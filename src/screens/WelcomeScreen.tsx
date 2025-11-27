import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import WaveFooter from '../components/WaveFooter';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoWave1} />
            <View style={styles.logoWave2} />
          </View>
          <Text style={styles.appName}>Maré Viva</Text>
          <Text style={styles.tagline}>
            Compre, venda e interaja com comerciantes e pescadores locais
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            style={styles.loginButton}
          />
          <Button
            title="Cadastro"
            onPress={() => navigation.navigate('Register')}
            variant="secondary"
            style={styles.registerButton}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for wave footer
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoWave1: {
    width: 50,
    height: 25,
    backgroundColor: colors.secondary,
    borderRadius: 25,
    position: 'absolute',
    top: 20,
  },
  logoWave2: {
    width: 40,
    height: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    position: 'absolute',
    top: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  loginButton: {
    flex: 1,
    marginRight: 8,
  },
  registerButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default WelcomeScreen;
