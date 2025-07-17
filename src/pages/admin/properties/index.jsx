/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties } from '@/services/properties/getProperties';
import { FaMapMarkerAlt, FaCoins, FaCubes, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
//components
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
//services

export default function PropiedadesAdminPage() {
  const [Propiedades, setPropiedades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'active': 'Ativo',
      'inactive': 'Inativo',
      'cancelled': 'Cancelado',
      'completed': 'Concluído',
      'rejected': 'Rejeitado'
    };
    return statusMap[status?.toLowerCase()] || status?.toLowerCase() || 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        setPropiedades(Array.isArray(response) ? response : []);
        setLoading(false);
      } catch (err) {
        toast.error('Erro ao carregar imóveis.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <ProtectedRoute>
      <Breadcrumb items={[
              { label: 'Imóveis', path: '/admin/properties' },
            ]} />

    <div className="px-4 py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-3xl font-bold mb-8 text-dark">Propiedades</h1>
          <p className="text-muted fs-5">Investimentos selecionados de acordo com o seu perfil</p>
        </div>
      </div>

      {loading && <div className="text-muted mb-4 animate-pulse fs-5">Carregando imóveis...</div>}

      <div className="row g-4">
        {Propiedades.length === 0 && !loading && (
          <div className="col-12 text-muted fs-5">Nenhum imóvel cadastrado.</div>
        )}

        {Propiedades.map((imovel) => (
          <div key={imovel.id} className="col-xl-3 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4  overflow-hidden">
              <img
                src={
                  imovel.photos && imovel.photos.length > 0
                    ? imovel.photos[0].path
                    : '/assets/img/theme/default.jpg'
                }
                alt="Imagem do imóvel"
                className="card-img-top object-fit-cover"
                style={{ height: '180px' }}
                onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
              />
              {imovel.photos && imovel.photos.length > 1 && (
                <div className="d-flex gap-2 mt-2 px-2 pb-2">
                  {imovel.photos.slice(1, 5).map((photo, idx) => (
                    <img
                      key={photo.id}
                      src={photo.path}
                      alt={`Foto ${idx + 2}`}
                      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                      onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
                    />
                  ))}
                  {imovel.photos.length > 5 && (
                    <span className="d-flex align-items-center justify-content-center bg-light rounded-2 border text-muted" style={{ width: 60, height: 40, fontSize: 12 }}>
                      +{imovel.photos.length - 5}
                    </span>
                  )}
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold text-dark mb-1 fs-4">{imovel.title}</h5>
                <p className="text-muted fs-6 mb-2">{imovel.description}</p>

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
                  <div className="d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-primary" /> {imovel.location}</div>
                  <div className="d-flex align-items-center"><FaCoins className="me-2 text-warning" /> Valor Total: R$ {Number(imovel.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div className="d-flex align-items-center"><FaCubes className="me-2 text-secondary" /> Tokens: {imovel.total_tokens}</div>
                  <div className="d-flex align-items-center">
                    <FaInfoCircle className="me-2 text-info" /> Status: <span className={`badge rounded-pill ${
                      imovel.status?.toLowerCase() === 'active' || imovel.status?.toLowerCase() === 'approved' 
                        ? 'bg-success-subtle text-success' 
                        : imovel.status?.toLowerCase() === 'pending' 
                        ? 'bg-warning-subtle text-warning' 
                        : 'bg-secondary-subtle text-secondary'
                    }`}>
                      {translateStatus(imovel.status)}
                    </span>
                  </div>
                 
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-danger" /> Data Tokenização: {
                      imovel.tokenization_date && !isNaN(new Date(imovel.tokenization_date).getTime())
                        ? new Date(imovel.tokenization_date).toLocaleString('pt-BR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }).replace(',', '')
                        : 'Não tokenizado'
                    }
                  </div>
                </div>

                <Link href={`./properties/${imovel.id}`} className="btn btn-outline-primary mt-3 w-100 fs-6">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </ProtectedRoute>
    </>
  );
}