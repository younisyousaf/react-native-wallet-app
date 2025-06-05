import express from "express";
import dotenv from "dotenv";
import { initDB } from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";
import transactionsRoute from "./src/routes/transactionsRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(rateLimiter);
app.use(express.json());

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server is running on PORT: 5001");
	});
});
