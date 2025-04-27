import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source.js';
import { Task } from '../models/task.entity.js';

const taskRepository = AppDataSource.getRepository(Task);


export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskRepository.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = taskRepository.create(req.body);
        const result = await taskRepository.save(task);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        
        taskRepository.merge(task, req.body);
        const result = await taskRepository.save(task);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const result = await taskRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) return res.status(404).json({ message: 'Task not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};