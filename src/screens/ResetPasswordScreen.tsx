import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import WaveFooter from '../components/WaveFooter';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { handleResetPassword } = useAuth();
  const { email } = route.params;
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPasswordPress = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    handleResetPassword(email, newPassword);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Maré Viva</Text>
          <View style={styles.waveIcon}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Redefina sua senha!</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nova senha"
            placeholder="Digite sua nova senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          
          <Input
            label="Confirmar senha"
            placeholder="Confirme sua nova senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Redefinir senha"
            onPress={handleResetPasswordPress}
            variant="primary"
            style={styles.resetButton}
          />
        </View>
      </View>
      
      <WaveFooter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  waveIcon: {
    width: 24,
    height: 16,
    position: 'relative',
  },
  wave1: {
    width: 20,
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
  },
  wave2: {
    width: 16,
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
    position: 'absolute',
    top: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  resetButton: {
    width: '100%',
  },
});

export default ResetPasswordScreen;
