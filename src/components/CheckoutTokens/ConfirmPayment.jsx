import { useState } from "react";

const ConfirmPayment = ({ formData, handleInputChange }) => {
  const quantidade = Number(formData.amount) || 0;
  const valorUnitario = Number(formData.valorUnitario) || 0;
  const valorTokens = quantidade * valorUnitario;
  const total = valorTokens;
  const saldoDisponivel = 2500;
  const [usarSaldo, setUsarSaldo] = useState(false);
  const saldoUtilizado = usarSaldo ? Math.min(saldoDisponivel, total) : 0;
  const valorPix = total - saldoUtilizado;
  const saldoInsuficiente = total > saldoDisponivel;
  const falta = saldoInsuficiente ? total - saldoDisponivel : 0;

  return (
    <div className="row g-4 mt-4">
      <div className="col-lg-7 mx-auto">
        <div className="card border-0 shadow-sm mb-4" >
          <div className="card-body">
            <h5 className="fw-bold text-dark mb-3">Resumo da Compra</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Quantidade:</span>
              <span className="fw-bold">{quantidade} tokens</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Valor dos tokens:</span>
              <span className="fw-bold">R$ {valorTokens.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-primary fs-5">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {saldoInsuficiente && (
          <div className="card border-0 shadow-sm mb-4 bg-warning-subtle" >
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="me-2" style={{ fontSize: 22}}><i className="fa-solid fa-triangle-exclamation text-warning"></i></span>
                <span className="fw-bold text-warning">Saldo IB3 disponível</span>
              </div>
              <div className="mb-2">Você pode usar até <span className="fw-bold">R$ {saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> do seu saldo IB3 para abater o valor do PIX.</div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Usar saldo IB3</span>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="usarSaldoIB3"
                    checked={usarSaldo}
                    onChange={() => setUsarSaldo(!usarSaldo)}
                  />
                </div>
              </div>
              <div className="mt-2">PIX será gerado com valor total: <span className="fw-bold">R$ {valorPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>
        )}

        <div className="card border-0 shadow-sm p-4 mb-4">
          <h4 className="fw-bold mb-3">Confirmação de Pagamento</h4>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="acceptTerms">
              Li e aceito os <a href="#" className="text-primary">termos de uso</a> *
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="acceptPrivacy">
              Li e aceito a <a href="#" className="text-primary">política de privacidade</a> *
            </label>
          </div>
        </div>


      </div>
    </div>
  );
};
export default ConfirmPayment;