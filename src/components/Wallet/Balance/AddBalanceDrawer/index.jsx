
import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { postWalletFunds } from '@/services/wallet/postWalletFunds';
import { getUserIdFromToken } from '@/utils/auth';
import { FiCreditCard, FiSmartphone, FiFileText } from "react-icons/fi";
import { lightTheme, darkTheme } from "./themes";
import { formatCurrency, generatePixQRCode, generateBoleto } from "./utils";
import DrawerShell from "./DrawerShell";
import AddBalanceForm from "./AddBalanceForm";
import PaymentDetails from "./PaymentDetails";
import SuccessView from "./SuccessView";

const paymentMethods = [
  { value: "pix", label: "Pix", icon: FiSmartphone, description: "Transferência instantânea" },
  { value: "boleto", label: "Boleto", icon: FiFileText, description: "Vencimento em 3 dias" }
];

export const globalStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function AddBalanceDrawer({ isDark = false, show, onClose }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [errors, setErrors] = useState({});

  const theme = isDark ? darkTheme : lightTheme;

  const handleAmountChange = (e) => {
    setAmount(formatCurrency(e.target.value));
    if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!amount || parseFloat(amount.replace(/[R$\s.,]/g, "")) < 100) {
      newErrors.amount = "Valor mínimo é R$ 1,00";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetState = () => {
    setAmount("");
    setPaymentMethod("pix");
    setIsSuccess(false);
    setShowPayment(false);
    setPaymentData(null);
    setErrors({});
  };

  const handleCloseAll = () => {
    resetState();
    onClose();
  };
  
  const handleBack = () => {
      setShowPayment(false);
      setPaymentData(null);
  };

  const mutation = useMutation({
    mutationFn: async ({ userId, amount }) => {
      // Converter para número (float) antes de enviar
      const valor = parseFloat(String(amount).replace(/[^\d,\.]/g, '').replace(',', '.'));
      return await postWalletFunds(userId, valor);
    },
    onSuccess: (data, variables) => {
      if (paymentMethod === "pix") {
        const { qrCodeUrl, pixCode } = generatePixQRCode(amount);
        setPaymentData({ type: "pix", qrCodeUrl, pixCode, amount });
        setShowPayment(true);
      } else if (paymentMethod === "boleto") {
        const boletoData = generateBoleto(amount);
        setPaymentData({ type: "boleto", ...boletoData });
        setShowPayment(true);
      } else if (paymentMethod === "credit") {
        setIsSuccess(true);
        setTimeout(() => {
          handleCloseAll();
        }, 2500);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      setErrors({ amount: 'Erro ao adicionar saldo. Tente novamente.' });
    }
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const userId = getUserIdFromToken();
    mutation.mutate({ userId, amount });
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isSuccess) {
      return {
        title: "Sucesso",
        subtitle: "Pagamento concluído",
        content: <SuccessView theme={theme} />
      };
    }
    if (showPayment && paymentData) {
      const isPix = paymentData.type === "pix";
      return {
        title: isPix ? "Pagamento via Pix" : "Boleto Bancário",
        subtitle: isPix ? "Escaneie o QR Code ou copie o código" : "Pague usando o código de barras",
        onBack: handleBack,
        content: <PaymentDetails paymentData={paymentData} theme={theme} />
      };
    }
    return {
      title: "Adicionar Saldo",
      subtitle: "Adicione créditos à sua conta",
      content: (
        <AddBalanceForm
          amount={amount}
          handleAmountChange={handleAmountChange}
          errors={errors}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentMethods={paymentMethods}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          theme={theme}
        />
      )
    };
  };

  const { title, subtitle, content, onBack } = renderContent();

  return (
    <>
      <style jsx global>{globalStyles}</style>
      <DrawerShell
        show={show}
        onClose={handleCloseAll}
        onBack={onBack}
        theme={theme}
        title={title}
        subtitle={subtitle}
      >
        {content}
      </DrawerShell>
    </>
  );
}