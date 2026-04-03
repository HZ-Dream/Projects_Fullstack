import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const authController = {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save Postgres by Prisma
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            // Return user
            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(400).json({ message: 'User already exists or invalid data' });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });

            // Check input
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

            // Return token
            res.json({ token });
        } catch (error) {
            res.status(400).json({ message: 'User already exists or invalid data' });
        }
    },
};

export default authController;
