import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/card/card';
import { getWallet } from '../services/wallet/getWallet';
import { getProperties } from '../services/properties/getProperties';

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
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('Token salvo no localStorage:', token);
        const userId = getUserIdFromToken();
        console.log('ID do usuário logado:', userId);
      }
      const userId = getUserIdFromToken();
      if (!userId) throw new Error('ID do usuário não encontrado no token. Faça login novamente.');
      try {
        const responseWallet = await getWallet(userId);
        setWallet(responseWallet);
      } catch (err) {
        console.error('Erro ao buscar carteira:', err);
        setError(err?.response?.data?.message || err.message || 'Erro ao buscar carteira');
      }
      try {
        const responseProperties = await getProperties();
        setProperties(responseProperties);
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setError(err?.response?.data?.message || err.message || 'Erro ao buscar propriedades');
      }
      setLoading(false);
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
                      <span key={idx}>R$ {Number(item).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br /></span>
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
        <Link href="/properties" className="text-blue-600 hover:underline font-medium">Ver todos</Link>
      </div>
      <ul className="row list-unstyled g-4">
        {properties?.filter(imovel => imovel.status !== 'vendido').length === 0 && !loading && (
          <li className="col-12 text-gray-500">Nenhum imóvel disponível.</li>
        )}
        {properties?.filter(imovel => imovel.status !== 'vendido').slice(0, 6).map((imovel) => (
          <li key={imovel.id} className="col-xl-3 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img
                src="/assets/img/theme/default.jpg"
                alt="Imagem do imóvel"
                className="card-img-top object-fit-cover"
                style={{ height: '180px' }}
                onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold text-dark mb-1 fs-4">{imovel.titulo}</h5>
                <p className="text-muted fs-6 mb-2">Direito de recebimento de antecipações do segmento imobiliário</p>

                <div className="mb-2">
                  <small className="text-muted fs-6">Nível de Garantia</small>
                  <div className="d-flex align-items-center">
                    <span className="text-success fw-semibold fs-6">Esse investimento está classificado no Nível 3</span>
                  </div>
                  <div className="progress bg-light mt-1" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between text-muted border-top pt-2 mt-2">
                  <div>
                    <div className="fw-semibold fs-6">Rentabilidade Prevista</div>
                    <div className="text-primary fw-bold fs-6">IPCA + 14% a.a.</div>
                  </div>
                  <div>
                    <div className="fw-semibold fs-6">Investimento Mínimo</div>
                    <div className="text-dark fs-6">R$ 1.000,00</div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-1 mt-3 text-muted fs-6">
                  <div className="d-flex align-items-center"><i className="fa fa-map-marker-alt me-2 text-primary" /> {imovel.localizacao}</div>
                  <div className="d-flex align-items-center"><i className="fa fa-coins me-2 text-warning" /> Valor Total: R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div className="d-flex align-items-center"><i className="fa fa-cubes me-2 text-secondary" /> Tokens: {imovel.qtd_tokens}</div>
                  <div className="d-flex align-items-center"><i className="fa fa-info-circle me-2 text-info" /> Status: <span className={`badge rounded-pill ${imovel.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary text-dark'}`}>{imovel.status}</span></div>
                  <div className="d-flex align-items-center"><i className="fa fa-calendar-alt me-2 text-danger" /> Data Tokenização: {imovel.data_tokenizacao}</div>
                </div>

                <Link href={`/properties/${imovel.id}`} className="btn btn-outline-primary mt-3 w-100 fs-6">
                  Simular investimento
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
