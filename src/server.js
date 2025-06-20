import express from 'express';
import path from 'node:path';
import cors from 'cors';
import pino from 'pino';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();
const logger = pino();

app.use('/photo', express.static(path.resolve('src', 'uploads', 'photos')));
app.use(cors());
app.use(cookieParser());
app.use('/', router);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
