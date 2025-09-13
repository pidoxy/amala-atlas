// Simple script to add amala spots using existing Firebase config
import { db } from '../firebase-admin.config.js';

const amalaSpots = [
  {
    "name": "Amala Extra",
    "description": "dine in",
    "address": "F673+QCM, Ojo 102101, Lagos, Nigeria",
    "location": {
      "lat": 6.4644574,
      "lng": 3.2035466
    },
    "category": ["Dine-in", "Takeaway"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 3.7,
    "review_count": 283,
    "image_url": "https://files.chowdeck.com/images/nyzso2qk6dtq0opo6tdn/1628773434.png",
    "geocoded_address": "F673+QCM, Ojo 102101, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "100127",
    "status": "active",
    "created_at": new Date("2021-08-12T13:03:57.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T08:22:32.000Z")
  },
  {
    "name": "AFOLASHADE AMALA SPOT",
    "description": "We Sell Hot Amala, Semo, Eba, with Sweet Gbegiri and Ewedu Efo Riro, Egusi, Cow meat, Fish Turkey, Ponmo, Goat Meat and Assorted",
    "address": "27 Igbo Elerin Rd, Ojo, Lagos 102101, Nigeria",
    "location": {
      "lat": 6.4864585,
      "lng": 3.1883883
    },
    "category": ["Dine-in", "Takeaway"],
    "price_band": "₦₦",
    "is_open": false,
    "rating": 2.75,
    "review_count": 20,
    "image_url": "https://files.chowdeck.com/images/2024/2024-07-03/sY27ft6ABDttmrHI0KSFH.PNG",
    "geocoded_address": "27 Igbo Elerin Rd, Ojo, Lagos 102101, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "109464",
    "status": "active",
    "created_at": new Date("2024-07-03T09:12:40.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-08-26T18:30:08.000Z")
  },
  {
    "name": "Amala joint Enterprise",
    "description": "Check the menu...",
    "address": "Iba Housing Estate, Lasu Road, Ojo, Lagos 102101, Nigeria",
    "location": {
      "lat": 6.491071,
      "lng": 3.192531
    },
    "category": ["Dine-in", "Takeaway"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 3.09,
    "review_count": 47,
    "image_url": "https://files.chowdeck.com/images/2024/2024-08-21/G1fBVhyEicXID8pxQl1Qx.png",
    "geocoded_address": "Iba Housing Estate, Lasu Road, Ojo, Lagos 102101, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "110782",
    "status": "active",
    "created_at": new Date("2024-08-21T16:18:25.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-09T11:52:10.000Z")
  },
  {
    "name": "Amala palace",
    "description": "Your one-stop spot if you are looking for the best local dish like Amala + Ewedu + Gbegiri served hot alongside tasty Ogunfe (Goat Meat)/Beef/Fish.",
    "address": "G53X+MRW, LASU Isheri Road, beside AP Petrol Station, Ojo, Lagos 102101, Nigeria",
    "location": {
      "lat": 6.5042088,
      "lng": 3.1995844
    },
    "category": ["Dine-in", "Takeaway"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 4.09,
    "review_count": 271,
    "image_url": "https://files.chowdeck.com/images/2024/2024-08-05/bVHqoWWSw0Q8LC7nI9C4i.png",
    "geocoded_address": "G53X+MRW, LASU Isheri Road, beside AP Petrol Station, Ojo, Lagos 102101, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "102572",
    "status": "active",
    "created_at": new Date("2023-08-02T13:49:14.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T09:47:19.000Z")
  },
  {
    "name": "Amala Hajia",
    "description": "Best swallow spot",
    "address": "Onike Round About, Onike, Lagos 101245, Lagos, Nigeria",
    "location": {
      "lat": 6.5094663,
      "lng": 3.3841029
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 4.38,
    "review_count": 499,
    "image_url": "https://files.chowdeck.com/images/2024/2024-09-06/Vei4dlZIYAgQhX0BAPJyQ.png",
    "geocoded_address": "Onike Round About, Onike, Lagos 101245, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "111202",
    "status": "active",
    "created_at": new Date("2024-09-06T14:50:52.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T14:42:08.000Z")
  },
  {
    "name": "DINE & WINE AMALA SPOT",
    "description": "we sale delicious food",
    "address": "Abiodun Street & Market Street, Somolu, Nigeria",
    "location": {
      "lat": 6.5330014,
      "lng": 3.3800024
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 2.67,
    "review_count": 6,
    "image_url": "https://files.chowdeck.com/images/2025/2025-03-03/vZAqblezhcpcc6c1mlLaj.PNG",
    "geocoded_address": "Abiodun Street & Market Street, Somolu, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "116723",
    "status": "active",
    "created_at": new Date("2025-03-03T14:24:52.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-10T20:04:36.000Z")
  },
  {
    "name": "Amala Hut Banilux",
    "description": "The african taste you trust",
    "address": "Chapel St & Commercial Ave, Sabo yaba, Yaba/Igbobi 101245, Lagos, Nigeria",
    "location": {
      "lat": 6.5065014,
      "lng": 3.3753326
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": false,
    "rating": 3.37,
    "review_count": 19,
    "image_url": "https://files.chowdeck.com/images/2024/2024-09-26/Xm59kHswTHdfl11wSgNEP.jpeg",
    "geocoded_address": "Chapel St & Commercial Ave, Sabo yaba, Yaba/Igbobi 101245, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "116109",
    "status": "active",
    "created_at": new Date("2025-02-13T17:43:43.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-08-25T21:05:23.000Z")
  },
  {
    "name": "Amala Spot (M & Q Kitchen) Alagomeji",
    "description": "Amala spot",
    "address": "29 Olonode St, Alagomeji-Yaba, Lagos 101212, Lagos, Nigeria",
    "location": {
      "lat": 6.4988059,
      "lng": 3.3776872
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": false,
    "rating": 1.0,
    "review_count": 1,
    "image_url": "https://files.chowdeck.com/images/fbjhvnpu9ib9zf57kkqw/1688979791.png",
    "geocoded_address": "29 Olonode St, Alagomeji-Yaba, Lagos 101212, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "117826",
    "status": "active",
    "created_at": new Date("2025-04-03T07:49:47.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-10T12:34:18.000Z")
  },
  {
    "name": "Only Amala",
    "description": "Home of authentic Amala — rich soups, generous proteins, and unbeatable taste delivered fresh to you",
    "address": "25 Olufemi St, Yaba, Lagos, Nigeria",
    "location": {
      "lat": 6.5131222,
      "lng": 3.3671356
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 5.0,
    "review_count": 0,
    "image_url": "https://files.chowdeck.com/images/2025/2025-08-27/OTEKXBopSk5gVZC0YBYYl.PNG",
    "geocoded_address": "25 Olufemi St, Yaba, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "123908",
    "status": "active",
    "created_at": new Date("2025-08-16T16:32:40.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T15:31:57.000Z")
  },
  {
    "name": "DBest Amala",
    "description": "We sell the best quality Amala in town. All prices include packaging.",
    "address": "25 Olufemi St, Yaba, Lagos, Nigeria",
    "location": {
      "lat": 6.5131222,
      "lng": 3.3671356
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": true,
    "rating": 2.56,
    "review_count": 18,
    "image_url": "https://files.chowdeck.com/images/2025/2025-05-22/oDGZhy1CariW15mAGDs5G.PNG",
    "geocoded_address": "25 Olufemi St, Yaba, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "119383",
    "status": "active",
    "created_at": new Date("2025-05-22T10:08:05.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T10:15:59.000Z")
  },
  {
    "name": "Spicy Amala Place",
    "description": "Spicy Amala Place is a place you can get your local food at low amount.",
    "address": "61 Ibidun St, Idi Oro 101241, Lagos, Nigeria",
    "location": {
      "lat": 6.5113144,
      "lng": 3.3606121
    },
    "category": ["Restaurant", "Local food"],
    "price_band": "₦₦",
    "is_open": false,
    "rating": 4.31,
    "review_count": 1026,
    "image_url": "https://files.chowdeck.com/images/s7dfcs9rxegsycpxk1w0/1698093714.png",
    "geocoded_address": "61 Ibidun St, Idi Oro 101241, Lagos, Nigeria",
    "geocoding_confidence": 1,
    "geocoding_status": "success",
    "source": "Chowdeck",
    "source_url": null,
    "external_id": "101225",
    "status": "active",
    "created_at": new Date("2023-03-08T01:48:14.000Z"),
    "updated_at": new Date(),
    "scraped_at": new Date("2025-09-13T16:01:34.000Z")
  }
];

async function addSpots() {
  try {
    console.log(`Adding ${amalaSpots.length} amala spots to database...`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const spot of amalaSpots) {
      try {
        // Check if spot already exists by external ID
        const existingSpot = await db.collection('spots')
          .where('external_id', '==', spot.external_id)
          .limit(1)
          .get();
        
        if (!existingSpot.empty) {
          console.log(`⏭️  Skipping ${spot.name} - already exists`);
          skippedCount++;
          continue;
        }
        
        // Add to Firestore
        await db.collection('spots').add(spot);
        console.log(`✅ Added: ${spot.name} (${spot.address})`);
        addedCount++;
        
        // Small delay to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error adding ${spot.name}:`, error.message);
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Added: ${addedCount} spots`);
    console.log(`⏭️  Skipped: ${skippedCount} spots (already exist)`);
    console.log(`📝 Total processed: ${amalaSpots.length} spots`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the import
addSpots();
