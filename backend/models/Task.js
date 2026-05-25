import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, required: true, default: false }
}, { timestamps: true });

taskSchema.index({ dueDate: 1 });
taskSchema.index({ completed: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;