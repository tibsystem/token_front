"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import UseProfile from "@/hooks/UseProfile";

export default function MyProfile() {
  const { profileData, isLoggedIn, getUserData, checkAuthAndRedirect } = UseProfile();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  

    const user = getUserData();
    setUserData(user);
  }, [isLoggedIn, profileData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formata o telefone brasileiro
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };

  // Função para formatar o documento (CPF/CNPJ)
  const formatDocument = (doc) => {
    if (!doc) return "N/A";
    
    // Remove todos os caracteres não numéricos
    const cleaned = doc.replace(/\D/g, '');
    
    // Formata CPF
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    // Formata CNPJ
    else if (cleaned.length === 14) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
    }
    
    return doc;
  };

  // Função para obter o status com cor
  const getStatusBadge = (status) => {
    if (!status) return <span className="badge bg-secondary">N/A</span>;
    
    const statusLower = status.toLowerCase();
    let badgeClass = "badge ";
    
    switch (statusLower) {
      case "ativo":
      case "aprovado":
        badgeClass += "bg-success";
        break;
      case "pendente":
        badgeClass += "bg-warning";
        break;
      case "inativo":
      case "rejeitado":
        badgeClass += "bg-danger";
        break;
      default:
        badgeClass += "bg-secondary";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  if (!isLoggedIn || !userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header da Página */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center">
            <h1 className="page-header mb-0">Meu Perfil</h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-8">
          <div className="card">
            <div className="card-header bg-dark text-white ">
              <h4 className="card-title mt-3">Informações Pessoais</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <Image
                      src="/assets/img/user/profile-user.jpeg"
                      alt="Foto do Perfil"
                      width="150"
                      height="150"
                      className="rounded-circle border border-3 border-dark shadow"
                    />
                  </div>
                  <h3 className="mt-3 mb-1">{userData.nome || "Nome não informado"}</h3>
                  <p className="text-muted mb-2">{userData.email || "Email não informado"}</p>
                  {getStatusBadge(userData.status)}
                </div>

                {/* Informações Detalhadas */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">ID do Usuário</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {userData.id || "N/A"}
                      </div>
                    </div>
                    
                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">Status</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {getStatusBadge(userData.status)}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">Nome Completo</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {userData.nome || "N/A"}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">Email</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {userData.email || "N/A"}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">Documento</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {formatDocument(userData.documento)}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">Telefone</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {formatPhone(userData.telefone)}
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">Última Atualização</label>
                      <div className="form-control-plaintext bg-light rounded p-2">
                        {formatDate(userData.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Ações */}
        <div className="col-xl-4 col-lg-4">
          {/* <div className="card">
            <div className="card-header">
              <h4 className="card-title">Ações Rápidas</h4>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    // Aqui você pode adicionar a funcionalidade de editar perfil
                    alert("Funcionalidade de editar perfil em desenvolvimento");
                  }}
                >
                  <i className="fa fa-edit me-2"></i>
                  Editar Perfil
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    // Aqui você pode adicionar a funcionalidade de alterar senha
                    alert("Funcionalidade de alterar senha em desenvolvimento");
                  }}
                >
                  <i className="fa fa-lock me-2"></i>
                  Alterar Senha
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-info"
                  onClick={() => {
                    // Aqui você pode adicionar a funcionalidade de atualizar dados
                    window.location.reload();
                  }}
                >
                  <i className="fa fa-refresh me-2"></i>
                  Atualizar Dados
                </button>
              </div>

              <div className="mt-4">
                <h6 className="fw-bold">Informações da Conta</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-calendar me-2"></i>
                      Última atualização: {formatDate(userData.updated_at)}
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-user me-2"></i>
                      ID: {userData.id}
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-shield me-2"></i>
                      Status: {userData.status || "Não informado"}
                    </small>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Card de Dados em JSON (para debug) */}
          {/* <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">Dados Completos (Debug)</h6>
            </div>
            <div className="card-body">
              <pre className="bg-light p-2 rounded small" style={{ fontSize: "10px", maxHeight: "200px", overflow: "auto" }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
