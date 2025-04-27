import 'dotenv/config';
import app from './app.js';
import { AppDataSource } from './db/data-source.js';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Database connection failed', error);
        process.exit(1);
    });