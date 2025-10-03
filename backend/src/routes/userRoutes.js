const express = require('express');
const { registerUser, loginUser, logoutUser, getProfile } = require('../controllers/userController');
const User = require('../models/usersModel');

const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getProfile);

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id_user", "name", "last_name", "email", "role_type"]
    });
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id_user", "name", "last_name", "email", "role_type"]
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
});

module.exports = router;






// const router = require('express').Router();

// const User = require('../../models/usersModel');

// router.get('/users', async (req, res) => {
//     const users = await User.findAll();
//     res.status(200).json({
//         ok: true,
//         status: 200,
//         body: users
//     });
// });

// router.get('/users/:user_id', async (req, res) => {
//     const id_user = req.params.user_id;
//      const users = await User.findOne({
//         where: { id_user }
//      });
//     res.status(200).json({
//         ok: true,
//         status: 200,
//         body: users
//     });
// });

// router.post('/users', async (req, res) => {
//     const datauser = req.body;
//     await User.sync();
//     const createUser = await User.create({
//         id_user: faker.number.int(),
//         name: faker.person.firstName(),
//         last_name: faker.person.lastName(),
//         role_type: faker.number.int(),
//         email: faker.internet.email(),
//         password: faker.internet.password()
//     })
//     res.status(201).json({
//         ok: true,
//         status: 201,
//         message: 'User created',
//     });
// });

// router.put('/users', (req, res) => {
//     res.send('Hello user routes!');
// });

// router.delete('/users', (req, res) => {
//     res.send('Hello user routes!');
// });

// module.exports = router;

