import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootLayout() {
	return (
		<ClerkProvider tokenCache={tokenCache}>
			<SafeScreen>
				<Slot />
			</SafeScreen>
			<StatusBar style="dark" />
		</ClerkProvider>
	);
}

export default RootLayout;
