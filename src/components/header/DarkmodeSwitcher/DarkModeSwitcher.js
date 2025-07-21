import { useEffect, useState } from "react";
import "./DarkModeSwitcher.modules.css";

const DarkModeSwitcher = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Se props checked for fornecido, usa ele, senão verifica o sistema
    if (typeof checked !== 'undefined') {
      setIsChecked(checked);
    } else {
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
    }
  }, [checked]);

  const handleDarkMode = (e) => {
    const checkedValue = e.target.checked;
    
    // Se onChange prop for fornecido, usa ele
    if (onChange) {
      onChange(e);
    } else {
      // Comportamento padrão
      setIsChecked(checkedValue);
      const mode = checkedValue ? 'dark' : 'light';
      document.documentElement.setAttribute('data-bs-theme', mode);
      localStorage.setItem('appMode', mode);
      document.dispatchEvent(new Event('theme-reload'));
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        className="checkbox"
        id="darkModeCheckbox"
        onChange={handleDarkMode}
        checked={typeof checked !== 'undefined' ? checked : isChecked}
      />
      <label htmlFor="darkModeCheckbox" className="checkbox-label">
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default DarkModeSwitcher;
