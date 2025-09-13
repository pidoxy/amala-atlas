// File: /scripts/discovery-agent.js
import axios from 'axios';
import * as cheerio from 'cheerio';

// Enhanced retry logic with exponential backoff
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          ...options.headers,
        },
      });
      return response;
    } catch (error) {
      console.log(`[Agent] Attempt ${attempt}/${maxRetries} failed for ${url}: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: wait 2^attempt seconds
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Enhanced data extraction with better pattern matching
function extractSpotData($, element, source) {
  const name = $(element).text().trim();
  
  // Clean up the name (remove numbers, bullets, etc.)
  const cleanName = name
    .replace(/^\d+\.\s*/, '') // Remove "1. " prefix
    .replace(/^[•\-\*]\s*/, '') // Remove bullet points
    .replace(/^[A-Z]\.\s*/, '') // Remove "A. " prefix
    .trim();
  
  if (cleanName.length < 3) return null;
  
  // Try multiple strategies to find address
  let address = '';
  
  // Strategy 1: Next sibling paragraph
  const nextP = $(element).next('p');
  if (nextP.length && nextP.text().trim().length > 10) {
    address = nextP.text().trim();
  }
  
  // Strategy 2: Next sibling div
  if (!address) {
    const nextDiv = $(element).next('div');
    if (nextDiv.length && nextDiv.text().trim().length > 10) {
      address = nextDiv.text().trim();
    }
  }
  
  // Strategy 3: Look for address patterns in nearby elements
  if (!address) {
    $(element).siblings().each((i, sibling) => {
      const text = $(sibling).text().trim();
      // Look for address patterns (contains common address words)
      if (text.length > 10 && 
          (text.includes('Street') || text.includes('Road') || text.includes('Avenue') || 
           text.includes('Lagos') || text.includes('Nigeria') || text.includes('Area'))) {
        address = text;
        return false; // Break the loop
      }
    });
  }
  
  // Strategy 4: Look within the same element for address info
  if (!address) {
    const fullText = $(element).html();
    const addressMatch = fullText.match(/(?:Address|Location|Located at)[:\s]*(.+?)(?:<|$)/i);
    if (addressMatch) {
      address = addressMatch[1].replace(/<[^>]*>/g, '').trim();
    }
  }
  
  if (!address || address.length < 10) return null;
  
  // Extract additional information
  const description = $(element).next('p').text().trim().substring(0, 200);
  const imageUrl = $(element).find('img').first().attr('src');
  
  return {
    name: cleanName,
    address: address,
    description: description || '',
    image_url: imageUrl || '',
    source: source.name,
    source_url: source.url,
    scraped_at: new Date().toISOString(),
  };
}

export async function findPotentialSpots(source) {
  try {
    console.log(`[Agent] Scanning source: ${source.name} (${source.url})`);
    
    const response = await fetchWithRetry(source.url);
    const $ = cheerio.load(response.data);
    
    const candidates = [];
    const { container, nameSelector } = source.scraperConfig;

    // Try the configured container first
    let elements = $(container).find(nameSelector);
    
    // If no elements found, try alternative selectors
    if (elements.length === 0) {
      const alternativeSelectors = ['h2', 'h3', 'h4', 'h5', '.spot-name', '.restaurant-name', 'strong'];
      for (const selector of alternativeSelectors) {
        elements = $(container).find(selector);
        if (elements.length > 0) {
          console.log(`[Agent] Using alternative selector: ${selector}`);
          break;
        }
      }
    }
    
    // If still no elements, try searching the entire page
    if (elements.length === 0) {
      elements = $(nameSelector);
      console.log(`[Agent] Searching entire page with selector: ${nameSelector}`);
    }

    elements.each((index, element) => {
      const spotData = extractSpotData($, element, source);
      if (spotData) {
        candidates.push(spotData);
      }
    });
    
    console.log(`[Agent] Found ${candidates.length} candidates from ${source.name}.`);
    return candidates;

  } catch (error) {
    console.error(`[Agent] Failed to scan ${source.name}:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: source.url
    });
    return [];
  }
}