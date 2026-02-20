import { useState, useEffect } from 'react';
import { useWeb3Contracts } from '../hooks/useContracts';
import { CATEGORY_NAMES } from '../abis';
import { useNavigate } from 'react-router-dom';

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
      if (!contracts.b2black) return;

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
  }, [contracts.b2black, getPlatformStats, getProject]);

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

  // Dados estáticos para os projetos
  const staticProjects = [
    {
      id: 1,
      category: 2,
      name: "Arrecadação de Fundos",
      description: "Mulheres artesas",
      raised: "0.0110",
      target: "0.2000",
      donors: 1,
      deadline: "2026-02-11"
    },
    {
      id: 2,
      category: 0,
      name: "Capacitação profissional para mulheres",
      description: "Vai ser muito bom",
      raised: "0.0510",
      target: "999.9990",
      donors: 3,
      deadline: "2025-10-01"
    }
  ];

  if (!contracts.b2black) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Projetos Fantoken MSA
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
            Projetos Fantoken MSA
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Apoie projetos que empoderam mulheres brasileiras e receba NFTs únicos
          </p>
        </div>

        {/* Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente do card do projeto
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[project.category] || 'bg-gray-100 text-gray-800'}`}>
            {CATEGORY_NAMES[project.category]}
          </span>
          <span className={`text-xs font-medium ${daysLeft > 7 ? 'text-green-600' : daysLeft > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1">{project.name}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>

        {/* Progresso */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{parseFloat(project.raised).toFixed(4)} ETH</span>
            <span>{parseFloat(project.target).toFixed(4)} ETH</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
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
      <div className="px-3 pb-3">
        <button
          className="w-full py-1.5 px-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate('/dashboard')}
        >
          Conectar carteira para doar
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
