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
import { authService } from '../services/authService';

type VerifyCodeScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyCode'>;
type VerifyCodeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyCode'>;

const VerifyCodeScreen: React.FC = () => {
  const navigation = useNavigation<VerifyCodeScreenNavigationProp>();
  const route = useRoute<VerifyCodeScreenRouteProp>();
  const { email } = route.params;
  const { handleVerifyCode } = useAuth();
  const [code, setCode] = useState('');

  const handleVerifyCodePress = async () => {
    if (!code) {
      Alert.alert('Erro', 'Por favor, digite o código');
      return;
    }

    const result = await authService.verifyRecoveryCode(email, code);
    
    if (result.success) {
      Alert.alert('Sucesso!', result.message, [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('ResetPassword', { email }) 
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
        <Text style={styles.title}>Digite o código recebido!</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Código"
            placeholder="Digite o código de 6 dígitos"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar código"
            onPress={handleVerifyCodePress}
            variant="primary"
            style={styles.verifyButton}
          />
          
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.notWorkingLink}>
            <Text style={styles.notWorkingLinkText}>O código não funcionou</Text>
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
  verifyButton: {
    width: '100%',
    marginBottom: 20,
  },
  notWorkingLink: {
    paddingVertical: 8,
  },
  notWorkingLinkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default VerifyCodeScreen;
