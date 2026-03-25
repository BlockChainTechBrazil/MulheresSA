import { useState } from 'react';
import Modal from '../components/Modal';

export default function ClientDashboard() {
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const openModal = (title, message, type = 'info') =>
    setModal({ isOpen: true, title, message, type });
  const closeModal = () => setModal(m => ({ ...m, isOpen: false }));

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
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Projetos para apoio</h1>
          <p className="text-gray-600 text-center">Conheça os projetos e escolha um ou mais para apoio e receba o Fan Token MUSA.</p>
        </div>

        {/* Lista de projetos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Lista de projetos disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-100 rounded-lg shadow p-4 border hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{project.name}</h3>
                    <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${project.status === 'ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {project.status === 'ativo'
                        ? <><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Ativo</>
                        : <><span className="inline-flex gap-0.5"><span className="w-1.5 h-3 rounded-sm bg-yellow-500 inline-block" /><span className="w-1.5 h-3 rounded-sm bg-yellow-500 inline-block" /></span>Pausado</>}
                    </span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                    {project.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                {/* Botão de doar */}
                <button
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${project.status === 'ativo'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  disabled={project.status !== 'ativo'}
                  onClick={() => {
                    if (project.status === 'ativo') {
                      openModal(
                        '💜 Apoio registrado!',
                        `Obrigado por apoiar o projeto "${project.name}"! Em breve você receberá seu Fan Token MUSA como recompensa.`,
                        'success'
                      );
                    }
                  }}
                >
                  {project.status === 'ativo' ? 'Apoiar Agora' : 'Projeto Pausado'}
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Observação sobre votação */}
        <p className="text-center text-sm font-semibold text-gray-700 mt-4">
          <strong>Obs:</strong> Se você já tem 50 Fan tokens, tem o direito de votar no melhor projeto da plataforma.
        </p>
      </div>
    </div>
  );
}
