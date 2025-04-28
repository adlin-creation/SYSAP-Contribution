/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AuthService from '../services/authService';
import { useRouter } from 'expo-router';

export default function AuthenticateScreen() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (code) {
      try {
        const data = await AuthService.authenticate(code);
        if (data.success) {
          // Navigate to HomeScreen
          router.push('/home');
        } else {
          Alert.alert(
            'Code invalide',
            "Si vous êtes Patient ou Proche-aidant, veuillez contacter votre kinésiologue pour obtenir un code valide. Si vous êtes Médecin ou Kinésiologue, veuillez contacter l’administrateur de Rx-APA."
          );
        }
      } catch (error) {
        console.error('Erreur:', error);
        Alert.alert('Erreur', 'Erreur réseau ou problème serveur');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentification</Text>
      <TextInput
        style={styles.input}
        placeholder="Code unique"
        value={code}
        onChangeText={setCode}
        keyboardType="default" // Utilise un clavier complet
      />
      <Button title="Accéder" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});*/
