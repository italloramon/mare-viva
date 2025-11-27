import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  productId?: string;
  productName?: string;
}

export interface Chat {
  id: string;
  userId1: string;
  userName1: string;
  userId2: string;
  userName2: string;
  productId?: string;
  productName?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

const MESSAGES_KEY = '@mare_viva:messages';
const CHATS_KEY = '@mare_viva:chats';

// Busca todas as mensagens
const getMessages = async (): Promise<Message[]> => {
  try {
    const messagesJson = await AsyncStorage.getItem(MESSAGES_KEY);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return [];
  }
};

// Salva todas as mensagens
const saveMessages = async (messages: Message[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Erro ao salvar mensagens:', error);
    throw error;
  }
};

// Busca todos os chats
const getChats = async (): Promise<Chat[]> => {
  try {
    const chatsJson = await AsyncStorage.getItem(CHATS_KEY);
    return chatsJson ? JSON.parse(chatsJson) : [];
  } catch (error) {
    console.error('Erro ao buscar chats:', error);
    return [];
  }
};

// Salva todos os chats
const saveChats = async (chats: Chat[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Erro ao salvar chats:', error);
    throw error;
  }
};

// Gera ID do chat baseado nos IDs dos usuários
const generateChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

export const messageService = {
  // Enviar mensagem
  sendMessage: async (
    senderId: string,
    senderName: string,
    receiverId: string,
    receiverName: string,
    text: string,
    productId?: string,
    productName?: string
  ): Promise<{ success: boolean; message: string; messageData?: Message }> => {
    try {
      if (!text.trim()) {
        return { success: false, message: 'A mensagem não pode estar vazia' };
      }

      const messages = await getMessages();
      const chats = await getChats();

      const chatId = generateChatId(senderId, receiverId);

      const newMessage: Message = {
        id: Date.now().toString(),
        chatId,
        senderId,
        senderName,
        receiverId,
        receiverName,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        productId,
        productName,
      };

      messages.push(newMessage);
      await saveMessages(messages);

      // Atualizar ou criar chat
      let chat = chats.find((c) => c.id === chatId);
      if (!chat) {
        chat = {
          id: chatId,
          userId1: senderId,
          userName1: senderName,
          userId2: receiverId,
          userName2: receiverName,
          productId,
          productName,
          unreadCount: 0,
        };
        chats.push(chat);
      }

      // Atualizar última mensagem
      chat.lastMessage = text.trim();
      chat.lastMessageTime = new Date().toISOString();

      // Incrementar contador de não lidas para o receptor
      if (chat.userId1 === receiverId) {
        chat.unreadCount += 1;
      } else if (chat.userId2 === receiverId) {
        chat.unreadCount += 1;
      } else {
        // Se o sender não está no chat, resetar contador
        chat.unreadCount = 0;
      }

      await saveChats(chats);

      return { success: true, message: 'Mensagem enviada!', messageData: newMessage };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { success: false, message: 'Erro ao enviar mensagem. Tente novamente.' };
    }
  },

  // Buscar mensagens de um chat
  getChatMessages: async (chatId: string): Promise<Message[]> => {
    const messages = await getMessages();
    return messages.filter((m) => m.chatId === chatId).sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  },

  // Buscar chats do usuário
  getUserChats: async (userId: string): Promise<Chat[]> => {
    const chats = await getChats();
    return chats
      .filter((c) => c.userId1 === userId || c.userId2 === userId)
      .sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });
  },

  // Marcar mensagens como lidas
  markAsRead: async (chatId: string, userId: string): Promise<void> => {
    try {
      const chats = await getChats();
      const chat = chats.find((c) => c.id === chatId);

      if (chat) {
        chat.unreadCount = 0;
        await saveChats(chats);
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  },

  // Buscar ou criar chat entre dois usuários
  getOrCreateChat: async (
    userId1: string,
    userName1: string,
    userId2: string,
    userName2: string,
    productId?: string,
    productName?: string
  ): Promise<Chat> => {
    const chats = await getChats();
    const chatId = generateChatId(userId1, userId2);

    let chat = chats.find((c) => c.id === chatId);

    if (!chat) {
      chat = {
        id: chatId,
        userId1,
        userName1,
        userId2,
        userName2,
        productId,
        productName,
        unreadCount: 0,
      };
      chats.push(chat);
      await saveChats(chats);
    }

    return chat;
  },
};
