import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const projectController = {
    // GET /api/project/
    async showProject(req: Request, res: Response) {
        try {
            const project = await prisma.project.findMany();

            return res.status(201).json({ project });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // POST /api/project/
    async createProject(req: Request, res: Response) {
        try {
            const { name, createdBy } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: Number(createdBy) },
            });

            if (!user) {
                return res.status(404).json({ error: 'User creator not found' });
            }

            const data: Prisma.ProjectCreateInput = {
                name,
                creator: {
                    connect: { id: createdBy },
                },
            };

            const project = await prisma.project.create({ data });

            return res.status(201).json({ project });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // PUT /api/project/:id
    async updateProject(req: Request, res: Response) {
        try {
            const { idProject } = req.params;
            const { name, createdBy } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: Number(createdBy) },
            });

            if (!user) {
                return res.status(404).json({ error: 'User creator not found' });
            }

            const project = await prisma.project.findUnique({
                where: { id: Number(idProject) },
            });

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            } else if (project.createdBy !== Number(createdBy)) {
                return res.status(403).json({ error: 'You cannot update this project!' });
            }

            const updateProject = await prisma.project.update({
                where: { id: Number(idProject) },
                data: {
                    name,
                },
            });

            return res.status(200).json({ updateProject });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },

    // DELETE /api/project/:id
    async deleteProject(req: Request, res: Response) {
        try {
            const { idProject } = req.params;
            const { createdBy } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: Number(createdBy) },
            });

            if (!user) {
                return res.status(404).json({ error: 'User creator not found' });
            }

            const project = await prisma.project.findUnique({
                where: { id: Number(idProject) },
            });

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            } else if (project.createdBy !== Number(createdBy)) {
                return res.status(403).json({ error: 'You cannot update this project!' });
            }

            // Delete
            await prisma.project.delete({ where: { id: Number(idProject) } });

            return res.status(200).json({ message: 'Delete Project successful!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },
};

export default projectController;
