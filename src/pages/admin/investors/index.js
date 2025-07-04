/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvestors } from '@/services/investors/getInvestors';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';

const Investidores = () => {
  const [investidores, setInvestidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestidores = async () => {
      try {
        const response = await getInvestors();
        setInvestidores(response);
      } catch (err) {
        console.error('Erro ao buscar investidores:', err, err?.response);
        setError('Erro ao carregar investidores.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestidores();
  }, []);

  if (loading) return <div className="text-gray-500 animate-pulse">Carregando investidores...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;

  return (

    <div className="p-4 max-w-6xl mx-auto">
      <Breadcrumb 
      items={[
        { label: 'Administração', path: '/admin/dashboard' },
        { label: 'Investidores', path: '/admin/investors' }
      ]}
      
      className="mb-4" />
      <h1 className="text-3xl font-bold mb-8 text-dark">Investidores</h1>
      <div className="row g-4">
        {investidores.length === 0 && (
          <div className="col-12 text-gray-500">Nenhum investidor cadastrado.</div>
        )}
        {investidores.map((inv) => (
          <div key={inv.id} className="col-lg-4 col-md-6">
            <div className="card h-100 shadow border-0 d-flex flex-column">
              <div className="d-flex align-items-center p-3 border-bottom">
                <img
                  src={inv.foto_url || '/assets/img/user/user-default.jpg'}
                  alt={inv.nome}
                  className="rounded-circle me-3"
                  style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid #eee' }}
                  onError={e => { e.target.src = '/assets/img/user/user-default.jpg'; }}
                />
                <div>
                  <div className="fw-bold text-lg text-theme">{inv.nome}</div>
                  <div className="text-gray-500 text-sm">ID: {inv.id}</div>
                </div>
              </div>
              <div className="card-body flex-grow-1 d-flex flex-column gap-2">
                <div className="d-flex align-items-center mb-1">
                  <i className="fa fa-envelope text-blue-600 me-2"></i>
                  <span>{inv.email}</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <i className="fa fa-phone text-green-600 me-2"></i>
                  <span>{inv.telefone || 'Não informado'}</span>
                </div>
                <Link href={`/admin/investors/${inv.id}`} className="btn btn-primary mt-auto w-100">Ver Mais</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investidores;
