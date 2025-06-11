import {
	View,
	Text,
	Alert,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { API_URL } from "@/constants/api";
import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
	{ id: "food", name: "Food & Drinks", icon: "fast-food" as const },
	{
		id: "shopping",
		name: "Shopping",
		icon: "cart" as const,
	},
	{
		id: "transportation",
		name: "Transportation",
		icon: "car" as const,
	},
	{
		id: "entertainment",
		name: "Entertainment",
		icon: "film" as const,
	},
	{ id: "bills", name: "Bills", icon: "receipt" as const },
	{ id: "income", name: "Income", icon: "cash" as const },
	{ id: "other", name: "Other", icon: "ellipsis-horizontal" as const },
];

const CreateScreen = () => {
	const router = useRouter();
	const { user } = useUser();

	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [isExpense, setIsExpense] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const handleCreate = async () => {
		// validations
		if (!title.trim())
			return Alert.alert("Error", "Please enter a transaction title");
		if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
			Alert.alert("Error", "Please enter a valid amount");
		}
		if (!selectedCategory) {
			Alert.alert("Error", "Please select a category");
		}
		setIsLoading(true);
		try {
			// format the amount (negative for expenses, positive for incomes)
			const formattedAmount = isExpense
				? -Math.abs(parseFloat(amount))
				: Math.abs(parseFloat(amount));

			const response = await fetch(`${API_URL}/transactions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: user?.id,
					title,
					amount: formattedAmount,
					category: selectedCategory,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || "Failed to create transaction"
				);
			}

			Alert.alert("Success", "Transaction created successfully");
			router.back();
		} catch (error: any) {
			Alert.alert(
				"Error",
				error.message || "Failed to create transaction"
			);
			console.log("Error creating transaction", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Ionicons name="arrow-back" size={24} color={COLORS.text} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>New Transaction</Text>
				<TouchableOpacity
					style={[
						styles.saveButtonContainer,
						isLoading && styles.saveButtonDisabled,
					]}
					onPress={handleCreate}
					disabled={isLoading}
				>
					<Text style={styles.saveButton}>
						{isLoading ? "Saving..." : "Save"}
					</Text>
					{!isLoading && (
						<Ionicons
							name="checkmark"
							size={18}
							color={COLORS.primary}
						/>
					)}
				</TouchableOpacity>
			</View>

			<View style={styles.card}>
				<View style={styles.typeSelector}>
					{/* Expense Selector */}
					<TouchableOpacity
						style={[
							styles.typeButton,
							isExpense && styles.typeButtonActive,
						]}
						onPress={() => setIsExpense(true)}
					>
						<Ionicons
							name="arrow-down-circle"
							size={22}
							color={isExpense ? COLORS.white : COLORS.expense}
							style={styles.typeIcon}
						/>
						<Text
							style={[
								styles.typeButtonText,
								isExpense && styles.typeButtonTextActive,
							]}
						>
							Expense
						</Text>
					</TouchableOpacity>
					{/* Income Selector */}
					<TouchableOpacity
						style={[
							styles.typeButton,
							!isExpense && styles.typeButtonActive,
						]}
						onPress={() => setIsExpense(false)}
					>
						<Ionicons
							name="arrow-up-circle"
							size={22}
							color={!isExpense ? COLORS.white : COLORS.income}
							style={styles.typeIcon}
						/>
						<Text
							style={[
								styles.typeButtonText,
								!isExpense && styles.typeButtonTextActive,
							]}
						>
							Income
						</Text>
					</TouchableOpacity>
				</View>

				{/* Amount Container */}
				<View style={styles.amountContainer}>
					<Text style={styles.currencySymbol}>$</Text>
					<TextInput
						style={styles.amountInput}
						placeholder="0.00"
						placeholderTextColor={COLORS.textLight}
						value={amount}
						onChangeText={setAmount}
						keyboardType="numeric"
					/>
				</View>

				{/* Input Container */}
				<View style={styles.inputContainer}>
					<Ionicons
						name="create-outline"
						size={22}
						color={COLORS.textLight}
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Transaction Title"
						placeholderTextColor={COLORS.textLight}
						value={title}
						onChangeText={setTitle}
					/>
				</View>

				{/* Title */}
				<Text style={styles.sectionTitle}>
					<Ionicons
						name="pricetag-outline"
						size={16}
						color={COLORS.text}
					/>
					Category
				</Text>

				<View style={styles.categoryGrid}>
					{CATEGORIES.map((category) => (
						<TouchableOpacity
							key={category.id}
							style={[
								styles.categoryButton,
								selectedCategory === category.name &&
									styles.categoryButtonActive,
							]}
							onPress={() => setSelectedCategory(category.name)}
						>
							<Ionicons
								name={category.icon}
								size={20}
								color={
									selectedCategory === category.name
										? COLORS.white
										: COLORS.text
								}
								style={styles.categoryIcon}
							/>
							<Text
								style={[
									styles.categoryButtonText,
									selectedCategory === category.name &&
										styles.categoryButtonTextActive,
								]}
							>
								{category.name}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
			{isLoading && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			)}
		</View>
	);
};

export default CreateScreen;
