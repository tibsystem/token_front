'use client';

import { useEffect } from 'react';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import 'jsvectormap/dist/jsvectormap.min.css';

export default function MapVector() {
	const { updateSettings } = useAppSettings();

  function renderMap() {
  	if (typeof window !== 'undefined') {
			(async () => {
				const { default: jsVectorMap } = await import('jsvectormap');
				await import('jsvectormap/dist/maps/world.js');
				
				const theme = getComputedStyle(document.body).getPropertyValue('--bs-app-theme').trim();
				const gray500 = getComputedStyle(document.body).getPropertyValue('--bs-gray-500').trim();
				const gray900 = getComputedStyle(document.body).getPropertyValue('--bs-gray-900').trim();
				const white = getComputedStyle(document.body).getPropertyValue('--bs-white').trim();
				const bodyFontFamily = getComputedStyle(document.body).getPropertyValue('--bs-body-font-family').trim();
				const map = document.getElementById('jvectorMap');
				const mapElm = document.querySelectorAll('.jvm-tooltip');
		
				if (map) {
					mapElm.forEach(el => el.remove());
					map.innerHTML = '';
					
					const markers = [
						{ name: "Egypt", coords: [26.8206, 30.8025] },
						{ name: "Russia", coords: [61.524, 105.3188] },
						{ name: "Canada", coords: [56.1304, -106.3468] },
						{ name: "Greenland", coords: [71.7069, -42.6043] },
						{ name: "Brazil", coords: [-14.235, -51.9253] }
					];
		
					new jsVectorMap({
						selector: '#jvectorMap',
						map: 'world',
						zoomButtons: false,
						normalizeFunction: 'polynomial',
						hoverOpacity: 0.5,
						hoverColor: false,
						zoomOnScroll: false,
						series: { regions: [{ normalizeFunction: 'polynomial' }] },
						labels: { markers: { render: (marker) => marker.name } },
						focusOn: { x: 0.5, y: 0.5, scale: 1 },
						markers,
						markerStyle: {
							initial: { fill: theme, stroke: 'none', r: 5 },
							hover: { fill: theme }
						},
						markerLabelStyle: {
							initial: { fontFamily: bodyFontFamily, fontSize: '12px', fill: white }
						},
						regionStyle: {
							initial: { fill: gray500, fillOpacity: 0.5, stroke: 'none', strokeWidth: 0.4, strokeOpacity: 1 },
							hover: { fillOpacity: 0.5 }
						},
						backgroundColor: gray900,
					});
				}
			})();
		}
  }

  useEffect(() => {
    renderMap();
    
    updateSettings({
    	appContentFullHeight: true,
    	appContentClass: 'p-0 position-relative'
    });

    return () => {
			updateSettings({
				appContentFullHeight: false,
				appContentClass: ''
			});
    };
		
		// eslint-disable-next-line
  }, []);

  return (
    <div className="h-100">
      <div className="position-absolute w-100 h-100 top-0 start-0 bottom-0 end-0">
        <div id="jvectorMap" className="w-100 h-100"></div>
      </div>
      <div className="app-content-padding position-relative">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link href="/map" className="text-white">Home</Link></li>
          <li className="breadcrumb-item active text-white">Vector Map</li>
        </ol>
        <h1 className="page-header text-white">Vector Map <small className="text-white text-opacity-75">header small text goes here...</small></h1>
      </div>
    </div>
  );
}