const express = require("express");
const productsRouter = require("../routes/products.router.js");
const cartsRouter = require("../routes/cart.routes.js");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("escuchando en el puerto: ", PORT);
});

app.use(productsRouter);
app.use(cartsRouter);
