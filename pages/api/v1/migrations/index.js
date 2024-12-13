import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { join } from "path";

export default async function migrations(req, res) {
  console.log("Environment variables", {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_CA: process.env.POSTGRES_CA,
  });
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultConfigMigrationRunner = {
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      dryRun: true,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(
        defaultConfigMigrationRunner,
      );

      return res.status(200).json(pendingMigrations);
    }

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultConfigMigrationRunner,
        dryRun: false,
      });

      if (migratedMigrations.length === 0) {
        return res.status(200).json(migratedMigrations);
      }

      return res.status(201).json(migratedMigrations);
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
