/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getInvestorById } from '../../../services/investors/getInvestorById';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-toastify';

const InvestorDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchInvestor = async () => {
      try {
        setLoading(true);
        const response = await getInvestorById(id);
        setInvestor(response);
      } catch (err) {
        console.error('Erro ao buscar investidor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  const handleShowWallet = () => {
    setShowWalletModal(true);
  };

  const handleCloseWalletModal = () => {
    setShowWalletModal(false);
  };

  const handleCopyWalletAddress = async () => {
    if (!investor.carteira_blockchain) return;
    
    const toastId = toast.loading('Copiando endereço...');
    
    try {
      await navigator.clipboard.writeText(investor.carteira_blockchain);
      toast.update(toastId, {
        render: 'Endereço copiado com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Erro ao copiar endereço',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const getKycStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <span className="badge bg-success">Aprovado</span>;
      case 'pending':
        return <span className="badge bg-warning">Pendente</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejeitado</span>;
      default:
        return <span className="badge bg-secondary">Não informado</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <div className="text-gray-500">Carregando dados do investidor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fa fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <i className="fa fa-info-circle me-2"></i>
          Investidor não encontrado.
        </div>
        
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className=" mt-4">
      <Breadcrumb 
        items={[
          { label: 'Investidores', path: '/admin/investors' },
          { label: `Detalhes de ${investor.nome}`, path: null }
        ]}
        className="mb-4"
      />
      
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-0">Detalhes do Investidor</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <div className="d-flex align-items-center">
                <img
                  src={investor.foto_url || '/assets/img/user/user-default.jpg'}
                  alt={investor.nome}
                  className="rounded-circle me-3"
                  style={{ width: 60, height: 60, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                  onError={e => { e.target.src = '/assets/img/user/user-default.jpg'; }}
                />
                <div>
                  <h4 className="mb-1">{investor.nome}</h4>
                  <small className="opacity-75">ID: {investor.id}</small>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {/* Informações Pessoais */}
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="fa fa-user me-2"></i>
                    Informações Pessoais
                  </h6>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Email</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-envelope text-muted me-2"></i>
                      <span>{investor.email}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Telefone</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-phone text-muted me-2"></i>
                      <span>{investor.telefone || 'Não informado'}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">CPF</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-id-card text-muted me-2"></i>
                      <span>{investor.cpf || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="fa fa-info-circle me-2"></i>
                    Informações Adicionais
                  </h6>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Data de Cadastro</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-calendar text-muted me-2"></i>
                      <span>
                        {investor.created_at 
                          ? new Date(investor.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Não informado'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Status</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-circle text-success me-2"></i>
                      <span className="badge bg-success">Ativo</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Última Atualização</label>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-clock text-muted me-2"></i>
                      <span>
                        {investor.updated_at 
                          ? new Date(investor.updated_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Não informado'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {(investor.endereco || investor.cidade || investor.estado || investor.cep) && (
                <div className="mt-4 pt-4 border-top">
                  <h6 className="text-primary mb-3">
                    <i className="fa fa-map-marker-alt me-2"></i>
                    Endereço
                  </h6>
                  <div className="row g-3">
                    {investor.endereco && (
                      <div className="col-md-8">
                        <label className="form-label text-muted small">Endereço</label>
                        <div>{investor.endereco}</div>
                      </div>
                    )}
                    {investor.cidade && (
                      <div className="col-md-4">
                        <label className="form-label text-muted small">Cidade</label>
                        <div>{investor.cidade}</div>
                      </div>
                    )}
                    {investor.estado && (
                      <div className="col-md-4">
                        <label className="form-label text-muted small">Estado</label>
                        <div>{investor.estado}</div>
                      </div>
                    )}
                    {investor.cep && (
                      <div className="col-md-4">
                        <label className="form-label text-muted small">CEP</label>
                        <div>{investor.cep}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar com ações */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h6 className="mb-0">Ações</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fa fa-edit me-2"></i>
                  Editar Investidor
                </button>
                <button className="btn btn-outline-info">
                  <i className="fa fa-chart-line me-2"></i>
                  Ver Investimentos
                </button>
                <button className="btn btn-outline-success" onClick={handleShowWallet}>
                  <i className="fa fa-wallet me-2"></i>
                  Ver Carteira
                </button>
                <button className="btn btn-outline-warning">
                  <i className="fa fa-history me-2"></i>
                  Histórico de Transações
                </button>
              </div>
            </div>
          </div>

          {/* Resumo rápido */}
          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h6 className="mb-0">Resumo</h6>
            </div>
            <div className="card-body">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="h4 text-primary mb-1">0</div>
                    <small className="text-muted">Investimentos</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <div className="h4 text-success mb-1">R$ 0,00</div>
                    <small className="text-muted">Total Investido</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWalletModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseWalletModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  <i className="fa fa-wallet me-2"></i>
                  Informações da Carteira
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseWalletModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="text-dark mb-3">
                          <i className="fa fa-shield-alt me-2"></i>
                          Status KYC (Know Your Customer)
                        </h6>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-bold">Status atual:</div>
                            <small className="text-muted">Verificação de identidade</small>
                          </div>
                          <div>
                            {getKycStatusBadge(investor.status_kyc)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="text-dark mb-3">
                          <i className="fa fa-link me-2"></i>
                          Endereço da Carteira Blockchain
                        </h6>
                        <div>
                          <div className="fw-bold mb-2">Endereço:</div>
                          {investor.wallet_blockchain ? (
                            <div className="d-flex align-items-center">
                              <code className="bg-white p-2 text-dark rounded border flex-grow-1 me-2" style={{ fontSize: '14px', wordBreak: 'break-all' }}>
                                {investor.wallet_blockchain}
                              </code>
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={handleCopyWalletAddress}
                                title="Copiar endereço"
                              >
                                <i className="fa fa-copy"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="text-muted">
                              <i className="fa fa-exclamation-triangle me-2"></i>
                              Carteira blockchain não configurada
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="text-dark mb-3">
                          <i className="fa fa-info-circle me-2"></i>
                          Informações Importantes
                        </h6>
                        <div className="small text-muted">
                          <ul className="mb-0">
                            <li>O status KYC deve estar "aprovado" para realizar transações</li>
                            <li>O endereço da carteira blockchain é único e não pode ser alterado</li>
                            <li>Mantenha o endereço da carteira seguro e não o compartilhe desnecessariamente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseWalletModal}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default InvestorDetails;