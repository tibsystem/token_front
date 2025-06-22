'use client';

import { useEffect, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import api from '@/services/api';

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
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			const { data } = await api.post('/investors', {
				nome,
				email,
				documento,
				telefone,
				senha,
				status_kyc: 'pendente',
				carteira_blockchain: null
			});
			if (data.token) {
				localStorage.setItem('token', data.token);
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
					<h4 className="caption-title"><b>Color</b> Admin App</h4>
					<p>
						Como administrador do Color Admin, você usa o console para gerenciar a conta da sua organização, adicionar novos usuários, gerenciar configurações de segurança e ativar os serviços que deseja que sua equipe acesse.
					</p>
				</div>
			</div>
			<div className="register-container">
				<div className="register-header mb-25px h1">
					<div className="mb-1">Cadastre-se</div>
					<small className="d-block fs-15px lh-16">Crie sua conta Color Admin. É grátis e sempre será.</small>
				</div>
				<div className="register-content">
					<form onSubmit={handleSubmit} className="fs-13px">
						{error && <div className="text-danger mb-2">{error}</div>}
						<div className="mb-3">
							<label className="mb-2">Nome completo <span className="text-danger">*</span></label>
							<input
								type="text"
								className="form-control fs-13px"
								placeholder="Digite seu nome completo"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="mb-2">Email <span className="text-danger">*</span></label>
							<input
								type="email"
								className="form-control fs-13px"
								placeholder="Digite seu email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="mb-2">Documento <span className="text-danger">*</span></label>
							<input
								type="text"
								className="form-control fs-13px"
								placeholder="Digite seu CPF ou documento"
								value={documento}
								onChange={(e) => setDocumento(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="mb-2">Telefone <span className="text-danger">*</span></label>
							<input
								type="text"
								className="form-control fs-13px"
								placeholder="Digite seu telefone"
								value={telefone}
								onChange={(e) => setTelefone(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
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
								Ao clicar em Cadastrar, você concorda com nossos <Link href="/user/register-v3">Termos</Link> e que leu nossa <Link href="/user/register-v3">Política de Dados</Link>, incluindo o uso de <Link href="/user/register-v3">Cookies</Link>.
							</label>
						</div>
						<div className="mb-4">
							<button type="submit" className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px">Cadastrar</button>
						</div>
						<div className="mb-4 pb-5">
							Já possui uma conta? Clique <Link href="/user/login-v3">aqui</Link> para entrar.
						</div>
						<hr className="bg-gray-600 opacity-2" />
						<p className="text-center text-gray-600">
							&copy; Color Admin Todos os direitos reservados 2025
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}