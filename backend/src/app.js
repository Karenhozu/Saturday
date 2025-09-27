const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const sequelize = require('./database');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');


const app = express();

const cors = require("cors");
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "supersecreto", // cámbialo por uno fuerte en producción
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Sincronizar modelos con la BD
sequelize.sync()
  .then(() => console.log('Modelos sincronizados con la BD'))
  .catch(err => console.error('Error al sincronizar modelos:', err));



module.exports = app;
