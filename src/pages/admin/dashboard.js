import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import api from '@/services/api';
import dynamic from 'next/dynamic';

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
        const [invRes, imvRes, transRes] = await Promise.all([
          api.get('/investors'),
          api.get('/properties'),
          api.get('/transacoes-financeiras'),
        ]);
        setInvestidores(Array.isArray(invRes.data) ? invRes.data.length : 0);
        // Debug: log do retorno de imoveis
        console.log('Retorno de /properties:', imvRes.data);
        setImoveisArray(Array.isArray(imvRes.data) ? imvRes.data : []);
        setImoveis(Array.isArray(imvRes.data) ? imvRes.data.length : 0);
        // Valor negociado total (usando campo 'valor' e 'data_transacao' do novo endpoint)
        const total = Array.isArray(transRes.data)
          ? transRes.data.reduce((sum, t) => sum + (Number(t.valor) || 0), 0)
          : 0;
        setValorNegociado(total);
        // Agrupamento por dia para o gráfico usando 'data_transacao'
        const porDia = {};
        if (Array.isArray(transRes.data)) {
          transRes.data.forEach(t => {
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
        <h1 className="text-3xl font-bold mb-8 text-theme">Dashboard do Administrador</h1>
        {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando dados...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="row mb-8">
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-blue">
              <div className="stats-icon"><i className="fa fa-building"></i></div>
              <div className="stats-info">
                <h4>IMÓVEIS CADASTRADOS</h4>
                <p>{imoveis}</p>
                <div className="text-gray-500">Total de imóveis</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-info">
              <div className="stats-icon"><i className="fa fa-users"></i></div>
              <div className="stats-info">
                <h4>INVESTIDORES</h4>
                <p>{investidores}</p>
                <div className="text-gray-500">Total de investidores</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-12">
            <div className="widget widget-stats bg-purple">
              <div className="stats-icon"><i className="fa fa-coins"></i></div>
              <div className="stats-info">
                <h4>VALOR NEGOCIADO</h4>
                <p>R$ {Number(valorNegociado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="text-gray-500">Total negociado na plataforma</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-theme">Valor negociado nos últimos dias</h2>
          {graficoData.categories.length > 0 && (
            <ApexChart
              type="bar"
              height={320}
              options={{
                chart: { id: 'valor-negociado', toolbar: { show: false } },
                xaxis: { categories: graficoData.categories },
                yaxis: { labels: { formatter: val => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` } },
                colors: ['#6f42c1'],
                dataLabels: { enabled: false },
                grid: { borderColor: '#eee' },
              }}
              series={graficoData.series}
            />
          )}
          {graficoData.categories.length === 0 && !loading && (
            <div className="text-gray-500">Sem dados de transações recentes.</div>
          )}
        </div>
      </main>
    </div>
  );
}
