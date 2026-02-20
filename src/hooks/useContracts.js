import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Endereços dos contratos (atualizado com contrato deployed)
const CONTRACT_ADDRESSES = {
  MULHERES_SA: B2BLACK_ADDRESS, // Contrato deployado
};

export const useWeb3Contracts = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [contracts, setContracts] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inicializar contratos (aceita provider ou signer)
  const initializeContracts = useCallback((connection) => {
    try {
      if (!CONTRACT_ADDRESSES.MULHERES_SA) return;
      const b2blackContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MULHERES_SA,
        B2BLACK_ABI,
        connection
      );

      setContracts({
        b2black: b2blackContract
      });
    } catch (err) {
      console.error('Erro ao inicializar contratos:', err);
      setError('Erro ao inicializar contratos');
    }
  }, []);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('MetaMask não encontrada. Por favor, instale a MetaMask.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Inicializar contratos se endereço estiver definido
      if (CONTRACT_ADDRESSES.MULHERES_SA) {
        // Re-inicializa com signer para permitir transações
        initializeContracts(signer);
      }

    } catch (err) {
      setError(err.message);
      console.error('Erro ao conectar wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [initializeContracts]);

  // Definir endereços dos contratos (chamado após deploy)
  const setContractAddresses = useCallback((addresses) => {
    CONTRACT_ADDRESSES.MULHERES_SA = addresses.b2black;

    if (signer) {
      initializeContracts(signer);
    }
  }, [signer, initializeContracts]);

  // Inicializa contratos em modo read-only para permitir que qualquer usuário
  // (mesmo sem conectar a carteira) veja informações públicas como projetos
  useEffect(() => {
    try {
      if (!CONTRACT_ADDRESSES.MULHERES_SA) return;
      if (window && window.ethereum) {
        const readProvider = new ethers.BrowserProvider(window.ethereum);
        initializeContracts(readProvider);
      } else if (ethers.getDefaultProvider) {
        // fallback para um provider público
        const defaultProv = ethers.getDefaultProvider();
        initializeContracts(defaultProv);
      }
    } catch (err) {
      console.error('Erro ao inicializar contratos em read-only:', err);
    }
  }, [initializeContracts]);

  // Criar projeto
  const createProject = useCallback(async (projectData) => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.b2black.createProject(
        projectData.name,
        projectData.description,
        projectData.category,
        ethers.parseEther(projectData.target.toString()),
        Math.floor(new Date(projectData.deadline).getTime() / 1000)
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contracts.b2black]);

  // Fazer doação
  const donateToProject = useCallback(async (projectId, amount) => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.b2black.donate(
        projectId,
        { value: ethers.parseEther(amount.toString()) }
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contracts.b2black]);

  // Obter projeto
  const getProject = useCallback(async (projectId) => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      const project = await contracts.b2black.getProject(projectId);
      return {
        org: project[0],
        name: project[1],
        description: project[2],
        category: Number(project[3]),
        target: ethers.formatEther(project[4]),
        raised: ethers.formatEther(project[5]),
        deadline: new Date(Number(project[6]) * 1000),
        active: project[7],
        donors: Number(project[8])
      };
    } catch (err) {
      console.error('Erro ao obter projeto:', err);
      throw err;
    }
  }, [contracts.b2black]);

  // Obter estatísticas da plataforma
  const getPlatformStats = useCallback(async () => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      const totalProjects = await contracts.b2black.projectCount();
      const totalRaised = await contracts.b2black.totalRaised();

      return {
        totalProjects: Number(totalProjects),
        totalRaised: ethers.formatEther(totalRaised)
      };
    } catch (err) {
      console.error('Erro ao obter estatísticas:', err);
      throw err;
    }
  }, [contracts.b2black]);

  // Obter projetos do usuário
  const getUserProjects = useCallback(async (address) => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      const projectIds = await contracts.b2black.getUserProjects(address);
      return projectIds.map(id => Number(id));
    } catch (err) {
      console.error('Erro ao obter projetos do usuário:', err);
      throw err;
    }
  }, [contracts.b2black]);

  // Sacar fundos de projeto
  const withdrawFromProject = useCallback(async (projectId, amount) => {
    try {
      if (!contracts.b2black) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.b2black.withdraw(
        projectId,
        ethers.parseEther(amount.toString())
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contracts.b2black]);

  // Verificar mudanças na conta
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount('');
          setContracts({});
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(Number(chainId));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Auto-conectar se já estiver conectado
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (err) {
          console.error('Erro no auto-connect:', err);
        }
      }
    };

    autoConnect();
  }, [connectWallet]);

  return {
    // Estado
    provider,
    signer,
    account,
    contracts,
    isConnected,
    chainId,
    loading,
    error,

    // Funções
    connectWallet,
    setContractAddresses,
    createProject,
    donateToProject,
    withdrawFromProject,
    getProject,
    getPlatformStats,
    getUserProjects,

    // Helpers
    formatAddress: (address) => `${address.slice(0, 6)}...${address.slice(-4)}`,
    clearError: () => setError('')
  };
};
