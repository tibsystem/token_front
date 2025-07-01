import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardHeader, CardBody } from '@/components/card/card';

function getUserIdFromToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.user_id || payload.sub || null;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export default function DashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          console.log('Token salvo no localStorage:', token);
          const userId = getUserIdFromToken();
          console.log('ID do usuário logado:', userId);
        }
        const userId = getUserIdFromToken();
        if (!userId) throw new Error('ID do usuário não encontrado no token. Faça login novamente.');
        const [walletRes, propRes] = await Promise.all([
          api.get(`/wallet/${userId}`),
          api.get('/properties'),
        ]);
        setWallet(walletRes.data);
        setProperties(propRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError(err?.response?.data?.message || err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Dashboard</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando informações...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
      )}
      {wallet && (
        <div className="row mb-4">
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-blue">
              <div className="stats-icon"><i className="fa fa-wallet"></i></div>
              <div className="stats-info">
                <h4>SALDO DISPONÍVEL</h4>
                <p>R$ {Number(wallet.saldo_disponivel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="text-gray-500">Disponível para uso</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-info">
              <div className="stats-icon"><i className="fa fa-lock"></i></div>
              <div className="stats-info">
                <h4>SALDO BLOQUEADO</h4>
                <p>R$ {Number(wallet.saldo_bloqueado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="text-gray-500">Em processamento</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-12">
            <div className="widget widget-stats bg-purple">
              <div className="stats-icon"><i className="fa fa-coins"></i></div>
              <div className="stats-info">
                <h4>SALDO TOKENIZADO</h4>
                <p>
                  {Array.isArray(wallet.saldo_tokenizado) && wallet.saldo_tokenizado.length > 0
                    ? wallet.saldo_tokenizado.map((item, idx) => (
                        <span key={idx}>R$ {Number(item).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br/></span>
                      ))
                    : 'R$ 0,00'}
                </p>
                <div className="text-gray-500">Tokens em carteira</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Imóveis disponíveis</h2>
        <Link href="/imoveis" className="text-blue-600 hover:underline font-medium">Ver todos</Link>
      </div>
      <ul className="row list-unstyled g-4">
        {properties.filter(imovel => imovel.status !== 'vendido').length === 0 && !loading && (
          <li className="col-12 text-gray-500">Nenhum imóvel disponível.</li>
        )}
        {properties.filter(imovel => imovel.status !== 'vendido').slice(0, 6).map((imovel) => (
          <li key={imovel.id} className="col-lg-4 col-md-6">
            <div className="card h-100 shadow border-0">
              <img
                src="/assets/img/theme/default.jpg"
                alt="Imagem do imóvel"
                className="card-img-top object-cover"
                style={{ height: '180px', objectFit: 'cover' }}
                onError={e => { e.target.src = '/assets/img/theme/default.jpg'; }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-theme mb-2">{imovel.titulo}</h5>
                <p className="card-text mb-2 line-clamp-2">{imovel.descricao}</p>
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-map-marker-alt me-2 text-blue-600"></i> {imovel.localizacao}</div>
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-coins me-2 text-yellow-600"></i> Valor Total: R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-cubes me-2 text-purple-600"></i> Tokens: {imovel.qtd_tokens}</div>
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-info-circle me-2 text-gray-600"></i> Status: <span className={`px-2 py-1 rounded text-xs font-semibold ${imovel.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{imovel.status}</span></div>
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-calendar-alt me-2 text-pink-600"></i> Data Tokenização: {imovel.data_tokenizacao}</div>
                <Link href={`/imoveis/${imovel.id}`} className="mt-auto btn btn-primary w-100">Ver detalhes</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
