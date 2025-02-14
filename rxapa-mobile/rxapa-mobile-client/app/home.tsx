//objective: Home screen of the application
//objective: Écran d'accueil de l'application
import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ajout pour les icônes
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#e0f7fa', '#1B365D']} style={styles.container}>
      {/* Logo et message de bienvenue */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/Logo-Rx-APA-Allonge-sans-texte-Bleu-sur-fond-blanc-removebg-preview.png')}
          style={styles.logo}
        />
        <Text style={styles.greeting}>Bienvenue, John Doe !</Text>
      </View>

      {/* Menu sous forme de cartes */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/programme')}>
          <MaterialIcons name="fitness-center" size={30} color="#1B365D" />
          <Text style={styles.cardText}>Mon Programme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/seance')}>
          <Ionicons name="timer-outline" size={30} color="#1B365D" />
          <Text style={styles.cardText}>Ma Séance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/progression')}>
          <Ionicons name="bar-chart-outline" size={30} color="#1B365D" />
          <Text style={styles.cardText}>Ma Progression</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/configuration')}>
          <Ionicons name="settings-outline" size={30} color="#1B365D" />
          <Text style={styles.cardText}>Configuration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/cahier-de-suivi')}>
          <MaterialIcons name="assignment" size={30} color="#1B365D" />
          <Text style={styles.cardText}>Cahier de Suivi</Text>
        </TouchableOpacity>
      </View>

      //{/* Bouton Déconnexion */}

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
