const fs = require("fs");
const path = "../../dbjson/productsDb.json";
class ProductsManagerFs {
  constructor() {
    this.path = path;
  }

  readProducts = async () => {
    try {
      if (fs.existsSync(path)) {
        const data = await fs.promises.readFile(path, "utf-8");
        const products = JSON.parse(data);
        return products;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };
  getProducts = async () => {
    try {
      const products = await this.readProducts();
      return products;
    } catch (error) {
      console.log(error);
    }
  };
  createProduct = async (newProduct) => {
    try {
      const products = await this.getProducts();
      const duplicated = products.find((e) => e.title === newProduct.title);
      if (duplicated) {
        return { error: "The product you entered is already in the list" };
      }
      if (typeof newProduct.title != "string" || newProduct.title == "") {
        throw new Error("Verify the title");
      } else if (
        typeof newProduct.description != "string" ||
        newProduct.description == ""
      ) {
        throw new Error("Verify the description");
      } else if (typeof newProduct.stock != "number") {
        throw new Error("Verify the stock");
      } else if (
        typeof newProduct.category != "string" ||
        newProduct.category == ""
      ) {
        throw new Error("Verify the category");
      }
      if (products.length === 0) {
        newProduct.id = 1;
        newProduct.code = Math.floor(Math.random() * 1000000);
        newProduct.status = true;
      } else {
        newProduct.id = products[products.length - 1].id + 1;
        newProduct.code = Math.floor(Math.random() * 1000000);
        newProduct.status = true;
      }

      products.push(newProduct);

      await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
      return newProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  getProduct = async (idProduct) => {
    try {
      const products = await this.getProducts();
      const productFound = products.find((e) => e.id == idProduct);
      return productFound;
    } catch (error) {
      console.log(error);
    }
  };
  updateProduct = async (id, changedProduct) => {
    try {
      const products = await this.getProducts();
      const productToChangeIndex = products.findIndex(
        (e) => e.id === parseInt(id, 10)
      );
      const productToUpdate = products[productToChangeIndex];
      if (productToChangeIndex == -1) {
        throw new Error("no se encontró el producto a modificar");
      }
      if (changedProduct.description) {
        productToUpdate.description = changedProduct.description;
      }
      if (changedProduct.title) {
        let titleDuplicated = products.some(
          (product) => product.title === changedProduct.title
        );
        if (titleDuplicated === true) {
          throw new Error("The product is already in the list");
        } else {
          productToUpdate.title = changedProduct.title;
        }
      }
      if (changedProduct.price && typeof changedProduct.price === "number") {
        productToUpdate.price = changedProduct.price;
      }
      if (changedProduct.stock && typeof changedProduct.stock) {
        productToUpdate.stock = changedProduct.stock;
        products[productToChangeIndex] = productToUpdate;
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return productToUpdate;
    } catch (error) {
      throw error;
    }
  };
  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((e) => e.id === parseInt(id, 10));

      if (productIndex == -1) {
        throw new Error("El producto no se ha encontrado");
      }
      products.splice(productIndex, 1);
      await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = ProductsManagerFs;
