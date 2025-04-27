import express from 'express';
import taskRoutes from './routes/task.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

export default app;