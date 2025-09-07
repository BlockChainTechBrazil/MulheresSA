// components/ProjectsSection.jsx
import { useState, useEffect } from 'react';
import { useWeb3Contracts } from '../hooks/useContracts';
import { CATEGORY_NAMES } from '../abis';

const ProjectsSection = () => {
  const { contracts, isConnected, getPlatformStats, getProject, donateToProject: donate } = useWeb3Contracts();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRaised: '0'
  });

  // Cores das categorias
  const categoryColors = [
    'bg-purple-100 text-purple-800',
    'bg-blue-100 text-blue-800',
    'bg-pink-100 text-pink-800',
    'bg-red-100 text-red-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800'
  ];

  // Carregar estatísticas da plataforma
  const loadPlatformStats = async () => {
    if (!contracts.mulheresSA) return;

    try {
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Carregar projetos ativos
  const loadActiveProjects = async () => {
    if (!contracts.mulheresSA) return;

    setLoading(true);
    try {
      const projectsList = [];

      // Buscar projetos ativos (assumindo IDs sequenciais)
      for (let i = 1; i <= stats.totalProjects; i++) {
        try {
          const project = await getProject(i);

          if (project.active) {
            projectsList.push({
              id: i,
              title: project.name,
              description: project.description,
              category: project.category,
              targetAmount: project.target,
              raisedAmount: project.raised,
              deadline: project.deadline,
              progress: (parseFloat(project.raised) / parseFloat(project.target)) * 100
            });
          }
        } catch {
          // Projeto não existe ou erro, continue
          continue;
        }
      }

      setProjects(projectsList);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
    setLoading(false);
  };

  // Fazer doação para um projeto
  const handleDonate = async (projectId, amount) => {
    if (!contracts.mulheresSA || !amount) return;

    try {
      await donate(projectId, amount);
      alert('Doação realizada com sucesso! Você recebeu um NFT!');

      // Recarregar dados
      loadPlatformStats();
      loadActiveProjects();
    } catch (error) {
      console.error('Erro ao fazer doação:', error);
      alert('Erro ao fazer doação. Verifique sua carteira e tente novamente.');
    }
  };

  useEffect(() => {
    if (isConnected && contracts.mulheresSA) {
      loadPlatformStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, contracts.mulheresSA]);

  useEffect(() => {
    if (stats.totalProjects > 0) {
      loadActiveProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.totalProjects]);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Projetos Mulheres SA
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Conecte sua carteira para ver e apoiar projetos
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              🔗 Por favor, conecte sua carteira Web3 para interagir com os projetos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header com estatísticas */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Projetos Mulheres SA
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Apoie projetos que empoderam mulheres brasileiras
        </p>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-600">{stats.totalProjects}</div>
            <div className="text-purple-800">Total de Projetos</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.activeProjects}</div>
            <div className="text-blue-800">Projetos Ativos</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-600">{stats.totalRaised} ETH</div>
            <div className="text-green-800">Total Arrecadado</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-pink-600">{stats.fundingProgress}%</div>
            <div className="text-pink-800">Meta Global</div>
          </div>
        </div>

        {/* Barra de progresso da meta global */}
        <div className="bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(stats.fundingProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Meta: 800.000 ETH para impulsionar a causa das mulheres brasileiras
        </p>
      </div>

      {/* Lista de projetos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando projetos...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Nenhum projeto ativo encontrado</p>
          <p className="text-gray-500 mt-2">Novos projetos serão exibidos aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              categories={Object.values(CATEGORY_NAMES)}
              categoryColors={categoryColors}
              onDonate={handleDonate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente individual do projeto
const ProjectCard = ({ project, categories, categoryColors, onDonate }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Por favor, insira um valor válido para doação');
      return;
    }

    onDonate(project.id, donationAmount, donationMessage);
    setDonationAmount('');
    setDonationMessage('');
    setShowDonationForm(false);
  };

  const daysLeft = Math.ceil((project.deadline - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header do card */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[project.category]}`}>
            {categories[project.category]}
          </span>
          <span className="text-sm text-gray-500">
            {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{project.raisedAmount} ETH arrecadados</span>
            <span>{project.targetAmount} ETH meta</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${Math.min(project.progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {project.progress.toFixed(1)}% da meta
          </div>
        </div>
      </div>

      {/* Footer com ação */}
      <div className="px-6 pb-6">
        {!showDonationForm ? (
          <button
            onClick={() => setShowDonationForm(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            💝 Apoiar Projeto
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="number"
              step="0.001"
              placeholder="Valor em ETH"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Mensagem de apoio (opcional)"
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleDonate}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowDonationForm(false)}
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
