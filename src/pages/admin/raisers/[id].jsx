
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
//componets
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import CustomModal from '@/components/modal/Modal';

//services
import { getRaiser } from '@/services/raisers/getRaiser';
import { putRaisers } from '@/services/raisers/putRaisers';
import deleteRaisers from '@/services/raisers/deleteRaisers';
import ConfirmModal from '../../../components/modal/ConfirmModal';

const RaiserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [raiser, setRaiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const editFormRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const fetchRaiser = async () => {
      try {
        setLoading(true);
        const response = await getRaiser(id);
        setRaiser(response);
      } catch (err) {
        console.error('Erro ao buscar captador:', err);
        setError('Erro ao buscar captador.');
      } finally {
        setLoading(false);
      }
    };
    fetchRaiser();
  }, [id]);

  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleSaveEdit = async () => {
    if (!editFormRef.current) return;
    const formData = new FormData(editFormRef.current);
    const updatedData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      document: formData.get('document'),
    };
    try {
      setLoading(true);
      await putRaisers(id, updatedData);
      toast.success('Captador atualizado com sucesso!');
      setRaiser({ ...raiser, ...updatedData });
    } catch (err) {
      console.error('Erro ao atualizar captador:', err);
      toast.error('Erro ao atualizar captador.');
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

const handleConfirmDelete = async () => {
  try {
    setLoading(true);
    await deleteRaisers(id);
    toast.success('Captador excluído com sucesso!');
    router.push('/admin/raisers');
  } catch (err) {
    console.error('Erro ao excluir captador:', err);
    toast.error('Erro ao excluir captador.');
  } finally {
    setLoading(false);
    setShowEditModal(false);
  }
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <div className="text-gray-500">Carregando dados do captador...</div>
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

  if (!raiser) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <i className="fa fa-info-circle me-2"></i>
          Captador não encontrado.
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mt-4">
        <Breadcrumb 
          items={[{ label: 'Captadores', path: '/admin/raisers' }, { label: `Detalhes de ${raiser.name}`, path: null }]} 
          className="mb-4"
        />
        <div className="row mb-4">
          <div className="col">
            <h1 className="h3 mb-0">Detalhes do Captador</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <div className="d-flex align-items-center">
                  <img
                    src={raiser.foto_url || '/assets/img/user/user-default.jpg'}
                    alt={raiser.name}
                    className="rounded-circle me-3"
                    style={{ width: 60, height: 60, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                    onError={e => { e.target.src = '/assets/img/user/user-default.jpg'; }}
                  />
                  <div>
                    <h4 className="mb-1">{raiser.name}</h4>
                    <small className="opacity-75">ID: {raiser.id}</small>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fa fa-user me-2"></i>
                      Informações Pessoais
                    </h6>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Email</label>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-envelope text-muted me-2"></i>
                        <span>{raiser.email}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Telefone</label>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-phone text-muted me-2"></i>
                        <span>{raiser.phone || 'Não informado'}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Documento</label>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-id-card text-muted me-2"></i>
                        <span>{raiser.document || 'Não informado'}</span>
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
                          {raiser.created_at 
                            ? new Date(raiser.created_at).toLocaleDateString('pt-BR', {
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
                          {raiser.updated_at 
                            ? new Date(raiser.updated_at).toLocaleDateString('pt-BR', {
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
                {(raiser.endereco || raiser.cidade || raiser.estado || raiser.cep) && (
                  <div className="mt-4 pt-4 border-top">
                    <h6 className="text-primary mb-3">
                      <i className="fa fa-map-marker-alt me-2"></i>
                      Endereço
                    </h6>
                    <div className="row g-3">
                      {raiser.endereco && (
                        <div className="col-md-8">
                          <label className="form-label text-muted small">Endereço</label>
                          <div>{raiser.endereco}</div>
                        </div>
                      )}
                      {raiser.cidade && (
                        <div className="col-md-4">
                          <label className="form-label text-muted small">Cidade</label>
                          <div>{raiser.cidade}</div>
                        </div>
                      )}
                      {raiser.estado && (
                        <div className="col-md-4">
                          <label className="form-label text-muted small">Estado</label>
                          <div>{raiser.estado}</div>
                        </div>
                      )}
                      {raiser.cep && (
                        <div className="col-md-4">
                          <label className="form-label text-muted small">CEP</label>
                          <div>{raiser.cep}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark">
                <h6 className="mb-0 text-white">Ações</h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary" onClick={handleShowEditModal}>
                    <i className="fa fa-edit me-2"></i>
                    Editar Captador
                  </button>
                  <button className="btn btn-outline-danger" onClick={handleShowConfirmModal}>
                    <i className="fa fa-trash me-2"></i>
                    Excluir Captador
                  </button>
          
                </div>
              </div>
            </div>
            {/* Resumo rápido */}
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Resumo</h6>
              </div>
              <div className="card-body">
                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="border rounded p-3">
                      <div className="h4 text-primary mb-1">0</div>
                      <small className="text-muted">Propriedades</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3">
                      <div className="h4 text-success mb-1">R$ 0,00</div>
                      <small className="text-muted">Total Captado</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     {setShowEditModal && (
        <CustomModal
          id="editRaiserModal"
          title="Editar Captador"
          show={showEditModal}
          onClose={handleCloseEditModal}
          confirmText="Salvar Alterações"
          onCancel={handleCloseEditModal}
          confirmVariant="success"
          onConfirm={handleSaveEdit}
        >
          <form className="row g-4 p-2" ref={editFormRef}>
            <div className="col-12 mb-3">
              <label htmlFor="editName" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="editName"
                defaultValue={raiser.name}
                name="name"
              />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="editEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="editEmail"
                defaultValue={raiser.email}
                name="email"
              />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="editPhone" className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="editPhone"
                defaultValue={raiser.phone}
                name="phone"
              />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="editDocument" className="form-label">Documento</label>
              <input
                type="text"
                className="form-control"
                id="editDocument"
                defaultValue={raiser.document}
                name="document"
              />
            </div>
            {/* Botões removidos, pois já existem no CustomModal */}
          </form>
        </CustomModal>
      )}
      {setShowConfirmModal && (
            <ConfirmModal
                    show={showConfirmModal}
                    title="Excluir Captador"
                    message="Tem certeza que deseja excluir este captador?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCloseConfirmModal}
                  />
)}
  </div>
</ProtectedRoute>
);
};

export default RaiserDetails;
