"use client";
import { useState } from "react";
import api from "@/services/api";
import { FaHome, FaMapMarkerAlt, FaCoins, FaCubes, FaMicrochip, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postProperties } from "@/services/properties/postProperties";

export default function CadastrarImovel() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    valor_total: "",
    qtd_tokens: "",
    modelo_smart_id: "",
    status: "ativo",
    data_tokenizacao: ""
  });
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setDate(date);
    setForm({ ...form, data_tokenizacao: date ? date.toISOString().slice(0, 16) : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = {
        ...form,
        valor_total: parseFloat(form.valor_total),
        qtd_tokens: parseInt(form.qtd_tokens),
      }
      await postProperties(data);
      setSuccess(true);
      setForm({
        titulo: "",
        descricao: "",
        localizacao: "",
        valor_total: "",
        qtd_tokens: "",
        modelo_smart_id: "",
        status: "ativo",
        data_tokenizacao: ""
      });
      setDate(null);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err).message);
      } else {
        setError('Erro ao cadastrar imóvel');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-theme flex items-center gap-2">
        <FaHome className="text-blue-600" /> Cadastro de Imóvel
      </h2>
      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaHome /> Título</label>
            <input type="text" className="form-control form-control-lg" name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Ex: Casa Alto Padrão" />
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaMapMarkerAlt /> Localização</label>
            <input type="text" className="form-control" name="localizacao" value={form.localizacao} onChange={handleChange} required placeholder="Ex: Rua das Palmeiras, 123" />
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaCubes /> Descrição</label>
            <textarea className="form-control" name="descricao" value={form.descricao} onChange={handleChange} required placeholder="Descreva o imóvel, diferenciais, metragem, etc..." rows={4} />
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaCoins /> Valor Total</label>
            <div className="input-group">
              <span className="input-group-text">R$</span>
              <input type="number" className="form-control" name="valor_total" value={form.valor_total} onChange={handleChange} required min={0} step={0.01} placeholder="Ex: 1000000" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaCubes /> Quantidade de Tokens</label>
            <input type="number" className="form-control" name="qtd_tokens" value={form.qtd_tokens} onChange={handleChange} required min={1} placeholder="Ex: 100000" />
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaMicrochip /> Modelo Smart ID</label>
            <input type="text" className="form-control" name="modelo_smart_id" value={form.modelo_smart_id} onChange={handleChange} required placeholder="Ex: 1" />
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaCheckCircle /> Status</label>
            <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label flex items-center gap-2"><FaCalendarAlt /> Data de Tokenização</label>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="form-control"
              placeholderText="Selecione a data e hora"
              required
            />
          </div>
        </div>
        <div className="col-12">
          {error && <div className="alert alert-danger animate-shake">{error}</div>}
          {success && <div className="alert alert-success animate-fade-in">Imóvel cadastrado com sucesso!</div>}
          <button type="submit" className="btn btn-primary w-full text-lg flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <FaCheckCircle />} {loading ? "Cadastrando..." : "Cadastrar Imóvel"}
          </button>
        </div>
      </form>
    </div>
  );
}
