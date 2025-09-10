import { useState } from 'react';
import { BiHomeAlt, BiBookmark, BiCog, BiFolder } from "react-icons/bi";

export default function Dashboard() {
  // Dados estáticos para exibição web2
  const [dashboardStats] = useState({
    balanceBRL: '2145',
    transactions: '67',
    projects: '6'
  });

  // Dados estáticos dos projetos
  const [projects] = useState([
    {
      id: 1,
      name: "Projeto 1 - Saúde da Mulher",
      description: "Programa de apoio à saúde feminina com foco em prevenção e cuidados especializados.",
      raised: "1.25",
      target: "5.00",
      status: "ativo",
      category: "Saúde da Mulher"
    },
    {
      id: 2,
      name: "Projeto 2 - Capacitação Profissional",
      description: "Cursos de capacitação profissional para mulheres em situação de vulnerabilidade.",
      raised: "3.80",
      target: "10.00",
      status: "ativo",
      category: "Educação Feminina"
    },
    {
      id: 3,
      name: "Projeto 3 - Empreendedorismo Feminino",
      description: "Programa de apoio ao empreendedorismo feminino com mentoria e microcrédito.",
      raised: "2.10",
      target: "8.00",
      status: "pausado",
      category: "Empoderamento Econômico"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Dashboard MulheresSA</h1>
          <p className="text-gray-600 text-center">Bem-vinda ao painel de controle da plataforma de doações</p>
        </div>

        {/* Painel do Dashboard - Informações Principais */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-semibold mb-4 text-white text-center">Seu Dashboard</h2>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {/* Saldo (BRL) */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Saldo (BRL)</p>
              <span className="text-3xl font-bold flex items-center justify-center">
                <span className="mr-1">R$</span>
                <span>{dashboardStats.balanceBRL}</span>
              </span>
            </div>
            {/* Transações */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Transações</p>
              <span className="text-3xl font-bold">{dashboardStats.transactions}</span>
            </div>
            {/* Projetos */}
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-300 mb-1">Projetos</p>
              <span className="text-3xl font-bold">{dashboardStats.projects}</span>
            </div>
          </div>
        </div>

        {/* Lista de projetos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Meus Projetos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-100 rounded-lg shadow p-4 border hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'ativo' ? '🟢 Ativo' : '⏸️ Pausado'}
                    </span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                
                {/* Informações financeiras */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Arrecadado: {project.raised} ETH</span>
                    <span>Meta: {project.target} ETH</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (parseFloat(project.raised) / parseFloat(project.target)) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((parseFloat(project.raised) / parseFloat(project.target)) * 100).toFixed(1)}% da meta
                  </div>
                </div>

                {/* Botão de doar */}
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    project.status === 'ativo'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  disabled={project.status !== 'ativo'}
                  onClick={() => {
                    if (project.status === 'ativo') {
                      alert(`Redirecionando para doar ao ${project.name}`);
                    }
                  }}
                >
                  {project.status === 'ativo' ? 'Doar Agora' : 'Projeto Pausado'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
