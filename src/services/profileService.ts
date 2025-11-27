import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User } from './authService';

const PROFILE_KEY = '@mare_viva:profiles';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  address: string;
}

// Busca todos os perfis
const getProfiles = async (): Promise<Record<string, UserProfile>> => {
  try {
    const profilesJson = await AsyncStorage.getItem(PROFILE_KEY);
    return profilesJson ? JSON.parse(profilesJson) : {};
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    return {};
  }
};

// Salva todos os perfis
const saveProfiles = async (profiles: Record<string, UserProfile>): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Erro ao salvar perfis:', error);
    throw error;
  }
};

export const profileService = {
  // Buscar perfil do usuário
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const profiles = await getProfiles();
      return profiles[userId] || null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  },

  // Criar ou atualizar perfil
  updateProfile: async (
    userId: string,
    name: string,
    email: string,
    address: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!name || !email) {
        return { success: false, message: 'Nome e email são obrigatórios' };
      }

      const profiles = await getProfiles();

      // Se já existe, atualiza; senão, cria novo
      const existingProfile = profiles[userId];
      if (existingProfile && existingProfile.email !== email) {
        // Se mudou o email, precisa atualizar no authService também
        // Por simplicidade, vamos apenas atualizar o perfil
      }

      profiles[userId] = {
        userId,
        name,
        email,
        address: address || '',
      };

      await saveProfiles(profiles);

      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro ao atualizar perfil. Tente novamente.' };
    }
  },

  // Criar perfil inicial a partir do usuário
  createProfileFromUser: async (user: User, address: string = ''): Promise<void> => {
    try {
      const profiles = await getProfiles();
      
      if (!profiles[user.id]) {
        profiles[user.id] = {
          userId: user.id,
          name: user.name,
          email: user.email,
          address,
        };
        await saveProfiles(profiles);
      }
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
    }
  },
};
