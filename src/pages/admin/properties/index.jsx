/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaCoins, FaCubes, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useDarkMode from "@/hooks/useDarkMode";

//components
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
//services
import { getProperties } from '@/services/properties/getProperties';
import { ImSpinner8 } from 'react-icons/im';

export default function PropiedadesAdminPage() {
  const [Propiedades, setPropiedades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();

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
    
      <Breadcrumb items={[
              { label: 'Imóveis', path: '/admin/properties' },
            ]} />

    <div className="px-4 py-5">
      <div className="row mb-4">
        <div className="col d-flex align-items-center justify-content-between">
          <h1 className="text-3xl font-bold mb-8 text-dark mb-0">Propiedades</h1>
          <Link href="/admin/properties/register" className="btn btn-lg btn-dark ms-3 mb-8">
            <i className="fa fa-plus me-2"></i>
            Cadastrar
          </Link>
        </div>
      </div>

        {loading ? (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ImSpinner8 className="fa fa-spin me-2 mb-2 text-dark" style={{ fontSize: 32 }} />
          </div>
        ) : null}
      <div className="row g-4">
        {Propiedades.length === 0 && !loading && (
          <div className="col-12 text-muted fs-5">Nenhum imóvel cadastrado.</div>
        )}

        {Propiedades.map((imovel) => (
          <div key={imovel.id} className="col-xl-3 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4  overflow-hidden"
            style={{ minHeight: 520 }}>
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
              <div className="card-body d-flex flex-column" style={{ flex: 1, display: 'flex' }}>
                <h5 className="fw-bold text-dark mb-1 fs-4">{imovel.title}</h5>
                <p className="text-muted fs-6 mb-2">{imovel.description}</p>

                <div className="mb-2">
                  <small className="text-muted fs-6">Nível de Garantia</small>
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold fs-6" style={{ color: (() => {
                      const coresGarantia = [
                        '#e53935', 
                        '#f6c244', 
                        '#f6e244', 
                        '#4fc3f7', 
                        '#43a047', 
                      ];
                      const nivel = Number(imovel.level_warrant);
                      return nivel >= 1 && nivel <= 5 ? coresGarantia[nivel - 1] : '#999';
                    })() }}>
                      {imovel.level_warrant
                        ? `Esse investimento está classificado no Nível ${imovel.level_warrant}`
                        : 'Nível não informado'}
                    </span>
                  </div>
                  <div className="progress bg-light mt-1" style={{ height: '6px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${imovel.level_warrant ? Math.min(Number(imovel.level_warrant) * 20, 100) : 0}%`,
                        backgroundColor: (() => {
                          const coresGarantia = [
                            '#e53935', // 1
                            '#f6c244', // 2
                            '#f6e244', // 3
                            '#4fc3f7', // 4
                            '#43a047', // 5
                          ];
                          const nivel = Number(imovel.level_warrant);
                          return nivel >= 1 && nivel <= 5 ? coresGarantia[nivel - 1] : '#999';
                        })()
                      }}
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between text-muted border-top pt-2 mt-2">
                  <div>
                    <div className="fw-semibold fs-6">Rentabilidade Prevista</div>
                    <div className="text-primary fw-bold fs-6">{imovel.profitability}</div>
                  </div>
                
                </div>

                <div className="d-flex flex-column gap-1 mt-3 text-muted fs-6">
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

                  <div style={{ flexGrow: 1 }}></div>
                  <Link href={`./properties/${imovel.id}`} className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} mt-3 w-100 fs-6`} style={{ marginTop: 'auto' }}>
                    Ver Detalhes
                  </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </>
  );
}