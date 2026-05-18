import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in the server environment');
  }

  if ([1, 2].includes(mongoose.connection.readyState)) {
  return mongoose.connection;
}

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || 'kwetu_creations',
  });

  return mongoose.connection;
}
