// hooks/useWeb3.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABIs básicos - você precisará copiar os ABIs após compilar no Remix
const MulheresSAabi = []; // Cole aqui o ABI do MulheresSA.sol
const FanTokenMSAabi = []; // Cole aqui o ABI do FanTokenMSA.sol  
const ProxyManagerabi = []; // Cole aqui o ABI do ProxyManager.sol

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [contracts, setContracts] = useState({});

  // Endereços dos contratos (atualize após deploy no Remix)
  const CONTRACT_ADDRESSES = {
    PROXY_MANAGER: '', // Cole aqui o endereço do ProxyManager após deploy
    MULHERES_SA: '',   // Cole aqui o endereço do MulheresSA após deploy
    FAN_TOKEN: ''      // Cole aqui o endereço do FanToken após deploy
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const userAccount = await web3Signer.getAddress();
        const network = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(userAccount);
        setChainId(network.chainId);
        setIsConnected(true);

        // Initialize contracts
        initializeContracts(web3Provider, web3Signer);

        return true;
      } catch (error) {
        console.error('Erro ao conectar carteira:', error);
        return false;
      }
    } else {
      alert('MetaMask não encontrada! Por favor, instale o MetaMask.');
      return false;
    }
  };

  const initializeContracts = (provider, signer) => {
    try {
      const contractInstances = {};

      if (CONTRACT_ADDRESSES.PROXY_MANAGER) {
        contractInstances.proxyManager = new ethers.Contract(
          CONTRACT_ADDRESSES.PROXY_MANAGER,
          ProxyManagerabi,
          signer
        );
      }

      if (CONTRACT_ADDRESSES.MULHERES_SA) {
        contractInstances.mulheresSA = new ethers.Contract(
          CONTRACT_ADDRESSES.MULHERES_SA,
          MulheresSAabi,
          signer
        );
      }

      if (CONTRACT_ADDRESSES.FAN_TOKEN) {
        contractInstances.fanToken = new ethers.Contract(
          CONTRACT_ADDRESSES.FAN_TOKEN,
          FanTokenMSAabi,
          signer
        );
      }

      setContracts(contractInstances);
    } catch (error) {
      console.error('Erro ao inicializar contratos:', error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount('');
    setIsConnected(false);
    setChainId(null);
    setContracts({});
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
    } catch (switchError) {
      // Se a rede não existe, adiciona ela
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            }],
          });
        } catch (addError) {
          console.error('Erro ao adicionar rede Polygon:', addError);
        }
      }
    }
  };

  // Função para formatar endereço
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Função para formatar valor em ETH
  const formatEther = (value) => {
    return ethers.utils.formatEther(value);
  };

  // Função para converter para Wei
  const parseEther = (value) => {
    return ethers.utils.parseEther(value.toString());
  };

  // Escutar mudanças na conta
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (newChainId) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload(); // Reload para atualizar contratos
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    contracts,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    formatAddress,
    formatEther,
    parseEther,
    CONTRACT_ADDRESSES
  };
};
