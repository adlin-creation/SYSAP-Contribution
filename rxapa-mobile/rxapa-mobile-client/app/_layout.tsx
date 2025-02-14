// objective: create a layout for the application
// objective: créer une mise en page pour l'application
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Authentification' }} />
      <Stack.Screen
  name="home"
  options={{
    title: 'Déconnexion',
    headerTitleStyle: {
      color: 'red', 
      fontSize: 20, 
      fontWeight: 'bold', 
    },
  }}
/>
      <Stack.Screen name="programme" options={{ title: 'Mon Programme' }} />
      <Stack.Screen name="seance" options={{ title: 'Ma Séance' }} />
      <Stack.Screen name="progression" options={{ title: 'Ma Progression' }} />
      <Stack.Screen name="configuration" options={{ title: 'Configuration' }} />
      <Stack.Screen name="cahier-de-suivie" options={{ title: 'Cahier de Suivie' }} />
    </Stack>
  );
}
