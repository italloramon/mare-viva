import { ImageSourcePropType } from 'react-native';
import { productImages } from '../assets/images';

/**
 * Converte um imageUri em uma fonte de imagem React Native
 * Se for uma imagem local (começa com "local:"), retorna o require
 * Caso contrário, retorna a URI como string
 */
export const getImageSource = (imageUri: string | undefined, productName?: string): ImageSourcePropType | { uri: string } | null => {
  if (!imageUri) {
    return null;
  }

  // Se for uma imagem local
  if (imageUri.startsWith('local:')) {
    const localName = imageUri.replace('local:', '').toLowerCase();
    
    // Mapeamento direto das imagens locais
    if (localName === 'atum') return productImages.atum;
    if (localName === 'salmao' || localName === 'salmão') return productImages.salmao;
    if (localName === 'tainha') return productImages.tainha;
    if (localName === 'tilapia' || localName === 'tilápia') return productImages.tilapia;
    
    return null;
  }

  // Se for uma URI normal (URL)
  return { uri: imageUri };
};

