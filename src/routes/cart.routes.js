const { Router } = require("express");
const CartManagerFS = require("../data/fileSystem/carts.manager");

const router = Router();

const { readCart, createCart, getCartById, createProductToCart } =
  new CartManagerFS();

router.post("/api/carts", async (req, res) => {
  try {
    const cartCreated = await createCart();
    res.send({ status: "success", data: cartCreated });
  } catch (error) {
    console.log(error);
  }
});
router.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartById(cid);
    res.send({ status: "success", data: cart });
  } catch (error) {
    console.log(error);
  }
});
router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const createdProduct = await createProductToCart(pid, cid);
    res.status(200).send({ status: "success", data: createdProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

module.exports = router;
