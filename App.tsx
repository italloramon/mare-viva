import React, { useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { authService } from './src/services/authService';
import { colors } from './src/styles/colors';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle authentication logic
  const handleLogin = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      Alert.alert('Sucesso!', result.message, [
        { text: 'OK', onPress: () => setIsAuthenticated(true) }
      ]);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    
    if (result.success) {
      Alert.alert('Sucesso!', result.message, [
        { text: 'OK' }
      ]);
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

  return (
    <AuthProvider
      onLogin={handleLogin}
      onRegister={handleRegister}
      onSendCode={handleSendCode}
      onVerifyCode={handleVerifyCode}
      onResetPassword={handleResetPassword}
    >
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
