const express = require("express");
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController");

// Crear tarea
router.post("/", createTask);

// Obtener todas las tareas
router.get("/", getTasks);

// Obtener tarea por id
router.get("/:id", getTaskById);

// Actualizar tarea
router.put("/:id", updateTask);

// Eliminar tarea
router.delete("/:id", deleteTask);

module.exports = router;
