import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getContacts, getOneContactById } from './controllers/contacts.js';

const app = express();
app.use(cors());

const logger = pino();

app.get('/contacts', getContacts);
app.get('/contacts/:id', getOneContactById);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
  });
});

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
