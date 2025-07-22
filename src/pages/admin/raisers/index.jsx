
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRaisers } from '@/services/raisers/getRaisers';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Raisers = () => {
  const [raisers, setRaisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaisers = async () => {
      try {
        const response = await getRaisers();
        setRaisers(response);
      } catch (err) {
        console.error('Erro ao buscar raisers:', err, err?.response);
        setError('Erro ao carregar raisers.');
      } finally {
        setLoading(false);
      }
    };
    fetchRaisers();
  }, []);

  if (loading) return <div className="text-gray-500 animate-pulse">Carregando Captadoores...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;

  return (
    
      <div className="p-4 max-w-6xl">
        <Breadcrumb 
          items={[{ label: 'Captadores', path: '/admin/raisers' }]} 
          className="mb-4" />
        <h1 className="text-3xl font-bold mb-8 text-dark">Captadores</h1>
        <div className="row g-4">
          {raisers.length === 0 && (
            <div className="col-12 text-gray-500">Nenhum captador cadastrado.</div>
          )}
          {raisers.map((raiser) => (
            <div key={raiser.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow border-0 d-flex flex-column">
                <div className="d-flex align-items-center p-3 border-bottom">
                  <img
                    src={raiser.foto_url || '/assets/img/user/user-default.jpg'}
                    alt={raiser.nome}
                    className="rounded-circle me-3"
                    style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid #eee' }}
                    onError={e => { e.target.src = '/assets/img/user/user-default.jpg'; }}
                  />
                  <div>
                    <div className="fw-bold text-lg text-theme">{raiser.name}</div>
                    <div className="text-gray-500 text-sm">ID: {raiser.id}</div>
                  </div>
                </div>
                <div className="card-body flex-grow-1 d-flex flex-column gap-2">
                  <div className="d-flex align-items-center mb-1">
                    <i className="fa fa-envelope text-blue-600 me-2"></i>
                    <span>{raiser.email}</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <i className="fa fa-phone text-green-600 me-2"></i>
                    <span>{raiser.phone || 'Não informado'}</span>
                  </div>
                  <Link href={`/admin/raisers/${raiser.id}`} className="btn btn-outline-primary mt-auto w-100">Ver Mais</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default Raisers;
