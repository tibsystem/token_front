/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import api from "@/services/api";
import { postProperties } from "@/services/properties/postProperties";
import {
  FaHome,
  FaMapMarkerAlt,
  FaCoins,
  FaCubes,
  FaMicrochip,
  FaCalendarAlt,
  FaCheckCircle,
  FaImage,
  FaTimes,
  FaSearch,
  FaSpinner,
  FaFileAlt,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { toast } from "react-toastify";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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

  // Estados para CEP e endereço
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: ""
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      const newForm = { ...prev, [name]: value };

      // Se for mudança na quantidade de tokens, recalcular valor por token
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

  // Função para buscar CEP
  const buscarCep = async (cepValue) => {
    const cepLimpo = cepValue.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setCepError("CEP deve ter 8 dígitos");
      return;
    }

    setLoadingCep(true);
    setCepError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }

      const novoEndereco = {
        logradouro: data.logradouro || "",
        numero: "",
        complemento: "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
        cep: cepValue
      };

      setEndereco(novoEndereco);

      // Monta a string de localização completa
      const localizacaoCompleta = `${novoEndereco.logradouro}, ${novoEndereco.bairro}, ${novoEndereco.cidade} - ${novoEndereco.uf}, CEP: ${cepValue}`;

      setForm(prev => ({
        ...prev,
        localizacao: localizacaoCompleta
      }));

      toast.success("CEP encontrado com sucesso!");

    } catch (error) {
      setCepError("Erro ao buscar CEP");
      toast.error("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  };

  // Função para formatar CEP
  const formatCep = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 5) {
      return numericValue;
    }
    return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
  };

  // Handler para mudança de CEP
  const handleCepChange = (e) => {
    const value = e.target.value;
    const formattedCep = formatCep(value);
    setCep(formattedCep);

    // Se o CEP está completo, busca automaticamente
    const cepLimpo = value.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(formattedCep);
    }
  };

  // Handler para mudança nos campos de endereço
  const handleEnderecoChange = (field, value) => {
    const novoEndereco = { ...endereco, [field]: value };
    setEndereco(novoEndereco);

    // Atualiza a localização completa
    const localizacaoCompleta = `${novoEndereco.logradouro}${novoEndereco.numero ? ', ' + novoEndereco.numero : ''}${novoEndereco.complemento ? ', ' + novoEndereco.complemento : ''}, ${novoEndereco.bairro}, ${novoEndereco.cidade} - ${novoEndereco.uf}, CEP: ${novoEndereco.cep}`;

    setForm(prev => ({
      ...prev,
      localizacao: localizacaoCompleta
    }));
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

  // Função para calcular o valor por token
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

  // Atualizar o valor por token sempre que valor_total ou qtd_tokens mudarem
  const updateValuePerToken = () => {
    const valorPorToken = calculateValuePerToken();
    setForm(prev => ({
      ...prev,
      valor_total_ptoken: valorPorToken
    }));
  };

  const handleDateChange = (date) => {
    setDate(date);
    setForm({
      ...form,
      data_tokenizacao: date ? date.toISOString().slice(0, 10) : "", // Formato YYYY-MM-DD para o backend
    });
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

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // resultado vem no formato: data:image/jpeg;base64,...
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validação: ao menos uma imagem deve estar selecionada
      if (selectedImages.length === 0) {
        toast.warning("Nenhuma imagem selecionada. Adicione pelo menos uma imagem.");
        setLoading(false);
        return;
      }

      const valorTotal = getCurrencyValue(form.valor_total);

      // Converter imagens para base64
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

      // Converter arquivos anexados para base64
      const attachedFilesBase64 = await Promise.all(
        attachedFiles.map(async (attached) => ({
          file: await toBase64(attached.file),
          description: attached.description,
          name: attached.file.name,
          type: attached.file.type,
          size: attached.file.size
        }))
      );

      // Montar payload JSON
      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        localizacao: form.localizacao,
        valor_total: valorTotal,
        qtd_tokens: parseInt(form.qtd_tokens),
        modelo_smart_id: form.modelo_smart_id,
        status: 1,
        data_tokenizacao: Date(),
        files: filesBase64, // imagens base64
        anexos: attachedFilesBase64, // arquivos anexados com descrições
      };

      console.log("Payload:", payload);

      // await postProperties(payload);

      toast.success("Imóvel cadastrado com sucesso!");
      setSuccess(true);

      // Resetar formulário
      setForm({
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
      setCep("");
      setEndereco({
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
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


  const submitWithAlternativeFormat = async (formData) => {

    const keys = Array.from(formData.keys());
    keys.forEach(key => {
      if (key.includes('imagens')) {
        formData.delete(key);
      }
    });

    selectedImages.forEach((image, index) => {
      formData.append(`imagens[${index}]`, image);
    });

    return await postProperties(formData);
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-5xl mx-auto mt-8 p-4">
        <div className="card shadow-lg border-0 rounded-4 p-5 animate__animated animate__fadeIn">
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

              {/* Campo de CEP */}
              {/* <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <FaMapMarkerAlt /> CEP
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${cepError ? 'is-invalid' : ''}`}
                    placeholder="00000-000"
                    value={cep}
                    onChange={handleCepChange}
                    maxLength={9}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => buscarCep(cep)}
                    disabled={loadingCep || cep.replace(/\D/g, '').length !== 8}
                  >
                    {loadingCep ? <FaSpinner className="fa-spin" /> : <FaSearch />}
                  </button>
                  {cepError && <div className="invalid-feedback">{cepError}</div>}
                </div>
                <small className="text-muted">Digite o CEP para preenchimento automático do endereço</small>
              </div> */}

              {/* Campos de endereço - aparecem após buscar o CEP */}
              {/* {endereco.logradouro && (
                <div className="row g-3 mb-4">
                  <div className="col-md-8">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.logradouro}
                        onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                        placeholder="Logradouro"
                      />
                      <label>Logradouro</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                        placeholder="Número"
                        required
                      />
                      <label>Número</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.complemento}
                        onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                        placeholder="Complemento"
                      />
                      <label>Complemento (opcional)</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                        placeholder="Bairro"
                      />
                      <label>Bairro</label>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                        placeholder="Cidade"
                      />
                      <label>Cidade</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        value={endereco.uf}
                        onChange={(e) => handleEnderecoChange('uf', e.target.value.toUpperCase())}
                        placeholder="UF"
                        maxLength={2}
                      />
                      <label>UF</label>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Preview da localização completa */}
              {/* {form.localizacao && (
                <div className="mb-4">
                  <label className="form-label">Endereço Completo:</label>
                  <div className="p-3 bg-light rounded border">
                    <small className="text-muted">{form.localizacao}</small>
                  </div>
                </div>
              )} */}

              <div className="form-floating mb-4">
                <textarea
                  className="form-control h-auto"
                  name="descricao"
                  id="descricao"
                  placeholder="Descrição"
                  value={form.descricao}
                  onChange={handleChange}
                  style={{ height: "130px" }}
                  required
                ></textarea>
                <label htmlFor="descricao"><FaCubes className="me-2" /> Descrição</label>
              </div>


              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control"
                  name="modelo_smart_id"
                  id="modelo_smart_id"
                  placeholder="Modelo Smart ID"
                  value={form.modelo_smart_id}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="modelo_smart_id"><FaMicrochip className="me-2" /> Modelo Smart ID</label>
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
                <label htmlFor="valor_total"><FaCoins className="me-2" /> Valor Total (R$)</label>
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
                <label htmlFor="qtd_tokens"><FaCubes className="me-2" /> Quantidade de Tokens</label>
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
                        <small className="text-muted">Valor individual por token</small>
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
              {/* Upload de Imagens - Movido para o topo */}
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <FaImage /> Imagens do Imóvel
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

                  {/* Preview das Imagens dentro do border */}
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
                  <FaFileAlt /> Arquivos Anexados do Imóvel
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