const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const sequelize = require('./database');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const statusRoutes = require('./routes/statusRoutes');
const cors = require("cors");

const app = express();

//  Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500", "https://saturday-flame.vercel.app"],
  credentials: true
}));

app.set('trust proxy', 1);

app.use(session({
  secret: "supersecreto",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: true, // true si usas HTTPS
    sameSite: 'none'
  }
}));

app.use((req, res, next) => {
  console.log('🧩 Session ID:', req.sessionID);
  console.log('🧠 Session data:', req.session);
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);


// Sincronizar modelos con la BD
sequelize.sync()
  .then(() => console.log('Modelos sincronizados con la BD'))
  .catch(err => console.error('Error al sincronizar modelos:', err));


module.exports = app;