import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  const options = {
    maxPoolSize: 50,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(env.mongoUri, options);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

export { mongoose };
