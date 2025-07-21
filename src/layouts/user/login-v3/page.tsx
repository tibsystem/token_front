'use client';

import { useEffect, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import api from '@/services/api';

export default function LoginV1() {
        const { updateSettings } = useAppSettings();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [error, setError] = useState('');
	
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
	
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/investor-login', {
        email,
        senha,
      });
      console.log('Resposta do backend no login:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Falha no login');
    }
  }
  
	return (
		<div className="login login-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg/login-bg-11.jpg)'}}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>Color</b> Admin App</h4>
          <p>
            Download the Color Admin app for iPhone®, iPad®, and Android™. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
      <div className="login-container">
        <div className="login-header mb-30px">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="logo"></span>
              <b>Color</b> Admin
            </div>
            <small>Bootstrap 5 Responsive Admin Template</small>
          </div>
          <div className="icon">
            <i className="fa fa-sign-in-alt"></i>
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
              <label htmlFor="emailAddress" className="d-flex align-items-center fs-13px text-gray-600">Email Address</label>
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
              <label htmlFor="senha" className="d-flex align-items-center fs-13px text-gray-600">senha</label>
            </div>
            <div className="form-check mb-30px">
              <input className="form-check-input" type="checkbox" value="1" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
            <div className="mb-15px">
              <button type="submit" className="btn btn-theme d-block h-45px w-100 btn-lg fs-14px">Sign me in</button>
            </div>
            <div className="mb-40px pb-40px text-body">
              Not a member yet? Click <Link href="/user/register-v3" className="text-primary">here</Link> to register.
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <div className="text-gray-600 text-center text-gray-500-darker mb-0">
              &copy; Color Admin All Right Reserved 2025
            </div>
          </form>
        </div>
      </div>
    </div>
	)
}