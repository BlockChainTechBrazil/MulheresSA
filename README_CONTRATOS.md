# 🌸 Mulheres SA - Contratos Inteligentes

## Visão Geral

A plataforma **Mulheres SA** é um ecossistema blockchain desenvolvido para apoiar projetos que promovem a causa das mulheres. Utilizando tecnologia blockchain e tokenização, a plataforma oferece transparência total, rastreabilidade de doações e recompensas através de FanTokens NFT.

## 📋 Estratégia do Projeto

Baseado na estratégia do **FanToken MSA**, a plataforma combina:
- **Tokenização de impacto social** através de NFTs de recompensa
- **Transparência total** de doações e uso de recursos
- **Gamificação** para incentivar doações recorrentes
- **Apoio direto** a organizações verificadas que trabalham com causas femininas

## 🏗️ Arquitetura dos Contratos

### 1. **MulheresSA.sol** - Contrato Principal
O contrato principal que gerencia toda a plataforma:

**Funcionalidades principais:**
- ✅ Registro e verificação de organizações
- ✅ Criação e aprovação de projetos
- ✅ Sistema de doações com taxas transparentes (2.5%)
- ✅ Distribuição automática de FanTokens
- ✅ Controles de segurança (pausas, reentrancy protection)

**Estruturas importantes:**
- `Organization`: Dados das organizações (CNPJ, certificações, histórico)
- `Project`: Informações completas dos projetos
- `Donation`: Registro detalhado de cada doação

### 2. **FanTokenMSA.sol** - Token de Recompensa (NFT)
NFT gamificado com sistema de níveis baseado em doações:

**Níveis de FanToken:**
- 🥉 **Bronze**: 1+ doações
- 🥈 **Silver**: 5+ doações  
- 🥇 **Gold**: 10+ doações
- 💎 **Diamond**: 25+ doações

**Funcionalidades:**
- ✅ Mint automático para doadores
- ✅ Upgrade automático de nível
- ✅ Metadados únicos por nível
- ✅ Rastreamento completo de histórico

### 3. **WomenProject.sol** - Contrato Individual de Projeto
Cada projeto tem seu próprio contrato para máxima transparência:

**Funcionalidades:**
- ✅ Gestão independente de fundos
- ✅ Sistema de milestones com evidências
- ✅ Relatórios de progresso com mídias
- ✅ Saques com comprovantes obrigatórios
- ✅ Reembolso automático se meta não for atingida

### 4. **DeployManager.sol** - Facilitador de Deploy
Contrato utilitário para deploy simplificado:
- ✅ Deploy coordenado de todos os contratos
- ✅ Configuração automática de permissões
- ✅ Transferência de ownership facilitada

## 🚀 Como Usar no Remix

### Passo 1: Preparação
1. Abra o [Remix IDE](https://remix.ethereum.org)
2. Crie uma nova workspace
3. Instale as dependências do OpenZeppelin

### Passo 2: Deploy dos Contratos
1. **Copie os contratos** para o Remix
2. **Compile** todos os contratos (Solidity 0.8.20+)
3. **Deploy do DeployManager** primeiro:
   ```solidity
   // No constructor do DeployManager não precisa de parâmetros
   ```
4. **Obtenha os endereços** dos contratos deployados:
   ```solidity
   deployManager.getContracts() // retorna (fanToken, platform)
   ```

### Passo 3: Configuração Inicial
1. **Registre organizações**:
   ```solidity
   mulheresSA.registerOrganization(
       "ONG Mulheres Tech",
       "12345678000123", // CNPJ
       "contato@mulherestech.org",
       ["ipfs://certificacao1", "ipfs://certificacao2"]
   )
   ```

2. **Verifique organizações** (apenas owner):
   ```solidity
   mulheresSA.verifyOrganization(enderecoOrganizacao)
   ```

3. **Crie projetos** (organizações verificadas):
   ```solidity
   mulheresSA.createProject(
       "Bootcamp de Programação para Mulheres",
       "Capacitação em tecnologia para 100 mulheres em situação de vulnerabilidade",
       "educacao",
       1000000000000000000, // 1 ETH target
       90, // 90 dias
       ["ipfs://proposta", "ipfs://orcamento"],
       "São Paulo, SP",
       100 // beneficiárias
   )
   ```

4. **Aprove projetos** (apenas owner):
   ```solidity
   mulheresSA.approveProject(1) // ID do projeto
   ```

## 💝 Fluxo de Doações

### Para Doadores:
1. **Visualize projetos ativos**
2. **Faça sua doação**:
   ```solidity
   mulheresSA.donateToProject{value: 0.1 ether}(
       1, // ID do projeto
       "Apoio à causa! 💪"
   )
   ```
3. **Receba FanToken automaticamente**
4. **Acompanhe o progresso do projeto**

### Para Organizações:
1. **Retire fundos do projeto**:
   ```solidity
   mulheresSA.withdrawProjectFunds(1) // ID do projeto
   ```
2. **Adicione milestones**:
   ```solidity
   womenProject.addMilestone(
       "Conclusão do módulo 1",
       250000000000000000 // 0.25 ETH
   )
   ```
3. **Publique relatórios de progresso**:
   ```solidity
   womenProject.addProgressReport(
       "Primeira semana completa!",
       "25 alunas concluíram o módulo básico",
       ["ipfs://foto1", "ipfs://video1"],
       25, // beneficiárias impactadas
       "100% de aprovação no módulo"
   )
   ```

## 🔒 Recursos de Segurança

### Implementados:
- ✅ **ReentrancyGuard**: Proteção contra ataques de reentrância
- ✅ **Pausable**: Pausa emergencial de contratos
- ✅ **AccessControl**: Controle granular de permissões
- ✅ **Ownable**: Proteção de funções administrativas
- ✅ **Checks-Effects-Interactions**: Padrão de segurança

### Validações:
- ✅ Doação mínima: 0.001 ETH
- ✅ Limite de projetos por organização: 10
- ✅ Verificação de organizações obrigatória
- ✅ Aprovação manual de projetos
- ✅ Taxa fixa e transparente: 2.5%

## 📊 Transparência e Auditoria

### Dados Públicos:
- 📈 Total de doações por projeto
- 👥 Número de doadores únicos
- 💰 Valores arrecadados e distribuídos
- 🏆 Estatísticas de FanTokens por nível
- 📋 Histórico completo de transações

### Relatórios Automáticos:
- 📊 Progresso de cada projeto
- 🧾 Comprovantes de gastos
- 🎯 Status de milestones
- 👥 Impacto real em beneficiárias

## 🌟 Benefícios da Plataforma

### Para Doadores:
- 🎁 **FanTokens NFT** como recompensa
- 📊 **Transparência total** do uso das doações
- 🎮 **Gamificação** com sistema de níveis
- 📱 **Acompanhamento** em tempo real

### Para Organizações:
- 💰 **Arrecadação facilitada** e segura
- 🔍 **Credibilidade** através da verificação
- 📈 **Relatórios automatizados**
- 🌐 **Alcance global** via blockchain

### Para Beneficiárias:
- 🎯 **Projetos focados** em suas necessidades
- 📊 **Transparência** na aplicação de recursos
- 🔄 **Continuidade** de projetos bem-sucedidos
- 💪 **Empoderamento** através da tecnologia

## 📝 Exemplos de Categorias de Projetos

- 🎓 **Educação**: Bootcamps, cursos, bolsas de estudo
- 💼 **Empreendedorismo**: Microcrédito, mentorias, incubação
- 🏥 **Saúde**: Prevenção, campanhas, atendimento especializado
- 💻 **Tecnologia**: Inclusão digital, desenvolvimento de apps
- ⚖️ **Direitos**: Assistência jurídica, campanhas de conscientização
- 🏠 **Habitação**: Moradias seguras, reformas, construção

## 🔧 Manutenção e Upgrades

### Funções Administrativas:
- ⏸️ **Pausar/Despausar** contratos
- ✅ **Verificar** organizações
- 👍 **Aprovar** projetos
- 💰 **Sacar** taxas da plataforma
- 🔄 **Atualizar** metadados de NFTs

### Monitoramento:
- 📊 Dashboard de métricas em tempo real
- 🚨 Alertas para situações suspeitas
- 📈 Relatórios periódicos de impacto
- 🔍 Auditoria contínua de transações

---

## 💡 Próximos Passos

1. **Deploy em testnet** para testes
2. **Desenvolvimento do frontend** React
3. **Integração com IPFS** para documentos
4. **Criação de dashboards** de métricas
5. **Programa piloto** com organizações parceiras
6. **Auditoria de segurança** profissional

---

*Desenvolvido com 💜 para empoderar mulheres através da tecnologia blockchain*
