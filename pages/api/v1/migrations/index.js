import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { resolve } from "path";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultConfigMigrationRunner = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
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
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
