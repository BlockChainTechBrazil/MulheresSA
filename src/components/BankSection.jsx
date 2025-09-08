import { useEffect, useState } from 'react';
import { useWeb3Contracts } from '../hooks/useContracts';

const BankSection = () => {
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
    <section className="bg-white py-8 flex justify-center items-center">
      <div className="rounded-lg shadow-lg p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Saldo do Cofre Solidário</h2>
        <p className="text-4xl font-bold text-[#193CB8] mb-4">{loading ? 'Carregando...' : `${parseFloat(balance).toFixed(4)} ETH`}</p>
        <button onClick={async () => {
          setLoading(true);
          try {
            const stats = await getPlatformStats();
            setBalance(stats.totalRaised || '0');
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }} className="bg-[#193CB8] text-white py-2 px-4 rounded-lg hover:bg-[#193CB8]">Atualizar saldo</button>
        <p className="text-gray-600 mt-4">
          Este é o saldo total disponível no cofre atual para doações às crianças. Transparência garantida via blockchain.
        </p>
      </div>
    </section>
  );
};

export default BankSection;
