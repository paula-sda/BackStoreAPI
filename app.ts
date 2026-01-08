import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './endpoints/users';
import productRoutes from './endpoints/products';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(
	cors({
		origin: process.env.FRONTEND_URL || '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		exposedHeaders: ['Content-Range', 'X-Content-Range'],
		maxAge: 86400,
	})
);

app.options('*', cors());

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => res.send('API funcionando'));

export default app;
