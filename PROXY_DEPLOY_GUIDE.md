# Guia de Deploy dos Contratos Proxy - Mulheres SA

## Arquitetura de Segurança com Proxy

Os contratos foram desenvolvidos utilizando o padrão **UUPS (Universal Upgradeable Proxy Standard)** da OpenZeppelin, que oferece:

### 🔒 **Benefícios de Segurança:**
- **Upgradeabilidade Controlada**: Apenas usuários autorizados podem fazer upgrades
- **Preservação de Estado**: Dados não são perdidos durante upgrades
- **Endereço Fixo**: O endereço do contrato nunca muda
- **Controle de Acesso**: Múltiplas camadas de segurança
- **Pausabilidade**: Capacidade de pausar contratos em emergências

---

## 📋 **Ordem de Deploy no Remix**

### **1. Deploy do ProxyManager**
```solidity
// Deploy: ProxyManager.sol
// Construtor: não requer parâmetros
```

### **2. Deploy do Ecossistema Completo**
```solidity
// Usar função: deployCompleteEcosystem()
// Parâmetros:
// - tokenName: "FanToken Mulheres SA"
// - tokenSymbol: "MSA"
// - admin: [SEU_ENDERECO_ADMIN]
```

### **3. Verificar Deployments**
```solidity
// Usar função: getDeployedContracts()
// Retorna: ["FanTokenMSA", "MulheresSA"]

// Obter endereços dos proxies:
// getProxyAddress("FanTokenMSA")
// getProxyAddress("MulheresSA")
```

---

## 🎯 **Funcionalidades Implementadas Baseadas na Estratégia**

### **Meta de Funding: R$ 800.000**
- Constante `FUNDING_GOAL = 800000 ether` 
- Tracking em tempo real do progresso
- Evento `FundingGoalReached()` quando atingida

### **Categorias de Projetos Focadas em Mulheres:**
```solidity
enum ProjectCategory {
    EMPODERAMENTO_ECONOMICO,    // Empoderamento econômico
    EDUCACAO_FEMININA,          // Educação feminina
    SAUDE_DA_MULHER,           // Saúde da mulher
    COMBATE_VIOLENCIA,         // Combate à violência de gênero
    LIDERANCA_FEMININA,        // Liderança feminina
    EMPREENDEDORISMO_FEMININO  // Empreendedorismo feminino
}
```

### **Sistema de FanToken com Níveis:**
- **BRONZE**: 1+ doação ou R$ 50+
- **SILVER**: 5+ doações ou R$ 250+
- **GOLD**: 10+ doações ou R$ 500+
- **DIAMOND**: 25+ doações ou R$ 2.500+

### **Taxa de Plataforma:**
- 2.5% de cada doação para sustentabilidade
- 97.5% vai direto para os projetos

---

## 🚀 **Principais Funcionalidades**

### **Para Administradores:**
```solidity
// Criar projeto
createProject(
    title,
    description,
    category,        // Uma das 6 categorias
    targetAmount,
    deadline,
    beneficiary
)

// Completar projeto
completeProject(projectId)

// Pausar/Despausar em emergências
pause() / unpause()

// Retirar taxas da plataforma
withdrawFees()
```

### **Para Doadores:**
```solidity
// Fazer doação
donateToProject(projectId, message)
// - Recebe automaticamente FanToken
// - Progresso é tracking automático

// Ver projetos doados
getDonorProjects(address)

// Ver estatísticas pessoais
getUserTierInfo(address)
```

### **Consultas Públicas:**
```solidity
// Estatísticas da plataforma
getPlatformStats()

// Progresso do funding
getFundingProgress()

// Projetos por categoria
getProjectsByCategory(category)

// Informações do projeto
getProject(projectId)
```

---

## ⚡ **Recursos de Segurança Implementados**

### **1. Controle de Acesso:**
- `onlyOwner`: Funções administrativas
- `onlyRole(MINTER_ROLE)`: Mint de tokens
- `onlyRole(ADMIN_ROLE)`: Configurações avançadas

### **2. Proteções:**
- `ReentrancyGuard`: Proteção contra ataques de reentrância
- `Pausable`: Pausar contratos em emergências
- `nonReentrant`: Funções críticas protegidas

### **3. Validações:**
- Verificação de endereços zero
- Validação de prazos e valores
- Limites de tamanho de mensagens
- Verificação de existência de projetos

### **4. Upgrades Seguros:**
- Apenas administradores autorizados
- Padrão UUPS com `_authorizeUpgrade()`
- Preservação de estado entre upgrades

---

## 📊 **Monitoramento e Transparência**

### **Eventos Importantes:**
```solidity
event ProjectCreated(...)      // Novo projeto criado
event DonationMade(...)        // Nova doação realizada
event ProjectCompleted(...)    // Projeto finalizado
event FundingGoalReached(...)  // Meta global atingida
event TokenMinted(...)         // FanToken mintado
event TierUpgraded(...)        // Upgrade de nível do token
```

### **Relatórios Disponíveis:**
- Total de projetos por categoria
- Valor total arrecadado
- Progresso da meta de R$ 800.000
- Estatísticas de doadores
- Distribuição de FanTokens por nível

---

## 🔄 **Processo de Upgrade**

Quando necessário atualizar os contratos:

```solidity
// 1. Deploy nova implementação
MulheresSAImplementation newImpl = new MulheresSAImplementation();

// 2. Fazer upgrade via ProxyManager
proxyManager.upgradeContract("MulheresSA", address(newImpl));

// 3. Verificar nova versão
proxyManager.getContractVersion("MulheresSA");
```

---

## ✅ **Checklist de Deploy**

- [ ] Deploy ProxyManager
- [ ] Deploy ecossistema completo via `deployCompleteEcosystem()`
- [ ] Verificar endereços dos proxies
- [ ] Testar criação de projeto
- [ ] Testar doação e mint de FanToken
- [ ] Configurar URIs dos metadados dos tokens
- [ ] Autorizar endereços para upgrades se necessário

---

## 🎯 **Próximos Passos**

1. **Integração Frontend**: Conectar com o dashboard React
2. **Metadados NFT**: Configurar IPFS com metadados dos FanTokens
3. **Listagem**: Preparar para listagem no Mercado Bitcoin
4. **Marketing**: Implementar tracking para campanhas
5. **Parcerias**: Sistema de benefícios para portadores de tokens

---

**Contratos prontos para apresentação com todas as funcionalidades principais operacionais e máxima segurança implementada através do sistema de proxy upgradeável!** 🚀
