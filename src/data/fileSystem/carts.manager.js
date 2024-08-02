const fs = require("fs");
const path = "../../dbjson/cartsDb.json";

class CartManagerFS {
  constructor() {
    this.path = path;
  }

  readCart = async () => {
    try {
      const cartJson = await fs.promises.readFile(path, "utf-8");
      const cart = JSON.parse(cartJson);
      return cart;
    } catch (error) {
      return [];
    }
  };
  createCart = async () => {
    try {
      const carts = await this.readCart();
      const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
      const newCart = {
        id: newId,
        products: [],
      };
      carts.push(newCart);

      await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };
  getCartById = async (cartId) => {
    try {
      const carts = await this.readCart();
      const searchedCart = carts.find((e) => e.id == cartId);
      return searchedCart.products;
    } catch (error) {
      console.log(error);
    }
  };
  createProductToCart = async (productId, cartId) => {
    try {
      const carts = await this.readCart();
      const cartSearch = carts.findIndex((cart) => cart.id == cartId);
      console.log(cartSearch);
      if (cartSearch === -1) {
        throw new Error("The cart doesn't exist");
      }
      const cart = carts[cartSearch];
      console.log(cart);
      const productSearch = cart.products.findIndex(
        (product) => product.product === productId
      );
      if (productSearch === -1) {
        const newProduct = {
          product: productId,
          quantity: 1,
        };
        cart.products.push(newProduct);
      } else {
        cart.products[productSearch].quantity += 1;
      }
      await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
      return cart;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = CartManagerFS;
