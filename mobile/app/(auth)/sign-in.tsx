import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";

export default function Page() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");

	// Handle the submission of the sign-in form
	const onSignInPress = async () => {
		if (!isLoaded) return;

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});

			// If sign-in process is complete, set the created session as active
			// and redirect the user
			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace("/");
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err: any) {
			if (err.errors?.[0]?.code === "form_password_incorrect") {
				setError("Password is incorrect. Please try again.");
			} else if (err.errors?.[0].code === "form_identifier_not_found") {
				setError(
					"Couldn't find your account. Please double-check your email address."
				);
			} else {
				setError("Something went wrong. Please try again.");
			}
		}
	};

	return (
		<KeyboardAwareScrollView
			style={{
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
			enableAutomaticScroll={true}
			enableOnAndroid={true}
			// extraScrollHeight={100}
		>
			<View style={styles.container}>
				<Image
					source={require("../../assets/images/revenue-i4.png")}
					style={styles.illustration}
				/>
				<Text style={styles.title}>Welcome Back</Text>

				{error ? (
					<View style={styles.errorBox}>
						<Ionicons
							name="alert-circle"
							size={20}
							color={COLORS.expense}
						/>
						<Text style={styles.errorText}>{error}</Text>
						<TouchableOpacity onPress={() => setError("")}>
							<Ionicons
								name="close"
								size={20}
								color={COLORS.textLight}
							/>
						</TouchableOpacity>
					</View>
				) : null}
				<TextInput
					style={[styles.input, error && styles.errorInput]}
					autoCapitalize="none"
					value={emailAddress}
					placeholder="Enter email"
					placeholderTextColor={"#9A8478"}
					onChangeText={(emailAddress) =>
						setEmailAddress(emailAddress)
					}
				/>
				<TextInput
					style={[styles.input, error && styles.errorInput]}
					value={password}
					placeholder="Enter password"
					placeholderTextColor={"#9A8478"}
					secureTextEntry={true}
					onChangeText={(password) => setPassword(password)}
				/>
				<TouchableOpacity onPress={onSignInPress} style={styles.button}>
					<Text style={styles.buttonText}>Sign In</Text>
				</TouchableOpacity>
				<View style={styles.footerContainer}>
					<Text style={styles.footerText}>
						Don&apos;t have an account?
					</Text>
					<Link href="/sign-up" asChild>
						<TouchableOpacity>
							<Text style={styles.linkText}>Sign up</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
}
