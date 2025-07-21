'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSettings } from '@/config/app-settings';
	
export default function ExtraError() {
	
	const { updateSettings } = useAppSettings();
	
	useEffect(() => {
		// Quando o componente for montado
		updateSettings({
			appHeaderNone: true, // Esconder cabeçalho
			appSidebarNone: true, // Esconder barra lateral
			appContentClass: 'p-0 h-100', // Sem padding e altura total
			appContentFullHeight: true // Ocupa altura total
		});
		
		// Quando o componente for desmontado
		return () => {
			updateSettings({
				appHeaderNone: false,
				appSidebarNone: false,
				appContentClass: '',
				appContentFullHeight: false
			});
		};
		
	}, []);
	
	return (
		<div className="error">
      <div className="error-code">404</div>
      <div className="error-content">
        <div className="error-message">Não conseguimos encontrar...</div>
        <div className="error-desc mb-4">
          A página que você está procurando não existe. <br />
          Talvez essas páginas te ajudem a encontrar o que está buscando.
        </div>
        <div>
          <Link href="/" className="btn btn-success px-3">Ir para a Página Inicial</Link>
        </div>
      </div>
    </div>
	)
}
