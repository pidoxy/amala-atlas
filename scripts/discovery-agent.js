// File: /scripts/discovery-agent.js
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';

const USER_AGENT = 'AmalaAtlas-Discovery-Bot/1.1';

// Global keyword hints
const NAME_KEYWORDS = ['amala', 'kitchen', 'buka', 'restaurant', 'spot', 'joint', 'canteen', 'grill', 'place'];
const CONTEXT_KEYWORDS = ['ewedu', 'gbegiri', 'abula'];
const ADDRESS_KEYWORDS = [
    'street', 'st.', 'road', 'rd.', 'avenue', 'ave.', 'lane', 'ln.', 'drive', 'dr.', 'way', 'close', 'crescent',
    'boulevard', 'blvd', 'place', 'plc', 'plaza', 'market', 'square', 'city', 'island', 'postcode', 'zip', 'suite',
    'california', 'texas', 'new york', 'london', 'manchester', 'lagos', 'abuja', 'accra', 'toronto', 'tokyo', 'paris'
];

const HIGH_AUTHORITY_SOURCES = new Set([
    'eatdrinklagos',
    'guardian.ng', 'guardian nigeria',
    'vanguardngr.com', 'vanguard nigeria',
    'foodieinlagos', 'thelagosweekender',
    'afrobuy', 'houstoniamag', 'secretatlanta', 'theafricandream', 'tastesofnigeria',
]);

function normalize(str) {
    return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function stripListPrefix(str) {
    return (str || '')
        .replace(/^\d+\.|^[•\-*]\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function isLikelyName(text) {
    const t = normalize(text);
    return NAME_KEYWORDS.some(k => t.includes(k)) && t.length <= 80;
}

function findBestAddress($, element, scraperConfig) {
    const candidates = [];
    const parent = $(element).parent();
    const within = parent.find('p, div, li');
    within.each((i, el) => {
        const txt = normalize($(el).text());
        if (txt.length < 10) return;
        if (/^(categories|tags|share this|leave a reply|comment|reply)/i.test($(el).text())) return;
        const hasAddrSignals = ADDRESS_KEYWORDS.some(k => txt.includes(k)) || /\d/.test(txt) || txt.includes(',');
        if (hasAddrSignals) {
            candidates.push($(el).text().trim());
        }
    });
    // Address selector if provided
    const addressSelector = scraperConfig?.addressSelector;
    if (addressSelector) {
        $(addressSelector).each((i, el) => {
            const txt = $(el).text().trim();
            if (txt && txt.length > 10) candidates.push(txt);
        });
    }
    // Choose the longest reasonable candidate
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0] || '';
}

function validateAddress(address) {
    if (!address || address.length < 10) return false;
    const lower = normalize(address);
    return lower.includes(',') || /\d/.test(lower) || ADDRESS_KEYWORDS.some(k => lower.includes(k));
}

function computeConfidence({ name, context, hasAddress, sourceName }) {
    let score = 0;
    const n = normalize(name);
    const c = normalize(context);

    if (NAME_KEYWORDS.some(k => n.includes(k))) score += 30;
    if (CONTEXT_KEYWORDS.some(k => c.includes(k))) score += 20;
    if (hasAddress) score += 40;

    const sourceNorm = normalize(sourceName);
    if ([...HIGH_AUTHORITY_SOURCES].some(s => sourceNorm.includes(s))) score += 10;

    // Penalties
    if (/(categories|tags|leave a reply|comment|weekend guide)/i.test(c)) score -= 25;
    if (/\.$/.test(name) || name.split(/\s+/).length > 8) score -= 10;

    if (score < 0) score = 0;
    if (score > 100) score = 100;
    return score;
}

export async function findPotentialSpots(source) {
    try {
        const robotsUrl = new URL('/robots.txt', source.url).toString();
        try {
            const robotsResponse = await fetch(robotsUrl);
            if (robotsResponse.ok) {
                const robots = robotsParser(robotsUrl, await robotsResponse.text());
                if (!robots.isAllowed(source.url, USER_AGENT)) {
                    console.warn(`[Agent] ⚠️ Disallowed by robots.txt: Skipping ${source.name}`);
                    return [];
                }
            }
        } catch (e) { /* Proceed if robots.txt fails */ }

        console.log(`[Agent] ✅ Scanning source: ${source.name}`);
        const response = await fetch(source.url, { headers: { 'User-Agent': USER_AGENT } });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        
        const html = await response.text();
        const $ = cheerio.load(html);

        const candidates = [];
        const { container, nameSelector } = source.scraperConfig;

        // Start with configured selector
        let elements = $(container).find(nameSelector);
        // Fall back to common header selectors if none found
        if (elements.length === 0) {
            const alternatives = ['h2', 'h3', 'h4', 'strong', '.restaurant-name', '.spot-name'];
            for (const sel of alternatives) {
                elements = $(container).find(sel);
                if (elements.length > 0) break;
            }
        }
        // Last resort: search entire page
        if (elements.length === 0) {
            elements = $(nameSelector);
        }

        elements.each((index, element) => {
            const rawName = $(element).text().trim();
            const potentialName = stripListPrefix(rawName);
            if (potentialName.length < 3) return;
            if (!isLikelyName(potentialName)) return;

            const address = findBestAddress($, element, source.scraperConfig);
            if (!validateAddress(address)) return;

            const context = $(element).parent().text().slice(0, 1200);
            const confidence = computeConfidence({
                name: potentialName,
                context,
                hasAddress: true,
                sourceName: source.name,
            });
            if (confidence < 50) return;

            candidates.push({
                name: potentialName,
                address,
                description: '',
                image_url: '',
                source: source.name,
                source_url: source.url,
                scraped_at: new Date().toISOString(),
                confidence,
            });
        });

        console.log(`[Agent] Found ${candidates.length} high-quality candidates from ${source.name}.`);
        return candidates;

    } catch (error) {
        console.error(`[Agent] ❌ Failed to scan ${source.name}: ${error.message}`);
        return [];
    }
}