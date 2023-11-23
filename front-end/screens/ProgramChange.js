import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProgramChange({navigation}) {
  const [programName, setProgramName] = useState('');

  const handleSaveProgramName = async () => {
    const requestBody = {
        programName: programName,
    };
    const token = await AsyncStorage.getItem('userToken');

    fetch('http://localhost:80/api/auth/change-program', {
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
            Alert.alert('Login failed', 'Please check your credentials and try again.');
        }
    })
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
