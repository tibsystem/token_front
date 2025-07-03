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
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CadastrarImovel() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    valor_total: "",
    qtd_tokens: "",
    modelo_smart_id: "",
    status: "ativo",
    data_tokenizacao: "",
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
    setForm({
      ...form,
      data_tokenizacao: date ? date.toISOString().slice(0, 16) : "",
    });
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
      };
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
        data_tokenizacao: "",
      });
      setDate(null);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message);
      } else {
        setError("Erro ao cadastrar imóvel");
      }
    } finally {
      setLoading(false);
    }
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
                type="number"
                className="form-control"
                name="valor_total"
                id="valor_total"
                placeholder="Valor Total"
                value={form.valor_total}
                onChange={handleChange}
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
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Selecione a data e hora"
                className="form-control py-2 px-3 border rounded shadow-sm"
                calendarClassName="shadow rounded border"
                required
              />
            </div>
          </div>

          <div className="col-12">
            {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
            {success && <div className="alert alert-success animate__animated animate__fadeIn">Imóvel cadastrado com sucesso!</div>}
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