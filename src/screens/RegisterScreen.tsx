import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import WaveFooter from '../components/WaveFooter';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { handleRegister } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterPress = () => {
    handleRegister(name, email, password);
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
        <Text style={styles.title}>Crie sua conta!</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Digite seu nome completo"
            value={name}
            onChangeText={setName}
          />
          
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Registrar"
            onPress={handleRegisterPress}
            variant="primary"
            style={styles.registerButton}
          />
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Já possuo uma conta</Text>
          </TouchableOpacity>
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
  registerButton: {
    width: '100%',
    marginBottom: 20,
  },
  loginLink: {
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default RegisterScreen;
