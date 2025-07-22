import { useEffect, useState } from "react";
import "./DarkModeSwitcher.modules.css";

const DarkModeSwitcher = () => {
  const { handleSetAppDarkMode } = useAppContext();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("appDarkMode");
    if (darkMode === "true") {
      setIsChecked(true);
      handleSetAppDarkMode(true);
    } else {
      setIsChecked(false);
      handleSetAppDarkMode(false);
    }
  }, [handleSetAppDarkMode]);

  const handleDarkMode = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    handleSetAppDarkMode(checked);
  };

  return (
    <>
      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onChange={handleDarkMode}
          checked={isChecked}
        />
        <label htmlFor="checkbox" className="checkbox-label">
          <i className="fas fa-moon"></i>
          <i className="fas fa-sun"></i>
          <span className="ball"></span>
        </label>
      </div>
    </>
  );
};

export default DarkModeSwitcher;
