import { useState } from 'react';

export default function ClientDashboard() {
  // Dados estáticos dos projetos (mesmo do dashboard admin)
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Projetos para Doação</h1>
          <p className="text-gray-600 text-center">Conheça os projetos e faça sua doação</p>
        </div>

        {/* Lista de projetos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Projetos Disponíveis</h2>
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
                
                {/* Botão de doar */}
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    project.status === 'ativo'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
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
