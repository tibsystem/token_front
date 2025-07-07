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
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { toast } from "react-toastify";
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
    data_tokenizacao: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD para o backend
  });
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleNumberFormat = (e) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "").replace(/,/g, '.');
    setForm({ ...form, [e.target.name]: value });
  }
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imagens permitidas");
      return;
    }
  }
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
      
      // Dados básicos do imóvel
      formData.append('titulo', form.titulo);
      formData.append('descricao', form.descricao);
      formData.append('localizacao', form.localizacao);
      formData.append('valor_total', valorTotal);
      formData.append('qtd_tokens', parseInt(form.qtd_tokens));
      formData.append('modelo_smart_id', form.modelo_smart_id);
      formData.append('status', form.status);
      formData.append('data_tokenizacao', form.data_tokenizacao);
      
      // console.log('Número de imagens selecionadas:', selectedImages.length);
      
      selectedImages.forEach((image, index) => {
        // console.log(`Adicionando imagem ${index}:`, image.name, image.size);
        formData.append('imagens', image);
      });
      
      // Formato 2: Com índices (alternativo para teste)
      // selectedImages.forEach((image, index) => {
      //   formData.append(`imagens[${index}]`, image);
      // });
      
      // Formato 3: Como array com []
      // selectedImages.forEach((image) => {
      //   formData.append('imagens[]', image);
      // });

      // Log para debug do FormData
      // console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          // console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          // console.log(key, value);
        }
      }

      try {
        await postProperties(formData);
      } catch (firstError) {
        // console.log('Primeiro formato falhou, tentando alternativo...');
        // // console.error('Erro do primeiro formato:', firstError);
        
        try {
          await submitWithAlternativeFormat(formData);
        } catch (secondError) {
          // console.log('Segundo formato falhou, tentando com imagens[]...');
          // // console.error('Erro do segundo formato:', secondError);
          
          // Tentar terceiro formato
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
    // // console.log('Tentando formato alternativo...');
    
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

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                name="localizacao"
                id="localizacao"
                placeholder="Localização"
                value={form.localizacao}
                onChange={handleChange}
                required
              />
              <label htmlFor="localizacao"><FaMapMarkerAlt className="me-2" /> Localização</label>
            </div>

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

            <div className="mb-4">
              <label className="form-label d-flex align-items-center gap-2">
                <FaImage /> Imagens do Imóvel
              </label>
              <div className="border border-dashed border-2 border-primary rounded-3 p-4 text-center">
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
            </div>

            {/* Preview das Imagens */}
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-3">Preview das Imagens:</h6>
                <div className="row g-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3">
                      <div className="position-relative">
                        <Image
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="img-fluid rounded-3 shadow-sm"
                          style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                          width={200}
                          height={120}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes size={12} />
                        </button>
                        <div className="mt-1">
                          <small className="text-muted text-truncate d-block">
                            {preview.name}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  );
}