import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { logger } from './middlewares/logger.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOADS_DIR } from './constants/index.js';

const PORT = Number(process.env.PORT) || Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  // server express
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static('uploads'));

  // service cors для кросбраузерних запитів
  app.use(cors());

  // service pino для виводу результату в консоль
  app.use(logger);

  // поточний час на момент запиту
  // app.use((req, res, next) => {
  //   console.log(`Time: ${new Date().toLocaleString()}`);
  //   next();
  // });

  // midlevare для домашньої сторінки
  app.get('/', (req, res) => {
    res.json({
      message: "Congratulations, you're home.",
    });
  });

  // роутер для реєстрації
  app.use('/auth', authRouter);

  app.use('/contacts', contactsRouter);

  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  // запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
  });
};
