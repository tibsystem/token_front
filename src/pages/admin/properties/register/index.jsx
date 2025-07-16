/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import api from "@/services/api";
import { postProperties } from "@/services/properties/postProperties";
import {
  FaHome,
  FaCoins,
  FaCubes,
  FaMicrochip,
  FaCheckCircle,
  FaImage,
  FaTimes,
  FaFileAlt,
  FaPercent,
} from "react-icons/fa";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { toast } from "react-toastify";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ToggleInput from "@/components/input/ToggleInput";
import UseOptionsSelect from "@/hooks/UseOptionsSelect";
import Steps from "@/components/Tab/Step";
registerLocale("pt-BR", ptBR);
setDefaultLocale("pt-BR");

export default function CadastrarImovel() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    valor_total: "",
    qtd_tokens: "",
    valor_total_ptoken: "",
    modelo_smart_id: "",
    status: "ativo",
    data_tokenizacao: new Date().toISOString().slice(0, 10),
  });
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [rentabilidade, setRentabilidade] = useState(""); 
  const { options,  } = UseOptionsSelect();
  const [tipoContrato, setTipoContrato] = useState('aluguel');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      const newForm = { ...prev, [name]: value };

      if (name === 'qtd_tokens') {
        const valorTotal = getCurrencyValue(prev.valor_total);
        const qtdTokens = parseInt(value) || 0;

        if (valorTotal > 0 && qtdTokens > 0) {
          const valorPorToken = valorTotal / qtdTokens;
          newForm.valor_total_ptoken = valorPorToken.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });
        } else {
          newForm.valor_total_ptoken = '';
        }
      }

      return newForm;
    });
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) return '';

    const numberValue = parseInt(numericValue) / 100;

    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCurrency(value);

    setForm(prev => {
      const newForm = {
        ...prev,
        valor_total: formattedValue
      };

      // Calcular valor por token automaticamente
      const valorTotal = getCurrencyValue(formattedValue);
      const qtdTokens = parseInt(prev.qtd_tokens) || 0;

      if (valorTotal > 0 && qtdTokens > 0) {
        const valorPorToken = valorTotal / qtdTokens;
        newForm.valor_total_ptoken = valorPorToken.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      } else {
        newForm.valor_total_ptoken = '';
      }

      return newForm;
    });
  };

  const getCurrencyValue = (formattedValue) => {
    if (!formattedValue) return 0;

    const numericString = formattedValue
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    return parseFloat(numericString) || 0;
  };

  const calculateValuePerToken = () => {
    const valorTotal = getCurrencyValue(form.valor_total);
    const qtdTokens = parseInt(form.qtd_tokens) || 0;

    if (valorTotal > 0 && qtdTokens > 0) {
      const valorPorToken = valorTotal / qtdTokens;
      return valorPorToken.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
    return '';
  };

  const updateValuePerToken = () => {
    const valorPorToken = calculateValuePerToken();
    setForm(prev => ({
      ...prev,
      valor_total_ptoken: valorPorToken
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imagens permitidas");
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error("Apenas arquivos JPEG, PNG e WEBP são permitidos");
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error("Cada imagem deve ter no máximo 5MB");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file: file,
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error("Apenas arquivos PDF, DOC e DOCX são permitidos");
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error("Cada arquivo deve ter no máximo 5MB");
      return;
    }

    const newFiles = files.map((file) => ({
      file,
      description: "",
    }));

    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileDescriptionChange = (index, description) => {
    setAttachedFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[index].description = description;
      return updatedFiles;
    });
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRentabilidadeChange = (tipo) => {
    setRentabilidade(tipo);
    setForm(prev => ({
      ...prev,
      indicador: tipo === "indicador_juros" ? prev.indicador : "",
      juros: tipo === "indicador_juros" || tipo === "juros" ? prev.juros : "",
      valor_previsto: tipo === "valor_previsto" ? prev.valor_previsto : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {

      if (selectedImages.length === 0) {
        toast.warning("Nenhuma imagem selecionada. Adicione pelo menos uma imagem.");
        setLoading(false);
        return;
      }

      const valorTotal = getCurrencyValue(form.valor_total);

      const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const filesBase64 = await Promise.all(
        selectedImages.map(async (image) => await toBase64(image))
      );

      const attachedFilesBase64 = await Promise.all(
        attachedFiles.map(async (attached) => ({
          file: await toBase64(attached.file),
          description: attached.description,
          name: attached.file.name,
          type: attached.file.type,
          size: attached.file.size
        }))
      );

      let profitability = '';
      if (rentabilidade === "indicador_juros") {
        const indicador = form.indicador || '';
        const juros = form.juros ? form.juros : '';
        profitability = `${indicador} ${juros}`.trim();
      } else if (rentabilidade === "juros") {
        profitability = form.juros ? String(form.juros) : '';
      } else if (rentabilidade === "valor_previsto") {
        profitability = form.valor_previsto ? String(form.valor_previsto) : '';
      }

      const payload = {
        title: form.titulo,
        description: form.descricao,
        total_value: valorTotal,
        total_tokens: parseInt(form.qtd_tokens),
        smart_contract_model_id: form.modelo_smart_id,
        status: 'pending',
        files: filesBase64, 
        attachments: attachedFilesBase64, 
        profitability,
        agent_id: form.agent_id || '',
      };
      // console.log("Payload:", JSON.stringify(payload, null, 2));
      // console.log("response")
      await postProperties(payload);
      toast.success("Imóvel cadastrado com sucesso!");
      setSuccess(true);
      setForm({
        titulo: "",
        descricao: "",
        valor_total: "",
        qtd_tokens: "",
        valor_total_ptoken: "",
        modelo_smart_id: "",
        status: "ativo",
        data_tokenizacao: new Date().toISOString().slice(0, 10),
        agent_id: "",
      });
      
      
      setDate(new Date());
      setSelectedImages([]);
      setImagePreviews([]);
      setAttachedFiles([]);

    } catch (err) {
      setError(err?.message || "Erro ao cadastrar imóvel");
      toast.error("Erro ao cadastrar imóvel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-5xl mx-auto mt-8 p-4">
        <div className="card shadow-lg border-0 rounded-4 p-5 animate__animated animate__fadeIn">
          <Steps model={[
  { label: "Tipo de Contrato", active: true },
  { label: "Dados do Imóvel", active: false },
  { label: "Finalizar", active: false }
]} />
          <h2 className="text-3xl fw-bold mb-5 text-primary d-flex align-items-center gap-2">
            <FaHome className="text-primary" /> Cadastro de Imóvel
          </h2>
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-md-6">
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
                <label htmlFor="titulo"><FaHome className="me-2" /> Título</label>
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
                <label htmlFor="descricao"><FaCubes className="me-2" /> Descrição *</label>
              </div>

             <div className="form-floating mb-4">
              <select
                className="form-control"
                name="agent_id"
                id="agent_id"
                value={form.agent_id || ''}
                onChange={handleChange}
              >
                <option value="">Selecione o Captador * </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label htmlFor="agent_id"><FaCubes className="me-2" /> Captador *</label>

              </div>
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="modelo_smart_id"
                  id="modelo_smart_id"
                  placeholder="Modelo Smart ID *"
                  value={form.modelo_smart_id}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="modelo_smart_id"><FaMicrochip className="me-2" /> Modelo Smart ID *</label>
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
                <label htmlFor="valor_total"><FaCoins className="me-2" /> Valor Total (R$) *</label>
              </div>

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
                <label htmlFor="qtd_tokens"><FaCubes className="me-2" /> Quantidade de Tokens *</label>
              </div>

              {/* Campo calculado automaticamente - Valor por Token */}
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
                            <FaCubes className="me-2" />
                            1 Token
                          </span>
                          <span className="text-muted fs-5">=</span>
                          <span className="badge bg-success fs-6 px-3 py-2">
                            <FaCoins className="me-2" />
                            {form.valor_total_ptoken}
                          </span>
                        </div>
                        <small className="text-muted">Valor individual por token *</small>
                      </div>
                    ) : (
                      <div>
                        <div className="text-muted mb-2">
                          <FaCoins className="me-2" size={24} />
                        </div>
                        <span className="text-muted">
                          Insira o valor total e quantidade de tokens<br />
                          para calcular o valor individual
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

          
            </div>

            <div className="col-md-6">
              <h5 className="mb-4">Rentabilidade Prevista</h5>
              <div className="d-flex gap-3 mb-4">
                <ToggleInput
                  onLabel="Indicador + Juros"
                  offLabel="Indicador + Juros"
                  onIcon="bi bi-check2-all"
                  offIcon="bi bi-x-lg"
                  checked={rentabilidade === "indicador_juros"}
                  onChange={() => handleRentabilidadeChange("indicador_juros")}
                />
                <ToggleInput
                  onLabel="Juros"
                  offLabel="Juros"
                  onIcon="bi bi-check2-all"
                  offIcon="bi bi-x-lg"
                  checked={rentabilidade === "juros"}
                  onChange={() => handleRentabilidadeChange("juros")}
                />
                <ToggleInput
                  onLabel="Valor Previsto"
                  offLabel="Valor Previsto"
                  onIcon="bi bi-check2-all"
                  offIcon="bi bi-x-lg"
                  checked={rentabilidade === "valor_previsto"}
                  onChange={() => handleRentabilidadeChange("valor_previsto")}
                />
              </div>

              {rentabilidade === "indicador_juros" && (
                <div className="form-floating mb-4">
                  <div className="row g-2 align-items-center mb-3">
                    <div className="col-6">
                      <select
                        className="form-select"
                        name="indicador"
                        value={form.indicador || ''}
                        onChange={e => setForm(prev => ({ ...prev, indicador: e.target.value }))}
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
                        value={form.juros || ''}
                        onChange={e => setForm(prev => ({ ...prev, juros: e.target.value }))}
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
                  value={form.juros || ''}
                  onChange={e => setForm(prev => ({ ...prev, juros: e.target.value }))}
                  required
                />
              )}
              {rentabilidade === "valor_previsto" && (
                <input
                  type="text"
                  className="form-control mb-3"
                  name="valor_previsto"
                  placeholder="Valor Previsto (R$)"
                  value={form.valor_previsto || ''}
                  onChange={e => setForm(prev => ({ ...prev, valor_previsto: e.target.value }))}
                  required
                />
              )}
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <FaImage /> Imagens do Imóvel *
                </label>
                <div className="border border-dashed border-2 border-primary rounded-3 p-4">
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
                      className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2 w-100"
                      style={{ cursor: 'pointer' }}
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
                      <h6 className="mb-3 text-center">Imagens Selecionadas ({imagePreviews.length}/5)</h6>
                      <div className="row g-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-6">
                            <div className="position-relative">
                              <Image
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="img-fluid rounded-2 shadow-sm"
                                style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                                width={150}
                                height={100}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '24px', height: '24px' }}
                                onClick={() => removeImage(index)}
                                title="Remover imagem"
                              >
                                <FaTimes size={10} />
                              </button>
                              <div className="mt-1">
                                <small className="text-muted text-truncate d-block" title={preview.name}>
                                  {preview.name.length > 15 ? preview.name.substring(0, 15) + '...' : preview.name}
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
                <div className="border border-dashed border-2 border-success rounded-3 p-4">
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
                      className="btn btn-outline-success btn-lg d-flex align-items-center justify-content-center gap-2 w-100"
                      style={{ cursor: 'pointer' }}
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
                      <h6 className="mb-3 text-center">Arquivos Anexados ({attachedFiles.length})</h6>
                      <div className="row g-3">
                        {attachedFiles.map((attached, index) => (
                          <div key={index} className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body p-3">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                  <FaFileAlt className="text-success" size={20} />
                                  <div className="flex-grow-1">
                                    <small className="text-muted d-block fw-bold">{attached.file.name}</small>
                                    <small className="text-muted">{(attached.file.size / 1024 / 1024).toFixed(2)} MB</small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                    onClick={() => removeAttachedFile(index)}
                                    title="Remover arquivo"
                                  >
                                    <FaTimes />
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
                                  <label htmlFor={`description-${index}`}>Descrição do arquivo</label>
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

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <FaCheckCircle />
                )}
                {loading ? "Cadastrando..." : "Cadastrar Imóvel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}