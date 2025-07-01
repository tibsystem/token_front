import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function ImoveisAdminPage() {
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties')
      .then((res) => setImoveis(res.data))
      .catch(() => setError('Erro ao carregar imóveis.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Todos os Imóveis</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando imóveis...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <ul className="row list-unstyled g-4">
        {imoveis.length === 0 && !loading && (
          <li className="col-12 text-gray-500">Nenhum imóvel cadastrado.</li>
        )}
        {imoveis.map((imovel) => (
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
                <div className="mb-1 text-sm d-flex align-items-center"><i className="fa fa-info-circle me-2 text-gray-600"></i> Status: <span className={`px-2 py-1 rounded text-xs font-semibold ${imovel.status === 'ativo' ? 'bg-green-100 text-green-700' : imovel.status === 'inativo' ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>{imovel.status}</span></div>
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
