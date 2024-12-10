import database from "infra/database";

const clearDatabase = async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
};
beforeAll(clearDatabase);

test("GET to /api/v1/migrations returns 200", async () => {
  const response = await fetch(`http://localhost:3000/api/v1/migrations`);
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toEqual(true);

  expect(responseBody.length).toBeGreaterThan(0); //> 0
});
