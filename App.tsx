import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { authService } from './src/services/authService';
import { testDataService } from './src/services/testDataService';
import { profileService } from './src/services/profileService';
import { colors } from './src/styles/colors';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Inicializar dados de teste
    testDataService.initializeTestData();

    // Expor funções de desenvolvimento no console
    // Use: clearAllData() ou resetTestData() no console do React Native
    if (__DEV__) {
      (global as any).clearAllData = async () => {
        await testDataService.clearAllData();
        Alert.alert('Sucesso', 'Todos os dados foram limpos! Reinicie o app.');
      };
      (global as any).resetTestData = async () => {
        await testDataService.resetTestData();
        Alert.alert('Sucesso', 'Dados de teste resetados!');
      };
    }
  }, []);

  const checkAuth = async () => {
    const user = await authService.getCurrentUser();
    setIsAuthenticated(!!user);
    setIsLoading(false);
  };

  // Handle authentication logic
  const handleLogin = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    
    if (result.success && result.user) {
      // Criar perfil se não existir
      await profileService.createProfileFromUser(result.user, '');
      setIsAuthenticated(true);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    
    if (result.success) {
      // Fazer login automático após registro
      const loginResult = await authService.login(email, password);
      if (loginResult.success && loginResult.user) {
        await profileService.createProfileFromUser(loginResult.user, '');
        setIsAuthenticated(true);
      }
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleSendCode = async (email: string) => {
    const result = await authService.sendRecoveryCode(email);
    
    if (result.success) {
      // Mostra o código no console e no alert (apenas para testes)
      Alert.alert('Código Enviado!', result.message);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    const result = await authService.verifyRecoveryCode(email, code);
    
    if (result.success) {
      Alert.alert('Sucesso!', result.message);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleResetPassword = async (email: string, newPassword: string) => {
    const result = await authService.resetPassword(email, newPassword);
    
    if (result.success) {
      Alert.alert('Sucesso!', result.message, [
        { text: 'OK' }
      ]);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // Ou um componente de loading
  }

  return (
    <SafeAreaProvider>
      <AuthProvider
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSendCode={handleSendCode}
        onVerifyCode={handleVerifyCode}
        onResetPassword={handleResetPassword}
        onLogout={handleLogout}
      >
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={colors.background} />
          {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
