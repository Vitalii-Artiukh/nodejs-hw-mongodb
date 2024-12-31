import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import bcrypt from 'bcrypt';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
