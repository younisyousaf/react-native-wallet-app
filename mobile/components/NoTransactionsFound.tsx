import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";

const NoTransactionsFound = () => {
	return (
		<View style={styles.emptyState}>
			<Ionicons
				name="receipt-outline"
				size={60}
				color={COLORS.textLight}
				style={styles.emptyStateIcon}
			/>
			<Text style={styles.emptyStateTitle}>No transactions yet</Text>
			<Text style={styles.emptyStateText}>
				Start Tracking your finances by adding your first transaction
			</Text>
			<TouchableOpacity
				style={styles.emptyStateButton}
				onPress={() => router.push("/(root)/create")}
			>
				<Ionicons name="add-circle" size={18} color={COLORS.white} />
				<Text style={styles.emptyStateButtonText}>Add Transaction</Text>
			</TouchableOpacity>
		</View>
	);
};

export default NoTransactionsFound;
