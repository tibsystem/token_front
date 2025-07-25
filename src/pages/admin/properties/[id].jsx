import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { toast } from "react-toastify";
// icons
import {
  FaCoins,
  FaUsers,
  FaCubes,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt,
  FaImage,
  FaBuilding,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBitcoin,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
//components
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomModal from "@/components/modal/Modal";
import ModalEditProperty from "@/components/Properties/edit/ModalEditProperty";

//services
import { getPropertyFinance } from "@/services/propertyFinance/getPropertyFinance";
import { getOnePropertie } from "@/services/properties/getOnePropertie";
import { putPropertie } from "@/services/properties/putPropertie";
import { deletePropertie } from "@/services/properties/deletePropertie";
// hooks
import UseOptionsSelect from "@/hooks/UseOptionsSelect";
import useDarkMode from "@/hooks/useDarkMode";

export default function propertyAdminFinanceiro() {
  const router = useRouter();
  const { id } = router.query;
  const [dados, setDados] = useState(null);
  const [aba, setAba] = useState("financeiro");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isDarkMode } = useDarkMode();

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    total_value: "",
    total_tokens: "",
    status: "",
  });

  const modalEditRef = useRef(null);
  const { optionsSmartContract, optionsRaiser } = UseOptionsSelect();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [responseFinance, responseProperty] = await Promise.all([
          getPropertyFinance(id),
          getOnePropertie(id),
        ]);
        setDados({ ...responseFinance, property: responseProperty });
      } catch (err) {
        if (err?.response?.status === 401) {
          setError(
            "Sua sessão expirou ou você não tem permissão para acessar os dados financeiros deste imóvel. Faça login novamente se necessário."
          );
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("admin_token");
          router.push("/admin/login");
        } else {
          setError("Erro ao carregar dados do imóvel.");
          console.error("Erro ao carregar dados do imóvel:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const carousel = document.querySelector("#propertyCarousel");
    if (!carousel) return;

    const handleSlide = (event) => {
      const newIndex = parseInt(event.to);
      if (!isNaN(newIndex)) {
        setActiveImageIndex(newIndex);
      }
    };

    const handleSliding = (event) => {
      const newIndex = parseInt(event.to);
      if (!isNaN(newIndex)) {
        setActiveImageIndex(newIndex);
      }
    };

    carousel.addEventListener("slid.bs.carousel", handleSlide);
    carousel.addEventListener("slide.bs.carousel", handleSliding);

    return () => {
      carousel.removeEventListener("slid.bs.carousel", handleSlide);
      carousel.removeEventListener("slide.bs.carousel", handleSliding);
    };
  }, []);

  const handleEditClick = () => {
    if (dados?.property) {
      setEditFormData({
        title: dados.property.title || "",
        description: dados.property.description || "",
        location: dados.property.location || "",
        total_value: dados.property.total_value || "",
        total_tokens: dados.property.total_tokens || "",
        status: dados.property.status || "",
        smart_contract_model_id: dados.property.smart_contract_model_id || "",
        agent_id: dados.property.agent_id || "",
        profitability: dados.property.profitability || "",
        files: dados.property.photos || [],
        level_warrant: dados.property.level_warrant || 1,
        tokenization_date: dados.property.tokenization_date || "",
        location: 'franca-sp'
      });
      console.log("Dados da propriedade para edição:", dados.property);
      setShowEditModal(true);
    }
  };
  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsSubmitting(true);
    const toastId = toast.loading("Excluindo propriedade...");
    try {
      await deletePropertie(id);
      toast.update(toastId, {
        render: "Propriedade excluída com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      router.push("/admin/properties");
    } catch (err) {
      console.error("Erro ao excluir propriedade:", err);
      toast.update(toastId, {
        render: "Erro ao excluir propriedade. Tente novamente.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Salvando alterações...");
    try {
      let imagensParaEnvio = { novas: [], removidas: [] };
      if (
        modalEditRef.current &&
        typeof modalEditRef.current.getImagensParaEnvio === "function"
      ) {
        imagensParaEnvio = await modalEditRef.current.getImagensParaEnvio();
      }

      const payload = {
        ...editFormData,
        files: imagensParaEnvio.novas,
        imagensRemovidas: Array.isArray(imagensParaEnvio.removidas)
          ? imagensParaEnvio.removidas
          : [],
      };

      await putPropertie(id, payload);

      const [responseFinance, responseProperty] = await Promise.all([
        getPropertyFinance(id),
        getOnePropertie(id),
      ]);
      setDados({ ...responseFinance, property: responseProperty });

      setShowEditModal(false);
      toast.update(toastId, {
        render: "Propriedade atualizada com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Erro ao atualizar propriedade:", err);
      toast.update(toastId, {
        render: "Erro ao atualizar propriedade. Tente novamente.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageClick = (index) => {
    if (isTransitioning || index === activeImageIndex) return;

    setIsTransitioning(true);

    setActiveImageIndex(index);

    const carouselElement = document.querySelector("#propertyCarousel");
    let carousel = window.bootstrap?.Carousel?.getInstance(carouselElement);

    if (!carousel && carouselElement) {
      carousel = new window.bootstrap.Carousel(carouselElement);
    }

    if (carousel) {
      carousel.to(index);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleCarouselNavigation = (direction) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const carousel = window.bootstrap?.Carousel?.getInstance(
      document.querySelector("#propertyCarousel")
    );
    if (carousel) {
      if (direction === "prev") {
        carousel.prev();
      } else {
        carousel.next();
      }
    }

    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  if (loading) {
    return (
      
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImSpinner8
            className="fa fa-spin me-2 mb-2 text-dark"
            style={{ fontSize: 32 }}
          />
        </div>
      
    );
  }

  if (error) {
    return (
      
        <div className="flex min-h-screen bg-gray-50">
          <main className="flex-1 p-8 max-w-6xl mx-auto text-center">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <FaExclamationTriangle className="inline-block mr-2 text-2xl" />
              <strong className="font-bold">Erro!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </main>
        </div>
      
    );
  }

  if (!dados) {
    return (
      
        <div className="flex min-h-screen bg-gray-50">
          <main className="flex-1 p-8 max-w-6xl mx-auto text-center">
            <div
              className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <FaInfoCircle className="inline-block mr-2 text-2xl" />
              <strong className="font-bold">Informação:</strong>
              <span className="block sm:inline"> Dados não encontrados.</span>
            </div>
          </main>
        </div>
      
    );
  }

  const { property, resumo, investidores, investimentos, transacoes_p2p } =
    dados;

  return (
    
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Imóveis", path: "/admin/properties" },
              {
                label: `Detalhes do imóvel ${dados.property.title}`,
                path: null,
              },
            ]}
          />

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div></div>
              <div className="d-flex gap-2">
              
                {dados.property.status === "pending" && (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={handleEditClick}
                    >
                      <i className="fa fa-edit me-2"></i>
                      Editar Propriedade
                    </button>
                    <button
                      className="btn btn-danger "
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="fa fa-trash me-2"></i>
                      Excluir Propriedade
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {dados.property?.contract_address && (
                <a
                  href={`https://polygonscan.com/token/${dados.property.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge bg-warning-subtle text-secondary px-3 py-2 text-decoration-none d-inline-flex align-items-center"
                  title="Ver contrato no PolygonScan"
                >
                  <i className="fa fa-link me-1"></i> Contrato
                </a>
              )}
            </div>

            <div className="row mb-4">
              <div className="col-12 mb-3">
                <h4 className="text-dark">
                  Estatísticas da Propriedade: {dados.property.title}
                </h4>
                <p className="mb-4  mt-3 fs-6 text-dark fw-bold">
                  Rentabilidade: {dados.property.profitability}{" "}
                </p>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 70, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
        <FaBitcoin style={{ color: '#fff' }} />
      </div>
      <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Tokens Originais</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {dados.property.total_tokens_original}
          </span>
        </div>
        <div className="stats-desc" style={{ color: '#e0e7ff', fontSize: 12 }}>Total de tokens criados</div>
      </div>
    </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 70, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)' }}>
      <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
        <FaCoins style={{ color: '#fff' }} />
      </div>
      <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Tokens Vendidos</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {dados.property.total_tokens_original - dados.property.total_tokens}
          </span>
        </div>
        <div className="stats-desc" style={{ color: '#e0fff4', fontSize: 12 }}>Total vendido</div>
      </div>
    </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 70, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' }}>
      <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
        <FaCubes style={{ color: '#fff' }} />
      </div>
      <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Tokens Disponíveis</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {dados.property.total_tokens}
          </span>
        </div>
        <div className="stats-desc" style={{ color: '#f3e8ff', fontSize: 12 }}>Disponível para venda</div>
      </div>
    </div>
              </div>
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 70, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
      <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
        <FaUsers style={{ color: '#fff' }} />
      </div>
      <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Investidores Únicos</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {resumo?.investidores_unicos ?? 0}
          </span>
        </div>
        <div className="stats-desc" style={{ color: '#e0e0e0', fontSize: 12 }}>Total de investidores</div>
      </div>
    </div>
              </div>
            </div>

            {/* Abas de navegação */}
            {/* <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${aba === 'financeiro' ? 'active' : ''}`} 
            onClick={() => setAba('financeiro')}
          >
            Investimentos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${aba === 'investidores' ? 'active' : ''}`} 
            onClick={() => setAba('investidores')}
          >
            Investidores
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${aba === 'p2p' ? 'active' : ''}`} 
            onClick={() => setAba('p2p')}
          >
            Transações P2P
          </button>
        </li>
      </ul>

      <div className="panel panel-inverse">
        <div className="panel-body">
          
          {aba === 'financeiro' && (
            <div>
              <h4 className="mb-3">Investimentos</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Investidor</th>
                      <th>Qtd. Tokens</th>
                      <th>Valor Unitário</th>
                      <th>Origem</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investimentos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-muted">Nenhum investimento encontrado.</td>
                      </tr>
                    ) : (
                      investimentos.map((inv, idx) => (
                        <tr key={idx}>
                          <td>{inv.data_compra}</td>
                          <td>{inv.nome_investidor}</td>
                          <td>{inv.qtd_tokens}</td>
                          <td>R$ {Number(inv.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td>{inv.origem}</td>
                          <td>
                            <span className={`badge ${inv.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {aba === 'investidores' && (
            <div>
              <h4 className="mb-3">Investidores do Imóvel</h4>
              <div className="row g-4">
                {investidores.length === 0 ? (
                  <div className="col-12 text-muted">Nenhum investidor encontrado.</div>
                ) : (
                  investidores.map((inv) => (
                    <div key={inv.id_investidor} className="col-lg-4 col-md-6">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <FaUser className="text-dark mb-2" size={40} />
                          <h6 className="card-title">{inv.nome}</h6>
                          <p className="text-muted small">ID: {inv.id_investidor}</p>
                          <span className="badge bg-dark mb-2">Tokens: {inv.qtd_tokens}</span>
                          <p className="text-muted small">{inv.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {aba === 'p2p' && (
            <div>
              <h4 className="mb-3">Transações P2P</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Investidor</th>
                      <th>Qtd. Tokens</th>
                      <th>Valor Unitário</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoes_p2p.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted">Nenhuma transação P2P encontrada.</td>
                      </tr>
                    ) : (
                      transacoes_p2p.map((t, idx) => (
                        <tr key={idx}>
                          <td>{t.data}</td>
                          <td>{t.nome_investidor || t.id_investidor}</td>
                          <td>{t.qtd_tokens}</td>
                          <td>R$ {Number(t.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td>
                            <span className={`badge ${t.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div> */}
          </div>

          <div className="card border-0 shadow-sm p-4 mb-5">
            <div className="row mb-4">
              <div className="col-lg-8">
                <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                  <FaImage className="text-dark" /> Galeria de Imagens
                </h5>
                <div className="panel panel-inverse h-100">
                  <div className="panel-body p-3">
                    <div
                      id="propertyCarousel"
                      className="carousel slide mb-3"
                      data-bs-ride="carousel"
                      style={{ maxHeight: "450px", overflow: "hidden" }}
                    >
                      <div className="carousel-inner rounded-3 shadow-sm">
                        {(dados.property.photos &&
                        dados.property.photos.length > 0
                          ? dados.property.photos
                          : []
                        ).map((photo, idx) => (
                          <div
                            className={`carousel-item${
                              idx === 0 ? " active" : ""
                            }`}
                            key={photo.id || idx}
                            style={{ height: "450px" }}
                          >
                            <Image
                              src={photo.path}
                              alt={`Imagem da propriedade ${dados.property.title}`}
                              className="d-block w-100 h-100 object-fit-cover"
                              width={800}
                              height={450}
                              onError={(e) => {
                                e.target.src = "/assets/img/theme/default.jpg";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {dados.property.photos &&
                        dados.property.photos.length > 1 && (
                          <>
                            <button
                              className="carousel-control-prev"
                              type="button"
                              data-bs-target="#propertyCarousel"
                              data-bs-slide="prev"
                              onClick={() => handleCarouselNavigation("prev")}
                              disabled={isTransitioning}
                            >
                              <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">Anterior</span>
                            </button>
                            <button
                              className="carousel-control-next"
                              type="button"
                              data-bs-target="#propertyCarousel"
                              data-bs-slide="next"
                              onClick={() => handleCarouselNavigation("next")}
                              disabled={isTransitioning}
                            >
                              <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">Próxima</span>
                            </button>
                          </>
                        )}
                    </div>

                    {dados.property.photos &&
                      dados.property.photos.length > 1 && (
                        <div className="mt-3">
                          <div className="d-flex gap-2 overflow-auto pb-2">
                            {(dados.property.photos || []).map((img, index) => (
                              <div
                                key={img.id || index}
                                className="flex-shrink-0 position-relative"
                              >
                                <Image
                                  src={img.path}
                                  alt={`Imagem ${index + 1}`}
                                  className={`rounded-2 object-fit-cover transition-all ${
                                    activeImageIndex === index
                                      ? "border-3 border-dark shadow-lg brightness-110"
                                      : isTransitioning
                                      ? "border border-secondary brightness-50 cursor-not-allowed"
                                      : "border border-light hover:border-dark cursor-pointer hover:shadow-md brightness-75 hover:brightness-90"
                                  }`}
                                  style={{
                                    width: "80px",
                                    height: "60px",
                                    cursor: isTransitioning
                                      ? "not-allowed"
                                      : "pointer",
                                    filter:
                                      activeImageIndex === index
                                        ? "brightness(1.1) contrast(1.1)"
                                        : isTransitioning
                                        ? "brightness(0.5) grayscale(50%)"
                                        : "brightness(0.75)",
                                    transform:
                                      activeImageIndex === index
                                        ? "scale(1.05)"
                                        : "scale(1)",
                                    transition: "all 0.3s ease",
                                  }}
                                  width={80}
                                  height={60}
                                  onClick={() =>
                                    !isTransitioning && handleImageClick(index)
                                  }
                                  onError={(e) => {
                                    e.target.src =
                                      "/assets/img/theme/default.jpg";
                                  }}
                                />
                                {activeImageIndex === index && (
                                  <div
                                    className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex align-items-center justify-content-center"
                                    style={{
                                      background: "rgba(0, 123, 255, 0.2)",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <i className="fa fa-check-circle text-dark fs-5 bg-white rounded-circle"></i>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                  <FaBuilding className="text-dark" /> Detalhes da Propriedade
                </h5>
                <div className="panel panel-inverse h-100">
                  <div className="panel-body">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <FaCheckCircle
                          className={
                            dados.property.status === "ativo"
                              ? "text-success"
                              : "text-muted"
                          }
                        />
                        <span className="text-muted">Status:</span>
                        <span
                          className={
                            dados.property.status === "active"
                              ? "text-success fw-semibold"
                              : "text-muted fw-semibold"
                          }
                        >
                          {dados.property.status === "pending"
                            ? "PENDENTE"
                            : dados.property.status === "active"
                            ? "Ativo"
                            : dados.property.status === "inactive"
                            ? "Inativo"
                            : dados.property.status === "sold"
                            ? "Vendido"
                            : "Desconhecido"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaCoins className="text-warning" />
                        <span className="text-muted">Valor Total:</span>
                        <span className="fw-semibold">
                          R${" "}
                          {Number(dados.property.total_value).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 }
                          )}
                        </span>
                      </div>

                      <div className="p-3 bg-light rounded-3 mt-3">
                        <h6 className="text-muted mb-2 fw-medium">
                          Nível de Garantia
                        </h6>
                        <p className="text-muted mb-2 small">
                          Esse investimento está classificado no{" "}
                          <strong>
                            Nível {dados.property.level_warrant || 1}
                          </strong>
                        </p>
                        <div className="d-flex gap-2 align-items-end">
                          {[1, 2, 3, 4, 5].map((nivel, idx) => {
                            const coresGarantia = [
                              "#e53935",
                              "#f6c244",
                              "#f6e244",
                              "#4fc3f7",
                              "#43a047",
                            ];
                            const nivelAtual =
                              Number(dados.property.level_warrant) || 1;
                            return (
                              <div
                                key={nivel}
                                className="text-center flex-fill"
                              >
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: coresGarantia[idx],
                                    opacity: nivel === nivelAtual ? 1 : 0.3,
                                    fontWeight: "bold",
                                  }}
                                >
                                  Nível {nivel}
                                </div>
                                <div
                                  className="rounded-pill mt-1"
                                  style={{
                                    height: 6,
                                    backgroundColor: coresGarantia[idx],
                                    opacity: nivel === nivelAtual ? 1 : 0.3,
                                  }}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {dados.property.description && (
                        <div className="p-3 bg-light rounded-3">
                          <h6 className="text-muted mb-2 fw-medium d-flex align-items-center gap-2">
                            <i className="fa fa-align-left"></i> Descrição
                          </h6>
                          <p className="small text-muted mb-0 lh-base">
                            {dados.property.description}
                          </p>
                        </div>
                      )}

                      {dados.property?.contract_address && (
                        <div className="text-center">
                          <a
                            href={`https://polygonscan.com/token/${dados.property.contract_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2"
                            title="Ver contrato no PolygonScan"
                          >
                            <i className="fa fa-link"></i>
                            Ver Contrato na Blockchain
                          </a>
                        </div>
                      )}

                      {dados.property.tokenization_date && (
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                          <div className="d-flex align-items-center gap-2">
                            <i className="fa fa-calendar text-dark"></i>
                            <span className="text-muted fw-medium">
                              Data de Tokenização
                            </span>
                          </div>
                          <span className="fw-semibold text-dark">
                            {new Date(
                              dados.property.tokenization_date
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Seção de Documentos/Anexos */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="fa fa-file-text text-dark"></i> Documentos e
                  Anexos
                </h5>
                <div className="panel panel-inverse">
                  <div className="panel-body">
                    {dados.property.attachments &&
                    dados.property.attachments.length > 0 ? (
                      <div className="row g-3">
                        {dados.property.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="col-12 col-sm-6 col-md-6 col-lg-4 d-flex"
                          >
                            <div className="card border h-100 w-100">
                              <div className="card-body d-flex align-items-center flex-wrap flex-md-nowrap">
                                <div className="me-3 mb-2 mb-md-0">
                                  <i
                                    className="fa fa-file-pdf text-danger"
                                    style={{ fontSize: "2rem" }}
                                  ></i>
                                </div>
                                <div className="flex-grow-1 min-w-0">
                                  <h6
                                    className="card-title mb-1 text-truncate"
                                    title={attachment.name}
                                  >
                                    {attachment.name}
                                  </h6>
                                  <small className="text-muted">
                                    {(attachment.size / 1024).toFixed(1)} KB
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    {new Date(
                                      attachment.created_at
                                    ).toLocaleDateString("pt-BR")}
                                  </small>
                                </div>
                                <div className="ms-auto">
                                  <a
                                    href={attachment.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"}`}
                                    title="Baixar documento"
                                  >
                                    <i className="fa fa-download"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i
                          className="fa fa-file-text text-muted mb-3"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <p className="text-muted mb-0">
                          Nenhum documento anexado a esta propriedade.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="row">
              <div className="col-12">
                <div className="panel panel-inverse">
                  <div className="panel-body">
                    <h5 className="mb-3 fw-bold text-dark">
                      Progresso do Investimento
                    </h5>
                    <div className="d-flex justify-content-between text-muted small mb-2">
                      <span>
                        R${" "}
                        {(
                          (property.total_tokens_original -
                            property.total_tokens) *
                          (property.total_value /
                            property.total_tokens_original)
                        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span>
                        R${" "}
                        {Number(property.total_value).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        Total
                      </span>
                    </div>
                    <div className="progress mb-3" style={{ height: 12 }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: `${
                            ((property.total_tokens_original -
                              property.total_tokens) /
                              property.total_tokens_original) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="row text-center">
                      <div className="col-md-3">
                        <div className="fw-semibold text-dark">
                          {(
                            ((property.total_tokens_original -
                              property.total_tokens) /
                              property.total_tokens_original) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                        <small className="text-muted">Vendido</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-semibold text-success">
                          R${" "}
                          {(
                            (property.total_tokens_original -
                              property.total_tokens) *
                            (property.total_value /
                              property.total_tokens_original)
                          ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <small className="text-muted">Arrecadado</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-semibold text-info">
                          R${" "}
                          {(
                            property.total_tokens *
                            (property.total_value /
                              property.total_tokens_original)
                          ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <small className="text-muted">Disponível</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-semibold text-dark">
                          {resumo?.investidores_unicos}
                        </div>
                        <small className="text-muted">Investidores</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <ModalEditProperty
          ref={modalEditRef}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          handleSaveChanges={handleSaveChanges}
          isSubmitting={isSubmitting}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleInputChange={handleInputChange}
          optionsSmartContract={optionsSmartContract}
          optionsRaiser={optionsRaiser}
          Imagens={(dados.property.photos || []).map((photo) => ({
            url: photo.path,
            name: photo.name || photo.path.split("/").pop() || "imagem",
            id: photo.id,
          }))}
          Attachments={(dados.property.attachments || []).map((att) => ({
            id: att.id,
            name: att.name,
            path: att.path,
            size: att.size,
            description: att.description || "",
          }))}
        />
        <CustomModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          show={showDeleteModal}
          title={`Excluir Propriedade: ${
            dados?.property?.title || "Propriedade"
          }`}
          confirmText="Excluir"
          cancelText="Cancelar"
          confirmVariant="danger"
          size="md"
          isSubmitting={isSubmitting}
        >
          <p>
            Tem certeza que deseja excluir a propriedade{" "}
            <strong>"{dados?.property?.title}"</strong>?
          </p>
          <p className="text-muted">Esta ação não pode ser desfeita.</p>
        </CustomModal>
      </div>
    
  );
}