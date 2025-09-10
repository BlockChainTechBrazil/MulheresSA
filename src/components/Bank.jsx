
import { useEffect, useState } from 'react';
import { useWeb3Contracts } from '../hooks/useContracts';

const Bank = () => {
  const { getPlatformStats, contracts } = useWeb3Contracts();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!contracts.mulheresSA) return;
      setLoading(true);
      try {
        const stats = await getPlatformStats();
        setBalance(stats.totalRaised || '0');
      } catch (err) {
        console.error('Erro ao carregar saldo do cofre:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [contracts.mulheresSA, getPlatformStats]);

  return (
  {/* Campo do Cofre Solidário removido conforme solicitado */}
  );
};

export default Bank;
