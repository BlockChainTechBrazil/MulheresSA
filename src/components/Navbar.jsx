import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import LogoSemFundo from "../assets/logo/logo-sa-s-fundo.png";
import { useAuth } from '../hooks/useAuth';
import { BiHomeAlt, BiBookmark, BiHeart, BiPlus } from "react-icons/bi";

const Navbar = () => {
  const { isConnected, walletAddress, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false); // Fechar menu ao fazer logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-white p-1 rounded flex-shrink-0">
              <img src={LogoSemFundo} alt="Logo" className="h-8 w-auto" />
            </div>
            <div className="ml-3 hidden sm:block">
              <span className="text-xl font-bold">Fantoken MSA</span>
            </div>
            <div className="ml-3 sm:hidden">
              <span className="text-lg font-bold">MSA</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isConnected && (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 bg-green-600 rounded text-sm cursor-default">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {!isConnected && <ConnectWallet buttonStyle="px-4 py-2 text-sm" />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Hamburger icon */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900">
            {isConnected ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-base font-medium text-white">
                  <span className="block text-sm text-blue-200">Carteira Conectada:</span>
                  <span className="bg-green-600 px-2 py-1 rounded text-sm inline-block mt-1">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-3 py-2">
                <ConnectWallet buttonStyle="w-full text-center px-4 py-2 text-base bg-blue-600 hover:bg-blue-700 rounded" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navbar Mobile com Ícones - Visível apenas na tela do Dashboard */}
      {window.location.pathname === '/dashboard' && (
        <nav className="fixed bottom-0 left-0 w-full bg-gray-800 shadow-lg border-t border-gray-700 md:hidden">
          <div className="flex justify-around items-center py-2">
            {/* Home */}
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <BiHomeAlt size={24} />
              <span className="text-xs">Home</span>
            </button>
            {/* Adicionar Projeto */}
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <BiPlus size={24} />
              <span className="text-xs">Adicionar</span>
            </button>
            {/* Doar */}
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <BiHeart size={24} />
              <span className="text-xs">Doar</span>
            </button>
            {/* Favoritos */}
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <BiBookmark size={24} />
              <span className="text-xs">Favoritos</span>
            </button>
          </div>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;