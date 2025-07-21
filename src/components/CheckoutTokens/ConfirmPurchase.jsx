  // Função Step2ConfirmPayment movida para dentro do componente para acessar formData e handleInputChange
  const Step2ConfirmPayment = () => (
    <div className="row g-4">
      <div className="col-lg-7">
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
import React, { useState } from 'react';
import { FaCoins, FaShieldAlt, FaCreditCard, FaUser, FaLock, FaCheckCircle, FaArrowLeft, FaCalculator } from 'react-icons/fa';
import Steps from '../Tab/Step';
import { toast } from 'react-toastify';

export default function PropertyCheckout({ property }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: 100,
    paymentMethod: 'credit_card',
    
    // Dados pessoais
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    

    // Pagamento
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Termos
    acceptTerms: false,
    acceptPrivacy: false
  });



  if (!property) return <div className="p-5 text-center">Imóvel não encontrado.</div>;

  const total = formData.amount * (Number(property.valorUnitario) || 0);
  const valorTaxa = total * ((Number(property.taxaCompra) || 0) / 100);
  const totalComTaxa = total + valorTaxa;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Simular processo de compra
    toast('Compra realizada com sucesso!');
  };

  const stepsModel = [
    { label: 'Revisão', active: currentStep === 1 },
    { label: 'Dados Pessoais', active: currentStep === 2 },
    { label: 'Pagamento', active: currentStep === 3 }
  ];

  const Step1Review = () => (
    <div>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaCoins className="text-warning" />
              Resumo do Investimento
            </h4>
            <div className="d-flex gap-3 mb-4">
              <img
                src={property.image || property.photo || '/assets/img/default-property.jpg'}
                alt={property.title}
                className="rounded-3 object-fit-cover"
                style={{ width: '100px', height: '80px' }}
              />
              <div>
                <h6 className="fw-bold mb-1">{property.title}</h6>
                <p className="text-muted mb-1 small">Rentabilidade: {property.profitability}</p>
                <span className="badge bg-success-subtle text-success px-2 py-1">
                  Nível {property.levelWarrant}
                </span>
                <FaShieldAlt className="text-success" />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Quantidade de tokens</label>
              <input
                type="number"
                className="form-control form-control-lg"
                value={formData.amount}
                min={1}
                max={property.total_tokens || property.totalTokens || 0}
                onChange={(e) => handleInputChange('amount', Math.max(1, parseInt(e.target.value) || 1))}
              />
              <small className="text-muted">

              </small>
            </div>
            <div className="bg-light rounded-3 p-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Valor unitário:</span>
                <span className="fw-semibold">
                  R$ {(Number(property.valorUnitario) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Taxa da plataforma ({property.taxaCompra}%):</span>
                <span className="fw-semibold">
                  R$ {valorTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span className="fw-bold text-success fs-5">Total:</span>
                <span className="fw-bold text-success fs-5">
                  R$ {totalComTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaCalculator className="text-primary" />
              Simulação de Retorno
            </h5>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Investimento inicial:</span>
                <span className="fw-semibold">
                  R$ {totalComTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Retorno estimado (12 meses):</span>
                <span className="fw-semibold text-success">
                  R$ {(totalComTaxa * 1.12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Lucro estimado:</span>
                <span className="fw-bold text-success">
                  R$ {(totalComTaxa * 0.12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="alert alert-info">
              <small>
                <strong>Importante:</strong> Os valores apresentados são estimativas baseadas na rentabilidade projetada e não constituem garantia de retorno.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Step2PersonalData = () => (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm p-4">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <FaUser className="text-primary" />
            Dados Pessoais
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nome completo *</label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">CPF *</label>
              <input
                type="text"
                className="form-control"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">E-mail *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Telefone *</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => currentStep > 1 ? prevStep() : null}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="h3 fw-bold mb-0">Checkout</h1>
            <p className="text-muted mb-0">Finalize seu investimento</p>
          </div>
        </div>

        <Steps model={stepsModel} />

        {currentStep === 1 && <Step1Review />}
        {currentStep === 2 && <Step2ConfirmPayment />}
        {currentStep === 3 && <Step3PixMock />}

        <div className="d-flex justify-content-between mt-5">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <FaArrowLeft className="me-2" />
            Voltar
          </button>
          {currentStep < 3 ? (
            <button
              className="btn btn-primary px-4"
              onClick={nextStep}
              disabled={currentStep === 2 && (!formData.acceptTerms || !formData.acceptPrivacy)}
            >
              {currentStep === 2 ? 'Confirmar e Pagar' : 'Continuar'}
              <i className="fa fa-arrow-right ms-2"></i>
            </button>
          ) : (
            <button
              className="btn btn-success px-4"
              onClick={handleSubmit}
            >
              <FaLock className="me-2" />
              Finalizar Compra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}