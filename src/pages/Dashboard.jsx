import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWeb3Contracts } from '../hooks/useContracts';
import { CATEGORY_NAMES } from '../abis';
import { Navigate } from 'react-router-dom';
import { BiHomeAlt, BiBookmark, BiCog, BiFolder } from "react-icons/bi";

export default function Dashboard() {
  const { isConnected, walletAddress } = useAuth();
  const {
    contracts,
    loading,
    error,
    createProject,
    donateToProject,
    withdrawFromProject,
    getProject,
    getPlatformStats,
    getUserProjects,
    formatAddress,
    clearError
  } = useWeb3Contracts();

  // Estados
  const [stats, setStats] = useState({ totalProjects: 0, totalRaised: '0' });
  const [userProjects, setUserProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    balanceBRL: '2145',
    transactions: '67',
    projects: '6'
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 0,
    target: '',
    deadline: ''
  });
  const [donationForm, setDonationForm] = useState({
    projectId: '',
    amount: ''
  });
  const [withdrawForm, setWithdrawForm] = useState({
    projectId: '',
    amount: '',
    show: false
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      if (!contracts.mulheresSA) return;

      try {
        // Carregar estatísticas (disponível mesmo sem conexão)
        const platformStats = await getPlatformStats();
        setStats(platformStats);

        // Carregar projetos do usuário (apenas se conectado)
        if (isConnected && walletAddress) {
          const userProjectIds = await getUserProjects(walletAddress);
          const userProjectData = await Promise.all(
            userProjectIds.map(async (id) => {
              const project = await getProject(id);
              return { id, ...project };
            })
          );
          setUserProjects(userProjectData);
        } else {
          setUserProjects([]);
        }

        // Carregar todos os projetos (últimos 10) — disponível sem carteira
        const totalProjects = platformStats.totalProjects;
        const allProjectsData = [];
        const startId = Math.max(1, totalProjects - 9);

        for (let i = startId; i <= totalProjects; i++) {
          try {
            const project = await getProject(i);
            allProjectsData.push({ id: i, ...project });
          } catch {
            console.log(`Projeto ${i} não encontrado`);
          }
        }
        setAllProjects(allProjectsData.reverse());

      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };

    loadData();
  }, [contracts.mulheresSA, isConnected, getPlatformStats, getUserProjects, getProject, walletAddress]);

  const refreshData = async () => {
    if (!contracts.mulheresSA) return;

    try {
      // Carregar estatísticas
      const platformStats = await getPlatformStats();
      setStats(platformStats);

      // Carregar projetos do usuário (se conectado)
      if (isConnected && walletAddress) {
        const userProjectIds = await getUserProjects(walletAddress);
        const userProjectData = await Promise.all(
          userProjectIds.map(async (id) => {
            const project = await getProject(id);
            return { id, ...project };
          })
        );
        setUserProjects(userProjectData);
      } else {
        setUserProjects([]);
      }

      // Carregar todos os projetos (últimos 10)
      const totalProjects = platformStats.totalProjects;
      const allProjectsData = [];
      const startId = Math.max(1, totalProjects - 9);

      for (let i = startId; i <= totalProjects; i++) {
        try {
          const project = await getProject(i);
          allProjectsData.push({ id: i, ...project });
        } catch {
          console.log(`Projeto ${i} não encontrado`);
        }
      }
      setAllProjects(allProjectsData.reverse());

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setNewProject({ name: '', description: '', category: 0, target: '', deadline: '' });
      await refreshData(); // Recarregar dados
      alert('Projeto criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar projeto: ' + err.message);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await donateToProject(donationForm.projectId, donationForm.amount);
      setDonationForm({ projectId: '', amount: '' });
      await refreshData(); // Recarregar dados
      alert('Doação realizada com sucesso! Você recebeu um NFT!');
    } catch (err) {
      alert('Erro ao fazer doação: ' + err.message);
    }
  };

  const handleWithdraw = async (projectId, amount) => {
    try {
      await withdrawFromProject(projectId, amount);
      await refreshData(); // Recarregar dados
      alert('Saque realizado com sucesso!');
      setWithdrawForm({ projectId: '', amount: '', show: false });
    } catch (err) {
      alert('Erro ao fazer saque: ' + err.message);
    }
  };

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard MulheresSA</h1>
          <p className="text-gray-600">Bem-vinda ao painel de controle da plataforma de doações</p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p><strong>Carteira:</strong> {formatAddress(walletAddress)}</p>
            <p><strong>Status:</strong> <span className="text-green-600">Conectada ✅</span></p>
          </div>
        </div>

        {/* Painel do Dashboard - Informações Principais */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Dashboard</h2>
          
          <div className="flex flex-wrap justify-between items-center gap-6">
            {/* Saldo (BRL) */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Saldo (BRL)</p>
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">R$</span>
                <span className="text-2xl font-bold text-yellow-400 ml-1">{dashboardStats.balanceBRL}</span>
              </div>
            </div>
            
            {/* Transações */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Transações</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.transactions}</p>
            </div>
            
            {/* Carteiras Conectadas */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Projetos</p>
              <p className="text-3xl font-bold text-white">{dashboardStats.projects}</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
              Buy
            </button>
            <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200">
              View
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
              Manage
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total de Projetos</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
            <p className="text-sm text-gray-500 mt-1">Projetos criados na plataforma</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Total Arrecadado</h3>
            <p className="text-3xl font-bold text-green-600">{parseFloat(stats.totalRaised).toFixed(4)} ETH</p>
            <p className="text-sm text-gray-500 mt-1">Valor total em doações</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Seus Projetos</h3>
            <p className="text-3xl font-bold text-blue-600">{userProjects.length}</p>
            <p className="text-sm text-gray-500 mt-1">Projetos que você criou</p>
          </div>
        </div>

        {/* Navegação por abas */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Visão Geral' },
                { id: 'create', name: 'Criar Projeto' },
                { id: 'donate', name: 'Fazer Doação' },
                { id: 'my-projects', name: 'Meus Projetos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Conteúdo das abas */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Projetos Recentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-block px-2 py-1 rounded text-sm bg-purple-100 text-purple-800`}>
                          {CATEGORY_NAMES[project.category]}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-sm ${project.active && new Date(project.deadline) > new Date()
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {project.active && new Date(project.deadline) > new Date() ? '🟢 Ativo' : '🔴 Expirado'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{project.description.substring(0, 100)}...</p>
                      <div className="text-sm space-y-1">
                        <p><strong>Meta:</strong> {parseFloat(project.target).toFixed(4)} ETH</p>
                        <p><strong>Arrecadado:</strong> {parseFloat(project.raised).toFixed(4)} ETH</p>
                        <p><strong>Progresso:</strong> {((parseFloat(project.raised) / parseFloat(project.target)) * 100).toFixed(1)}%</p>
                        <p><strong>Doadores:</strong> {project.donors}</p>
                        <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (parseFloat(project.raised) / parseFloat(project.target)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'create' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Criar Novo Projeto</h2>
                <form onSubmit={handleCreateProject} className="max-w-2xl">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Projeto
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Capacitação Profissional para Mulheres"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Descreva seu projeto e como os recursos serão utilizados"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta de Arrecadação (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      required
                      value={newProject.target}
                      onChange={(e) => setNewProject({ ...newProject, target: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.1"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Limite
                    </label>
                    <input
                      type="datetime-local"
                      required
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)} // Mínimo 24h no futuro
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">A data deve ser pelo menos 24 horas no futuro</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {loading ? 'Criando...' : 'Criar Projeto'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'donate' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Fazer Doação</h2>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">💎 Receba um NFT!</h3>
                  <p className="text-blue-700 text-sm">Cada doação gera automaticamente um NFT único como comprovante e agradecimento pela sua contribuição!</p>
                </div>

                <h3 className="text-lg font-semibold mb-4">Selecione um Projeto para Doar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {allProjects.filter(p => p.active && new Date(p.deadline) > new Date()).map((project) => (
                    <div
                      key={project.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${donationForm.projectId === project.id.toString()
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                        }`}
                      onClick={() => setDonationForm({ ...donationForm, projectId: project.id.toString() })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">#{project.id} {project.name}</h4>
                        {donationForm.projectId === project.id.toString() && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Selecionado</span>
                        )}
                      </div>

                      <span className="inline-block px-2 py-1 rounded text-sm bg-purple-100 text-purple-800 mb-2">
                        {CATEGORY_NAMES[project.category]}
                      </span>

                      <p className="text-gray-600 text-sm mb-3">{project.description.substring(0, 80)}...</p>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Meta:</span>
                          <span className="font-medium">{parseFloat(project.target).toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Arrecadado:</span>
                          <span className="font-medium text-green-600">{parseFloat(project.raised).toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Progresso:</span>
                          <span className="font-medium">
                            {((parseFloat(project.raised) / parseFloat(project.target)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Doadores:</span>
                          <span className="font-medium">{project.donors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deadline:</span>
                          <span className="font-medium text-orange-600">
                            {new Date(project.deadline).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (parseFloat(project.raised) / parseFloat(project.target)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {allProjects.filter(p => p.active && new Date(p.deadline) > new Date()).length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-2">Nenhum projeto ativo disponível para doação no momento.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Que tal criar o primeiro projeto?
                    </button>
                  </div>
                )}

                {donationForm.projectId && (
                  <div className="bg-white border-2 border-green-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      💰 Fazer Doação para o Projeto #{donationForm.projectId}
                    </h3>

                    <form onSubmit={handleDonate} className="max-w-md">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor da Doação (ETH)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          required
                          value={donationForm.amount}
                          onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">Valor mínimo: 0.001 ETH</p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setDonationForm({ projectId: '', amount: '' })}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !donationForm.amount}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {loading ? 'Doando...' : `Doar ${donationForm.amount || '0'} ETH`}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}            {activeTab === 'my-projects' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Meus Projetos ({userProjects.length})</h2>
                {userProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Você ainda não criou nenhum projeto.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                    >
                      Criar Primeiro Projeto
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-xl">{project.name}</h3>
                          <span className={`px-2 py-1 rounded text-sm ${project.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {project.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
                            {CATEGORY_NAMES[project.category]}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{project.description}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Meta:</span>
                            <span className="font-medium">{parseFloat(project.target).toFixed(4)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Arrecadado:</span>
                            <span className="font-medium text-green-600">{parseFloat(project.raised).toFixed(4)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Progresso:</span>
                            <span className="font-medium">
                              {((parseFloat(project.raised) / parseFloat(project.target)) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Doadores:</span>
                            <span className="font-medium">{project.donors}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deadline:</span>
                            <span className="font-medium">
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (parseFloat(project.raised) / parseFloat(project.target)) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {parseFloat(project.raised) > 0 && (
                          <div className="mt-4">
                            <button
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                              onClick={() => {
                                setWithdrawForm({
                                  projectId: project.id,
                                  amount: project.raised,
                                  show: true
                                });
                              }}
                            >
                              💰 Sacar Fundos ({parseFloat(project.raised).toFixed(4)} ETH)
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mensagens de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span>Processando transação...</span>
            </div>
          </div>
        )}

        {/* Modal de Saque */}
        {withdrawForm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Sacar Fundos do Projeto</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleWithdraw(withdrawForm.projectId, withdrawForm.amount);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Disponível para Saque
                  </label>
                  <p className="text-lg font-bold text-green-600">
                    {parseFloat(withdrawForm.amount).toFixed(4)} ETH
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor a Sacar (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max={withdrawForm.amount}
                    required
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawForm({ projectId: '', amount: '', show: false })}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Sacando...' : 'Confirmar Saque'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu de Navegação no Rodapé */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 md:hidden">
          <div className="flex justify-around items-center py-2">
            <button className="flex flex-col items-center text-gray-600 hover:text-purple-600">
              <BiHomeAlt className="text-2xl" />
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-purple-600">
              <BiBookmark className="text-2xl" />
              <span className="text-xs">Favoritos</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-purple-600">
              <BiCog className="text-2xl" />
              <span className="text-xs">Configurações</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-purple-600">
              <BiFolder className="text-2xl" />
              <span className="text-xs">Arquivados</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
