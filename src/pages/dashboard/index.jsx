/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/card/card';
import { getWallet } from '@/services/wallet/getWallet';
import { getProperties } from '@/services/properties/getProperties';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


function getUserIdFromToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.user_id || payload.sub || null;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export default function DashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('Token salvo no localStorage:', token);
        const userId = getUserIdFromToken();
        console.log('ID do usuário logado:', userId);
      }
      const userId = getUserIdFromToken();
      try {
        const responseWallet = await getWallet(userId);
        setWallet(responseWallet);
      } catch (err) {
        console.error('Erro ao buscar carteira:', err);
        setError(err?.response?.data?.message || err.message || 'Erro ao buscar carteira');
      }
      try {
        const responseProperties = await getProperties();
        setProperties(responseProperties);
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setError(err?.response?.data?.message || err.message || 'Erro ao buscar propriedades');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
        

    <div className="p-4 max-w-5xl mx-auto">
      <BreadCrumb />
      
      <h1 className="text-3xl font-bold mb-6 text-dark">Dashboard</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando informações...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
      )}
      {wallet && (
        <div className="row mb-4">
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-blue">
              <div className="stats-icon"><i className="fa fa-wallet"></i></div>
              <div className="stats-info">
                <h4>SALDO DISPONÍVEL</h4>
                <p>R$ {Number(wallet.saldo_disponivel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="text-gray-500">Disponível para uso</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className="widget widget-stats bg-info">
              <div className="stats-icon"><i className="fa fa-lock"></i></div>
              <div className="stats-info">
                <h4>SALDO BLOQUEADO</h4>
                <p>R$ {Number(wallet.saldo_bloqueado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="text-gray-500">Em processamento</div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-12">
            <div className="widget widget-stats bg-purple">
              <div className="stats-icon"><i className="fa fa-coins"></i></div>
              <div className="stats-info">
                <h4>SALDO TOKENIZADO</h4>
                <p>
                  {Array.isArray(wallet.saldo_tokenizado) && wallet.saldo_tokenizado.length > 0
                    ? wallet.saldo_tokenizado.map((item, idx) => (
                      <span key={idx}>R$ {Number(item).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br /></span>
                    ))
                    : 'R$ 0,00'}
                </p>
                <div className="text-gray-500">Tokens em carteira</div>
              </div>
            </div>
          </div>
        </div>
      )}
     
    </div>
        

  );
}