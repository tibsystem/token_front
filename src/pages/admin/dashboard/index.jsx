import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/sidebar/sidebar';
import dynamic from 'next/dynamic';
import { getInvestors } from '@/services/investors/getInvestors';
import { getFinancialTransactions } from '@/services/financialTransactions/getFinancialTransactions';
import { getProperties } from '@/services/properties/getProperties';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';

import ProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { FaCalendarAlt, FaCoins, FaCubes, FaInfoCircle } from 'react-icons/fa';
import { ImSpinner8 } from "react-icons/im";
import useDarkMode from "@/hooks/useDarkMode";



const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboard() {
  const [investidores, setInvestidores] = useState(0);
  const [Propiedades, setPropiedades] = useState(0);
  const [valorNegociado, setValorNegociado] = useState(0);
  const [graficoData, setGraficoData] = useState({ categories: [], series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [PropiedadesArray, setPropiedadesArray] = useState([]);
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
    async function fetchData() {
      try {
        const invRes = await getInvestors();
        const transRes = await getFinancialTransactions();
        const imvRes = await getProperties();
        setInvestidores(Array.isArray(invRes) ? invRes.length : 0);
        setPropiedadesArray(Array.isArray(imvRes) ? imvRes : []);
        setPropiedades(Array.isArray(imvRes) ? imvRes.length : 0);
        const total = Array.isArray(transRes)
          ? transRes.reduce((sum, t) => sum + (Number(t.valor) || 0), 0)
          : 0;
        setValorNegociado(total);
        const porDia = {};
        if (Array.isArray(transRes)) {
          transRes.forEach(t => {
            const dia = t.data_transacao?.slice(0, 10) || 'Desconhecido';
            porDia[dia] = (porDia[dia] || 0) + (Number(t.valor) || 0);
          });
        }
        const categories = Object.keys(porDia).sort();
        const series = [{
          name: 'Valor negociado',
          data: categories.map(dia => porDia[dia])
        }];
        setGraficoData({ categories, series });
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-8 max-w-6xl mx-auto">
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
              <ImSpinner8 className="fa  fa-spin me-2 mb-2 text-dark" style={{ fontSize: 32 }} />
            </div>
          ) : (
            <>
              <Breadcrumb />
              <h1 className="page-header font-bold text-dark text-3xl mb-4">Dashboard Administrativo</h1>
              {error && <div className="alert alert-danger mb-4">
                <i className="fa fa-exclamation-triangle me-2"></i>
                {error}
              </div>}
              <div className="row mb-4">
                <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
                  <div className="widget widget-stats bg-blue">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-building fa-fw"></i></div>
                    <div className="stats-content">
                      <div className="stats-title">IMÓVEIS CADASTRADOS</div>
                      <div className="stats-number">{Propiedades.toLocaleString('pt-BR')}</div>
                      <div className="stats-progress progress">
                        <div className="progress-bar" style={{width: '100%'}}></div>
                      </div>
                      <div className="stats-desc">Total de imóveis na plataforma</div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
                  <div className="widget widget-stats bg-info">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-users fa-fw"></i></div>
                    <div className="stats-content">
                      <div className="stats-title">INVESTIDORES</div>
                      <div className="stats-number">{investidores.toLocaleString('pt-BR')}</div>
                      <div className="stats-progress progress">
                        <div className="progress-bar" style={{width: '85%'}}></div>
                      </div>
                      <div className="stats-desc">Total de investidores ativos</div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-12">
                  <div className="widget widget-stats bg-purple">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-coins fa-fw"></i></div>
                    <div className="stats-content">
                      <div className="stats-title">VALOR NEGOCIADO</div>
                      <div className="stats-number">R$ {Number(valorNegociado).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                      <div className="stats-progress progress">
                        <div className="progress-bar" style={{width: '90%'}}></div>
                      </div>
                      <div className="stats-desc">Total negociado na plataforma</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-8">
                  <div className="panel panel-inverse">
                    <div className="panel-heading">
                      <h4 className="panel-title">Valor negociado nos últimos dias</h4>
                    </div>
                    <div className="panel-body">
                      {graficoData.categories.length > 0 && (
                        <ApexChart
                          type="bar"
                          height={350}
                          options={{
                            chart: { 
                              id: 'valor-negociado', 
                              toolbar: { show: false },
                              background: 'transparent'
                            },
                            xaxis: { 
                              categories: graficoData.categories,
                              labels: {
                                style: { colors: '#fff' }
                              }
                            },
                            yaxis: { 
                              labels: { 
                                formatter: val => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                style: { colors: '#fff' }
                              }
                            },
                            colors: ['#348fe2'],
                            dataLabels: { enabled: false },
                            grid: { 
                              borderColor: 'rgba(255,255,255,0.15)',
                              strokeDashArray: 3
                            },
                            theme: { mode: 'dark' },
                            plotOptions: {
                              bar: {
                                borderRadius: 4,
                                columnWidth: '60%'
                              }
                            }
                          }}
                          series={graficoData.series}
                        />
                      )}
                      {graficoData.categories.length === 0 && !loading && (
                        <div className="text-center py-5">
                          <i className="fa fa-chart-bar fa-3x text-muted mb-3"></i>
                          <div className="text-muted">Sem dados de transações recentes</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="panel panel-inverse">
                    <div className="panel-heading">
                      <h4 className="panel-title">Resumo Executivo</h4>
                    </div>
                    <div className="panel-body">
                      <div className="row text-center mb-3">
                        <div className="col-6">
                          <div className="widget widget-stats bg-teal mb-2">
                            <div className="stats-content p-3">
                              <div className="stats-title">Média/Imóvel</div>
                              <div className="stats-number fs-16px">
                                R$ {Propiedades > 0 ? Number(valorNegociado / Propiedades).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="widget widget-stats bg-orange mb-2">
                            <div className="stats-content p-3">
                              <div className="stats-title">Média/Investidor</div>
                              <div className="stats-number fs-16px">
                                R$ {investidores > 0 ? Number(valorNegociado / investidores).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="bg-gray-600 mb-3" />
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0">
                          <span><i className="fa fa-building text-blue me-2"></i>Imóveis Ativos</span>
                          <span className="badge bg-blue">{Propiedades}</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0">
                          <span><i className="fa fa-users text-info me-2"></i>Investidores Ativos</span>
                          <span className="badge bg-info">{investidores}</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0">
                          <span><i className="fa fa-chart-line text-purple me-2"></i>Dias com Transações</span>
                          <span className="badge bg-purple">{graficoData.categories.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Imóveis disponíveis</h2>
                    <Link href="./properties" className="text-blue-600 hover:underline font-medium">Ver todos</Link>
                  </div>
                  <div className="d-flex flex-wrap gap-4">
                    {PropiedadesArray.map((imovel) => (
                      <div key={imovel.id} className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" style={{ minWidth: 300, maxWidth: 340, flex: '1 1 320px' }}>
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
                <Link href={`./properties/${imovel.id}`} className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} mt-3 w-100 fs-6`}>
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    
  );
}