// Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connection from './config/database.js';


// Importación de rutas
import authRoutes from './routes/authRoutes.js';
import vehiculoRoutes from './routes/vehiculoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';   
import reservaRoutes from './routes/reservaRoutes.js'; 

// Inicialización
dotenv.config();
const app = express();

// Middlewares
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Ruta de prueba
app.get('/', (req, res) => {
res.send('Server on');
});  // En ocasiones se debe borrar la ruta de prueba para evitar conflictos
// Rutas 
app.use('/api/auth', authRoutes); //Para login y registro
app.use('/api/vehiculos',vehiculoRoutes) // Para las operaciones CRUD de vehículos
app.use('/api/clientes',clienteRoutes) // Para las operaciones CRUD de clientes
app.use('/api/reservas',reservaRoutes) // Para las operaciones CRUD de reservas


const PORT = process.env.PORT || 3000;
// Exportar app
export default app;