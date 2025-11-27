import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type AuthContextType = {
  handleLogin: (email: string, password: string) => void;
  handleRegister: (name: string, email: string, password: string) => void;
  handleSendCode: (email: string) => void;
  handleVerifyCode: (email: string, code: string) => void;
  handleResetPassword: (email: string, newPassword: string) => void;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onSendCode: (email: string) => void;
  onVerifyCode: (email: string, code: string) => void;
  onResetPassword: (email: string, newPassword: string) => void;
  onLogout: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onLogin,
  onRegister,
  onSendCode,
  onVerifyCode,
  onResetPassword,
  onLogout,
}) => {
  return (
    <AuthContext.Provider
      value={{
        handleLogin: onLogin,
        handleRegister: onRegister,
        handleSendCode: onSendCode,
        handleVerifyCode: onVerifyCode,
        handleResetPassword: onResetPassword,
        handleLogout: onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


