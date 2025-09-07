import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MULHERES_SA_ABI, MULHERES_SA_ADDRESS } from '../abis';

// Endereços dos contratos (atualizado com contrato deployed)
const CONTRACT_ADDRESSES = {
  MULHERES_SA: MULHERES_SA_ADDRESS, // Contrato deployado
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

  // Inicializar contratos
  const initializeContracts = useCallback((signer) => {
    try {
      const mulheresSAContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MULHERES_SA,
        MULHERES_SA_ABI,
        signer
      );

      setContracts({
        mulheresSA: mulheresSAContract
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
    CONTRACT_ADDRESSES.MULHERES_SA = addresses.mulheresSA;

    if (signer) {
      initializeContracts(signer);
    }
  }, [signer, initializeContracts]);

  // Criar projeto
  const createProject = useCallback(async (projectData) => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.mulheresSA.createProject(
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
  }, [contracts.mulheresSA]);

  // Fazer doação
  const donateToProject = useCallback(async (projectId, amount) => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.mulheresSA.donate(
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
  }, [contracts.mulheresSA]);

  // Obter projeto
  const getProject = useCallback(async (projectId) => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      const project = await contracts.mulheresSA.getProject(projectId);
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
  }, [contracts.mulheresSA]);

  // Obter estatísticas da plataforma
  const getPlatformStats = useCallback(async () => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      const totalProjects = await contracts.mulheresSA.projectCount();
      const totalRaised = await contracts.mulheresSA.totalRaised();

      return {
        totalProjects: Number(totalProjects),
        totalRaised: ethers.formatEther(totalRaised)
      };
    } catch (err) {
      console.error('Erro ao obter estatísticas:', err);
      throw err;
    }
  }, [contracts.mulheresSA]);

  // Obter projetos do usuário
  const getUserProjects = useCallback(async (address) => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      const projectIds = await contracts.mulheresSA.getUserProjects(address);
      return projectIds.map(id => Number(id));
    } catch (err) {
      console.error('Erro ao obter projetos do usuário:', err);
      throw err;
    }
  }, [contracts.mulheresSA]);

  // Sacar fundos de projeto
  const withdrawFromProject = useCallback(async (projectId, amount) => {
    try {
      if (!contracts.mulheresSA) throw new Error('Contrato não inicializado');

      setLoading(true);
      const tx = await contracts.mulheresSA.withdraw(
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
  }, [contracts.mulheresSA]);

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
