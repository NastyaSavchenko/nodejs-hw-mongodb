import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

async function startServer() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

startServer();
