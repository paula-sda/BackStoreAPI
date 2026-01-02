import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import userRoutes from "./endpoints/users";
import productRoutes from "./endpoints/products";

dotenv.config();

const app = express();
const port = 8080;

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => res.send('API funcionando'));

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
