import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Text style={{ color: "white" }}>Welcome to the app</Text>
			<Link href={"/about"}>About</Link>
			{/* <Image
				source={{
					uri: "https://plus.unsplash.com/premium_photo-1720744786864-440bb3ffd11f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
				}}
				style={{ width: 200, height: 200 }}
			/> */}
			<Image
				source={require("@/assets/images/react-logo.png")}
				style={{ width: 200, height: 200 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
