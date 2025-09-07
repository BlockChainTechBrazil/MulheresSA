import { useState, useEffect } from 'react';
import { useWeb3Contracts } from '../hooks/useContracts';
import { CATEGORY_NAMES } from '../abis';

const ProjectsSection = () => {
  const {
    contracts,
    getPlatformStats,
    getProject,
    donateToProject,
    loading: contractLoading
  } = useWeb3Contracts();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRaised: '0'
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      if (!contracts.mulheresSA) return;

      setLoading(true);
      try {
        // Carregar estatísticas
        const platformStats = await getPlatformStats();
        setStats(platformStats);

        // Carregar projetos
        const projectsList = [];
        for (let i = 1; i <= platformStats.totalProjects; i++) {
          try {
            const project = await getProject(i);
            projectsList.push({ id: i, ...project });
          } catch {
            // Projeto não encontrado, continua
            continue;
          }
        }

        // Filtrar apenas projetos ativos e ordenar por mais recentes
        const activeProjects = projectsList
          .filter(p => p.active && new Date(p.deadline) > new Date())
          .reverse();

        setProjects(activeProjects);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [contracts.mulheresSA, getPlatformStats, getProject]);

  // Fazer doação
  const handleDonate = async (projectId, amount) => {
    try {
      await donateToProject(projectId, amount);
      // Recarregar dados após doação
      const updatedProject = await getProject(projectId);
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...updatedProject, id: projectId } : p
      ));
      alert('Doação realizada com sucesso! Você recebeu um NFT!');
    } catch (error) {
      console.error('Erro ao fazer doação:', error);
      alert('Erro ao fazer doação: ' + error.message);
    }
  };

  if (!contracts.mulheresSA) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Projetos Mulheres SA
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Conecte sua carteira para ver e apoiar projetos que empoderam mulheres brasileiras
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              🔗 Conecte sua carteira Web3 para interagir com os projetos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Projetos Mulheres SA
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Apoie projetos que empoderam mulheres brasileiras e receba NFTs únicos
          </p>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600">{stats.totalProjects}</div>
              <div className="text-gray-600">Total de Projetos</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600">{parseFloat(stats.totalRaised).toFixed(4)} ETH</div>
              <div className="text-gray-600">Total Arrecadado</div>
            </div>
          </div>
        </div>

        {/* Projetos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-md max-w-md mx-auto">
              <p className="text-xl text-gray-600 mb-2">Nenhum projeto ativo encontrado</p>
              <p className="text-gray-500">Novos projetos aparecerão aqui em breve</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDonate={handleDonate}
                loading={contractLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente do card do projeto
const ProjectCard = ({ project, onDonate, loading }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Por favor, insira um valor válido para doação');
      return;
    }
    onDonate(project.id, donationAmount);
    setDonationAmount('');
    setShowDonationForm(false);
  };

  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const progress = (parseFloat(project.raised) / parseFloat(project.target)) * 100;

  // Cores das categorias
  const categoryColors = {
    0: 'bg-purple-100 text-purple-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-pink-100 text-pink-800',
    3: 'bg-red-100 text-red-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[project.category] || 'bg-gray-100 text-gray-800'}`}>
            {CATEGORY_NAMES[project.category]}
          </span>
          <span className={`text-sm font-medium ${daysLeft > 7 ? 'text-green-600' : daysLeft > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{parseFloat(project.raised).toFixed(4)} ETH</span>
            <span>{parseFloat(project.target).toFixed(4)} ETH</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{progress.toFixed(1)}% da meta</span>
            <span>{project.donors} doadores</span>
          </div>
        </div>
      </div>

      {/* Footer com ação */}
      <div className="px-6 pb-6">
        {!showDonationForm ? (
          <button
            onClick={() => setShowDonationForm(true)}
            disabled={daysLeft === 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${daysLeft === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
          >
            {daysLeft === 0 ? '❌ Projeto Expirado' : '💝 Apoiar Projeto'}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="Valor em ETH (mín: 0.001)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleDonate}
                disabled={loading || !donationAmount}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Doando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => {
                  setShowDonationForm(false);
                  setDonationAmount('');
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
