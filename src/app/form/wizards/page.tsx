'use client';

import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import Highlight from 'react-highlight';
import Link from 'next/link';
	
export default function FormWizards() {
	const initialState: (string | undefined)[] = Array(3).fill(undefined);
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
				const response = await fetch(`/assets/data/form/wizard-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 3; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/form/wizards">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/form/wizards">Form Stuff</Link></li>
				<li className="breadcrumb-item active">Wizards</li>
			</ol>
			<h1 className="page-header">Wizards <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 1
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-1 mb-2">
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link completed">
											<div className="nav-no">1</div>
											<div className="nav-text">Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link completed">
											<div className="nav-no">2</div>
											<div className="nav-text">Second step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link active">
											<div className="nav-no">3</div>
											<div className="nav-text">Active step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link disabled">
											<div className="nav-no">4</div>
											<div className="nav-text">Disabled step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link disabled">
											<div className="nav-no">5</div>
											<div className="nav-text">Last step</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 2
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-2 mb-3">
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link completed">
											<div className="nav-text">1. Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link active">
											<div className="nav-text">2. Active step text</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link disabled">
											<div className="nav-text">3. Disabled step text</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Wizard layout 3
						</PanelHeader>
						<PanelBody>
							<p>Wizard layout include the number of step and text. Please do note that all the wizard is for uxui ONLY but do not include any javascript or backend logic.</p>
							<div className="nav-wizards-container">
								<nav className="nav nav-wizards-3 mb-2">
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link completed">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 1</div>
											<div className="nav-text">Completed step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link completed">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 2</div>
											<div className="nav-text">Second step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link active">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 3</div>
											<div className="nav-text">Active step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link disabled">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 4</div>
											<div className="nav-text">Disabled step</div>
										</Link>
									</div>
									<div className="nav-item col">
										<Link href="/form/wizards" className="nav-link disabled">
											<div className="nav-dot"></div>
											<div className="nav-title">Step 5</div>
											<div className="nav-text">Last step</div>
										</Link>
									</div>
								</nav>
							</div>
							<div className="card">
								<div className="card-body">
									wizard content here
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}