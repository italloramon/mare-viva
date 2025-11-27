# 📱 Como Rodar o App Maré Viva no Seu Celular

## Opção 1: Usando Expo Go (Mais Fácil) ⭐

### Passo 1: Instalar o Expo Go
- **Android**: Baixe na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Baixe na [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passo 2: Conectar o Celular
1. Certifique-se de que seu **celular e computador estão na mesma rede WiFi**
2. No terminal, execute:
   ```bash
   cd MareViva
   npx expo start
   ```

### Passo 3: Escanear o QR Code
1. Um **QR Code** aparecerá no terminal
2. **Android**: Abra o Expo Go e toque em "Scan QR Code"
3. **iOS**: Abra a câmera do iPhone e toque na notificação que aparecer

### Passo 4: Aguardar o Carregamento
- O app será baixado e instalado automaticamente
- Aguarde alguns segundos para o build inicial

---

## Opção 2: Usando Tunnel (Se WiFi não funcionar)

Se você não conseguir conectar via WiFi, use o tunnel:

```bash
cd MareViva
npx expo start --tunnel
```

Isso criará um link público que funciona mesmo em redes diferentes.

---

## Opção 3: Usando Emulador/Simulador

### Android (Android Studio)
```bash
cd MareViva
npx expo start
# Depois pressione 'a' para abrir no Android emulador
```

### iOS (Mac apenas, Xcode necessário)
```bash
cd MareViva
npx expo start
# Depois pressione 'i' para abrir no simulador iOS
```

---

## 🐛 Problemas Comuns

### "Unable to connect to Metro"
- Verifique se o celular e computador estão na mesma WiFi
- Tente usar `--tunnel`: `npx expo start --tunnel`

### "Network response timed out"
- Desative o firewall temporariamente
- Ou use o modo tunnel

### QR Code não aparece
- Pressione `s` no terminal para mostrar o QR Code novamente
- Ou use `npx expo start --web` para ver no navegador

---

## 📝 Comandos Úteis

- `npx expo start` - Inicia o servidor
- `npx expo start --tunnel` - Usa tunnel (funciona em redes diferentes)
- `npx expo start --clear` - Limpa o cache e reinicia
- Pressione `r` no terminal - Recarrega o app
- Pressione `m` no terminal - Abre o menu de desenvolvedor

---

## ✅ Pronto!

Depois de seguir esses passos, você verá o app Maré Viva rodando no seu celular! 🎉

