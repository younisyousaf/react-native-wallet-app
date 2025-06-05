import { sql } from "../config/db.js";
export async function getTransactionsByUserId(req, res) {
	try {
		const { userId } = req.params;
		const transactions =
			await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
		res.json(transactions);
	} catch (error) {
		console.log("Error getting transactions", error);
		res.status(500).json({ message: "Internal Server error" });
	}
}

export async function createTransaction(req, res) {
	//title, amount, category, user-id
	try {
		const { title, amount, category, user_id } = req.body;

		if (!title || !user_id || !category || amount === undefined) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const transaction = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *
            `;
		console.log(transaction);
		res.status(201).json(transaction[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal Server error" });
	}
}

export async function deleteTransaction(req, res) {
	try {
		const { id } = req.params;

		if (isNaN(parseInt(id))) {
			return res.status(400).json({ message: "Invalid transaction id" });
		}

		const transaction =
			await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

		if (transaction.length === 0) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.log("Error deleting transaction", error);
		res.status(500).json({ message: "Internal Server error" });
	}
}

export async function getTransactionSummaryByUserId(req, res) {
	try {
		const { userId } = req.params;
		const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `;
		const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
            `;
		const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
            `;

		res.status(200).json({
			balance: balanceResult[0].balance,
			income: incomeResult[0].income,
			expenses: expensesResult[0].expenses,
		});
	} catch (error) {
		console.log("Error getting summary", error);
		res.status(500).json({ message: "Internal Server error" });
	}
}
