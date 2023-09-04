const { Router } = require("express");
const {
  getTransaction,
  saveTransaction,
  deleteTransaction,
} = require("../controllers/TransactionController");

const router = Router();

router.get("/getTransaction", getTransaction);
router.delete("/deleteTransaction/:id", deleteTransaction);
router.post("/saveTransaction", saveTransaction);

module.exports = router;
