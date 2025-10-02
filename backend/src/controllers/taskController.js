const Task = require("../models/taskModel");
const User = require("../models/usersModel");
const Role = require("../models/roleModel");
const Status = require("../models/statusModel");

const createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json({ message: "✅ Tarea creada correctamente", task: newTask });
    } catch (error) {
        console.error("❌ Error al crear tarea:", error);
        res.status(500).json({ message: "Error al crear tarea", error: error.message });
    }
};



const getTasks = async (req, res) => {
    try {
        const { id_rol } = req.query;

        let whereCondition = {};

        // 👉 Admin (id_rol = 1) ve todas las tareas
        // 👉 Otros solo ven las de su rol
        if (id_rol && id_rol !== "1") {
            whereCondition.task_role = id_rol;
        }

        const tasks = await Task.findAll({
            where: whereCondition,
            include: [
                { model: User, as: "responsible", attributes: ["id_user", "name", "last_name"] },
                { model: Role, as: "role", attributes: ["user_rol"] },
                { model: Status, as: "status", attributes: ["status_name"] },
            ],
        });

        // 👀 Si no hay tareas y el rol no es Admin, devolver mensaje de restricción
        if (!tasks.length && id_rol !== "1") {
            return res.status(403).json({ message: "❌ No tienes permisos para ver este tablero" });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tareas", error: error.message });
    }
};



const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tarea", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        await task.update(req.body);
        res.status(200).json({ message: "✅ Tarea actualizada correctamente", task });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tarea", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        await task.destroy();
        res.status(200).json({ message: "✅ Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarea", error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { task_status } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "❌ Tarea no encontrada" });
    }

    task.task_status = task_status;

    // Buscar el estado en base al ID
    const status = await Status.findByPk(task_status);

    if (status) {
      if (status.status_name.toLowerCase() === "implementacion") {
        task.task_start_date = new Date(); // fecha actual
      }
      if (status.status_name.toLowerCase() === "qa") {
        task.task_end_date = new Date(); // fecha actual
      }
    }

    await task.save();

    res.json({ message: "✅ Estado actualizado", task });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado", error: error.message });
  }
};

const updateTaskResponsible = async (req, res) => {
  try {
    const { id } = req.params;
    const { task_responsible } = req.body;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: "❌ Tarea no encontrada" });

    task.task_responsible = task_responsible || null; // null si se quita
    await task.save();

    res.json({ message: "✅ Responsable actualizado", task });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar responsable", error: error.message });
  }
};


module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, updateTaskStatus, updateTaskResponsible };
