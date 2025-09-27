const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

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

