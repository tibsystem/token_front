/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import { postLogin } from '@/services/login/postLogin';
import { toast } from 'react-toastify';
import useDarkMode from '@/hooks/useDarkMode';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function AdminLogin() {
  const { updateSettings } = useAppSettings();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    updateSettings({
      appHeaderNone: true,
      appSidebarNone: true,
      appContentClass: 'p-0'
    });
    return () => {
      updateSettings({
        appHeaderNone: false,
        appSidebarNone: false,
        appContentClass: 'p-0'
      });
    };
  }, [updateSettings]);

async function handleSubmit(event) {
  event.preventDefault();
  setError('');
  setIsSubmitting(true);

  try {
    const response = await postLogin({ email, password });

    if (response?.token) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('profileData', JSON.stringify(response.user));
      toast.success('Login realizado com sucesso!');
      window.location.href = './dashboard';
    } else {
      toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

  } catch (err) {
    console.error('Erro ao realizar login:', err);

    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status === 401 || status === 400) {
      toast.error(message || 'Email ou senha incorretos.');
      setError(message || 'Email ou senha incorretos.');
    } else if (status >= 500) {
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    } else if (err.message === 'Network Error') {
      toast.error('Sem conexão. Verifique sua internet.');
    } else {
      toast.error('Falha inesperada no login.');
      setError('Erro desconhecido.');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('profileData');
    }

  } finally {
    setIsSubmitting(false);
  }
}

  if (loading) return null;

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="login login-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg.png)'}}></div>
        {/* <div className="news-caption">
          <h4 className="caption-title"><b>IB3</b> Capital</h4>
          <p>Área exclusiva para administradores da plataforma.</p>
        </div> */}
      </div>
      <div className="login-container">
        <div className="login-header mb-30px">
          <div className="brand">
            <div className="d-flex align-items-center">
              <img src={isDarkMode ? "/assets/img/logo-light.webp" : "/assets/img/logo-dark.webp"} alt="IB3 Capital" className="logo-img" style={{height: '40px', width: 'auto', marginRight: '12px'}} />
            </div>
            <small>Administração da Plataforma</small>
          </div>
          <div className="icon">
            <i className="fa fa-lock"></i>
          </div>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit} className="fs-13px">
            <div className="form-floating mb-15px">
              <input
                type="email"
                className="form-control h-30px fs-13px"
                placeholder="Email do administrador"
                id="adminEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="adminEmail" className="d-flex align-items-center fs-13px text-gray-600">Email</label>
            </div>
            <div className="form-floating mb-15px">
              <input
                type="password"
                className="form-control h-30px fs-13px"
                placeholder="Senha"
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="adminPassword" className="d-flex align-items-center fs-13px text-gray-600">Senha</label>
            </div>
            <div className="mb-15px">
              <button 
                type="submit" 
                className="btn btn-dark d-block h-45px w-100 btn-lg fs-14px" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <AiOutlineLoading3Quarters className="spinner-border-sm me-2" style={{animation: 'spin 1s linear infinite'}} />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <div className="text-gray-600 text-center text-gray-500-darker mb-0">
              &copy;IB3 Capital  Todos os direitos reservados 2025
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}