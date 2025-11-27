# 🔐 Backend Simples - Autenticação Local

## ✅ O que foi implementado:

### **Armazenamento Local (AsyncStorage)**
- ✅ **Registro de usuários** - Armazena nome, email e senha localmente
- ✅ **Login** - Valida credenciais e mantém sessão
- ✅ **Recuperação de senha** - Gera código de 6 dígitos
- ✅ **Verificação de código** - Valida código com expiração de 10 minutos
- ✅ **Redefinição de senha** - Permite alterar senha após verificar código

### **Validações Implementadas:**
- ✅ Email válido (formato)
- ✅ Senha mínima de 6 caracteres
- ✅ Verificação de email duplicado no cadastro
- ✅ Código de recuperação com expiração
- ✅ Confirmação de senha na redefinição

### **Fluxo Completo:**
1. **Cadastro** → Valida → Salva no AsyncStorage
2. **Login** → Valida → Mantém sessão
3. **Esqueci senha** → Gera código → Envia (mostra no console para testes)
4. **Verificar código** → Valida → Navega para redefinir senha
5. **Redefinir senha** → Valida → Atualiza senha → Navega para login

---

## 📝 Como Funciona:

### **Dados Armazenados:**
- `@mare_viva:users` - Lista de todos os usuários
- `@mare_viva:current_user` - Usuário logado atualmente
- `@mare_viva:recovery_codes` - Códigos de recuperação temporários

### **Para Testar:**

1. **Criar uma conta:**
   - Vá em "Cadastro"
   - Preencha nome, email e senha
   - Clique em "Registrar"

2. **Fazer login:**
   - Use o email e senha cadastrados
   - Clique em "Entrar"

3. **Recuperar senha:**
   - Clique em "Esqueceu sua senha?"
   - Digite seu email
   - O código aparecerá no console e no alert
   - Use o código para verificar
   - Redefina sua senha

---

## 🔒 Segurança (Notas):

⚠️ **Este é um sistema simples para TESTES apenas!**

- Senhas são armazenadas em texto plano (não use em produção!)
- Dados ficam apenas no dispositivo
- Não há criptografia
- Não há servidor externo

**Para produção, você precisaria:**
- Hash de senhas (bcrypt)
- API backend com banco de dados
- Criptografia de dados
- Tokens JWT para autenticação
- Envio real de emails

---

## 🚀 Próximos Passos (Opcional):

Se quiser evoluir para algo mais robusto, considere:
- **Firebase Authentication** - Autenticação pronta e segura
- **Supabase** - Backend completo com PostgreSQL
- **Node.js + Express** - API própria com banco de dados

Mas para testes rápidos, o AsyncStorage é perfeito! 🎉

