// react custom hook file

import { API_URL } from "@/constants/api";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

// If you are running the app on the physical device, then the backend will not work on mobile with error: "Network Request Failed", so we need to use the our IP address:
//    First fetch your IP address using the command:
// Windows: `ipconfig`
//Linux/MacOS: ifconfig | grep inet

// Example
// const API_URL = "http://192.138.2.5:5001/api";

// Alternatively you can use:
// https://render.com/
// deploy your api's here and use the url and it will work on physical devices
// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
	const [transactions, setTransactions] = useState([]);
	const [summary, setSummary] = useState({
		balance: 0,
		income: 0,
		expenses: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	// use callback is used for performance reasons, it will memoize the function
	const fetchTransactions = useCallback(async () => {
		try {
			const response = await fetch(`${API_URL}/transactions/${userId}`);
			const data = await response.json();
			setTransactions(data);
		} catch (error) {
			console.log("Error Fetching Transactions", error);
		}
	}, [userId]);

	const fetchSummary = useCallback(async () => {
		try {
			const response = await fetch(
				`${API_URL}/transactions/summary/${userId}`
			);
			const data = await response.json();
			setSummary(data);
		} catch (error) {
			console.log("Error Fetching Summary", error);
		}
	}, [userId]);

	const loadData = useCallback(async () => {
		if (!userId) {
			return;
		}
		setIsLoading(true);
		try {
			// These functions will run parallel
			await Promise.all([fetchTransactions(), fetchSummary()]);
		} catch (error) {
			console.log("Error Fetching Data", error);
		} finally {
			setIsLoading(false);
		}
	}, [userId, fetchTransactions, fetchSummary]);

	const deleteTransaction = async (id) => {
		try {
			const response = await fetch(`${API_URL}/transactions/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete transaction");
			await loadData();
			Alert.alert("Success", "Transaction deleted successfully");
		} catch (error) {
			console.log("Error deleting transaction", error);
			Alert.alert("Error", error.message);
		}
	};

	return { transactions, summary, isLoading, loadData, deleteTransaction };
};
