import { nodeJsModuleTwo } from '../learning/nodeJsModuleTwo.js';
import { setupServer } from './server.js';
import express from 'express';

// console.log(setupServer());
const app = express();

const PORT = 3000;

// Middleware для логування часу запиту
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Вбудований у express middleware для обробки (парсингу)
// JSON - даних у запитах
// наприклад, у запитах POST або PATCH
app.use(express.json());

// Маршрут для обробки GET-запитів на '/'
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Hello',
  });
});

// Middleware для обробких помилок (приймає 4 аргументи)
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});

// console.log(express);
