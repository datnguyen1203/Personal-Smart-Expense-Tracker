const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const auth = require("../middleware/auth");

router.get("/", auth, transactionController.getTransactions);
router.post("/", auth, transactionController.addTransaction);
router.get("/by-date", auth, transactionController.getTransactionByDate);
router.get("/range/search", auth, transactionController.getTransactionByRange);
router.delete("/:id", auth, transactionController.removeTransaction);
router.put("/:id", auth, transactionController.updateTransaction);

module.exports = router;