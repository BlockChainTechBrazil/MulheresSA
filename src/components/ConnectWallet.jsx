import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import { useAuth } from '../hooks/useAuth';

const walletIcon = (
  <svg
    className="w-4 h-4 mr-1 inline-block"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2m2-4h-6m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
    />
  </svg>
);

const ConnectWallet = ({ buttonStyle = "px-5 py-2" }) => {
  const navigate = useNavigate();
  const { isConnected, walletAddress, login, logout } = useAuth();

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        login(accounts[0]);
        navigate('/dashboard');
      } catch (err) {
        alert("Erro ao conectar carteira: " + (err && err.message ? err.message : err));
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão para continuar.");
    }
  };

  const handleDisconnect = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      {!isConnected ? (
        <button
          className={`flex items-center gap-2 ${buttonStyle} rounded-full font-semibold shadow-lg transition-all duration-200 border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 bg-[#F9C448] text-white hover:scale-105 hover:shadow-xl`}
          onClick={handleConnect}
          style={{ minWidth: 120 }}
        >
          {walletIcon}
          <span>Conectar</span>
        </button>
      ) : (
        <button
          className={`flex items-center gap-2 ${buttonStyle} rounded-full font-semibold shadow-lg transition-all duration-200 border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gradient-to-r from-green-500 to-green-700 text-white cursor-pointer hover:from-green-600 hover:to-green-800`}
          onClick={handleDisconnect}
          style={{ minWidth: 120 }}
        >
          {walletIcon}
          <span className="truncate">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
