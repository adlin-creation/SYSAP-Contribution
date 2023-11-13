import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProgramChange({navigation}) {
  const [programName, setProgramName] = useState('');

  const handleSaveProgramName = async () => {
    // fetch('http://localhost:5000/api/auth/changeProgram', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(requestBody),
    // })
    // .then((response) => {
    //     if (response.ok) {
    //         console.log(response);
    //         navigation.navigate('App');

    //     } else {
    //         Alert.alert('Login failed', 'Please check your credentials and try again.');
    //     }
    // })
    try {
        await AsyncStorage.setItem('programName', programName);
        const token = await AsyncStorage.getItem('userToken');
        console.log(token);
        navigation.navigate('App');
    } catch (error) {
        console.error('Error storing program name:', error);
    }
  };

  return (
    <View>
      <Text>Enter Program Name:</Text>
      <TextInput
        placeholder="Program Name"
        value={programName}
        onChangeText={text => setProgramName(text)}
      />
      <Button title="Save Program Name" onPress={handleSaveProgramName} />
    </View>
  );
}

export default ProgramChange;
