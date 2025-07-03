import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { getOnePropertie } from '../../services/properties/getOnePropertie';
import { getPlatformSettings } from '../../services/platformSettings/getPlatformSettings';
import { postInvestmentsPurchase } from '../../services/investments/postInvestmentsPurchase';

export default function ImovelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState(null);
  const [valorUnitario, setValorUnitario] = useState('');
  const [loading, setLoading] = useState(true);
  const [taxaCompra, setTaxaCompra] = useState(0);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (id) {
      try {
        setLoading(true);
        const response = getOnePropertie(id);
        setProperty(response);
        if (response.valor_total && response.qtd_tokens_original) {
          setValorUnitario((Number(response.valor_total) / Number(response.qtd_tokens_original)). toFixed(2));
        } else {
          setValorUnitario('');
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          setError('Sua sessão expirou ou você não tem permissão para acessar este imóvel. Faça login novamente se necessário.');
        } else {
          setError('Erro ao carregar imóvel.');
        }
      } finally {
        setLoading(false);
      }
    }
    try {
      const response = getPlatformSettings();
      if (response && response.taxa_compra_token) {
        setTaxaCompra(Number(response.taxa_compra_token));
      }
    } catch (err) {
      setTaxaCompra(0);
    }
  }, [id]);

  const total = Number(amount) * (Number(valorUnitario) || 0);
  const valorTaxa = total * (taxaCompra / 100);
  const totalComTaxa = total + valorTaxa;

  const infoMock = {
    rentabilidade: 'IPCA + 14,00%',
    vencimento: '15/06/2029',
    nivelGarantia: 5,
    vendido: 877000.87,
    total: 2000000,
    valorMinimo: 1000,
    valorDisponivel: 1122999.13,
    devedor: 'Gran Vellas Wins Empreendimentos SPE Ltda.',
    periodicidade: 'Cash Sweep',
    fluxo: 'Cash Sweep',
    garantia: 'Imóveis, Recebíveis, Cotas e Aval',
    lastro: 'Recebíveis Imobiliários',
    cronograma: 'Conforme descrito no Termo de Securitização'
  };

  const coresGarantia = ['#e53935', '#f6c244', '#f6e244', '#4fc3f7', '#43a047'];

  const isValid = () => {
    if (amount < 1 || isNaN(amount)) {
      setValidationError('Informe uma quantidade válida.');
      return false;
    }
    if (total < infoMock.valorMinimo) {
      setValidationError(`Valor mínimo de investimento é R$ ${infoMock.valorMinimo.toLocaleString('pt-BR')}`);
      return false;
    }
    if (total > infoMock.valorDisponivel) {
      setValidationError('O valor excede o disponível para este imóvel.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handlePurchase = async () => {
    if (!isValid()) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let id_investidor = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          id_investidor = payload.id || payload.user_id || payload.sub;
        } catch {}
      }
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const data_compra = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const payload = {
        id_investidor,
        id_imovel: Number(id),
        qtd_tokens: Number(amount),
        valor_unitario: Number(valorUnitario) || 0,
        data_compra,
        origem: 'plataforma',
        status: 'ativo',
      };
      await postInvestmentsPurchase(payload);
      alert('Compra realizada!');
    } catch (error) {
      console.error(error);
      alert('Erro na compra');
    }
  };

  if (loading) return <div className="p-5 text-muted fs-5 text-center">Carregando imóvel...</div>;
  if (error) return <div className="p-5 text-danger fs-5 text-center">{error}</div>;
  if (!property) return <div className="p-5 text-center">Imóvel não encontrado.</div>;

  return (
    <div className="container-fluid py-5">
      <div className="card border-0 shadow-sm p-5 mb-5">
        <div className="row g-5">
          <div className="col-lg-7">
            <h1 className="h2 fw-bold mb-3">Gran Vellas Wind</h1>
            <div className="d-flex gap-2 mb-4">
              <span className="badge bg-primary-subtle text-primary px-3 py-2">Isento de IR</span>
              <span className="badge bg-secondary-subtle text-secondary px-3 py-2">Novo</span>
            </div>
            <p className="mb-4 fs-5 text-primary fw-bold">Rentabilidade Prevista: {infoMock.rentabilidade} a.a.</p>

            <p className="mb-2 fw-semibold">Nível de Garantia</p>
            <p className="text-muted mb-2">Esse investimento está classificado no <strong>Nível {infoMock.nivelGarantia}</strong></p>
            <div className="d-flex gap-2 mb-4 align-items-end">
              {[1, 2, 3, 4, 5].map((nivel, idx) => (
                <div key={nivel} className="text-center flex-fill">
                  <div style={{ fontSize: 12, color: coresGarantia[idx], opacity: nivel === infoMock.nivelGarantia ? 1 : 0.3, fontWeight: 'bold' }}>Nível {nivel}</div>
                  <div
                    className="rounded-pill mt-1"
                    style={{ height: 10, backgroundColor: coresGarantia[idx], opacity: nivel === infoMock.nivelGarantia ? 1 : 0.3 }}
                  ></div>
                </div>
              ))}
            </div>

            <p className="mb-1 fw-semibold">Progresso</p>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>R$ {infoMock.vendido.toLocaleString('pt-BR')}</span>
              <span>R$ {infoMock.total.toLocaleString('pt-BR')} Total</span>
            </div>
            <div className="progress mb-4" style={{ height: 8 }}>
              <div className="progress-bar bg-primary" style={{ width: `${(infoMock.vendido / infoMock.total) * 100}%` }}></div>
            </div>

            <div className="row row-cols-2 g-3 text-muted fs-6">
              <div><strong>Devedor:</strong><br />{infoMock.devedor}</div>
              <div><strong>Periodicidade da Remuneração:</strong><br />{infoMock.periodicidade}</div>
              <div><strong>Fluxo de Amortização:</strong><br />{infoMock.fluxo}</div>
              <div><strong>Garantia:</strong><br />{infoMock.garantia}</div>
              <div><strong>Lastro:</strong><br />{infoMock.lastro}</div>
              <div><strong>Cronograma:</strong><br />{infoMock.cronograma}</div>
              <div><strong>Valor Mínimo:</strong><br />R$ {infoMock.valorMinimo.toLocaleString('pt-BR')}</div>
              <div><strong>Valor Disponível:</strong><br />R$ {infoMock.valorDisponivel.toLocaleString('pt-BR')}</div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4">Simule seu investimento</h4>
              <div className="mb-3">
                <label className="form-label">Quantidade de tokens</label>
                <input type="number" className="form-control form-control-lg" value={amount} min={1} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div className="mb-3">
                <label className="form-label">Valor unitário</label>
                <div className="form-control form-control-lg bg-light">R$ {Number(valorUnitario).toLocaleString('pt-BR')}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Taxa da plataforma: {taxaCompra}%</div>
                <div className="fw-semibold">Total: R$ {total.toLocaleString('pt-BR')}</div>
                <div className="text-muted">Taxa: R$ {valorTaxa.toLocaleString('pt-BR')}</div>
                <div className="fw-bold text-success">Total com taxa: R$ {totalComTaxa.toLocaleString('pt-BR')}</div>
              </div>
              {validationError && <div className="alert alert-warning small py-2">{validationError}</div>}
              <button className="btn btn-success w-100 py-2 fs-5" onClick={handlePurchase} disabled={!!validationError}>
                Comprar Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}