import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/sidebar/sidebar';
import dynamic from 'next/dynamic';
import { getInvestors } from '@/services/investors/getInvestors';
import { getFinancialTransactions } from '@/services/financialTransactions/getFinancialTransactions';
import { getProperties } from '@/services/properties/getProperties';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboard() {
  const [investidores, setInvestidores] = useState(0);
  const [imoveis, setImoveis] = useState(0);
  const [valorNegociado, setValorNegociado] = useState(0);
  const [graficoData, setGraficoData] = useState({ categories: [], series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imoveisArray, setImoveisArray] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const invRes = await getInvestors();
        const transRes = await getFinancialTransactions();
        const imvRes = await getProperties();
        setInvestidores(Array.isArray(invRes) ? invRes.length : 0);
        setImoveisArray(Array.isArray(imvRes) ? imvRes : []);
        setImoveis(Array.isArray(imvRes) ? imvRes.length : 0);
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
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <Breadcrumb />
        
        <h1 className="page-header font-bold text-dark text-3xl mb-4">Dashboard Administrativo</h1>
        
        {loading && <div className="alert alert-info mb-4">
          <i className="fa fa-spinner fa-spin me-2"></i>
          Carregando dados...
        </div>}
        
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
                <div className="stats-number">{imoveis.toLocaleString('pt-BR')}</div>
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
                          R$ {imoveis > 0 ? Number(valorNegociado / imoveis).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
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
                    <span className="badge bg-blue">{imoveis}</span>
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
      <ul className="row list-unstyled g-4">
        {imoveisArray?.filter(imovel => imovel.status !== 'vendido').length === 0 && !loading && (
          <li className="col-12 text-gray-500">Nenhum imóvel disponível.</li>
        )}
        {imoveisArray?.filter(imovel => imovel.status !== 'vendido').slice(0, 6).map((imovel) => (
          <li key={imovel.id} className="col-xl-3 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <Image
                src="/assets/img/theme/default.jpg"
                alt="Imagem do imóvel"
                className="card-img-top object-fit-cover"
                style={{ height: '180px' }}
                width={300}
                height={180}
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

                <Link href={`./properties/${imovel.id}`} className="btn btn-outline-primary mt-3 w-100 fs-6">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
            </div>
          </div>
      </main>
    </div>
  );
}