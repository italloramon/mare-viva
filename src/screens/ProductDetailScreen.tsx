import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { productService, Product } from '../services/productService';
import { MainStackParamList } from '../navigation/MainNavigator';
import Button from '../components/Button';
import { getImageSource } from '../utils/imageHelper';

type ProductDetailScreenRouteProp = RouteProp<MainStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const productData = await productService.getProductById(productId);
    setProduct(productData);
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleContact = () => {
    navigation.navigate('Chat', {
      chatId: '',
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      productId: product.id,
      productName: product.name,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.logo}>
          <View style={styles.logoWave1} />
          <View style={styles.logoWave2} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          {(() => {
            const imageSource = getImageSource(product.imageUri, product.name);
            return imageSource ? (
              <Image source={imageSource} style={styles.productImage} />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="fish" size={60} color={colors.gray} />
              </View>
            );
          })()}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productQuantity}>{product.quantity}</Text>

          <View style={styles.quantityPriceRow}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityValue}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>R${product.price}</Text>
          </View>

          <TouchableOpacity
            style={styles.detailsHeader}
            onPress={() => setDetailsExpanded(!detailsExpanded)}
          >
            <Text style={styles.detailsTitle}>Detalhes do produto</Text>
            <Ionicons
              name={detailsExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          {detailsExpanded && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data da pesca</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoValueText}>{product.fishingDate}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.sellerRow}>
            <Text style={styles.infoLabel}>Vendedor</Text>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={16} color={colors.white} />
              </View>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Entrar em contato"
          onPress={handleContact}
          variant="primary"
          style={styles.contactButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  backButton: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
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
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  quantityValue: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.borderGray,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infoValueText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  sellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sellerName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  contactButton: {
    width: '100%',
  },
});

export default ProductDetailScreen;
