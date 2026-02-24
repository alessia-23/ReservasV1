// Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


// Importación de rutas
import authRoutes from './routes/authRoutes.js';
import vehiculoRoutes from './routes/vehiculoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';    

// Inicialización
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Ruta de prueba
app.get('/', (req, res) => {
res.send('Server on');
});
// Rutas 
app.use('/api/auth', authRoutes); //Para login y registro
app.use('/api/vehiculos',vehiculoRoutes) // Para las operaciones CRUD de vehículos
app.use('/api/clientes',clienteRoutes) // Para las operaciones CRUD de clientes


const PORT = process.env.PORT || 3000;
// Exportar app
export default app;