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

        if (id_rol && id_rol !== "1") {
            whereCondition.task_role = id_rol;
        }

        const tasks = await Task.findAll({
            where: whereCondition,
            include: [
                { model: User, as: "responsible", attributes: ["name"] },
                { model: Role, as: "role", attributes: ["user_rol"] },
                { model: Status, as: "status", attributes: ["status_name"] },
            ],
        });

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

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
