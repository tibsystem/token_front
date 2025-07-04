/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties } from '../../../services/properties/getProperties';
import { FaMapMarkerAlt, FaCoins, FaCubes, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

export default function ImoveisAdminPage() {
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        setImoveis(Array.isArray(response) ? response : []);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar imóveis.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-4 py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-3xl font-bold mb-8 text-dark">Imoveis</h1>
          <p className="text-muted fs-5">Investimentos selecionados de acordo com o seu perfil</p>
        </div>
      </div>

      {loading && <div className="text-muted mb-4 animate-pulse fs-5">Carregando imóveis...</div>}
      {error && <div className="alert alert-danger mb-4 fs-5">{error}</div>}

      <div className="row g-4">
        {imoveis.length === 0 && !loading && (
          <div className="col-12 text-muted fs-5">Nenhum imóvel cadastrado.</div>
        )}

        {imoveis.map((imovel) => (
          <div key={imovel.id} className="col-xl-3 col-lg-6">
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
                  <div className="d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-primary" /> {imovel.localizacao}</div>
                  <div className="d-flex align-items-center"><FaCoins className="me-2 text-warning" /> Valor Total: R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div className="d-flex align-items-center"><FaCubes className="me-2 text-secondary" /> Tokens: {imovel.qtd_tokens}</div>
                  <div className="d-flex align-items-center"><FaInfoCircle className="me-2 text-info" /> Status: <span className={`badge rounded-pill ${imovel.status === 'ativo' ? 'bg-success-subtle text-success' : 'bg-secondary text-dark'}`}>{imovel.status}</span></div>
                  <div className="d-flex align-items-center"><FaCalendarAlt className="me-2 text-danger" /> Data Tokenização: {imovel.data_tokenizacao}</div>
                </div>

                <Link href={`/properties/${imovel.id}`} className="btn btn-outline-primary mt-3 w-100 fs-6">
                  Simular investimento
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}