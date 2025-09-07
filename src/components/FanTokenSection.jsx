// components/FanTokenSection.jsx
import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const FanTokenSection = () => {
  const { contracts, isConnected, account, formatEther } = useWeb3();
  const [userTokens, setUserTokens] = useState([]);
  const [userStats, setUserStats] = useState({
    balance: 0,
    donationCount: 0,
    totalDonated: '0',
    currentTier: 0
  });
  const [loading, setLoading] = useState(false);

  // Definições dos tiers
  const tiers = [
    { name: 'Bronze', color: 'from-yellow-600 to-yellow-800', icon: '🥉', min: '1 doação' },
    { name: 'Silver', color: 'from-gray-400 to-gray-600', icon: '🥈', min: '5 doações' },
    { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: '🥇', min: '10 doações' },
    { name: 'Diamond', color: 'from-blue-400 to-purple-600', icon: '💎', min: '25 doações' }
  ];

  // Carregar informações dos tokens do usuário
  const loadUserTokens = async () => {
    if (!contracts.fanToken || !account) return;

    setLoading(true);
    try {
      // Buscar balance do usuário
      const balance = await contracts.fanToken.balanceOf(account);

      // Buscar estatísticas do usuário (se disponível)
      let tierInfo = { currentTier: 0, donationCount: 0, totalDonated: '0' };
      try {
        tierInfo = await contracts.fanToken.getUserTierInfo(account);
      } catch {
        // Função pode não existir em versões mais simples
      }

      setUserStats({
        balance: balance.toNumber(),
        donationCount: tierInfo.donationCount?.toNumber() || 0,
        totalDonated: tierInfo.totalDonated ? formatEther(tierInfo.totalDonated) : '0',
        currentTier: tierInfo.currentTier || 0
      });

      // Buscar tokens específicos do usuário
      const tokens = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        try {
          const tokenId = await contracts.fanToken.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contracts.fanToken.tokenURI(tokenId);

          tokens.push({
            id: tokenId.toString(),
            uri: tokenURI,
            tier: Math.floor(Math.random() * 4), // Simulado - substitua pela lógica real
            mintedAt: new Date() // Simulado
          });
        } catch (error) {
          console.log('Erro ao buscar token:', error);
        }
      }

      setUserTokens(tokens);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isConnected && contracts.fanToken && account) {
      loadUserTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, contracts.fanToken, account]);

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Seus FanTokens MSA
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Conecte sua carteira para ver seus FanTokens
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              🎫 Conecte sua carteira para ver seus FanTokens de recompensa
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Seus FanTokens MSA
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Tokens de recompensa por apoiar a causa das mulheres
        </p>
      </div>

      {/* Estatísticas do usuário */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{userStats.balance}</div>
            <div className="text-gray-600">FanTokens</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{userStats.donationCount}</div>
            <div className="text-gray-600">Doações</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{userStats.totalDonated}</div>
            <div className="text-gray-600">ETH Doado</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold bg-gradient-to-r ${tiers[userStats.currentTier]?.color} bg-clip-text text-transparent`}>
              {tiers[userStats.currentTier]?.icon} {tiers[userStats.currentTier]?.name}
            </div>
            <div className="text-gray-600">Nível Atual</div>
          </div>
        </div>
      </div>

      {/* Sistema de níveis */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sistema de Níveis FanToken MSA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${userStats.currentTier === index
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {userStats.currentTier === index && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Atual
                </div>
              )}
              <div className="text-center">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <div className={`text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  {tier.name}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {tier.min}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de tokens */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Seus FanTokens ({userStats.balance})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Carregando seus tokens...</p>
          </div>
        ) : userStats.balance === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Você ainda não possui FanTokens
            </h4>
            <p className="text-gray-600 mb-6">
              Faça uma doação para qualquer projeto e receba seu primeiro FanToken MSA!
            </p>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg inline-block">
              💝 Faça sua primeira doação
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTokens.map((token) => (
              <TokenCard key={token.id} token={token} tiers={tiers} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente individual do token
const TokenCard = ({ token, tiers }) => {
  const tier = tiers[token.tier] || tiers[0];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="text-center">
        {/* Ícone do tier */}
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-3xl`}>
          {tier.icon}
        </div>

        {/* Informações do token */}
        <h4 className={`text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
          FanToken MSA #{token.id}
        </h4>
        <div className="text-lg font-semibold text-gray-700 mb-1">
          Nível {tier.name}
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Mintado em {token.mintedAt.toLocaleDateString('pt-BR')}
        </div>

        {/* Benefícios */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="font-semibold text-gray-700 mb-2">Benefícios:</div>
          <ul className="text-gray-600 space-y-1">
            <li>✨ Acesso a eventos exclusivos</li>
            <li>🎁 Descontos em parceiros</li>
            <li>📊 Relatórios de impacto</li>
            {token.tier >= 2 && <li>👑 Acesso VIP</li>}
            {token.tier >= 3 && <li>💎 Benefícios premium</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FanTokenSection;
