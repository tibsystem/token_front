import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";

export const formatCurrency = (value) => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";

  const formattedValue = (parseInt(numericValue) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formattedValue;
};

export const generatePixQRCode = (value) => {
  const pixKey = "user@exemplo.com";
  const numericValue = parseFloat(value.replace(/[R$\s.,]/g, "")) / 100;
  const pixCode = `00020126580014br.gov.bcb.pix0136${pixKey}52040000530398654${numericValue.toFixed(2)}5802BR5925Nome do Recebedor6009SAO PAULO62070503***6304`;
  return {
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`,
    pixCode
  };
};

export const generateBoleto = (value) => ({
  boletoCode: "23793.39001 60000.000000 00000.000000 0 95970000010000",
  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
  value: value,
  downloadUrl: "#"
});

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Código copiado!");
  });
};