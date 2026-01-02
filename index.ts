import * as express from "express";
import userRoutes from "./endpoints/users";
import productRoutes from "./endpoints/products";

const app = express();
const port = 8080;

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

