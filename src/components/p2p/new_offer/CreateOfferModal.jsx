
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useMemo } from "react";
//services
import { postP2pListings } from "@/services/p2p/postP2pListings";
import { getPropertiesTokens } from "@/services/properties/getPropertiesTokens";
//utils
import { getUserIdFromToken } from "@/utils/auth";
//hooks
import useDarkMode from "@/hooks/useDarkMode";

const formatCurrency = (value) => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  const numberValue = parseInt(numericValue) / 100;
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function CreateOfferModal({ imovel, onClose, onSuccess, getUserIdFromToken }) {
  const [qtdVenda, setQtdVenda] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { isDarkMode } = useDarkMode();

  
  // const {data, error, isLoading} = UseQuery({
  //   queryKey: ['propertyTokens', imovel?.id],
  //   queryFn: () => getPropertiesTokens(imovel?.id),
  //   enabled: !!imovel?.id,
  //   onSuccess: (data) => {
  //     console.log('getPropertiesTokens:', data);
  //   },
  //   onError: (err) => {
  //     console.error('Erro getPropertiesTokens:', err);
  //     toast.error("Erro ao carregar tokens do imóvel.");
  //   }
  // });

  const validateForm = useCallback(() => {
    const errors = {};
    const qtd = Number(qtdVenda);
    if (!qtdVenda || qtd < 1) {
      errors.qtdVenda = "Quantidade deve ser maior que 0";
    } else if (qtd > (imovel?.qtd_tokens || 0)) {
      errors.qtdVenda = `Máximo ${imovel?.qtd_tokens || 0} tokens`;
    }

    const preco = parseFloat(precoVenda.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    if (!precoVenda || preco <= 0) {
      errors.precoVenda = "Preço deve ser maior que R$ 0,00";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [qtdVenda, precoVenda, imovel?.qtd_tokens]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros do formulário.");
      return;
    }

    setSubmitting(true);
    try {
      const vendedor_id = getUserIdFromToken();
      if (!vendedor_id) {
          toast.error("Erro de autenticação. Faça login novamente.");
          return;
      }

      const precoNumerico = precoVenda.replace(/[^\d,]/g, "").replace(",", ".");
      const payload = {
        vendedor_id,
        id_imovel: imovel?.id,
        qtd_tokens: Number(qtdVenda),
        valor_unitario: Number(precoNumerico),
      };

      await postP2pListings(payload);
      toast.success("Oferta criada com sucesso!");
      onSuccess(); 
    } catch (error) {
      console.error("Erro ao criar oferta:", error);
      toast.error(error?.response?.data?.message || "Erro ao criar oferta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const valorTotal = useMemo(() => {
    const preco = parseFloat(precoVenda.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    return (Number(qtdVenda) * preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [qtdVenda, precoVenda]);
  
  const isFormValid = Object.keys(validationErrors).length === 0 && qtdVenda && precoVenda;

  return (
     <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className={`modal-header ${isDarkMode ? 'bg-dark text-white' : 'bg-dark text-light'}`}>
            <h5 className="modal-title d-flex align-items-center">
              <i className="fa fa-store me-2"></i> Criar Oferta de Venda
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body bg-light ">
              <div className="row mb-4">
                 <div className="col-md-4">
                    <img
                        src={imovel?.imagem_url || "/assets/img/default-property.jpg"}
                        alt={imovel?.titulo}
                        className="img-fluid rounded"
                        style={{ height: 120, width: "100%", objectFit: "cover" }}
                    />
                 </div>
                 <div className="col-md-8">
                     <h6 className="fw-bold text-primary mb-2">{imovel?.titulo}</h6>
                     <p className="text-muted small mb-2">{imovel?.descricao}</p>
                     <div className="row g-2">
                        <div className="col-6">
                            <div className="bg-light rounded p-2 text-center">
                                <div className="fw-bold text-success">{imovel?.qtd_tokens || 0}</div>
                                <small className="text-muted">Tokens disponíveis</small>
                            </div>
                        </div>
                        <div className="col-6">
                             <div className="bg-light rounded p-2 text-center">
                                <div className="fw-bold text-primary">
                                    {(imovel?.valor_unitario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </div>
                                <small className="text-muted">Valor unitário</small>
                            </div>
                        </div>
                     </div>
                 </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                        <i className="fa fa-cubes me-2 text-success"></i>
                        Quantidade de tokens
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={imovel?.qtd_tokens || 0}
                      value={qtdVenda}
                      onChange={(e) => setQtdVenda(e.target.value)}
                      onBlur={validateForm}
                      className={`form-control form-control-lg ${validationErrors.qtdVenda ? "is-invalid" : ""}`}
                      placeholder="Ex: 10"
                      required
                    />
                    {validationErrors.qtdVenda ? (
                        <div className="invalid-feedback">{validationErrors.qtdVenda}</div>
                    ) : (
                        <div className="form-text">Máximo: {imovel?.qtd_tokens || 0} tokens</div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                        <i className="fa fa-coins me-2 text-warning"></i>
                        Preço por token
                    </label>
                    <input
                      type="text"
                      value={precoVenda}
                      onChange={(e) => setPrecoVenda(formatCurrency(e.target.value))}
                      onBlur={validateForm}
                      className={`form-control form-control-lg ${validationErrors.precoVenda ? "is-invalid" : ""}`}
                      placeholder="R$ 0,00"
                      required
                    />
                    {validationErrors.precoVenda ? (
                        <div className="invalid-feedback">{validationErrors.precoVenda}</div>
                    ) : (
                        <div className="form-text">
                            Valor sugerido: {(imovel?.valor_unitario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                    )}
                </div>
              </div>

              {isFormValid && (
                  <div className="alert alert-info">
                      <strong>Resumo:</strong> {qtdVenda} tokens × {precoVenda} = <span className="fw-bold text-primary">{valorTotal}</span>
                  </div>
              )}
              <div className="alert alert-warning small">
                <strong>Importante:</strong> Os tokens ofertados ficarão bloqueados até a venda ou o cancelamento da oferta.
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || !isFormValid}>
                {submitting ? (
                    <>
                        <span className="spinner-border spinner-border-xs me-2" style={{width: '1rem', height: '1rem', minWidth: '1rem', minHeight: '1rem'}}></span>
                        Criando...
                    </>
                ) : (
                    <><i className="fa fa-check me-2"></i>Criar Oferta</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}