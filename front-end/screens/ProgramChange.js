import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.REACT_APP_API_URL;

function ProgramChange({navigation}) {
  const [programName, setProgramName] = useState('');
  const [error, setError] = useState(null);

  const handleSaveProgramName = async () => {
    const requestBody = {
        programName: programName,
    };
    const token = await AsyncStorage.getItem('userToken');

    fetch(`${apiUrl}/api/auth/change-program`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => {
        if (response.ok) {
            navigation.navigate('App');
        } else {
            setError('Le choix du programme a échoué. Veuillez vérifier vos informations et réessayer.');
        }
    })
    .catch((error) => {
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Program Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Program Name"
        value={programName}
        onChangeText={(text) => setProgramName(text)}
      />
      <Button title="Save Program Name" onPress={handleSaveProgramName} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default ProgramChange;
