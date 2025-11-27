import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { profileService, UserProfile } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { MainStackParamList } from '../navigation/MainNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { handleLogout: logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);

      const profile = await profileService.getProfile(user.id);
      if (profile) {
        setAddress(profile.address);
      } else {
        // Criar perfil inicial
        await profileService.createProfileFromUser(user, '');
      }
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert('Erro', 'Você precisa estar logado');
        return;
      }

      const result = await profileService.updateProfile(user.id, name, email, address);

      if (result.success) {
        Alert.alert('Sucesso!', result.message);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoWave1} />
          <View style={styles.logoWave2} />
        </View>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Digite seu nome"
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
            label="Endereço"
            placeholder="Digite seu endereço"
            value={address}
            onChangeText={setAddress}
          />

          <Button
            title="Salvar alterações"
            onPress={handleSave}
            variant="primary"
            style={styles.saveButton}
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  logoWave1: {
    width: 24,
    height: 12,
    backgroundColor: colors.secondary,
    borderRadius: 6,
    position: 'absolute',
    top: 8,
  },
  logoWave2: {
    width: 20,
    height: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 5,
    position: 'absolute',
    top: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  saveButton: {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ProfileScreen;
