// objective: create a layout for the application
// objective: créer une mise en page pour l'application
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('Layout:authentification') }} />
      <Stack.Screen
  name="home"
  options={{
    title: t('Layout:deconnexion'),
    headerTitleStyle: {
      color: 'red', 
      fontSize: 20, 
      fontWeight: 'bold', 
    },
  }}
/>
      <Stack.Screen name="programme" options={{ title: t('Layout:mon_programme') }} />
      <Stack.Screen name="seance" options={{ title: t('Layout:ma_seance') }} />
      <Stack.Screen name="progression" options={{ title: t('Layout:ma_progression') }} />
      <Stack.Screen name="configuration" options={{ title: t('Layout:configuration') }} />
      <Stack.Screen name="cahier-de-suivi" options={{ title: t('Layout:cahier_de_suivi') }} />
    </Stack>
  );
}
