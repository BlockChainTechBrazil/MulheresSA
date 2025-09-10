import { useState } from 'react';
import { BiHomeAlt, BiBookmark, BiCog, BiFolder } from "react-icons/bi";

export default function Dashboard() {
  // Dados estáticos para exibição web2
  const [dashboardStats] = useState({
    balanceBRL: '2145',
    transactions: '67',
    projects: '6'
  });

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

        {/* Lista de projetos (exemplo estático) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Meus Projetos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg shadow p-3">
              <h3 className="text-lg font-bold mb-1">Projeto 1 - Saúde da Mulher</h3>
              <p className="text-sm text-gray-600">Descrição breve do projeto.</p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow p-3">
              <h3 className="text-lg font-bold mb-1">Projeto 2 - Capacitação Profissional</h3>
              <p className="text-sm text-gray-600">Descrição breve do projeto.</p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow p-3">
              <h3 className="text-lg font-bold mb-1">Projeto 3 - Empreendedorismo Feminino</h3>
              <p className="text-sm text-gray-600">Descrição breve do projeto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
