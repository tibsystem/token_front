import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaCoins,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaCalculator,
} from "react-icons/fa";

//Components
import ConfirmPayment from "./ConfirmPayment";
import CheckoutPix from "./CheckoutPix";
import Steps from "../Tab/Step";
//services
import { postInvestmentsPurchase } from "@/services/investments/postInvestmentsPurchase";
//utils
import { getUserIdFromToken } from "@/utils/auth";

const Review = ({ property, formData, handleInputChange, valorUnitarioFinal, total, valorTaxa, totalComTaxa }) => (
  <div className="mt-4">
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm p-4">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <FaCoins className="text-warning" />
            Resumo do Investimento
          </h4>
          <div className="d-flex gap-3 mb-4">
            <img
              src={
                Array.isArray(property.photos) && property.photos.length > 0
                  ? property.photos[0].path
                  : property.image || property.foto || "/assets/img/default-property.jpg"
              }
              alt={property.title || property.nome || property.name || "Imóvel"}
              className="rounded-3 object-fit-cover"
              style={{ width: "100px", height: "80px" }}
            />
            <div>
              <h6 className="fw-bold mb-1">{property.title || property.nome || property.name || "Sem nome"}</h6>
              <p className="text-muted mb-1 small">
                Rentabilidade: {property.profitability || property.rentabilidade || "N/A"}
              </p>
              <span className="badge bg-success-subtle text-success px-2 py-1">
                Nível {property.level_warrant || property.level || property.nivel || "-"}
              </span>
              <FaShieldAlt className="text-success" />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Quantidade de tokens
            </label>
            <input
              type="number"
              className="form-control form-control-lg"
              value={formData.amount === 0 ? "" : formData.amount === "" ? "" : formData.amount}
              min={1}
              max={Number(property.total_tokens || property.totalTokens) > 0 ? Number(property.total_tokens || property.totalTokens) : 1}
              onChange={(e) => {
                let val = e.target.value;
                if (val === "") {
                  handleInputChange("amount", "");
                  return;
                }
                if (isNaN(val)) return;
                val = Math.floor(Number(val));
                let max = Number(property.total_tokens || property.totalTokens) > 0 ? Number(property.total_tokens || property.totalTokens) : 1;
                if (val > max) val = max;
                handleInputChange("amount", val);
              }}
            />
            <small className="text-muted">
              Máximo disponível:{" "}
              {(
                Number(property.total_tokens || property.totalTokens) || 0
              ).toLocaleString("pt-BR")}{" "}
              tokens
            </small>
          </div>
          <div className="bg-light rounded-3 p-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Valor unitário:</span>
              <span className="fw-semibold">
                R${" "}
                {valorUnitarioFinal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal:</span>
              <span className="fw-semibold">
                R${" "}
                {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                Taxa da plataforma ({property.taxaCompra}%):
              </span>
              <span className="fw-semibold">
                R${" "}
                {valorTaxa.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <span className="fw-bold text-success fs-5">Total:</span>
              <span className="fw-bold text-success fs-5">
                R${" "}
                {totalComTaxa.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
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
                R${" "}
                {totalComTaxa.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Retorno estimado (12 meses):</span>
              <span className="fw-semibold text-success">
                R${" "}
                {(totalComTaxa * 1.12).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Lucro estimado:</span>
              <span className="fw-bold text-success">
                R${" "}
                {(totalComTaxa * 0.12).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <div className="alert alert-info">
            <small>
              <strong>Importante:</strong> Os valores apresentados são
              estimativas baseadas na rentabilidade projetada e não constituem
              garantia de retorno.
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function PropertyCheckout({ property }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: property?.amount ? Number(property.amount) : 1,
    valorUnitario: property?.valorUnitario ? Number(property.valorUnitario) : 0,
    paymentMethod: "credit_card",
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const user = getUserIdFromToken();

  useEffect(() => {
    if (property) {
      setFormData((prev) => ({
        ...prev,
        amount:
          property.total_tokens || property.totalTokens
            ? Math.min(
                prev.amount,
                Number(property.total_tokens || property.totalTokens) || 1
              )
            : prev.amount,
        valorUnitario: property.valorUnitario
          ? Number(property.valorUnitario)
          : prev.valorUnitario,
      }));
    }
  }, [property]);

  if (!property)
    return <div className="p-5 text-center">Imóvel não encontrado.</div>;

  const valorUnitarioFinal =
    formData.valorUnitario || Number(property.valorUnitario) || 0;
  const total = formData.amount * valorUnitarioFinal;
  const valorTaxa = total * ((Number(property.taxaCompra) || 0) / 100);
  const totalComTaxa = total + valorTaxa;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const payload = {
      id_investidor: user?.id || user?.id_investidor || 1,
      id_imovel: property.id || property.id_imovel || 1,
      qtd_tokens: formData.amount,
      valor_unitario: valorUnitarioFinal,
      data_compra: new Date().toISOString().slice(0, 10),
      origem: "plataforma",
      status: "ativo"
    };
    const toastId = toast.loading("Finalizando compra...");
    try {
      await postInvestmentsPurchase(payload);
      toast.update(toastId, {
        render: "Compra realizada com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 4000
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao realizar compra. Tente novamente.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
      console.error("Erro ao realizar compra:", error);
    }
  };

  const stepsModel = [
    { label: "Revisão", active: currentStep === 1 },
    { label: "Resumo da compra", active: currentStep === 2 },
    { label: "Pagamento", active: currentStep === 3 },
  ];



  return (
    <div className="container-fluid py-5">
      <div className="">
        <Steps model={stepsModel} />

        {currentStep === 1 && (
          <Review
            property={property}
            formData={formData}
            handleInputChange={handleInputChange}
            valorUnitarioFinal={valorUnitarioFinal}
            total={total}
            valorTaxa={valorTaxa}
            totalComTaxa={totalComTaxa}
          />
        )}
        {currentStep === 2 && (
          <ConfirmPayment
        
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        {currentStep === 3 && <CheckoutPix formData={formData} />}

        <div className="d-flex justify-content-between mt-5">
          {currentStep > 1 && (
            <button
              className="btn btn-outline-secondary px-4"
              onClick={prevStep}
            >
              <FaArrowLeft className="me-2" />
              Voltar
            </button>
          )}
        {currentStep < 3 ? (
            <button
              className="btn btn-dark px-4"
              onClick={nextStep}
              disabled={
                (formData.amount === "" || Number(formData.amount) < 1) ||
                (currentStep === 2 && (!formData.acceptTerms || !formData.acceptPrivacy))
              }
            >
              {currentStep === 2 ? "Confirmar e Pagar" : "Continuar"}
              <i className="fa fa-arrow-right ms-2"></i>
            </button>
          ) : (
            <button className="btn btn-dark px-4" onClick={handleSubmit}>
              <FaLock className="me-2" />
              Finalizar Compra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
