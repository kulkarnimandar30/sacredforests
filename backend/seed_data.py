import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

async def seed_data():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'test_database')]

    # Sample Sacred Groves Data
    groves_data = [
        {
            "name": "Mawphlang Sacred Grove",
            "district": "East Khasi Hills",
            "coordinates": {"lat": 25.4670, "lng": 91.7362},
            "natural_history": "This sacred grove is believed to be over 700 years old and is protected by the Khasi tribe. It contains dense vegetation with tall trees, medicinal plants, and rare orchids. The grove represents pristine forest ecosystem of the Khasi Hills.",
            "present_status": "Well-preserved, actively protected by local community through customary laws. Eco-tourism is regulated to minimize impact.",
            "threats": "Tourism pressure, edge degradation, climate change impacts",
            "references": "Tiwari et al. (2010), Sacred Groves of Meghalaya",
            "image": "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "name": "Khecheopalri Lake Sacred Grove",
            "district": "West Sikkim",
            "coordinates": {"lat": 27.3473, "lng": 88.1778},
            "natural_history": "Sacred lake surrounded by dense forest, home to various bird species including the endangered Red Panda habitat. The lake is believed to fulfill wishes and is venerated by both Buddhists and Hindus.",
            "present_status": "Protected as a biodiversity hotspot, regularly maintained by local monastery",
            "threats": "Plastic pollution from tourists, construction activities nearby",
            "references": "Sharma & Roy (2015), Sacred Landscapes of Sikkim",
            "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "name": "Deori Temple Grove",
            "district": "Gondia",
            "coordinates": {"lat": 21.4545, "lng": 80.1877},
            "natural_history": "Ancient grove surrounding the Deori Temple with mahua, tendu, and bamboo species. Home to peacocks and various snake species considered sacred.",
            "present_status": "Moderately protected, managed by temple trust",
            "threats": "Encroachment for agriculture, firewood collection",
            "references": "Bhagwat & Rutte (2006), Sacred Groves of India",
            "image": "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "name": "Devbhumi Dwarka Sacred Grove",
            "district": "Devbhumi Dwarka",
            "coordinates": {"lat": 22.2394, "lng": 68.9685},
            "natural_history": "Coastal sacred grove with unique halophytic vegetation. Associated with Lord Krishna mythology and protected by fishing communities.",
            "present_status": "Under pressure from coastal development but locally protected",
            "threats": "Coastal erosion, urban expansion, salinity changes",
            "references": "Shah & Patel (2018), Coastal Sacred Groves of Gujarat",
            "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "name": "Osanai Sacred Grove",
            "district": "Tiruchirappalli",
            "coordinates": {"lat": 10.7905, "lng": 78.7047},
            "natural_history": "Tamil Nadu sacred grove dedicated to local deity with native tree species including Ficus religiosa, Azadirachta indica, and Tamarindus indica. Known for traditional water conservation pond.",
            "present_status": "Well-maintained by village panchayat, annual festival celebrated",
            "threats": "Agricultural expansion, herbicide use in adjacent fields",
            "references": "Ramanujam & Cyril (2003), Sacred Groves of Tamil Nadu",
            "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
            "created_at": datetime.now(timezone.utc)
        }
    ]

    # Insert groves
    result = await db.sacred_groves.insert_many(groves_data)
    print(f"✓ Inserted {len(result.inserted_ids)} sacred groves")

    # Sample Articles
    articles_data = [
        {
            "title": "Sacred Groves: India's Ancient Conservation Strategy",
            "author": "Dr. Priya Sharma",
            "category": "Conservation",
            "excerpt": "Sacred groves represent one of the oldest forms of biodiversity conservation practiced in India, predating modern environmental movements by centuries.",
            "content": "Full article content...",
            "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
            "read_time": "8 min read",
            "date": datetime.now(timezone.utc)
        },
        {
            "title": "Documenting Traditional Ecological Knowledge in Sacred Groves",
            "author": "Prof. Rajesh Kumar",
            "category": "Research",
            "excerpt": "How indigenous knowledge systems embedded in sacred grove traditions can inform modern conservation science.",
            "content": "Full article content...",
            "image": "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&q=80",
            "read_time": "10 min read",
            "date": datetime.now(timezone.utc)
        }
    ]

    result = await db.articles.insert_many(articles_data)
    print(f"✓ Inserted {len(result.inserted_ids)} articles")

    # Sample News
    news_data = [
        {
            "title": "Sacred Groves Get Legal Protection in Maharashtra",
            "source": "Environmental Law Journal",
            "summary": "New legislation grants legal status to sacred groves, empowering local communities with conservation rights.",
            "link": "#",
            "image": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80",
            "date": datetime.now(timezone.utc)
        }
    ]

    result = await db.news.insert_many(news_data)
    print(f"✓ Inserted {len(result.inserted_ids)} news items")

    # Sample Resources
    resources_data = [
        {
            "title": "Sacred Groves Documentation Toolkit",
            "type": "Guide",
            "description": "Comprehensive guide for documenting sacred groves including field survey methods, GPS mapping, and biodiversity assessment.",
            "download_link": "#",
            "icon": "BookOpen"
        },
        {
            "title": "Community Conservation Best Practices",
            "type": "Manual",
            "description": "Methods for engaging local communities in sacred grove conservation and restoration projects.",
            "download_link": "#",
            "icon": "Users"
        }
    ]

    result = await db.resources.insert_many(resources_data)
    print(f"✓ Inserted {len(result.inserted_ids)} resources")

    print("\n✅ Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    from dotenv import load_dotenv
    from pathlib import Path
    
    ROOT_DIR = Path(__file__).parent
    load_dotenv(ROOT_DIR / '.env')
    
    asyncio.run(seed_data())
