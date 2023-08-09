import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./db-types/User";

dotenv.config();

const connectionString = process.env.NEON_CONNECTION_STRING as string;

export async function createDatabaseConnection() {
    let dataSource: DataSource;
    let connection: any;

    try {
        dataSource = new DataSource({
            type: 'postgres',
            url: connectionString,
            entities: [User]
        });

        connection = await dataSource.initialize();
        console.log("Database connection established successfully!");

        return connection;
    } catch (error) {
        console.error("Error establishing database connection:", error);
        process.exit(1);
    }
}

export async function closeDatabaseConnection() {
    let connection: any;

    try {
        if (connection) {
            await connection.close();
            console.log("Database connection closed successfully!");
        }
    } catch (error) {
        console.error("Error closing database connection:", error);
    }
  }