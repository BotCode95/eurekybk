import { Response, Request } from 'express';
import Task from '../task/Task';
import Project from '../project/Project';


export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, projectId, status, priority, dueDate } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: (req as any).userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const task = new Task({
      name,
      description,
      projectId,
      status,
      priority,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasksByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, userId: (req as any).userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('projectId');
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findOne({ _id: task.projectId, userId: (req as any).userId });
    if (!project) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findOne({ _id: task.projectId, userId: (req as any).userId });
    if (!project) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findOne({ _id: task.projectId, userId: (req as any).userId });
    if (!project) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
