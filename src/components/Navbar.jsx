import { Link } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import LogoSemFundo from "../assets/logo/logo-sa-s-fundo.png";
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isConnected, walletAddress, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        <div className="bg-white p-2 rounded">
          <img src={LogoSemFundo} alt="Logo" className="h-10" />
        </div>
        <div className="ml-4">
          <span className="text-xl font-bold">Fantoken MSA</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {isConnected && (
          <>
            <Link
              to="/dashboard"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Dashboard
            </Link>
            <div className="px-3 py-1 bg-green-600 rounded text-sm cursor-default">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              Sign Out
            </button>
          </>
        )}
        {!isConnected && <ConnectWallet buttonStyle="px-4 py-1 text-sm" />}
      </div>
    </nav>
  );
};

export default Navbar;