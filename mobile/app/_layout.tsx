import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

function RootLayout() {
	return (
		<ClerkProvider tokenCache={tokenCache}>
			<SafeScreen>
				<Slot />
			</SafeScreen>
		</ClerkProvider>
	);
}

export default RootLayout;
