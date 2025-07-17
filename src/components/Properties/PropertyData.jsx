import {
  FaCoins,
  FaCubes,
  FaHome,
  FaImage,
  FaMicrochip,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import ToggleInput from "@/components/input/ToggleInput";

export default function PropertyData({
  form,
  setForm,
  handleChange,
  handleCurrencyChange,
  options,
  handleRentabilidadeChange,
  rentabilidade,
  handleImageChange,
  imagePreviews,
  removeImage,
  isDarkMode,
  handleFileChange,
  attachedFiles,
  removeAttachedFile,
  handleFileDescriptionChange,
}) {
  return (
    <>
      <div className="col-xl-6 mt-5">
        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            name="titulo"
            id="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
          />
          <label htmlFor="titulo">
            <FaHome className="me-2" /> Título
          </label>
        </div>

        <div className="form-floating mb-4">
          <textarea
            className="form-control h-auto"
            name="descricao"
            id="descricao"
            placeholder="Descrição *"
            value={form.descricao}
            onChange={handleChange}
            style={{ height: "130px" }}
            required
          ></textarea>
          <label htmlFor="descricao">
            <FaCubes className="me-2" /> Descrição *
          </label>
        </div>

        <div className="form-floating mb-4">
          <select
            className="form-control"
            name="agent_id"
            id="agent_id"
            value={form.agent_id || ""}
            onChange={handleChange}
          >
            <option value="">Selecione o Captador * </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor="agent_id">
            <FaCubes className="me-2" /> Captador *
          </label>
        </div>
     

        <div className="form-floating mb-4">
          <input
            type="text"
            className="form-control"
            name="valor_total"
            id="valor_total"
            placeholder="Valor Total"
            value={form.valor_total}
            onChange={handleCurrencyChange}
            min={0}
            step={0.01}
            required
          />
          <label htmlFor="valor_total">
            <FaCoins className="me-2" /> Valor Total (R$) *
          </label>
        </div>
            <h5 className="mb-4">Rentabilidade Prevista</h5>
        <div className="row mb-4">
          <div className="col-xl-12">
            <div className="d-flex gap-3 flex-wrap">
              <ToggleInput
                onLabel="Indicador + Juros"
                offLabel="Indicador + Juros"
                onIcon="fas fa-check"
                offIcon="bi bi-x-lg"
                checked={rentabilidade === "indicador_juros"}
                onChange={() => handleRentabilidadeChange("indicador_juros")}
              />
              <ToggleInput
                onLabel="Juros"
                offLabel="Juros"
                onIcon="fas fa-check"
                offIcon="bi bi-x-lg"
                checked={rentabilidade === "juros"}
                onChange={() => handleRentabilidadeChange("juros")}
              />
              <ToggleInput
                onLabel="Valor Previsto"
                offLabel="Valor Previsto"
                onIcon="fas fa-check"
                offIcon="bi bi-x-lg"
                checked={rentabilidade === "valor_previsto"}
                onChange={() => handleRentabilidadeChange("valor_previsto")}
              />
            </div>
          </div>
        </div>

        {rentabilidade === "indicador_juros" && (
          <div className="form-floating mb-4">
            <div className="row g-2 align-items-center mb-3">
              <div className="col-xl-6">
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
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      juros: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}
        {rentabilidade === "juros" && (
          <input
            type="number"
            className="form-control mb-3"
            name="juros"
            placeholder="Juros (%)"
            value={form.juros || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, juros: e.target.value }))
            }
            required
          />
        )}
        {rentabilidade === "valor_previsto" && (
          <input
            type="text"
            className="form-control mb-3"
            name="valor_previsto"
            placeholder="Valor Previsto (R$)"
            value={form.valor_previsto || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                valor_previsto: e.target.value,
              }))
            }
            required
          />
        )}

        <div className="form-floating mb-4">
          <input
            type="number"
            className="form-control"
            name="qtd_tokens"
            id="qtd_tokens"
            placeholder="Quantidade de Tokens"
            value={form.qtd_tokens}
            onChange={handleChange}
            min={1}
            required
          />
          <label htmlFor="qtd_tokens">
            <FaCubes className="me-2" /> Quantidade de Tokens *
          </label>
        </div>

        <div className="mb-4">
          <label className="form-label d-flex align-items-center gap-2">
            <FaCoins className="text-warning" /> Valor por Token
          </label>
          <div className="card border-warning bg-warning bg-opacity-10">
            <div className="card-body p-3 text-center">
              {form.valor_total_ptoken ? (
                <div>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                    <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                      <FaCubes className="me-2" />1 Token
                    </span>
                    <span className="text-muted fs-5">=</span>
                    <span className="badge bg-success fs-6 px-3 py-2">
                      <FaCoins className="me-2" />
                      {form.valor_total_ptoken}
                    </span>
                  </div>
                  <small className="text-muted">
                    Valor individual por token *
                  </small>
                </div>
              ) : (
                <div>
                  <div className="text-muted mb-2">
                    <FaCoins className="me-2" size={24} />
                  </div>
                  <span className="text-muted">
                    Insira o valor total e quantidade de tokens
                    <br />
                    para calcular o valor individual
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-6 mt-5">
    
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
                className={`btn ${
                  isDarkMode ? "btn-outline-light" : "btn-outline-dark"
                } btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
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
                            style={{
                              height: "100px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            width={150}
                            height={100}
                          />
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => removeImage(index)}
                          title="Remover imagem"
                        >
                          <FaTimes size={10} />
                        </button>
                        <div className="mt-1">
                          <small
                            className="text-muted text-truncate d-block"
                            title={preview.name}
                          >
                            {preview.name.length > 15
                              ? preview.name.substring(0, 15) + "..."
                              : preview.name}
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

        {/* Upload de Arquivos Anexados */}
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
                className={`btn ${
                  isDarkMode ? "btn-outline-light" : "btn-outline-dark"
                } btn-lg d-flex align-items-center justify-content-center gap-2 w-100`}
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
                                {attached.file.name}
                              </small>
                              <small className="text-muted">
                                {(attached.file.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </small>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                              onClick={() => removeAttachedFile(index)}
                              title="Remover arquivo"
                            ></button>
                          </div>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Descrição do arquivo"
                              value={attached.description}
                              onChange={(e) =>
                                handleFileDescriptionChange(
                                  index,
                                  e.target.value
                                )
                              }
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
      </div>
    </>
  );
}
