/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import { postInvestorLogin } from '@/services/login/postInvestorLogin';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useDarkMode from '@/hooks/useDarkMode';

export default function LoginV1() {
  const { updateSettings } = useAppSettings();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
		
		// eslint-disable-next-line
	}, []);
	
async function handleSubmit(event) {
  event.preventDefault();
  setError('');
  setIsSubmitting(true);

  if (!email || !password) {
    toast.warning('Por favor, preencha todos os campos.');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await postInvestorLogin({ email, password });

    if (response?.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('profileData', JSON.stringify(response.investor));
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } else {
      throw new Error('Token não fornecido.');
    }
  } catch (err) {
    console.error('Erro no login:', err);

    const backendMessage = err?.response?.data?.message;

    if (backendMessage) {
      // toast.error(backendMessage);
      toast.error('Ocorreu um erro ao tentar fazer login. Por favor,tente novamente.');
      console.error('Mensagem do backend:', backendMessage);
    } else if (err.message === 'Token não fornecido.') {
      toast.error('Erro inesperado: resposta incompleta do servidor.');
    } else {
      toast.error('Falha ao conectar. Verifique sua conexão ou tente novamente mais tarde.');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('profileData');
  } finally {
    setIsSubmitting(false);
  }
}

  
	return (
		<div className="login login-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg.png)'}}></div>
        {/* <div className="news-caption">
          <h4 className="caption-title"><b>IB3</b> Capital</h4>
          <p>
           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div> */}
      </div>
      <div className="login-container">
        <div className="login-header mb-30px">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="logo-bg"></span>
              <img src={isDarkMode ? "/assets/img/logo-light.webp" : "/assets/img/logo-dark.webp"} alt="IB3 Capital" className="logo-img" style={{height: '40px', width: 'auto', marginRight: '12px'}} />
            </div>
            <small>Área do investidor</small>
          </div>
          <div className="icon">
            <i className="fa fa-lock"></i>
          </div>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit} className="fs-13px">
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="form-floating mb-15px">
              <input
                type="username"
                className="form-control h-45px fs-13px"
                placeholder="Email Address"
                id="emailAddress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="emailAddress" className="d-flex align-items-center fs-13px text-gray-600">Email</label>
            </div>
            <div className="form-floating mb-15px">
              <input
                type="password"
                className="form-control h-45px fs-13px"
                placeholder="senha"
                id="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="senha" className="d-flex align-items-center fs-13px text-gray-600">Senha</label>
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
              </button>            </div>
            <div className="mb-40px pb-40px text-body">
               Clique <Link href="/register" className="text-primary">aqui</Link> para se cadastrar.
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <div className="text-gray-600 text-center text-gray-500-darker mb-0">
              &copy; IB3 capital Todos os direitos reservados 2025
            </div>
          </form>
        </div>
      </div>
            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    
	)
}