import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    console.log('Index: isAuthenticated =', isAuthenticated, 'initializing =', initializing);
  }, [isAuthenticated, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  console.log('Index: Redirigiendo a', isAuthenticated ? "/(tabs)" : "/welcome");
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/welcome"} />;
}


