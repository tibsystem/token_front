import ToggleInput from "@/components/input/ToggleInput";
import { useState } from "react";
import { FaFileAlt, FaTimes } from "react-icons/fa";

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
  optionsSmartContract = [],
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
          <div className="col-md-12">
            <div className="mb-4">
              <label className="form-label">Rentabilidade *</label>
              <div className="d-flex gap-3">
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
                  type="text"
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
              <label htmlFor="periodo_contrato">Período do contrato *</label>
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

            <div className="form-floating mb-4">
              <select
                className="form-select"
                name="smart_contract"
                id="smart_contract"
                value={form.smart_contract || ""}
                onChange={handleChange}
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
        </div>
      )}
      {tipoContrato === "equity" && (
        <div className="row">
          <div className="col-md-12">
            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                name="participacao"
                id="participacao"
                placeholder="Participação (%)"
                value={form.participacao || ""}
                onChange={handlePercentChange}
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
              <label htmlFor="meta_captacao">Meta de Captação *</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                name="expectativa_retorno"
                id="expectativa_retorno"
                placeholder="Expectativa de Retorno (%)"
                value={form.expectativa_retorno || ""}
                onChange={handlePercentChange}
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
                maxLength={3}
              />
              <label htmlFor="prazo_retorno">
                Prazo de Retorno (Em meses) *
              </label>
            </div>

            <div className="form-floating mb-4">
              <select
                className="form-select"
                name="smart_contract"
                id="smart_contract"
                value={form.smart_contract || ""}
                onChange={handleChange}
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
          
        </div>
      )}
    </>
  );
}
