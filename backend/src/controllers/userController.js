const User = require('../models/usersModel');
const bcrypt = require('bcrypt');

const registerUser  = async (req, res) => {
  try {
    const { id_user, name, last_name, role_type, email, password } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      id_user,
      name,
      last_name,
      role_type,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
  console.log("📩 Datos recibidos en el body:", req.body);
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Usuario incorrecto" });
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    req.session.user = {
      id_user: user.id_user,
      name: user.name,
      role_type: user.role_type,
      email: user.email
    };

    res.json({ message: "Login exitoso", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error: error.message, errorDos: error });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
    res.clearCookie("connect.sid"); // eliminar cookie
    res.json({ message: "✅ Sesión cerrada" });
  });
};

module.exports = { registerUser, loginUser, logoutUser };