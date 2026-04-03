import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const taskController = {
    // GET /api/task/
    async showTask(req: Request, res: Response) {
        try {
            const task = await prisma.task.findMany({
                include: {
                    assignees: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });

            return res.status(201).json({ task });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // POST /api/task/
    async createTask(req: Request, res: Response) {
        try {
            const { title, projectId, assigneeIds, createdBy } = req.body;

            const task = await prisma.task.create({
                data: {
                    title,
                    status: 'Not Started',
                    project: {
                        connect: { id: Number(projectId) },
                    },
                    creator: {
                        connect: { id: Number(createdBy) },
                    },
                    assignees: {
                        connect: assigneeIds.map((id: number) => ({ id })),
                    },
                },
                include: {
                    assignees: true,
                },
            });

            res.status(201).json({ task });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // PUT /api/task/:id
    async updateTask(req: Request, res: Response) {
        try {
            const { idTask } = req.params;
            const { title, status, assigneeIds } = req.body;

            const task = await prisma.task.update({
                where: { id: Number(idTask) },
                data: {
                    title,
                    status,
                    assignees: {
                        set: assigneeIds?.map((id: number) => ({ id })) || [],
                    },
                },
                include: { assignees: true },
            });

            res.status(201).json({ task });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // DELETE /api/task/:id
    async deleteTask(req: Request, res: Response) {
        try {
            const { idTask } = req.params;

            await prisma.task.delete({
                where: { id: Number(idTask) },
            });

            res.status(201).json({ message: 'Task deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },
};

export default taskController;
