import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import { getAllStudents, getStudentById } from './services/students.js';

// const PORT = Number(getEnvVar('PORT', '3000'));
const PORT = Number(process.env.PORT) || Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  // server express
  const app = express();

  app.use(express.json());
  // service cors для кросбраузерних запитів
  app.use(cors());
  // service pino для виводу результату в консоль
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // поточний час на момент запиту
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  // midlevare для домашньої сторінки
  app.get('/', (req, res) => {
    res.json({
      message: "Congratulations, you're home.",
    });
  });

  // midlevare для сторінки '/students'
  app.get('/students', async (req, res) => {
    const students = await getAllStudents();
    res.status(200).json({
      message: 'Successfully found students!',
      data: students,
    });
  });

  // midlevare для сторінки '/contacts'
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  // midlevare для сторінки '/contacts/:studentId'
  app.get('/students/:studentId', async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
      res.status(404).json({
        message: 'Sudent not found',
      });
      return;
    }
    res.status(200).json({
      message: 'Successfully found contact with id {studentId}!',
      data: student,
    });
    next();
  });

  // midlevare для сторінки '/contacts/:contactId'
  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
    next();
  });

  // midlevare для хибної сторінки
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // midlevare для невідомої помилки
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
  // запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
  });
};
