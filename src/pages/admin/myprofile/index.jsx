"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import UseProfile from "@/hooks/UseProfile";

export default function AdminProfile() {
  const { profileData, isLoggedIn, getUserData, checkAuthAndRedirect, isAdmin } = UseProfile();
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
    
    const cleaned = phone.replace(/\D/g, '');
    
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
        <div className="spinner-border text-dark" role="status">
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
            <h1 className="page-header mb-0">
              <i className="fa fa-user-shield me-2 text-dark"></i>
              Perfil do Administrador
            </h1>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Card Principal do Perfil */}
        <div className="col-xl-8 col-lg-8">
          <div className="card ">
            <div className="card-header bg-dark text-white">
              <h4 className="card-title mb-0">
                <i className="fa fa-user me-2"></i>
                Informações do Administrador
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Avatar e Nome */}
                <div className="col-md-4 text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <Image
                      src="/assets/img/user/profile-user.jpeg"
                      alt="Foto do Perfil"
                      width="150"
                      height="150"
                      className="rounded-circle border border-3 border-dark shadow"
                    />
                    <span className="position-absolute bottom-0 end-0 badge bg-dark rounded-pill">
                      <i className="fa fa-crown"></i>
                    </span>
                  </div>
                  <h3 className="mt-3 mb-1">{userData.nome || "Nome não informado"}</h3>
                  <p className="text-muted mb-2">{userData.email || "Email não informado"}</p>
                  <span className="badge bg-dark mb-2">
                    <i className="fa fa-shield me-1"></i>
                    Administrador
                  </span>
                  <br />
                  {getStatusBadge(userData.status)}
                </div>

                {/* Informações Detalhadas */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-id-card me-2 text-dark"></i>
                        ID do Administrador
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {userData.id || "N/A"}
                      </div>
                    </div>
                    
                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-info-circle me-2 text-dark"></i>
                        Status
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {getStatusBadge(userData.status)}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-user me-2 text-dark"></i>
                        Nome Completo
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {userData.nome || "N/A"}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-envelope me-2 text-dark"></i>
                        Email
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {userData.email || "N/A"}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-id-badge me-2 text-dark"></i>
                        Documento
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {formatDocument(userData.documento)}
                      </div>
                    </div>

                    <div className="col-sm-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-phone me-2 text-dark"></i>
                        Telefone
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {formatPhone(userData.telefone)}
                      </div>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">
                        <i className="fa fa-clock me-2 text-dark"></i>
                        Última Atualização
                      </label>
                      <div className="form-control-plaintext bg-light rounded p-2 border">
                        {formatDate(userData.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Ações Administrativas */}
        <div className="col-xl-4 col-lg-4">
          {/* <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h4 className="card-title mb-0">
                <i className="fa fa-tools me-2"></i>
                Ações Administrativas
              </h4>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-dark"
                  onClick={() => {
                    alert("Funcionalidade de editar perfil em desenvolvimento");
                  }}
                >
                  <i className="fa fa-edit me-2"></i>
                  Editar Perfil
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-warning"
                  onClick={() => {
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
                    window.location.reload();
                  }}
                >
                  <i className="fa fa-refresh me-2"></i>
                  Atualizar Dados
                </button>
                
                <hr className="my-3" />
                
                <button 
                  type="button" 
                  className="btn btn-outline-success"
                  onClick={() => {
                    window.location.href = "/admin/dashboard";
                  }}
                >
                  <i className="fa fa-tachometer-alt me-2"></i>
                  Dashboard Admin
                </button>
              </div>

              <div className="mt-4">
                <h6 className="fw-bold text-dark">
                  <i className="fa fa-shield me-2"></i>
                  Informações Privilegiadas
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-calendar me-2"></i>
                      Última atualização: {formatDate(userData.updated_at)}
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-user-shield me-2"></i>
                      ID Admin: {userData.id}
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-crown me-2"></i>
                      Nível: Administrador
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      <i className="fa fa-shield-alt me-2"></i>
                      Status: {userData.status || "Não informado"}
                    </small>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Card de Dados em JSON (para debug) */}
          {/* <div className="card mt-3 border-warning">
            <div className="card-header bg-warning text-dark">
              <h6 className="card-title mb-0">
                <i className="fa fa-code me-2"></i>
                Dados Completos (Debug)
              </h6>
            </div>
            <div className="card-body">
              <pre className="bg-light p-2 rounded small text-dark" style={{ fontSize: "10px", maxHeight: "200px", overflow: "auto" }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
