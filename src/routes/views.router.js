const { Router } = require("express");
const router = Router();

// Ruta para la vista de home
router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real-Time Products",
  });
});

module.exports = router;
