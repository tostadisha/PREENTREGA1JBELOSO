const { Router } = require("express");
const ProductsManagerFs = require("../data/fileSystem/products.manager");

const router = Router();

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } =
  new ProductsManagerFs();
router.get("/api/products", async (req, res) => {
  try {
    const allProducts = await getProducts();
    console.log(allProducts);
    res.send({ status: "success", data: allProducts });
  } catch (error) {
    console.log(error);
  }
});
router.get("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const thisProduct = await getProduct(pid);
    if (thisProduct) {
      console.log(thisProduct);
      res.send({ status: "success", data: thisProduct });
    } else {
      console.log(thisProduct);
      res.status(404).send({ status: "error", message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/api/products/", async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const response = await createProduct(body);
    if (response.error) {
      res.status(400).send({
        status: "error",
        message: "The product is already on the list",
      });
    } else {
      res.send({ status: "success", data: response });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: error.message });
  }
});
router.put("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { body } = req;
    const updatedProduct = body;
    const response = await updateProduct(pid, updatedProduct);
    res.send({ status: "success", data: response });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
router.delete("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await deleteProduct(pid);
    res.send({ status: "succes", data: response });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
