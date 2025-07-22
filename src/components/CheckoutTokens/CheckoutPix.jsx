import { useState, useEffect } from "react";

const CheckoutPix = ({ formData,  }) => {
const quantidade = Number(formData?.amount) || 0;
  const valorUnitario = Number(formData?.valorUnitario) || 0;
  const valorPix = quantidade * valorUnitario;
  const codigoPix = "00020126580014BR.GOV.BCB.PIX0136abcd1234efgh5678ijkl9012mnop3456qr7890stuv1234wxyz52040000530398654042500.005802BR5920NOME DO RECEBEDOR6009SAO PAULO62070503***";

  const [copiado, setCopiado] = useState(false);
  const [expirado, setExpirado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(5 * 60); 

  useEffect(() => {
    if (expirado) return;
    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          setExpirado(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expirado]);

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const sec = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codigoPix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Pagamento PIX</h5>
        </div>
        <div className="text-center mb-3">
          <div className="text-secondary mb-1" style={{ fontSize: 16 }}>Valor a pagar via PIX</div>
          <div className="fw-bold text-success" style={{ fontSize: 32 }}>R$ {valorPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="mt-2" style={{ fontSize: 15 }}>
            <span className="badge bg-warning text-dark px-3 py-2">
              Tempo para pagar: {formatarTempo(tempoRestante)}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <div style={{ background: '#F5F6FA', borderRadius: 16, padding: 24 }}>
            <i className="fa-solid fa-qrcode" style={{ fontSize: 80, color: '#A0A4B8' }}></i>
          </div>
        </div>
        <div className="text-center text-secondary mb-3" style={{ fontSize: 15 }}>
          Escaneie o código com o app do seu banco
        </div>
        <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
          <div className="form-control bg-light text-truncate" style={{ fontSize: 15, fontFamily: 'monospace', flex: 1, userSelect: 'all' }} title={codigoPix}>
            {codigoPix}
          </div>
          <button className="btn btn-outline-success d-flex align-items-center" style={{ height: 40 }} onClick={handleCopy} disabled={expirado}>
            <i className={`fa-regular ${copiado ? 'fa-circle-check' : 'fa-copy'} me-2`}></i>
            {copiado ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        {expirado ? (
          <div className="alert alert-danger d-flex align-items-center mt-2" style={{ fontSize: 15 }}>
            <span className="me-2"><i className="fa-regular fa-clock"></i></span>
            <div>
              <span className="fw-bold">PIX expirado</span><br />
              O tempo para pagamento expirou. Gere um novo código para continuar.
            </div>
          </div>
        ) : (
          <div className="alert alert-warning d-flex align-items-center mt-2" style={{ fontSize: 15 }}>
            <span className="me-2"><i className="fa-regular fa-clock"></i></span>
            <div>
              <span className="fw-bold">Processamento Automático</span><br />
              Sua compra será confirmada automaticamente após o pagamento
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPix;