import React, { useState, useEffect, useRef } from 'react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState('');
  const netRef = useRef(null);

  useEffect(() => {
    // Carrega o efeito VANTA.HALO se disponível
    if (window.VANTA && window.VANTA.HALO && netRef.current) {
      const vantaEffect = window.VANTA.HALO({
        el: netRef.current,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        color: 0xfd3995,
        size: 1.6,
        scale: 0.75,
        xOffset: 0.22,
        scaleMobile: 0.50,
      });
      return () => { if (vantaEffect && vantaEffect.destroy) vantaEffect.destroy(); };
    }
  }, [netRef, showToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Usuário ou senha inválidos');
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (token === 'admintoken') {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Token inválido');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 py-3" style={{zIndex: 1000}}>
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src="/logo-light.svg" alt="logo" style={{height: 32}} />
          </a>
          <div className="ms-auto d-flex gap-2">
            <a href="#" className="btn btn-link text-white border-0 text-decoration-none">Login</a>
            <a href="#" className="btn btn-link text-white border-0 text-decoration-none">Register</a>
          </div>
        </div>
      </nav>
      <section className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center bg-dark bg-opacity-75">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-11 col-md-8 col-lg-6 col-xl-4">
              {!showToken ? (
                <div id="regular-login" className="login-card p-4 p-md-5 bg-dark bg-opacity-50 translucent-dark rounded-4">
                  <h2 className="text-center mb-4">Login</h2>
                  <p className="text-center text-white opacity-50 mb-4">Keep it all together and you'll be free</p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Email or Phone</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type="password"
                          className="form-control form-control-lg text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary btn-lg bg-primary bg-opacity-75">Sign In</button>
                    </div>
                    <div className="text-center mb-4">
                      <a href="#" className="text-decoration-none small text-white">Forgot Password?</a>
                    </div>
                    <div className="divider small text-white opacity-25">or</div>
                    <div className="d-grid mb-3">
                      <button type="button" className="btn btn-dark bg-opacity-50 border-dark btn-lg" onClick={() => { setShowToken(true); setError(''); }}>
                        Login Using Token
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div id="token-login" className="login-card p-4 p-md-5 bg-dark bg-opacity-50 translucent-dark rounded-4">
                  <h2 className="text-center mb-4">Login</h2>
                  <p className="text-center text-white opacity-50 mb-4">Keep it all together and you'll be free</p>
                  <form onSubmit={handleTokenSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Token</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        required
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary btn-lg bg-primary bg-opacity-75">Sign In with Token</button>
                    </div>
                    <div className="divider small text-white opacity-25">or</div>
                    <div className="d-grid mb-3">
                      <button type="button" className="btn btn-dark bg-opacity-50 border-dark btn-lg" onClick={() => { setShowToken(false); setError(''); }}>
                        Sign In Using Password
                      </button>
                    </div>
                  </form>
                  {/* Social login buttons (Google, Microsoft, Apple) */}
                  <div className="d-grid mb-3">
                    <button type="button" className="btn btn-lg bg-opacity-75 mb-2" style={{
                      '--bs-btn-bg': '#4285F4', '--bs-btn-border-color': '#4285F4', '--bs-btn-color': '#FFFFFF',
                      '--bs-btn-hover-bg': '#357ae8', '--bs-btn-hover-border-color': '#357ae8', '--bs-btn-hover-color': '#FFFFFF',
                      '--bs-btn-active-bg': '#3367d6', '--bs-btn-active-border-color': '#3367d6', '--bs-btn-active-color': '#FFFFFF',
                    }}>Sign In Using Google</button>
                  </div>
                  <div className="d-grid mb-3">
                    <button type="button" className="btn btn-lg bg-opacity-75 mb-2" style={{
                      '--bs-btn-bg': '#0078D4', '--bs-btn-border-color': '#0078D4', '--bs-btn-color': '#FFFFFF',
                      '--bs-btn-hover-bg': '#005A9E', '--bs-btn-hover-border-color': '#005A9E', '--bs-btn-hover-color': '#FFFFFF',
                      '--bs-btn-active-bg': '#004377', '--bs-btn-active-border-color': '#004377', '--bs-btn-active-color': '#FFFFFF',
                    }}>Sign In Using Microsoft</button>
                  </div>
                  <div className="d-grid mb-3">
                    <button type="button" className="btn btn-lg bg-opacity-75 mb-2" style={{
                      '--bs-btn-bg': '#D1D1D6', '--bs-btn-border-color': '#D1D1D6', '--bs-btn-color': '#000000',
                      '--bs-btn-hover-bg': '#C7C7CC', '--bs-btn-hover-border-color': '#C7C7CC', '--bs-btn-hover-color': '#000000',
                      '--bs-btn-active-bg': '#BABAC0', '--bs-btn-active-border-color': '#BABAC0', '--bs-btn-active-color': '#000000',
                    }}>Sign In Using Apple</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="net" ref={netRef}></div>
      </section>
    </>
  );
}
