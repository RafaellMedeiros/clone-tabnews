function status(req, res) {
  res.status(200).json({ chave: "Olá Mundo" });
}

export default status;
