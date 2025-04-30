import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Task } from "../models/task.entity.js";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_NAME,
    synchronize: true,
    logging: true,
    entities: [Task],
    subscribers: [],
    migrations: [],
});

// Initialize the connection
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });