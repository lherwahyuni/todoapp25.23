import express from "express";
const router = express.Router();
import Task from "../models/Task.js";

router.get("/tasks", async(req, res) => {
  try {
    const filter = {};
    if (req.query.completed === "true") filter.completed = true;
    if (req.query.completed === "false") filter.completed = false;

    let query = Task.find(filter); // Find all complete/incomplete tasks
    if (req.query.sort === "dueDate") query = query.sort({ dueDate: 1 });
    
  const tasks = await query;
  res.json({ message: "Fetched tasks", tasks: tasks});
  
  } catch (error) {
    console.log("failed to get tasks", error);
    res.status(500).json({ message: "Failed to get tasks" });
  }
});



router.post("/tasks/new", async (req, res) => {
  try {
  const { title, dueDate } = req.body;
  
  const newTask = await Task.create ({
    title: title,
    dueDate: dueDate
  });

  res.json({ message: "Created a task", task: newTask});

} catch (error) {
  console.log("Failed to create task", error);
  res.status(500).json({ message: "Failed to create task" });
}
});



router.patch("/tasks/complete/:id", async (req, res) => {
  try {
  const taskId = req.params.id;
  const task = await Task.findByIdAndUpdate(taskId, { completed: true }, {returnDocument: "after" });
  
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task completed", task: task });

  } catch (error) { 
  console.log("Failed to complete task", error);
  res.status(500).json({ message: "Failed to complete task" });
  }
});


router.patch("/tasks/incomplete/:id", async (req, res) => {
  try {
  const taskId = req.params.id;
  const task = await Task.findByIdAndUpdate(taskId, { completed: false }, {returnDocument: "after" });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task set to incomplete", task: task });

  } catch (error) { 
  console.log("Failed to set task to incomplete:", error);
  res.status(500).json({ message: "Failed to set task to incomplete" });
  }
});



router.delete("/tasks/delete/:id", async(req, res) => {
  try {
  const taskId = req.params.id;
  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  };

  res.json({ message: "Task deleted", task: task });

} catch (error) {
  console.log("Failed to delete task:", error);
  res.status(500).json({ message: "Failed to delete task" });
  }
});


router.put("/tasks/edit/:id", async (req, res) => {
  try {
  const taskId = req.params.id;
  const { title, dueDate } = req.body;

  const updatedTask = {
    title: title,
    dueDate: dueDate
  }

  const task = await Task.findByIdAndUpdate(taskId, updatedTask, { returnDocument: "after" });

  if (!task) {
  return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task updated", task: task });

} catch (error) { 
  console.log("Failed to edit task:", error);
  res.status(500).json({ message: "Failed to edit task" });
  }
});


export default router;