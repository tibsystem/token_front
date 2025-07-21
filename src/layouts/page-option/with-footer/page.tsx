'use client';

import { useEffect, useReducer } from 'react';
import Highlight from 'react-highlight';
import Link from 'next/link';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
	
export default function PageOptionWithFooter() {
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
				const response = await fetch(`/assets/data/page-option/with-footer-code-${index}.json`, { signal });
				
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
		
		return () => {
			controller.abort();
		}
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><Link href="/page-option/with-footer">Home</Link></li>
        <li className="breadcrumb-item"><Link href="/page-option/with-footer">Page Options</Link></li>
        <li className="breadcrumb-item active">Page with Footer</li>
      </ol>
      <h1 className="page-header">Page with Footer <small>header small text goes here...</small></h1>

      <Panel>
        <PanelHeader>Installation Settings</PanelHeader>
        <PanelBody>
          <p>
            Add the <code>.app-footer</code> element to <code>.app-content</code> container for footer page element.
          </p>
        </PanelBody>
        <div className="hljs-wrapper">
          <Highlight className='javascript'>{state[1]}</Highlight>
        </div>
      </Panel>

      <div id="footer" className="app-footer mx-0 px-0">
        &copy; 2025 Color Admin Responsive Admin Template - Sean Ngu All Rights Reserved
      </div>
		</>
	)
}