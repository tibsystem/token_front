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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    
    setForm({ 
      ...form, 
      valor_total: formattedValue 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Validação adicional
      if (selectedImages.length === 0) {
        toast.warning("Nenhuma imagem selecionada. Adicione pelo menos uma imagem.");
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      
      const valorTotal = getCurrencyValue(form.valor_total);
      // console.log('Valor formatado:', form.valor_total);
      // console.log('Valor numérico:', valorTotal);
      
      formData.append('titulo', form.titulo);
      formData.append('descricao', form.descricao);
      formData.append('localizacao', form.localizacao);
      formData.append('valor_total', valorTotal);
      formData.append('qtd_tokens', parseInt(form.qtd_tokens));
      formData.append('modelo_smart_id', form.modelo_smart_id);
      formData.append('status', form.status);
      formData.append('data_tokenizacao', form.data_tokenizacao);
      
      
      selectedImages.forEach((image, index) => {
        formData.append('imagens', image);
      });
      

      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
        } else {
        }
      }

      try {
        await postProperties(formData);
      } catch (firstError) {
        
        try {
          await submitWithAlternativeFormat(formData);
        } catch (secondError) {
          
          const keys = Array.from(formData.keys());
          keys.forEach(key => {
            if (key.includes('imagens')) {
              formData.delete(key);
            }
          });
          
          selectedImages.forEach((image) => {
            formData.append('imagens[]', image);
          });
          
          await postProperties(formData);
        }
      }
      
      setSuccess(true);
      toast.success("Imóvel cadastrado com sucesso!");
      
      setForm({
        titulo: "",
        descricao: "",
        localizacao: "",
        valor_total: "",
        qtd_tokens: "",
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
        cep: ""
      });
      setDate(new Date());
      setSelectedImages([]);
      setImagePreviews([]);
      
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message);
        toast.error(`Erro ao cadastrar imóvel`);
      } else {
        setError("Erro ao cadastrar imóvel");
        toast.error("Erro ao cadastrar imóvel");
      }
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
            <div className="mb-4">
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
            </div>

            {/* Campos de endereço - aparecem após buscar o CEP */}
            {endereco.logradouro && (
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
            )}

            {/* Preview da localização completa */}
            {form.localizacao && (
              <div className="mb-4">
                <label className="form-label">Endereço Completo:</label>
                <div className="p-3 bg-light rounded border">
                  <small className="text-muted">{form.localizacao}</small>
                </div>
              </div>
            )}

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
              <select
                className="form-select"
                name="status"
                id="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
              <label htmlFor="status"><FaCheckCircle className="me-2" /> Status</label>
            </div>

            <div className="mb-4">
              <label className="form-label d-flex align-items-center gap-2"><FaCalendarAlt /> Data de Tokenização</label>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione a data"
                className="form-control py-2 px-3 border rounded shadow-sm"
                calendarClassName="shadow rounded border"
                locale="pt-BR"
                required
              />
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