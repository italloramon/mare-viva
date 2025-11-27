import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import WaveFooter from '../components/WaveFooter';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { authService } from '../services/authService';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { handleSendCode } = useAuth();
  const [email, setEmail] = useState('');

  const handleSendCodePress = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu email');
      return;
    }
    
    const result = await authService.sendRecoveryCode(email);
    
    if (result.success) {
      Alert.alert('Código Enviado!', result.message, [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('VerifyCode', { email }) 
        }
      ]);
    } else {
      Alert.alert('Erro', result.message);
    }
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
        <Text style={styles.title}>Recupere sua senha!</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <Text style={styles.infoText}>
            Caso seu e-mail esteja cadastrado, um código de recuperação será encaminhado
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Enviar código"
            onPress={handleSendCodePress}
            variant="primary"
            style={styles.sendButton}
          />
          
          <TouchableOpacity 
            onPress={() => {
              if (email) {
                navigation.navigate('VerifyCode', { email });
              } else {
                Alert.alert('Atenção', 'Por favor, informe seu email primeiro');
              }
            }} 
            style={styles.hasCodeLink}
          >
            <Text style={styles.hasCodeLinkText}>Já possuo o código</Text>
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
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  sendButton: {
    width: '100%',
    marginBottom: 20,
  },
  hasCodeLink: {
    paddingVertical: 8,
  },
  hasCodeLinkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
