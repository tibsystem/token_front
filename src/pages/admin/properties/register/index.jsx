/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";

//component
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Steps from "@/components/Tab/Step";
import TypeContract from "@/components/Properties/TypeContract";
import PropertyData from "@/components/Properties/PropertyData";
import PropertySummary from "@/components/Properties/PropertySummary";
//hooks
import useDarkMode from "@/hooks/useDarkMode";
import UseOptionsSelect from "@/hooks/UseOptionsSelect";
//services
import { postProperties } from "@/services/properties/postProperties";

export default function CadastrarImovel() {
  const { isDarkMode } = useDarkMode();
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
  const { options } = UseOptionsSelect();
  const [tipoContrato, setTipoContrato] = useState("aluguel");
  const [smartContractFiles, setSmartContractFiles] = useState([]);

  const steps = [
    { label: "Tipo de Contrato" },
    { label: "Dados do Imóvel" },
    { label: "Finalizar" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const stepsModel = steps.map((step, idx) => ({
    ...step,
    active: idx === currentStep,
  }));
 const camposValidos = () => {
  if (currentStep === 0) {
    const smartContractValido =
      smartContractFiles.length > 0 &&
      smartContractFiles.every(
        (attached) =>
          attached.description && attached.description.trim() !== ""
      );
    if (tipoContrato === "aluguel") {
      return (
        form.periodo_contrato &&
        form.percentual_lucro &&
        smartContractValido &&
        rentabilidade &&
        (rentabilidade === "indicador_juros"
          ? form.indicador && form.juros
          : form.juros)
      );
    }
    if (tipoContrato === "equity") {
      return (
        form.participacao &&
        form.meta_captacao &&
        form.expectativa_retorno &&
        form.prazo_retorno &&
        smartContractValido
      );
    }
    return false;
  }
  if (currentStep === 1) {
    return (
      form.titulo &&
      form.descricao &&
      form.agent_id &&
      form.valor_total &&
      form.qtd_tokens
    );
  }
  return true;
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const newForm = { ...prev, [name]: value };

      if (name === "qtd_tokens") {
        const valorTotal = getCurrencyValue(prev.valor_total);
        const qtdTokens = parseInt(value) || 0;

        if (valorTotal > 0 && qtdTokens > 0) {
          const valorPorToken = valorTotal / qtdTokens;
          newForm.valor_total_ptoken = valorPorToken.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        } else {
          newForm.valor_total_ptoken = "";
        }
      }

      return newForm;
    });
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    const numberValue = parseInt(numericValue) / 100;

    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCurrency(value);

    setForm((prev) => {
      const newForm = {
        ...prev,
        valor_total: formattedValue,
      };

      // Calcular valor por token automaticamente
      const valorTotal = getCurrencyValue(formattedValue);
      const qtdTokens = parseInt(prev.qtd_tokens) || 0;

      if (valorTotal > 0 && qtdTokens > 0) {
        const valorPorToken = valorTotal / qtdTokens;
        newForm.valor_total_ptoken = valorPorToken.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        newForm.valor_total_ptoken = "";
      }

      return newForm;
    });
  };

  const getCurrencyValue = (formattedValue) => {
    if (!formattedValue) return 0;

    const numericString = formattedValue
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(numericString) || 0;
  };

  const calculateValuePerToken = () => {
    const valorTotal = getCurrencyValue(form.valor_total);
    const qtdTokens = parseInt(form.qtd_tokens) || 0;

    if (valorTotal > 0 && qtdTokens > 0) {
      const valorPorToken = valorTotal / qtdTokens;
      return valorPorToken.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return "";
  };

  const updateValuePerToken = () => {
    const valorPorToken = calculateValuePerToken();
    setForm((prev) => ({
      ...prev,
      valor_total_ptoken: valorPorToken,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imagens permitidas");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Apenas arquivos JPEG, PNG e WEBP são permitidos");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      toast.error("Cada imagem deve ter no máximo 5MB");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          {
            file: file,
            url: e.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Apenas arquivos PDF, DOC e DOCX são permitidos");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

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
    setForm((prev) => ({
      ...prev,
      indicador: tipo === "indicador_juros" ? prev.indicador : "",
      juros: tipo === "indicador_juros" || tipo === "juros" ? prev.juros : "",
      valor_previsto: tipo === "valor_previsto" ? prev.valor_previsto : "",
    }));
  };

  const handlePercentChange = (e) => {
    let value = e.target.value.replace(/[^\d.,]/g, "").replace(/(,|\.)/g, ",");
    const parts = value.split(",");
    if (parts.length > 2) value = parts[0] + "," + parts[1];
    value = value.replace(/^0+(\d)/, "$1");
    if (value) value = value + "%";
    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSmartContractFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      description: "",
    }));
    setSmartContractFiles((prev) => [...prev, ...files]);
  };

  const removeSmartContractFile = (index) => {
    setSmartContractFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSmartContractFileDescriptionChange = (index, desc) => {
    setSmartContractFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, description: desc } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (selectedImages.length === 0) {
        toast.warning(
          "Nenhuma imagem selecionada. Adicione pelo menos uma imagem."
        );
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
          size: attached.file.size,
        }))
      );

      let profitability = "";
      if (rentabilidade === "indicador_juros") {
        const indicador = form.indicador || "";
        const juros = form.juros ? form.juros : "";
        profitability = `${indicador} ${juros}`.trim();
      } else if (rentabilidade === "juros") {
        profitability = form.juros ? String(form.juros) : "";
      } else if (rentabilidade === "valor_previsto") {
        profitability = form.valor_previsto ? String(form.valor_previsto) : "";
      }

      const payload = {
        title: form.titulo,
        description: form.descricao,
        total_value: valorTotal,
        total_tokens: parseInt(form.qtd_tokens),
        smart_contract_model_id: form.modelo_smart_id,
        status: "pending",
        files: filesBase64,
        attachments: attachedFilesBase64,
        profitability,
        agent_id: form.agent_id || "",
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
//  console.log("form", form);
  return (
    <ProtectedRoute>
      <div className="container max-w-5xl mx-auto mt-8 p-4">
        <div className="card shadow-lg border-0 rounded-4 p-5 animate__animated animate__fadeIn">
          <h2 className="text-3xl fw-bold mb-5 text-dark d-flex align-items-center gap-2">
            <FaBuilding className="text-dark" /> Cadastro de Propriedade
          </h2>
          <Steps model={stepsModel} />

          <form onSubmit={handleSubmit} className="row g-4">
            {currentStep === 0 && (
              <TypeContract
                tipoContrato={tipoContrato}
                setTipoContrato={setTipoContrato}
                rentabilidade={rentabilidade}
                setRentabilidade={setRentabilidade}
                form={form}
                setForm={setForm}
                attachedFiles={smartContractFiles}
                handleFileChange={handleSmartContractFileChange}
                handleFileDescriptionChange={
                  handleSmartContractFileDescriptionChange
                }
                removeAttachedFile={removeSmartContractFile}
                isDarkMode={isDarkMode}
                handleChange={handleChange}
                handlePercentChange={handlePercentChange}
                handleRentabilidadeChange={handleRentabilidadeChange}
              />
            )}

            {currentStep === 1 && (
              <PropertyData
                form={form}
                setForm={setForm}
                attachedFiles={attachedFiles}
                handleFileChange={handleFileChange}
                handleFileDescriptionChange={handleFileDescriptionChange}
                removeAttachedFile={removeAttachedFile}
                isDarkMode={isDarkMode}
                handleChange={handleChange}
                handleCurrencyChange={handleCurrencyChange}
                handlePercentChange={handlePercentChange}
                handleRentabilidadeChange={handleRentabilidadeChange}
                options={options}
                imagePreviews={imagePreviews || []}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                rentabilidade={rentabilidade}
              />
            )}

            {currentStep === 2 && (
              <div className="col-12 mb-4">
                <PropertySummary
                  form={form}
                  tipoContrato={tipoContrato}
                  rentabilidade={rentabilidade}
                  attachedFiles={attachedFiles}
                  smartContractFiles={smartContractFiles}
                  imagePreviews={imagePreviews}
                  options={options}
                />
              </div>
            )}

            <div className="col-12 d-flex gap-3 justify-content-end">
              {currentStep > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary  d-flex align-items-center gap-2"
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
                  disabled={loading || !camposValidos()}
                >
                  Próximo
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  type="submit"
                  className="btn btn-success ms-auto gap-3 d-flex align-items-center"
                  disabled={loading}
                >
                
                  {loading ? "Salvando..." : "Salvar"}
                   <i className="fas fa-check"></i>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
