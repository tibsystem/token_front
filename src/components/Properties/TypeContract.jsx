 import ToggleInput from "@/components/input/ToggleInput";
import { useState } from "react";
import { FaFileAlt,FaTimes } from "react-icons/fa";

 export default function TypeContract({
    tipoContrato,
  setTipoContrato,
  rentabilidade,
  setRentabilidade,
  form,
  setForm,
  attachedFiles,
  handleFileChange,
  handleFileDescriptionChange,
  removeAttachedFile,
  isDarkMode,
  handleChange,
  handlePercentChange,
  handleRentabilidadeChange,
  
 }) {
    const handleTipoContratoChange = (tipo) => {
    setTipoContrato(tipo);
    setRentabilidade(""); 
    setForm((prev) => ({
      ...prev,
      periodo_contrato: "",
      percentual_lucro: "",
      indicador: "",
      juros: "",
      participacao: "",
      meta_captacao: "",
      expectativa_retorno: "",
      prazo_retorno: "",
    }));
  };


  return (
      <>
                    <div className="d-flex justify-content-center mt-5 gap-3 mb-4">
                      <ToggleInput
                        onLabel="Aluguel"
                        offLabel="Aluguel"
                        onIcon="fas fa-check"
                        offIcon="bi bi-x-lg"
                        checked={tipoContrato === "aluguel"}
                        onChange={() => handleTipoContratoChange("aluguel")}
                      />
                      <ToggleInput
                        onLabel="Equity"
                        offLabel="Equity"
                        onIcon="fas fa-check"
                        offIcon="bi bi-x-lg"
                        checked={tipoContrato === "equity"}
                        onChange={() => handleTipoContratoChange("equity")}
                      />
                     
                    </div>
                    {tipoContrato === "aluguel" && (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Rentabilidade *</label>
                            <div className="d-flex gap-3">
                              <ToggleInput
                                onLabel="Indicador + Juros"
                                offLabel="Indicador + Juros"
                                onIcon="fas fa-check"
                                offIcon="bi bi-x-lg"
                                checked={rentabilidade === "indicador_juros"}
                                onChange={() =>
                                  handleRentabilidadeChange("indicador_juros")
                                }
                              />
                              <ToggleInput
                                onLabel="Juros"
                                offLabel="Juros"
                                onIcon="fas fa-check"
                                offIcon="bi bi-x-lg"
                                checked={rentabilidade === "juros"}
                                onChange={() => handleRentabilidadeChange("juros")}
                              />
                            </div>
                            {rentabilidade === "indicador_juros" && (
                              <div className="row mt-2">
                                <div className="col-6">
                                  <select
                                    className="form-select"
                                    name="indicador"
                                    value={form.indicador || ""}
                                    onChange={(e) =>
                                      setForm((prev) => ({
                                        ...prev,
                                        indicador: e.target.value,
                                      }))
                                    }
                                    required
                                  >
                                    <option value="">Selecione o indicador</option>
                                    <option value="CDI">CDI</option>
                                    <option value="IPCA">IPCA</option>
                                    <option value="IGPM">IGPM</option>
                                    <option value="TR">TR</option>
                                  </select>
                                </div>
                                <div className="col-6">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="juros"
                                    placeholder="Juros (%)"
                                    value={form.juros || ""}
                                    onChange={handlePercentChange}
                                    required
                                  />
                                </div>
                              </div>
                            )}
                            {rentabilidade === "juros" && (
                              <input
                                type="number"
                                className="form-control mt-2"
                                name="juros"
                                placeholder="Juros (%)"
                                value={form.juros || ""}
                                onChange={handlePercentChange}
    
                                required
                              />
                            )}
                          </div>
    
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="periodo_contrato"
                              id="periodo_contrato"
                              placeholder="Período do contrato"
                              value={form.periodo_contrato || ""}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="periodo_contrato">
                              Período do contrato *
                            </label>
                          </div>
    
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="percentual_lucro"
                              id="percentual_lucro"
                              placeholder="Percentual de distribuição de lucros"
                              value={form.percentual_lucro || ""}
                              onChange={handlePercentChange}
                                required
                            />
                            <label htmlFor="percentual_lucro">
                              Percentual de distribuição de lucros *
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label d-flex align-items-center gap-2">
                              <FaFileAlt /> Smart Contract *
                            </label>
                            <div className="border border-dashed border-2 border-dark rounded-3 p-4">
                              <div className="text-center mb-3">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange} 
                                  className="d-none"
                                  id="smartContractUpload"
                                />
                                <label
                                  htmlFor="smartContractUpload"
                                  className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
                                  style={{ cursor: "pointer" }}
                                >
                                  <FaFileAlt />
                                  Selecionar Smart Contract
                                </label>
                                <small className="text-muted d-block mt-2">
                                  Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                                </small>
                              </div>
    
                              {attachedFiles.length > 0 && (
                                <div className="border-top pt-3">
                                  <h6 className="mb-3 text-center">
                                    Smart Contract Selecionado (
                                    {attachedFiles.length})
                                  </h6>
                                  <div className="row g-3">
                                    {attachedFiles.map((attached, index) => (
                                      <div key={index} className="col-12">
                                        <div className="card border-0 bg-light">
                                          <div className="card-body p-3">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                              <FaFileAlt
                                                className="text-dark"
                                                size={20}
                                              />
                                              <div className="flex-grow-1">
                                                <small className="text-muted d-block fw-bold">
                                                  {attached.file.name}
                                                </small>
                                                <small className="text-muted">
                                                  {(
                                                    attached.file.size /
                                                    1024 /
                                                    1024
                                                  ).toFixed(2)}{" "}
                                                  MB
                                                </small>
                                              </div>
                                              <button
                                                type="button"
                                                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                                onClick={() =>
                                                  removeAttachedFile(index)
                                                }
                                                title="Remover arquivo"
                                              >
                                                <FaTimes />
                                              </button>
                                            </div>
                                            <div className="form-floating">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Descrição do Smart Contract"
                                                value={attached.description}
                                                onChange={(e) =>
                                                  handleFileDescriptionChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                id={`smart-description-${index}`}
                                              />
                                              <label
                                                htmlFor={`smart-description-${index}`}
                                              >
                                                Descrição do Smart Contract
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
                                  <FaFileAlt
                                    size={40}
                                    className="mb-2 opacity-50"
                                  />
                                  <p className="mb-0">
                                    Nenhum Smart Contract selecionado
                                  </p>
                                  <small>
                                    Clique no botão acima para adicionar o arquivo
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {tipoContrato === "equity" && (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="participacao"
                              id="participacao"
                              placeholder="Participação (%)"
                              value={form.participacao || ""}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="participacao">Participação (%) *</label>
                          </div>
    
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="meta_captacao"
                              id="meta_captacao"
                              placeholder="Meta de Captação"
                              value={form.meta_captacao || ""}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="meta_captacao">
                              Meta de Captação *
                            </label>
                          </div>
    
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="expectativa_retorno"
                              id="expectativa_retorno"
                              placeholder="Expectativa de Retorno (%)"
                              value={form.expectativa_retorno || ""}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="expectativa_retorno">
                              Expectativa de Retorno (%) *
                            </label>
                          </div>
    
                          <div className="form-floating mb-4">
                            <input
                              type="text"
                              className="form-control"
                              name="prazo_retorno"
                              id="prazo_retorno"
                              placeholder="Em meses"
                              value={form.prazo_retorno || ""}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="prazo_retorno">
                              Prazo de Retorno (Em meses) *
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label d-flex align-items-center gap-2">
                              <FaFileAlt /> Smart Contract *
                            </label>
                            <div className="border border-dashed border-dark border-2  rounded-3 p-4"
                            style={{ borderColor: '#010101' }}>
                              <div className="text-center mb-3">
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange}
                                  className="d-none"
                                  id="smartContractUpload"
                                />
                                <label
                                  htmlFor="smartContractUpload"
                                  className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
                                  style={{ cursor: "pointer" }}
                                >
                                  <FaFileAlt />
                                  Selecionar Smart Contract
                                </label>
                                <small className="text-muted d-block mt-2">
                                  Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                                </small>
                              </div>
    
                              {attachedFiles.length > 0 && (
                                <div className="border-top pt-3">
                                  <h6 className="mb-3 text-center">
                                    Smart Contract Selecionado (
                                    {attachedFiles.length})
                                  </h6>
                                  <div className="row g-3">
                                    {attachedFiles.map((attached, index) => (
                                      <div key={index} className="col-12">
                                        <div className="card border-0 bg-light">
                                          <div className="card-body p-3">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                              <FaFileAlt
                                                className="text-dark"
                                                size={20}
                                              />
                                              <div className="flex-grow-1">
                                                <small className="text-muted d-block fw-bold">
                                                  {attached.file.name}
                                                </small>
                                                <small className="text-muted">
                                                  {(
                                                    attached.file.size /
                                                    1024 /
                                                    1024
                                                  ).toFixed(2)}{" "}
                                                  MB
                                                </small>
                                              </div>
                                              <button
                                                type="button"
                                                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                                onClick={() =>
                                                  removeAttachedFile(index)
                                                }
                                                title="Remover arquivo"
                                              >
                                                <FaTimes />
                                              </button>
                                            </div>
                                            <div className="form-floating">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Descrição do Smart Contract"
                                                value={attached.description}
                                                onChange={(e) =>
                                                  handleFileDescriptionChange(
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                id={`smart-description-${index}`}
                                              />
                                              <label
                                                htmlFor={`smart-description-${index}`}
                                              >
                                                Descrição do Smart Contract
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
                                  <FaFileAlt
                                    size={40}
                                    className="mb-2 opacity-50"
                                  />
                                  <p className="mb-0">
                                    Nenhum Smart Contract selecionado
                                  </p>
                                  <small>
                                    Clique no botão acima para adicionar o arquivo
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
  );
}