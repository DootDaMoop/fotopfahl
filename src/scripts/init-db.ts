import { migrateToLatest } from "@/db/migrate.ts";

export async function InitializeDB() {
    console.log("Initializing database...");
    try {
        await migrateToLatest();
        console.log("Database initialized successfully.");
        return;
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}