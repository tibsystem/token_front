'use client';

import { useEffect, FormEvent, useState } from 'react';
import { redirect } from 'next/navigation';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';

export default function LoginV1() {
	const { updateSettings } = useAppSettings();
	const [activeBg, setActiveBg] = useState('/assets/img/login-bg/login-bg-17.jpg');
  
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
	
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
  	redirect('/');
  }
  
  const selectBg = (e: React.MouseEvent<HTMLAnchorElement>, bgKey: string, imageUrl: string) => {
    e.preventDefault();
    setActiveBg(imageUrl);
  };
  
	return (
		<>
		<div className="login login-v2 fw-bold">
			<div className="login-cover">
				<div className="login-cover-img" style={{ backgroundImage: `url(${activeBg})` }}></div>
        <div className="login-cover-bg"></div>
			</div>

			<div className="login-container">
				<div className="login-header">
					<div className="brand">
						<div className="d-flex align-items-center">
							<span className="logo"></span> <b>Color</b> Admin
						</div>
						<small>Bootstrap 5 Responsive Admin Template</small>
					</div>
					<div className="icon">
						<i className="fa fa-lock"></i>
					</div>
				</div>

				<div className="login-content">
					<form onSubmit={handleSubmit}>
						<div className="form-floating mb-20px">
							<input type="text" className="form-control fs-13px h-45px border-0" placeholder="Email Address" id="emailAddress" />
							<label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Email Address</label>
						</div>
						<div className="form-floating mb-20px">
							<input type="password" className="form-control fs-13px h-45px border-0" placeholder="Password" />
							<label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Password</label>
						</div>
						<div className="form-check mb-20px">
							<input className="form-check-input border-0" type="checkbox" value="1" id="rememberMe" />
							<label className="form-check-label fs-13px text-gray-500" htmlFor="rememberMe">
								Remember Me
							</label>
						</div>
						<div className="mb-20px">
							<button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg">Sign me in</button>
						</div>
						<div className="text-gray-500">
							Not a member yet? Click <Link href="/user/register-v3">here</Link> to register.
						</div>
					</form>
				</div>
			</div>
		</div>

		<div className="login-bg-list clearfix">
			{["17", "16", "15", "14", "13", "12"].map((num) => (
				<div key={num} className={`login-bg-list-item ${activeBg.includes(num) ? "active" : ""}`}>
					<Link href="/user/login-v2" 
						onClick={(e) => selectBg(e, `bg${num}`, `/assets/img/login-bg/login-bg-${num}.jpg`)} 
						style={{ backgroundImage: `url(/assets/img/login-bg/login-bg-${num}.jpg)` }}
						className="login-bg-list-link">
					</Link>
				</div>
			))}
		</div>
		</>
	)
}