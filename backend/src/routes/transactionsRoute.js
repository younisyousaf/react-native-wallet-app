import express from "express";
import {
	createTransaction,
	deleteTransaction,
	getTransactionsByUserId,
	getTransactionSummaryByUserId,
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;
