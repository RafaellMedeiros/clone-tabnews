import database from "infra/database";

const clearDatabase = async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
};
beforeAll(clearDatabase);

test("POST to /api/v1/migrations returns 200", async () => {
  const response1 = await fetch(`http://localhost:3000/api/v1/migrations`, {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toEqual(true);
  expect(response1Body.length).toBeGreaterThan(0); //> 0

  const response2 = await fetch(`http://localhost:3000/api/v1/migrations`, {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(response2Body)).toEqual(true);
  expect(response2Body.length).toBe(0); //> 0
});