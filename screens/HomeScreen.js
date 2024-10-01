import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, PanResponder } from 'react-native'
import { auth, firestore } from '../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Animated } from 'react-native';


const HomeScreen = () => {

	const navigation = useNavigation();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleLogOut = () => {
		auth
			.signOut()
			.then(() => {
				navigation.replace("Login")
			})
			.catch(error => alert(error.message))
	}

	const pan = useRef(new Animated.ValueXY()).current;

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }],
				{ useNativeDriver: false }
			),
			onPanResponderRelease: () => {
				pan.extractOffset();
			},
		}),
	).current;

	const FadeInView = props => {
		const fadeAnim = useRef(new Animated.Value(0)).current;

		useEffect(() => {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 10000,
				useNativeDriver: true,
			}).start();
		}, [fadeAnim]);

		return (
			<Animated.View
				style={{
					...props.style,
					opacity: fadeAnim,
				}}>
				{props.children}
			</Animated.View>
		);
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const user = auth.currentUser;
				if (user) {
					const userDoc = await getDoc(doc(firestore, 'users', user.uid));
					if (userDoc.exists()) {
						setUserData(userDoc.data());
					} else {
						console.log('No such document!');
					}
				}
			} catch (error) {
				console.error("Error fetching user data: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return <ActivityIndicator size="large" color="#0782F9" />
	}


	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<FadeInView
					style={{
						width: 250,
						height: 70,
						backgroundColor: 'powderblue',
					}}>
					<Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
						Logged in
					</Text>
				</FadeInView>
			</View>
			<View style={styles.container}>
				<Text style={styles.titleText}>Drag this box!</Text>
				<Animated.View
					style={{
						transform: [{ translateX: pan.x }, { translateY: pan.y }],
					}}
					{...panResponder.panHandlers}>
					<View style={styles.box} />
				</Animated.View>
			</View>
			<View style={styles.container}>
				<Text>Email: {userData?.email}</Text>
				<Text>Name: {userData?.name}</Text>
				<TouchableOpacity
					onPress={handleLogOut}
					style={styles.button}
				>
					<Text style={styles.buttonText}>Sign out</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		backgroundColor: '#0782F9',
		width: '60%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 40,
	},
	dragContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
	titleText: {
		fontSize: 14,
		lineHeight: 24,
		fontWeight: 'bold',
	},
	box: {
		height: 150,
		width: 150,
		backgroundColor: 'blue',
		borderRadius: 5,
	},
})