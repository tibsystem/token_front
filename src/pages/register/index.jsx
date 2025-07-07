'use client';

import { useEffect, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import { postInvestor } from '@/services/investors/postInvestor';

export default function RegisterV3() {
  const { updateSettings } = useAppSettings();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
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
       }, [updateSettings]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = {
        nome,
        email,
        documento,
        telefone,
        senha,
        status_kyc: 'pendente',
        carteira_blockchain: null
      }
      const response = await postInvestor(data);
      if (response.token) {
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      } else {
        router.push('/user/login-v3');
      }
    } catch (err) {
      console.error(err);
      setError('Falha no registro');
    }
  }

  return (
    <div className="register register-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-9.jpg)' }}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>IB3</b> Capital</h4>
          <p>
            lorem ipsum
          </p>
        </div>
      </div>
      <div className="register-container">
        <div className="register-header mb-25px h1">
          <div className="mb-1">Cadastre-se</div>
          <small className="d-block fs-15px lh-16">Crie sua conta no IB3 Capital.</small>
        </div>
        <div className="register-content">
          <form onSubmit={handleSubmit} className="fs-13px">
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className=" form-floating mb-3">
              <label className="">Nome completo <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control fs-13px"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className=" form-floating mb-3">
              <label className="">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control fs-13px"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className=" form-floating mb-3">
              <label className="">Documento <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control fs-13px"
                placeholder="Digite seu CPF ou documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </div>
            <div className=" form-floating mb-3">
              <label className="">Telefone <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control fs-13px"
                placeholder="Digite seu telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
            <div className=" form-floating mb-4">
              <label className="mb-2">Senha <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control fs-13px"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" value="" id="agreementCheckbox" required />
              <label className="form-check-label" htmlFor="agreementCheckbox">
                Ao clicar em Cadastrar, você concorda com nossos <Link href="/register">Termos</Link> e que leu nossa <Link href="/register">Política de Dados</Link>, incluindo o uso de <Link href="/register">Cookies</Link>.
              </label>
            </div>
            <div className="mb-4">
              <button type="submit" className="btn btn-dark d-block w-100 btn-lg h-45px fs-13px">Cadastrar</button>
            </div>
            <div className="mb-4 pb-5">
              Já possui uma conta? Clique <Link href="/login">aqui</Link> para entrar.
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <p className="text-center text-gray-600">
              &copy; IB3 Capital Todos os direitos reservados 2025
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}