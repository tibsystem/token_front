import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import Link from 'next/link';
import { FaCoins, FaUsers, FaCubes, FaCheckCircle, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

export default function ImovelAdminFinanceiro() {
  const router = useRouter();
  const { id } = router.query;
  const [dados, setDados] = useState(null);
  const [aba, setAba] = useState('financeiro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/imoveis/${id}/financeiro`)
      .then(res => setDados(res.data))
      .catch(() => setError('Erro ao carregar dados financeiros do imóvel.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!dados) return <div className="p-4">Dados não encontrados.</div>;

  const { imovel, resumo, investidores, investimentos, transacoes_p2p } = dados;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <FaCubes className="text-cyan-500" /> {imovel.titulo}
        </h1>
      </div>
      {/* Card de informações principais */}
      <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <span className="flex items-center gap-2 text-base">
            <FaCheckCircle className={imovel.status === 'ativo' ? 'text-cyan-500' : 'text-gray-400'} />
            <span className={imovel.status === 'ativo' ? 'text-cyan-700 font-semibold' : 'text-gray-500'}>{imovel.status.toUpperCase()}</span>
          </span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="flex items-center gap-2 text-base">
            <FaCoins className="text-indigo-400" />
            <span className="text-gray-600">Valor Total:</span>
            <span className="font-semibold text-gray-800">R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FaMapMarkerAlt className="text-cyan-400" /> {imovel.localizacao}
        </div>
      </div>
      {/* Cards sólidos, cores frias e contraste alto */}
      <div className="row mb-8">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="widget widget-stats bg-blue-600 text-white shadow-lg">
            <div className="stats-icon text-white/80"><FaCubes /></div>
            <div className="stats-info">
              <h4 className="uppercase tracking-wide">Tokens Originais</h4>
              <p className="text-2xl font-bold">{imovel.qtd_tokens_original}</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="widget widget-stats bg-indigo-700 text-white shadow-lg">
            <div className="stats-icon text-white/80"><FaCoins /></div>
            <div className="stats-info">
              <h4 className="uppercase tracking-wide">Tokens Vendidos</h4>
              <p className="text-2xl font-bold">{resumo.tokens_vendidos}</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="widget widget-stats bg-cyan-700 text-white shadow-lg">
            <div className="stats-icon text-white/80"><FaCubes /></div>
            <div className="stats-info">
              <h4 className="uppercase tracking-wide">Tokens Disponíveis</h4>
              <p className="text-2xl font-bold">{imovel.qtd_tokens}</p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="widget widget-stats bg-gray-800 text-white shadow-lg">
            <div className="stats-icon text-white/80"><FaUsers /></div>
            <div className="stats-info">
              <h4 className="uppercase tracking-wide">Investidores Únicos</h4>
              <p className="text-2xl font-bold">{resumo.investidores_unicos}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 border-b mb-4">
        <button className={`px-4 py-2 font-semibold transition-colors duration-200 ${aba === 'financeiro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setAba('financeiro')}>Investimentos</button>
        <button className={`px-4 py-2 font-semibold transition-colors duration-200 ${aba === 'investidores' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setAba('investidores')}>Investidores</button>
        <button className={`px-4 py-2 font-semibold transition-colors duration-200 ${aba === 'p2p' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setAba('p2p')}>Transações P2P</button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
        {aba === 'financeiro' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Investimentos</h2>
            <div className="table-responsive rounded-xl overflow-hidden">
              <table className="table table-striped align-middle">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Data</th>
                    <th>Investidor</th>
                    <th>Qtd. Tokens</th>
                    <th>Valor Unitário</th>
                    <th>Origem</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investimentos.length === 0 && (
                    <tr><td colSpan={6} className="text-gray-500">Nenhum investimento encontrado.</td></tr>
                  )}
                  {investimentos.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td>{inv.data_compra}</td>
                      <td>{inv.nome_investidor}</td>
                      <td>{inv.qtd_tokens}</td>
                      <td>R$ {Number(inv.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td>{inv.origem}</td>
                      <td><span className={`badge ${inv.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {aba === 'investidores' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Investidores do Imóvel</h2>
            <div className="row g-4">
              {investidores.length === 0 && (
                <div className="col-12 text-gray-500">Nenhum investidor encontrado.</div>
              )}
              {investidores.map((inv) => (
                <div key={inv.id_investidor} className="col-lg-4 col-md-6">
                  <div className="card h-100 shadow border-0 d-flex flex-column align-items-center p-4 bg-gradient-to-br from-white to-blue-50">
                    <FaUser className="text-blue-500 text-3xl mb-2" />
                    <div className="fw-bold text-lg text-theme">{inv.nome}</div>
                    <div className="text-gray-500 text-sm mb-2">ID: {inv.id_investidor}</div>
                    <div className="badge bg-blue-100 text-blue-700 px-3 py-1 mb-2">Tokens: {inv.qtd_tokens}</div>
                    <div className="text-gray-500 text-xs">{inv.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {aba === 'p2p' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Transações P2P</h2>
            <div className="table-responsive rounded-xl overflow-hidden">
              <table className="table table-striped align-middle">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Data</th>
                    <th>Investidor</th>
                    <th>Qtd. Tokens</th>
                    <th>Valor Unitário</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes_p2p.length === 0 && (
                    <tr><td colSpan={5} className="text-gray-500">Nenhuma transação P2P encontrada.</td></tr>
                  )}
                  {transacoes_p2p.map((t, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td>{t.data}</td>
                      <td>{t.nome_investidor || t.id_investidor}</td>
                      <td>{t.qtd_tokens}</td>
                      <td>R$ {Number(t.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td><span className={`badge ${t.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10">
        <Link href="/imoveis" className="btn btn-outline-secondary h-10 flex items-center px-5 text-base shadow-none"><span className="mr-2">←</span>Voltar</Link>
      </div>
    </div>
  );
}
