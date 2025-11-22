import { Response, Request} from 'express';
import Project from './Project';
import Task from '../task/Task';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, status } = req.body;

    const project = new Project({
      name,
      description,
      status,
      userId: (req as any).userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ userId: (req as any).userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({ _id: id, userId: (req as any).userId });
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Get tasks associated with this project
    const tasks = await Task.find({ projectId: id });

    res.json({
      ...project.toObject(),
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: (req as any).userId },
      { name, description, status },
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, userId: (req as any).userId });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await Task.deleteMany({ projectId: id });

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
