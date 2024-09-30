import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Text, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment'; 
import { auth, createUserWithEmailAndPassword, firestore } from "../firebase";
import { useNavigation } from '@react-navigation/core';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [country, setCountry] = useState(null);
  const [gender, setGender] = useState(null);
  const [biography, setBiography] = useState('');

  const [openCountry, setOpenCountry] = useState(false);
  const [openGender, setOpenGender] = useState(false);

  const [countries, setCountries] = useState([
    { label: 'USA', value: 'usa' },
    { label: 'Canada', value: 'canada' },
    { label: 'UK', value: 'uk' },
    { label: 'Morocco', value: 'morocco' },
  ]);

  const [genders, setGenders] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    })
    return unsubscribe;
  }, []);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        // Signed in 
        const user = userCredentials.user;
        console.log('User registered successfully!', user);

        await setDoc(doc(firestore, 'users', user.uid), {
          email: user.email,
          name: name,
          biography: biography,
          birthdate: moment(birthdate).format('MM/DD/YYYY'),
          country: country,
          gender: gender,
          createdAt: new Date(),
        });
        console.log('User data saved in Firestore!');

        await AsyncStorage.setItem('userName', name);
        await AsyncStorage.setItem('userEmail', email);
        console.log('User name and email saved in AsyncStorage!')

      })
      .catch((error) => {
        alert(error.message);
    });
  };

  const onChangeBirthdate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS until "Done" is pressed
    setBirthdate(currentDate);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
        />
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

        {/* Birthdate Label and Input */}
        <Text style={styles.label}>Birthdate</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.birthdateText}>
            {moment(birthdate).format('MM/DD/YYYY')}
          </Text>
        </TouchableOpacity>

        {/* Show DatePicker only when triggered */}
        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            display="default"
            onChange={onChangeBirthdate}
          />
        )}

        <DropDownPicker
          open={openCountry}
          value={country}
          items={countries}
          setOpen={setOpenCountry}
          setValue={setCountry}
          setItems={setCountries}
          placeholder="Country"
          style={[styles.picker, styles.countryPicker]}
          dropDownStyle={styles.dropdown}
        />

        <DropDownPicker
          open={openGender}
          value={gender}
          items={genders}
          setOpen={setOpenGender}
          setValue={setGender}
          setItems={setGenders}
          placeholder="Gender"
          style={[styles.picker, styles.genderPicker]}
          dropDownStyle={styles.dropdown}
        />

        <TextInput
          placeholder="Biography"
          value={biography}
          onChangeText={text => setBiography(text)}
          style={[styles.input, styles.biographyInput]}
          multiline={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
    zIndex: 10, // Ensure input fields are above other elements
  },
  birthdateText: {
    color: '#333',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    // fontWeight: 'bold',
  },
  picker: {
    marginTop: 10,
    backgroundColor: '#f1f3f6',
    borderRadius: 10,
  },
  countryPicker: {
    zIndex: 20, // Ensure country picker is above gender picker
  },
  genderPicker: {
    zIndex: 15, // Ensure gender picker is below country picker
  },
  dropdown: {
    backgroundColor: '#f1f3f6',
  },
  biographyInput: {
    height: 100,
    textAlignVertical: 'top',
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
});
