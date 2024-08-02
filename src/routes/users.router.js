const { Router } = require("express");

const router = Router();

const users = [];

router.get("api/users", (req, res) => {
  respuesta.send({ data: users });
});
router.post("api/users", (req, res) => {
  const { body } = req;
  if (!body.email || !body.password) {
    return res.status(400).send({ status: "error", error });
  }
  users.push({ id: users.length + 1, ...body });
  res.status(200).send({ data: users });
});
router.put("api/users", (req, res) => {
  res.send("hola mundo put");
});

export default router;
