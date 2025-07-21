'use client';

import { useEffect, useReducer } from 'react';
import Link from 'next/link';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import { useAppSettings } from '@/config/app-settings';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Highlight from 'react-highlight';
	
export default function PageOptionWithFixedFooter() {
	const { updateSettings } = useAppSettings();
	const initialState: (string | undefined)[] = Array(1).fill(undefined);
	const [state, dispatch] = useReducer(reducer, initialState);
	
	function reducer(state: typeof initialState, action: { type: string; index?: number; payload?: string }) {
		if (action.type === "SET_CODE" && action.index !== undefined) {
			const newState = [...state];
			newState[action.index] = action.payload;
			return newState;
		}
		return state;
	}
	
	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const fetchData = async (index: number) => {
			try {
				const response = await fetch(`/assets/data/page-option/with-fixed-footer-code-${index}.json`, { signal });
				
				if (!response.ok) {
					throw new Error(`Failed to load code ${index} (HTTP ${response.status})`);
				}
				
				const html = await response.text();
				dispatch({ type: "SET_CODE", index, payload: html });
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					dispatch({ type: "SET_CODE", index, payload: `Error fetching code ${index}: ${error}` });
				}
			}
		};
	
		for (let i = 1; i <= 1; i++) {
			fetchData(i);
		}
		
		updateSettings({ 
			appContentFullHeight: true,
			appContentClass: 'p-0 d-flex flex-column'
		});
		
		return () => {
			controller.abort();
			updateSettings({ 
				appContentFullHeight: false,
				appContentClass: ''
			});
		}
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div className="h-100 d-flex flex-column">
      <PerfectScrollbar className="app-content-padding flex-grow-1 overflow-hidden" options={{ suppressScrollX: true }}>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link href="/page-option/with-fixed-footer">Home</Link></li>
          <li className="breadcrumb-item"><Link href="/page-option/with-fixed-footer">Page Options</Link></li>
          <li className="breadcrumb-item active">Page with Footer</li>
        </ol>
        <h1 className="page-header">Page with Fixed Footer <small>header small text goes here...</small></h1>
        <Panel>
          <PanelHeader>Installation Settings</PanelHeader>
          <PanelBody>
            <p>
              Add the following settings into your individual page or change the variable value from <code>/config/app-settings.tsx</code> to make it globally affected in your app.
            </p>
          </PanelBody>
          <div className="hljs-wrapper">
            <Highlight className='typescript'>{state[1]}</Highlight>
          </div>
        </Panel>
      </PerfectScrollbar>

      <div id="footer" className="app-footer m-0">
        &copy; 2025 Color Admin Responsive Admin Template - Sean Ngu All Rights Reserved
      </div>
    </div>
	)
}