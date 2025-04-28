// objective: Create a login screen that allows the user to enter a code and authenticate
// objective: Créer un écran de connexion qui permet à l'utilisateur de saisir un code et de s'authentifier
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import AuthService from '../services/authService';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

export default function IndexScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Nouveau état pour le message d'erreur
  const [showModal, setShowModal] = useState(false); // État pour afficher ou cacher la boîte modale
  const router = useRouter();

  const { t, i18n } = useTranslation();

  const handleSubmit = async () => {
    setErrorMessage(null); // Réinitialise le message d'erreur
    if (!code.trim()) {
      setErrorMessage(t('Index:error_enter_code'));
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.authenticate(code);
      if (response.success) {
        const savedId = await AsyncStorage.getItem('programEnrollementId');
        console.log('Stored Program Enrollement ID after login:', savedId);

        if (!savedId) {
          setErrorMessage("Impossible de sauvegarder l'identifiant du programme.");
          return;
        }

        // Navigate to HomeScreen
        router.push('/home');
      } else {
        setErrorMessage(t('Index:error_incorrect_code'));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#1B365D']} // Dégradé bleu/blanc
      style={styles.gradientBackground}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Logo-Rx-APA-Allonge-sans-texte-Bleu-sur-fond-blanc-removebg-preview.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('Index:title_authentication')}</Text>
        <Text style={styles.subtitle}>{t('Index:info_enter_code')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('Index:placeholder_enter_code')}
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setErrorMessage(null); // Efface le message d'erreur en cas de saisie
          }}
          keyboardType="default"
          placeholderTextColor="#666"
        />
        {/* Affichage du message d'erreur */}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : {}]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{t('Index:title_login')}</Text>
        </TouchableOpacity>

        {/* Ajout de l'option pour "Je n'ai pas le code personnel" */}
        <TouchableOpacity
          style={styles.noCodeButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.noCodeText}>{t('Index:button_no_code')}</Text>
        </TouchableOpacity>
      </View>

      {/* Modale pour afficher les instructions */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Index:title_need_help')}</Text>
            <Text style={styles.modalText}>
              {t('Index:title_contact_info')}
            </Text>
            <Text style={styles.modalText}>
              - {t('Index:title_contact_it_department')} <Text style={styles.highlight}>TEST@ssss.gouv.qc.ca</Text>
            </Text>
            <Text style={styles.modalText}>
              - {t('Index:title_contact_kinesiologist')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>{t("index:button_close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  logoContainer: {
    height: '30%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: { width: 320, height: 180, resizeMode: 'contain' },
  formContainer: { flex: 1, padding: 30, justifyContent: 'flex-start', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 10, letterSpacing: 1 },
  subtitle: { fontSize: 18, color: '#ffffff', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#1B365D',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600', letterSpacing: 1 },
  noCodeButton: { marginTop: 20 },
  noCodeText: { color: '#ffffff', textDecorationLine: 'underline', fontSize: 16 },
  errorText: { color: '#FF5252', fontSize: 16, marginBottom: 10, textAlign: 'center' }, // Style pour le texte d'erreur
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1B365D',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
