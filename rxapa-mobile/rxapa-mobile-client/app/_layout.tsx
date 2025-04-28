// objective: create a layout for the application
// objective: créer une mise en page pour l'application
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('Layout:title_authentication') }} />
      <Stack.Screen
  name="home"
  options={{
    title: t('Layout:title_logout'),
    headerTitleStyle: {
      color: 'red', 
      fontSize: 20, 
      fontWeight: 'bold', 
    },
  }}
/>
      <Stack.Screen name="programme" options={{ title: t('Layout:title_my_program') }} />
      <Stack.Screen name="seance" options={{ title: t('Layout:title_my_session') }} />
      <Stack.Screen name="progression" options={{ title: t('Layout:title_my_progress') }} />
      <Stack.Screen name="configuration" options={{ title: t('Layout:title_settings') }} />
      <Stack.Screen name="cahier-de-suivi" options={{ title: t('Layout:title_tracking_notebook') }} />
    </Stack>
  );
}
