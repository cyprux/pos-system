const { Router } = require("express");
const {
  getItem,
  updateQuantity,
} = require("../controllers/ItemController");

const router = Router();

router.get("/getItem", getItem);
router.put("/updateQuantity/:id", updateQuantity);

module.exports = router;
