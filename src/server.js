import express from 'express';
import cors from 'cors';
import pino from 'pino';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

const logger = pino();
app.use(cors());

app.use('/', router);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
