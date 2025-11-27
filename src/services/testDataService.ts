import AsyncStorage from '@react-native-async-storage/async-storage';
import { productService, Product } from './productService';
import { messageService } from './messageService';

const TEST_DATA_INITIALIZED_KEY = '@mare_viva:test_data_initialized';

export const testDataService = {
  // Inicializar dados de teste
  initializeTestData: async (): Promise<void> => {
    try {
      const initialized = await AsyncStorage.getItem(TEST_DATA_INITIALIZED_KEY);
      
      // Se já foi inicializado, verificar se os produtos de teste têm imagens locais
      if (initialized === 'true') {
        const products = await productService.getAllProducts();
        const testProductNames = ['Tainha', 'Salmão', 'Atum', 'Tilápia'];
        const testProducts = products.filter(p => testProductNames.includes(p.name));
        
        // Verificar se algum produto de teste não tem imagem local
        const needsUpdate = testProducts.some(p => !p.imageUri || !p.imageUri.startsWith('local:'));
        
        if (needsUpdate) {
          // Remover produtos de teste antigos para recriar com imagens locais
          for (const product of testProducts) {
            await productService.deleteProduct(product.id, product.sellerId);
          }
        } else {
          return; // Já tem imagens locais, não precisa recriar
        }
      }

      // Criar usuários de teste (simulados)
      const testUsers = [
        { id: 'user1', name: 'José João', email: 'jose@teste.com' },
        { id: 'user2', name: 'Nathan Scott', email: 'nathan@teste.com' },
        { id: 'user3', name: 'Brooke Davis', email: 'brooke@teste.com' },
        { id: 'user4', name: 'Jamie Scott', email: 'jamie@teste.com' },
      ];

      // Criar produtos de teste
      const testProducts: Omit<Product, 'id' | 'createdAt'>[] = [
        {
          name: 'Tainha',
          quantity: '1kg',
          price: 35,
          description: 'Tainha fresca pescada hoje. Excelente qualidade e sabor.',
          fishingDate: '31/12',
          imageUri: 'local:tainha', // Identificador para imagem local
          sellerId: 'user1',
          sellerName: 'José João',
        },
        {
          name: 'Salmão',
          quantity: '1kg',
          price: 135,
          description:
            'O Salmão É Uma Excelente Fonte De Ácidos Gordos Ómega-3 (EPA E DHA), Essenciais Para A Saúde Do Coração, Função Cerebral E Redução De Inflamações.',
          fishingDate: '31/12',
          imageUri: 'local:salmao', // Identificador para imagem local
          sellerId: 'user1',
          sellerName: 'José João',
        },
        {
          name: 'Atum',
          quantity: '1kg',
          price: 39,
          description: 'Atum fresco, rico em proteínas e ômega-3. Ideal para sashimi.',
          fishingDate: '30/12',
          imageUri: 'local:atum', // Identificador para imagem local
          sellerId: 'user2',
          sellerName: 'Nathan Scott',
        },
        {
          name: 'Tilápia',
          quantity: '1kg',
          price: 48,
          description: 'Tilápia fresca, sabor suave e textura macia. Perfeita para grelhar.',
          fishingDate: '29/12',
          imageUri: 'local:tilapia', // Identificador para imagem local
          sellerId: 'user3',
          sellerName: 'Brooke Davis',
        },
      ];

      // Criar produtos
      for (const product of testProducts) {
        await productService.createProduct(
          product.name,
          product.quantity,
          product.price,
          product.description,
          product.fishingDate,
          product.imageUri, // imageUri
          product.sellerId,
          product.sellerName
        );
      }

      // Criar mensagens de teste
      await messageService.sendMessage(
        'user1',
        'José João',
        'user2',
        'Nathan Scott',
        'Olá, Nathan! Tenho salmão fresco disponível.',
        undefined,
        'Salmão'
      );

      await messageService.sendMessage(
        'user2',
        'Nathan Scott',
        'user1',
        'José João',
        'Olá! Qual o preço do salmão?',
        undefined,
        'Salmão'
      );

      await messageService.sendMessage(
        'user1',
        'José João',
        'user2',
        'Nathan Scott',
        'R$135 o quilo. Está muito fresco!',
        undefined,
        'Salmão'
      );

      // Marcar como inicializado
      await AsyncStorage.setItem(TEST_DATA_INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Erro ao inicializar dados de teste:', error);
    }
  },

  // Resetar dados de teste (útil para desenvolvimento)
  resetTestData: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TEST_DATA_INITIALIZED_KEY);
      await AsyncStorage.removeItem('@mare_viva:products');
      await AsyncStorage.removeItem('@mare_viva:messages');
      await AsyncStorage.removeItem('@mare_viva:chats');
      console.log('✅ Dados de teste resetados!');
    } catch (error) {
      console.error('Erro ao resetar dados de teste:', error);
    }
  },

  // Limpar TUDO - reset completo (útil para desenvolvimento)
  clearAllData: async (): Promise<void> => {
    try {
      // Limpar todos os dados do app
      await AsyncStorage.multiRemove([
        TEST_DATA_INITIALIZED_KEY,
        '@mare_viva:products',
        '@mare_viva:messages',
        '@mare_viva:chats',
        '@mare_viva:users',
        '@mare_viva:current_user',
        '@mare_viva:recovery_codes',
        '@mare_viva:profiles',
      ]);
      console.log('✅ TODOS os dados foram limpos! App resetado completamente.');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  },
};
