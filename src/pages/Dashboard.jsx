
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { isConnected, walletAddress } = useAuth();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Bem-vinda ao seu painel! Aqui você verá informações da sua carteira e funcionalidades exclusivas.</p>
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Informações da Carteira:</h3>
        <p><strong>Endereço:</strong> {walletAddress}</p>
        <p><strong>Status:</strong> Conectada ✅</p>
      </div>
    </div>
  );
}
