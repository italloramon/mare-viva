import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../styles/colors';
import Input from '../components/Input';
import Button from '../components/Button';
import { productService, Product } from '../services/productService';
import { authService } from '../services/authService';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getImageSource } from '../utils/imageHelper';

type AdvertiseScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

const AdvertiseScreen: React.FC = () => {
  const navigation = useNavigation<AdvertiseScreenNavigationProp>();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fishingDate, setFishingDate] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadMyProducts = async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const products = await productService.getProductsBySeller(currentUser.id);
      setMyProducts(products);
    }
  };

  // Recarregar produtos quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadMyProducts();
    }, [])
  );

  const clearForm = () => {
    setName('');
    setQuantity('');
    setPrice('');
    setDescription('');
    setFishingDate('');
    setImageUri(undefined);
    setEditingProductId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setQuantity(product.quantity);
    setPrice(product.price.toString());
    setDescription(product.description);
    setFishingDate(product.fishingDate);
    setImageUri(product.imageUri);
    setEditingProductId(product.id);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o produto "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              const result = await productService.deleteProduct(product.id, currentUser.id);
              if (result.success) {
                Alert.alert('Sucesso!', result.message);
                loadMyProducts();
              } else {
                Alert.alert('Erro', result.message);
              }
            }
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !quantity || !price || !description || !fishingDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const priceNumber = parseFloat(price.replace(',', '.'));
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Erro', 'Preço inválido');
      return;
    }

    setLoading(true);

    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Erro', 'Você precisa estar logado para anunciar');
        navigation.navigate('MainTabs');
        return;
      }

      let result;
      if (editingProductId) {
        // Atualizar produto existente
        result = await productService.updateProduct(
          editingProductId,
          currentUser.id,
          name,
          quantity,
          priceNumber,
          description,
          fishingDate,
          imageUri
        );
      } else {
        // Criar novo produto
        result = await productService.createProduct(
          name,
          quantity,
          priceNumber,
          description,
          fishingDate,
          imageUri,
          currentUser.id,
          currentUser.name
        );
      }

      if (result.success) {
        Alert.alert('Sucesso!', result.message, [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
              loadMyProducts();
            },
          },
        ]);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoWave1} />
          <View style={styles.logoWave2} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showForm ? (
          <>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Meus Produtos</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  clearForm();
                  setShowForm(true);
                }}
              >
                <Ionicons name="add" size={24} color={colors.white} />
                <Text style={styles.addButtonText}>Novo Produto</Text>
              </TouchableOpacity>
            </View>

            {myProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="fish-outline" size={64} color={colors.gray} />
                <Text style={styles.emptyText}>Você ainda não anunciou nenhum produto</Text>
                <Button
                  title="Anunciar Primeiro Produto"
                  onPress={() => {
                    clearForm();
                    setShowForm(true);
                  }}
                  variant="primary"
                  style={styles.emptyButton}
                />
              </View>
            ) : (
              <FlatList
                data={myProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <View style={styles.productCardImage}>
                      {(() => {
                        const imageSource = getImageSource(item.imageUri, item.name);
                        return imageSource ? (
                          <Image source={imageSource} style={styles.productCardImageContent} />
                        ) : (
                          <View style={styles.productCardImagePlaceholder}>
                            <Ionicons name="fish" size={30} color={colors.gray} />
                          </View>
                        );
                      })()}
                    </View>
                    <View style={styles.productCardInfo}>
                      <Text style={styles.productCardName}>{item.name}</Text>
                      <Text style={styles.productCardQuantity}>{item.quantity}</Text>
                      <Text style={styles.productCardPrice}>R${item.price}</Text>
                    </View>
                    <View style={styles.productCardActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEdit(item)}
                      >
                        <Ionicons name="pencil" size={20} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(item)}
                      >
                        <Ionicons name="trash" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </>
        ) : (
          <View style={styles.form}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingProductId ? 'Editar Produto' : 'Novo Produto'}
              </Text>
              <TouchableOpacity onPress={clearForm}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Editar foto:</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.gray} />
                <Text style={styles.imagePlaceholderText}>Adicionar foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label="Nome do produto"
            placeholder="Digite o nome do produto"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Quantidade (em Quilos ou Gramas)"
            placeholder="Ex: 1kg, 500g"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Input
            label="Preço"
            placeholder="Digite o preço"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>Descrição</Text>
            <View style={styles.textArea}>
              <TextInput
                style={styles.textAreaInput}
                placeholder="Descreva o produto"
                placeholderTextColor={colors.gray}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <Input
            label="Data da pesca"
            placeholder="DD/MM"
            value={fishingDate}
            onChangeText={setFishingDate}
          />
          </View>
        )}
      </ScrollView>

      {showForm && (
        <View style={styles.footer}>
          <Button
            title={editingProductId ? 'Salvar Alterações' : 'Anunciar Produto'}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
          />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
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
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
    fontWeight: '500',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.gray,
  },
  textAreaContainer: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
    backgroundColor: colors.white,
  },
  textAreaInput: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  submitButton: {
    width: '100%',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productCardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
  },
  productCardImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productCardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productCardQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  productCardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  productCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: colors.lightGray,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});

export default AdvertiseScreen;
