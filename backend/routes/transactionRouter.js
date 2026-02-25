const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);
router.post("/", transactionController.addTransaction);
router.delete("/:id", transactionController.removeTransaction);

module.exports = router;