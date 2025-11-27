import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { messageService, Chat } from '../services/messageService';
import { authService } from '../services/authService';
import { MainStackParamList } from '../navigation/MainNavigator';

type MessagesScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      setCurrentUserId(user.id);
      const userChats = await messageService.getUserChats(user.id);
      setChats(userChats);
    }
  };

  const getChatName = (chat: Chat): string => {
    if (!currentUserId) return '';
    return chat.userId1 === currentUserId ? chat.userName2 : chat.userName1;
  };

  const handleChatPress = (chat: Chat) => {
    const otherUserId = chat.userId1 === currentUserId ? chat.userId2 : chat.userId1;
    const otherUserName = chat.userId1 === currentUserId ? chat.userName2 : chat.userName1;

    navigation.navigate('Chat', {
      chatId: chat.id,
      sellerId: otherUserId,
      sellerName: otherUserName,
      productId: chat.productId,
      productName: chat.productName,
    });
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const chatName = getChatName(item);
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color={colors.white} />
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{chatName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'Nenhuma mensagem'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoWave1} />
          <View style={styles.logoWave2} />
        </View>
        <Text style={styles.title}>Mensagens</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.gray} />
          <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatsList}
        />
      )}
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
  chatsList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default MessagesScreen;
