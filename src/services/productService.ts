import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  name: string;
  quantity: string;
  price: number;
  description: string;
  fishingDate: string;
  imageUri?: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

const PRODUCTS_KEY = '@mare_viva:products';

// Busca todos os produtos
const getProducts = async (): Promise<Product[]> => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    return productsJson ? JSON.parse(productsJson) : [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

// Salva todos os produtos
const saveProducts = async (products: Product[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Erro ao salvar produtos:', error);
    throw error;
  }
};

export const productService = {
  // Buscar todos os produtos
  getAllProducts: async (): Promise<Product[]> => {
    return await getProducts();
  },

  // Buscar produto por ID
  getProductById: async (id: string): Promise<Product | null> => {
    const products = await getProducts();
    return products.find((p) => p.id === id) || null;
  },

  // Criar novo produto
  createProduct: async (
    name: string,
    quantity: string,
    price: number,
    description: string,
    fishingDate: string,
    imageUri: string | undefined,
    sellerId: string,
    sellerName: string
  ): Promise<{ success: boolean; message: string; product?: Product }> => {
    try {
      if (!name || !quantity || !price || !description || !fishingDate) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      const products = await getProducts();

      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        quantity,
        price,
        description,
        fishingDate,
        imageUri,
        sellerId,
        sellerName,
        createdAt: new Date().toISOString(),
      };

      products.push(newProduct);
      await saveProducts(products);

      return { success: true, message: 'Produto anunciado com sucesso!', product: newProduct };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return { success: false, message: 'Erro ao anunciar produto. Tente novamente.' };
    }
  },

  // Buscar produtos por vendedor
  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    const products = await getProducts();
    return products.filter((p) => p.sellerId === sellerId);
  },

  // Atualizar produto
  updateProduct: async (
    productId: string,
    sellerId: string,
    name: string,
    quantity: string,
    price: number,
    description: string,
    fishingDate: string,
    imageUri: string | undefined
  ): Promise<{ success: boolean; message: string; product?: Product }> => {
    try {
      if (!name || !quantity || !price || !description || !fishingDate) {
        return { success: false, message: 'Por favor, preencha todos os campos' };
      }

      const products = await getProducts();
      const productIndex = products.findIndex((p) => p.id === productId && p.sellerId === sellerId);

      if (productIndex === -1) {
        return { success: false, message: 'Produto não encontrado' };
      }

      // Atualizar produto
      products[productIndex] = {
        ...products[productIndex],
        name,
        quantity,
        price,
        description,
        fishingDate,
        imageUri: imageUri || products[productIndex].imageUri,
      };

      await saveProducts(products);

      return { success: true, message: 'Produto atualizado com sucesso!', product: products[productIndex] };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, message: 'Erro ao atualizar produto. Tente novamente.' };
    }
  },

  // Deletar produto
  deleteProduct: async (productId: string, sellerId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const products = await getProducts();
      const productIndex = products.findIndex((p) => p.id === productId && p.sellerId === sellerId);

      if (productIndex === -1) {
        return { success: false, message: 'Produto não encontrado' };
      }

      products.splice(productIndex, 1);
      await saveProducts(products);

      return { success: true, message: 'Produto removido com sucesso!' };
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return { success: false, message: 'Erro ao remover produto. Tente novamente.' };
    }
  },
};
