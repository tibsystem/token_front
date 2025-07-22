import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { FaImage, FaTrashAlt, FaFileAlt } from "react-icons/fa";
import Steps from "@/components/Tab/Step";
import PropertySummary from "@/components/Properties/PropertySummary";
import CustomModal from "@/components/modal/Modal";
import { toast } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";

const steps = [
  { label: "Dados Básicos" },
  { label: "Dados Financeiros" },
  { label: "Documentos da Propriedade" },
  { label: "Tokenizar" },
];

const ModalEditProperty = forwardRef(({
  showEditModal,
  setShowEditModal,
  handleSaveChanges,
  isSubmitting,
  editFormData,
  setEditFormData,
  handleInputChange,
  optionsSmartContract,
  optionsRaiser,
  Imagens = [],
  Attachments = [] 
}, ref) => {
  const [attachedFiles, setAttachedFiles] = useState([]); 
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]);

  useEffect(() => {
    if (Attachments.length > 0 && showEditModal) {
      setAttachedFiles(
        Attachments.filter(doc => !removedAttachmentIds.includes(doc.id)).map(doc => ({
          id: doc.id,
          url: doc.path,
          name: doc.name,
          size: doc.size,
          description: doc.description || "",
          isNew: false
        }))
      );
    }
    if (!showEditModal) {
      setRemovedAttachmentIds([]);
    }
  }, [Attachments, showEditModal]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.warning("Apenas arquivos PDF, DOC e DOCX são permitidos");
      return;
    }
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.warning("Cada arquivo deve ter no máximo 5MB");
      return;
    }
    files.forEach((file) => {
      setAttachedFiles((prev) => [
        ...prev,
        {
          file,
          name: file.name,
          size: file.size,
          description: "",
          isNew: true
        }
      ]);
    });
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => {
      const doc = prev[index];
      if (doc.id) setRemovedAttachmentIds((ids) => [...ids, doc.id]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleFileDescriptionChange = (index, value) => {
    setAttachedFiles((prev) => prev.map((doc, i) => i === index ? { ...doc, description: value } : doc));
  };
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
    const { isDarkMode } = useDarkMode();
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.warning("Máximo 5 imagens permitidas");
      return;
    }
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.warning("Apenas arquivos JPEG, PNG e WEBP são permitidos");
      return;
    }
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.warning("Cada imagem deve ter no máximo 5MB");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          {
            file: file,
            url: e.target.result,
            name: file.name,
            isNew: true
          },
        ]);
        setSelectedImages((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const img = prev[index];
      if (img.id) setRemovedImageIds((ids) => [...ids, img.id]);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const stepsModel = steps.map((step, idx) => ({
    ...step,
    active: idx === currentStep,
  }));


  useEffect(() => {
    if (Imagens.length > 0 && showEditModal) {
      setImagePreviews([
        ...Imagens.filter(img => !removedImageIds.includes(img.id)),
      ]);
      setSelectedImages([]);
    }
    if (!showEditModal) {
      setRemovedImageIds([]);
    }
  }, [Imagens, showEditModal]);

  const getImagensParaEnvio = async () => {
    const novas = await Promise.all(
      imagePreviews
        .filter(img => img.isNew)
        .map(async img => {
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(img.file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
    );
    return {
      novas, 
      removidas: removedImageIds 
    };
  };

  useImperativeHandle(ref, () => ({
    getImagensParaEnvio
  }));


  return (
    <CustomModal
      id="editPropertyModal"
      title="Editar Propriedade"
      show={showEditModal}
      onCancel={() => setShowEditModal(false)}
      size="lg"
      isSubmitting={isSubmitting}
      hideFooter={true}
    >
      <Steps model={stepsModel} />
      <form>
        {currentStep === 0 && (
          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="title" className="form-label">
                Título
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
              />
            </div>
           
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={editFormData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="total_value" className="form-label">
                Valor Total
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="total_value"
                name="total_value"
                value={editFormData.total_value}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="total_tokens" className="form-label">
                Total de Tokens
              </label>
              <input
                type="number"
                className="form-control"
                id="total_tokens"
                name="total_tokens"
                value={editFormData.total_tokens}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-floating ">
                <select
                  className="form-select"
                  name="smart_contract_model_id"
                  id="smart_contract"
                  value={editFormData.smart_contract_model_id || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um contrato inteligente</option>
                  {optionsSmartContract.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="smart_contract">Smart Contract *</label>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-floating ">
                <select
                  className="form-select"
                  name="agent_id"
                  id="agent_id"
                  value={editFormData.agent_id || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um captador</option>
                  {optionsRaiser.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="agent_id">Capitador *</label>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="profitability"
                  name="profitability"
                  value={editFormData.profitability}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="profitability">Rentabilidade *</label>
              </div>
            </div>
          </div>
      
        )}
        {currentStep === 2 && (
          <>
            <div className="mb-3">
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <FaImage /> Imagens do Imóvel *
                </label>
                <div className="border border-dashed border-2 border-dark rounded-3 p-4">
                  <div className="text-center mb-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
                      style={{ cursor: "pointer" }}
                    >
                      <FaImage />
                      Selecionar Imagens (Máx. 5)
                    </label>
                    <small className="text-muted d-block mt-2">
                      Formatos aceitos: JPEG, PNG, WEBP (máx. 5MB cada)
                    </small>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="border-top pt-3">
                      <h6 className="mb-3 text-center">
                        Imagens Selecionadas ({imagePreviews.length}/5)
                      </h6>
                      <div className="row g-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-6">
                            <div className="position-relative">
                              {typeof preview.url === "string" && (
                                <img
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  className="img-fluid rounded-2 shadow-sm"
                                  style={{ height: "100px", width: "100%", objectFit: "cover" }}
                                  width={150}
                                  height={100}
                                />
                              )}
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center"
                                onClick={() => removeImage(index)}
                                title="Remover imagem"
                              >
                                <FaTrashAlt />
                              </button>
                              <div className="mt-1">
                                <small className="text-muted text-truncate d-block" title={preview.name}>
                                  {preview.name.length > 15 ? preview.name.substring(0, 15) + "..." : preview.name}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {imagePreviews.length === 0 && (
                    <div className="text-center text-muted py-3">
                      <FaImage size={40} className="mb-2 opacity-50" />
                      <p className="mb-0">Nenhuma imagem selecionada</p>
                      <small>Clique no botão acima para adicionar imagens</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label d-flex align-items-center gap-2">
                <FaFileAlt /> Arquivos Anexados do Imóvel *
              </label>
              <div className="border border-dashed border-2 border-dark rounded-3 p-4">
                <div className="text-center mb-3">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="d-none"
                    id="fileUpload"
                  />
                  <label
                    htmlFor="fileUpload"
                    className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
                    style={{ cursor: "pointer" }}
                  >
                    <FaFileAlt />
                    Selecionar Arquivos
                  </label>
                  <small className="text-muted d-block mt-2">
                    Formatos aceitos: PDF, DOC, DOCX (máx. 5MB cada)
                  </small>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="border-top pt-3">
                    <h6 className="mb-3 text-center">
                      Arquivos Anexados ({attachedFiles.length})
                    </h6>
                    <div className="row g-3">
                      {attachedFiles.map((attached, index) => (
                        <div key={index} className="col-12">
                          <div className="card border-0 bg-light">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <FaFileAlt className="text-dark" size={20} />
                                <div className="flex-grow-1">
                                  <small className="text-muted d-block fw-bold">
                                    {attached.name}
                                  </small>
                                  <small className="text-muted">
                                    {(attached.size / 1024 / 1024).toFixed(2)} MB
                                  </small>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                  onClick={() => removeAttachedFile(index)}
                                  title="Remover arquivo"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Descrição do arquivo"
                                  value={attached.description}
                                  onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                                  id={`description-${index}`}
                                />
                                <label htmlFor={`description-${index}`}>
                                  Descrição do arquivo
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attachedFiles.length === 0 && (
                  <div className="text-center text-muted py-3">
                    <FaFileAlt size={40} className="mb-2 opacity-50" />
                    <p className="mb-0">Nenhum arquivo anexado</p>
                    <small>Clique no botão acima para adicionar arquivos</small>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <div className="mb-3 row">
            <div className="col-md-6 mt-3">
                <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={editFormData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pendente</option>
                <option value="active">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="col-md-6">
                <div className="p-3 rounded-3 ">
          <h6 className="text-dark fs-5 mb-2 fw-bold">Selecione o nivel de Garantia</h6>
          <p className=" fs-6 mb-2 ">
            Esse investimento será classificado no <strong>Nível {editFormData.level_warrant || 1}</strong>
          </p>
          <div className="d-flex gap-2 align-items-end">
            {[1, 2, 3, 4, 5].map((nivel, idx) => {
              const coresGarantia = ["#e53935", "#f6c244", "#f6e244", "#4fc3f7", "#43a047"];
              const nivelAtual = Number(editFormData.level_warrant) || 1;
              return (
                <div
                  key={nivel}
                  className="text-center flex-fill"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleInputChange({ target: { name: "level_warrant", value: nivel } })}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: coresGarantia[idx],
                      opacity: nivel === nivelAtual ? 1 : 0.3,
                      fontWeight: "bold",
                      textDecoration: nivel === nivelAtual ? "underline" : "none",
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

            </div>
            <div className="col-md-12 mt-3">
            
              <label htmlFor="tokenize" className="form-label">
                Tokenizar Propriedade
              </label>
              <select
                className="form-select"
                id="tokenize"
                name="tokenize"
                value={editFormData.tokenize || ""}
                onChange={handleInputChange}
              >
                <option value="">Selecione uma opção</option>
                <option value="yes">Sim</option>
                <option value="no">Não</option>
              </select>
                {editFormData.tokenize === "yes" && (
                <div className="alert alert-warning mt-2" role="alert">
                  Atenção: Tokenizar a propriedade é uma ação <strong>irreversível</strong>. Confirme se deseja continuar.
                </div>
              )}

              </div>
              
            
           
          </div>
        )}
        <div className="d-flex gap-3 justify-content-end mt-4">
          {currentStep > 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Anterior
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              className="btn btn-success ms-auto d-flex align-items-center gap-2"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Próximo
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              type="button"
              className="btn btn-success ms-auto gap-3 d-flex align-items-center"
              onClick={async () => {
                await handleSaveChanges();
                setCurrentStep(0);
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
              <i className={isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-check'}></i>
            </button>
          )}
        </div>
      </form>
    </CustomModal>
  );
});

export default ModalEditProperty;