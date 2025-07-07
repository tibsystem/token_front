/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import api from '@/services/api';
import { postInvestorLogin } from '../../services/login/postInvestorLogin';
import useDarkMode from '@/hooks/useDarkMode';
import { toast } from 'react-toastify';

export default function LoginV1() {
        const { updateSettings } = useAppSettings();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [error, setError] = useState('');
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
    try {
      const response = await postInvestorLogin({ email, senha });
      console.log('Resposta do backend no login:', response);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('profileData', JSON.stringify(response.investidor));
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Email ou senha inválido!');
    }
  }
  
	return (
		<div className="login login-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg/login-bg-11.jpg)'}}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>IB3</b> Capital</h4>
          <p>
           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
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
                type="email"
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
                type="senha"
                className="form-control h-45px fs-13px"
                placeholder="senha"
                id="senha"
                value={senha}
                onChange={(e) => setsenha(e.target.value)}
              />
              <label htmlFor="senha" className="d-flex align-items-center fs-13px text-gray-600">Senha</label>
            </div>
         
            <div className="mb-15px">
              <button type="submit" className="btn btn-dark d-block h-45px w-100 btn-lg fs-14px">Entrar</button>
            </div>
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
    </div>
	)
}