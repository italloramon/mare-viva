// Mapeamento de imagens locais dos produtos
export const productImages = {
  atum: require('./atum.jpg'),
  salmao: require('./salmao.jpg'),
  tainha: require('./tainha-161139446.jpg'),
  tilapia: require('./tilapia-cdp.jpg'),
};

// Função para obter imagem por nome do produto
export const getProductImage = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes('atum')) return productImages.atum;
  if (name.includes('salmão') || name.includes('salmao')) return productImages.salmao;
  if (name.includes('tainha')) return productImages.tainha;
  if (name.includes('tilápia') || name.includes('tilapia')) return productImages.tilapia;
  return null;
};

