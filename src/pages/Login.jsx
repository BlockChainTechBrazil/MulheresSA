import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/dashboard');
  };

  const handleClientLogin = () => {
    navigate('/client-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MulheresSA</h1>
          <p className="text-gray-600">Escolha como deseja acessar a plataforma</p>
        </div>

        <div className="space-y-4">
          {/* Opção Administrador */}
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex flex-col items-center"
          >
            <div className="text-2xl mb-2">👩‍💼</div>
            <div className="text-lg">Administrador</div>
            <div className="text-sm opacity-90">Gerenciar projetos e visualizar estatísticas</div>
          </button>

          {/* Opção Cliente/Doador */}
          <button
            onClick={handleClientLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex flex-col items-center"
          >
            <div className="text-2xl mb-2">❤️</div>
            <div className="text-lg">Doador</div>
            <div className="text-sm opacity-90">Visualizar e apoiar projetos</div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
