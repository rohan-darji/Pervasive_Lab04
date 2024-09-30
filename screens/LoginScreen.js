import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, signInWithEmailAndPassword, firestore } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    });

    const loadUserData = async() => {
      try {
        const savedName = await AsyncStorage.getItem('userName');
        const savedEmail = await AsyncStorage.getItem('userEmail');

        if(savedEmail) {
          setEmail(savedEmail);
        }
      }
      catch (error) {
        console.error('Failed to load user data from AsyncStorage!', error);
      }
    };

    loadUserData();

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User logged in successfully!', user);
        
        // Show success alert
        Alert.alert(
          "Login Successful",
          `Welcome back, ${user.email}!`,
          [
            { text: "OK", onPress: () => navigation.navigate('Home') }
          ]
        );
      })
      .catch((error) => {
        // Show error alert
        Alert.alert(
          "Login Failed",
          error.message,
          [
            { text: "OK" }
          ]
        );
      });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Not a member yet?{' '}
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('Register')} 
          >
            Register Now
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#f1f3f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#1877f2',
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  signUpText: {
    color: '#1877f2',
    fontWeight: '700',
  },
});
