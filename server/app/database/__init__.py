import os
import motor.motor_asyncio
from pymongo import MongoClient
from pymongo.collection import Collection

# MongoDB client
client = None
db = None

# Collections
users_collection = None
analyses_collection = None

async def init_db():
    global client, db, users_collection, analyses_collection
    
    mongodb_uri = os.environ.get("MONGODB_URI")
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable not set")
    
    # Create Motor client
    client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_uri)
    db = client.cerebroai
    
    # Initialize collections
    users_collection = db.users
    analyses_collection = db.analyses
    
    # Create indices
    await users_collection.create_index("email", unique=True)
    await analyses_collection.create_index("user_id")
    
    print("Connected to MongoDB Atlas") 