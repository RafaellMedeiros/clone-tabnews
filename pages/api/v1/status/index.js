import database from "infra/database";

async function status(req, res) {
  const result = await database.query("SELECT NOW()");
  console.log(result.rows);

  res.status(200).json({ chave: "Olá Mundo" });
}

export default status;
