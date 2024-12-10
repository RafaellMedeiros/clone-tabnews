import migrationRunner from "node-pg-migrate";
import { join } from "path";

export default async function migrations(req, res) {
  const defaultConfigMigrationRunner = {
    databaseUrl: process.env.DATABASE_URL,
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
}
