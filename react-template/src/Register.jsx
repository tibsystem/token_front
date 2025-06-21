import React, { useState, useEffect, useRef } from 'react';

export default function Register({ onRegister, onNavigateLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const netRef = useRef(null);

  useEffect(() => {
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
  }, [netRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!terms) {
      setError('Você precisa aceitar os termos');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não conferem');
      return;
    }
    setError('');
    onRegister && onRegister();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 py-3" style={{zIndex: 1000}}>
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src="/logo-light.svg" alt="logo" style={{height: 32}} />
          </a>
          <div className="ms-auto d-flex gap-2">
            <a href="#" className="btn btn-link text-white border-0 text-decoration-none" onClick={onNavigateLogin}>Login</a>
            <a href="#" className="btn btn-link text-white border-0 text-decoration-none">Register</a>
          </div>
        </div>
      </nav>
      <section className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center bg-dark bg-opacity-75">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-11 col-md-8 col-lg-6 col-xl-4">
              <div className="login-card p-4 p-md-5 bg-dark bg-opacity-50 translucent-dark rounded-4">
                <h2 className="text-center mb-4">Register</h2>
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
                    <input
                      type="password"
                      className="form-control form-control-lg text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input className="form-check-input bg-dark border-light border-opacity-25 bg-opacity-25" type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} id="terms" />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the <a href="#" className="text-decoration-underline text-white fw-500">Terms of Service</a> and <a href="#" className="text-decoration-underline text-white fw-500">Privacy Policy</a>
                    </label>
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary btn-lg bg-primary bg-opacity-75">Register</button>
                  </div>
                  <div className="opacity-75">
                    Already have an account? <a href="#" className="text-decoration-underline text-white fw-500" onClick={onNavigateLogin}>Login here</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div id="net" ref={netRef}></div>
      </section>
    </>
  );
}
