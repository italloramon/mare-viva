import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção, isso seria um hash
}

const USERS_KEY = '@mare_viva:users';
const CURRENT_USER_KEY = '@mare_viva:current_user';
const RECOVERY_CODES_KEY = '@mare_viva:recovery_codes';

// Gera um código de recuperação de 6 dígitos
const generateRecoveryCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Busca todos os usuários
const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

// Salva todos os usuários
const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    throw error;
  }
};

// Autenticação Service
export const authService = {
  // Registro de novo usuário
  register: async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Validações básicas
      if (!name || !email || !password) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      if (password.length < 6) {
        return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
      }

      // Validação de email simples
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Email inválido' };
      }

      const users = await getUsers();

      // Verifica se o email já está cadastrado
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, message: 'Este email já está cadastrado' };
      }

      // Cria novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password, // Em produção, isso seria um hash (bcrypt, etc)
      };

      users.push(newUser);
      await saveUsers(users);

      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro ao criar conta. Tente novamente.' };
    }
  },

  // Login
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      if (!email || !password) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      const users = await getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return { success: false, message: 'Email ou senha incorretos' };
      }

      // Salva o usuário atual
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { success: true, message: 'Login realizado com sucesso!', user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
    }
  },

  // Enviar código de recuperação
  sendRecoveryCode: async (email: string): Promise<{ success: boolean; message: string; code?: string }> => {
    try {
      if (!email) {
        return { success: false, message: 'Por favor, informe seu email' };
      }

      const users = await getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Por segurança, não revelamos se o email existe ou não
        return { success: true, message: 'Se o email estiver cadastrado, um código será enviado.' };
      }

      // Gera código de recuperação
      const code = generateRecoveryCode();

      // Salva o código associado ao email (expira em 10 minutos)
      const recoveryCodes = await AsyncStorage.getItem(RECOVERY_CODES_KEY);
      const codes = recoveryCodes ? JSON.parse(recoveryCodes) : {};
      codes[email.toLowerCase()] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutos
      };
      await AsyncStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));

      // Em produção, você enviaria o código por email
      // Por enquanto, vamos retornar o código para facilitar testes
      console.log(`🔐 Código de recuperação para ${email}: ${code}`);

      return {
        success: true,
        message: `Código enviado! (Para testes, o código é: ${code})`,
        code, // Apenas para testes - remover em produção
      };
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      return { success: false, message: 'Erro ao enviar código. Tente novamente.' };
    }
  },

  // Verificar código de recuperação
  verifyRecoveryCode: async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!email || !code) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      const recoveryCodes = await AsyncStorage.getItem(RECOVERY_CODES_KEY);
      if (!recoveryCodes) {
        return { success: false, message: 'Código inválido ou expirado' };
      }

      const codes = JSON.parse(recoveryCodes);
      const emailKey = email.toLowerCase();
      const storedCode = codes[emailKey];

      if (!storedCode) {
        return { success: false, message: 'Código inválido ou expirado' };
      }

      // Verifica se o código expirou
      if (Date.now() > storedCode.expiresAt) {
        delete codes[emailKey];
        await AsyncStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));
        return { success: false, message: 'Código expirado. Solicite um novo código.' };
      }

      // Verifica se o código está correto
      if (storedCode.code !== code) {
        return { success: false, message: 'Código incorreto' };
      }

      // Código válido - remove o código usado
      delete codes[emailKey];
      await AsyncStorage.setItem(RECOVERY_CODES_KEY, JSON.stringify(codes));

      return { success: true, message: 'Código verificado com sucesso!' };
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return { success: false, message: 'Erro ao verificar código. Tente novamente.' };
    }
  },

  // Redefinir senha (após verificar código)
  resetPassword: async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!email || !newPassword) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      if (newPassword.length < 6) {
        return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
      }

      const users = await getUsers();
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      // Atualiza a senha
      users[userIndex].password = newPassword; // Em produção, isso seria um hash
      await saveUsers(users);

      return { success: true, message: 'Senha redefinida com sucesso!' };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return { success: false, message: 'Erro ao redefinir senha. Tente novamente.' };
    }
  },

  // Verifica se há um usuário logado
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },
};
