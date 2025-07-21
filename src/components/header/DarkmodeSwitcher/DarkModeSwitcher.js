import { useEffect, useState } from "react";

const DarkModeSwitcher = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Verificar o modo atual do sistema
    const checkCurrentMode = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const isDark = currentTheme === 'dark' || localStorage.getItem('appMode') === 'dark';
      setIsChecked(isDark);
    };

    checkCurrentMode();

    // Observer para detectar mudanças no atributo data-bs-theme
    const observer = new MutationObserver(() => {
      checkCurrentMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleDarkMode = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    
    const mode = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', mode);
    localStorage.setItem('appMode', mode);
    
    document.dispatchEvent(new Event('theme-reload'));
  };

  return (
    <div className="navbar-item d-none d-md-block">
      <div className="navbar-link">
        <input
          type="checkbox"
          className="checkbox"
          id="darkModeCheckbox"
          onChange={handleDarkMode}
          checked={isChecked}
        />
        <label htmlFor="darkModeCheckbox" className="checkbox-label">
          <i className="fas fa-moon"></i>
          <i className="fas fa-sun"></i>
          <span className="ball"></span>
        </label>
      </div>
    </div>
  );
};

export default DarkModeSwitcher;
