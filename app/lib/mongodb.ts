'use server';
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

    if(!MONGO_URI){
        throw new Error("MONGO_URI is not defined in environment variables");
    }

const globalForMongoose = global as typeof globalThis & {
    mongoose?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

export async function connectToDatabase(){
   

    let cached = globalForMongoose.mongoose;

    if (!cached) {
    cached = globalForMongoose.mongoose = {
        conn: null,
        promise: null,
    };
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try{
        cached.conn = await cached.promise;
    }catch(error){
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

