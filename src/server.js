const express = require("express");
const ProductManagerFS = require("./data/fileSystem/products.manager.js");
const productsRouter = require("./routes/products.router.js");
const productManager = new ProductManagerFS();
const cartsRouter = require("./routes/cart.routes.js");
const viewsRouter = require("./routes/views.router.js");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log("escuchando en el puerto: ", PORT);
});
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  (async () => {
    try {
      const products = await productManager.getProducts();
      console.log("Productos enviados al cliente:", products);
      socket.emit("actualizarProductos", products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  })();

  socket.on("nuevoProducto", async (producto) => {
    console.log("Nuevo producto recibido:", producto);
    try {
      const result = await productManager.createProduct(producto);

      if (result.error) {
        console.log("Error al crear producto:", result.error);
        socket.emit("errorProducto", result.error);
      } else {
        const products = await productManager.getProducts();
        console.log(
          "Productos actualizados enviados a todos los clientes:",
          products
        );
        io.emit("actualizarProductos", products);
      }
    } catch (error) {
      console.log("Error general:", error.message);
      socket.emit("errorProducto", error.message);
    }
  });
  socket.on("borrarProducto", async (idProducto) => {
    try {
      await productManager.deleteProduct(idProducto);
      const products = await productManager.getProducts();
      io.emit("actualizarProductos", products);
    } catch (error) {
      console.error("Error al borrar producto:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Routers
app.use("/", viewsRouter);
app.use("/api/products/", productsRouter);
app.use(cartsRouter);

// Manejo de errores
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).send("error de server");
});
