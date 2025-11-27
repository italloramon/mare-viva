import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { productService, Product } from '../services/productService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { TabParamList } from '../navigation/MainNavigator';
import { getImageSource } from '../utils/imageHelper';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<MainStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    const allProducts = await productService.getAllProducts();
    setProducts(allProducts);
  };

  // Recarregar produtos sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.productImageContainer}>
        {(() => {
          const imageSource = getImageSource(item.imageUri, item.name);
          return imageSource ? (
            <Image source={imageSource} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="fish" size={40} color={colors.gray} />
            </View>
          );
        })()}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>R${item.price}</Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={(e) => {
              e.stopPropagation();
              // Navegar para chat com o vendedor
              navigation.navigate('Chat', {
                chatId: '',
                sellerId: item.sellerId,
                sellerName: item.sellerName,
                productId: item.id,
                productName: item.name,
              });
            }}
          >
            <Ionicons name="chatbubble" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoWave1} />
            <View style={styles.logoWave2} />
          </View>
          <Text style={styles.appName}>Maré Viva</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar um produto"
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoWave1: {
    width: 20,
    height: 10,
    backgroundColor: colors.secondary,
    borderRadius: 5,
    position: 'absolute',
    top: 6,
  },
  logoWave2: {
    width: 16,
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    position: 'absolute',
    top: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  productsList: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
