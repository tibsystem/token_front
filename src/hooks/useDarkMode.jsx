'use client';

import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      setIsDarkMode(currentTheme === 'dark');
    };

    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { isDarkMode, setIsDarkMode };
}
