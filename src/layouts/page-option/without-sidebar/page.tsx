'use client';

import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import Highlight from 'react-highlight';
	
export default function PageOptionWithoutSidebar() {
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
				const response = await fetch(`/assets/data/page-option/without-sidebar-code-${index}.json`, { signal });
				
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
		
		updateSettings({ appSidebarNone: true });
		
		return () => {
			controller.abort();
			updateSettings({ appSidebarNone: false });
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><Link href="/page-option/without-sidebar">Home</Link></li>
        <li className="breadcrumb-item"><Link href="/page-option/without-sidebar">Page Options</Link></li>
        <li className="breadcrumb-item active">Page without Sidebar</li>
      </ol>
      <h1 className="page-header">Page without Sidebar <small>header small text goes here...</small></h1>

      <Panel>
        <PanelHeader>Installation Settings</PanelHeader>
        <PanelBody>
          <p>
            Add the following settings into your individual page or change the variable value from <code>app.jsx</code> to make it globally affected in your app.
          </p>
        </PanelBody>
        <div className="hljs-wrapper">
          <Highlight className='typescript'>{state[1]}</Highlight>
        </div>
      </Panel>

      <p>
        <Link href="/page-option/with-footer" className="btn btn-success">
          <i className="fa fa-arrow-circle-left"></i> Back to previous page
        </Link>
      </p>
		</>
	)
}