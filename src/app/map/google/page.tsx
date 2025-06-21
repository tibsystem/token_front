'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useAppSettings } from '@/config/app-settings';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';

export default function MapGoogle() {
	const { updateSettings } = useAppSettings();
  const center = useMemo(() => ({ lat: -3.745, lng: -38.523 }), []);

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
  });

  const onLoad = useCallback((map: google.maps.Map) => {
		const bounds = new window.google.maps.LatLngBounds(center);
		map.fitBounds(bounds);
	}, [center]);

  const onUnmount = useCallback(() => {
  }, []);

  useEffect(() => {
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
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          />
        ) : null}
      </div>

      <div className="app-content-padding position-relative">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link href="/map" className="text-white">Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Map</li>
        </ol>
        <h1 className="page-header text-white">
          Google Map <small className="text-white-transparent-5">header small text goes here...</small>
        </h1>
      </div>
    </div>
  );
}