'use client';

import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import Highlight from 'react-highlight';
import Link from 'next/link';
	
export default function UiGeneral() {
	const initialState: (string | undefined)[] = Array(12).fill(undefined);
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
				const response = await fetch(`/assets/data/ui/general-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 12; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
  }, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui">UI Elements</Link></li>
				<li className="breadcrumb-item active">General</li>
			</ol>
			<h1 className="page-header">General UI Elements <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Alerts</PanelHeader>
						<PanelBody>
							<div className="alert alert-success alert-dismissible fade show mb-0">
								<strong>Success!</strong>
								This is a success alert with <a href="#/" className="alert-link">an example link</a>.
								<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Alerts Color <span className="badge bg-success">NEW</span></PanelHeader>
						<PanelBody>
							<div className="row gx-2">
								<div className="col-md-4 pb-2">
									<div className="alert alert-primary alert-dismissible fade show h-100 mb-0">
										Primary alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-info alert-dismissible fade show h-100 mb-0">
										Info alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-purple alert-dismissible fade show h-100 mb-0">
										Purple alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-indigo alert-dismissible fade show h-100 mb-0">
										Indigo alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-success alert-dismissible fade show h-100 mb-0">
										Success alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-green alert-dismissible fade show h-100 mb-0">
										Green alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-lime alert-dismissible fade show h-100 mb-0">
										Lime alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-warning alert-dismissible fade show h-100 mb-0">
										Warning alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-yellow alert-dismissible fade show h-100 mb-0">
										Yellow alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-danger alert-dismissible fade show h-100 mb-0">
										Danger alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-pink alert-dismissible fade show h-100 mb-0">
										Pink alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-dark alert-dismissible fade show h-100 mb-0">
										Dark alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-secondary alert-dismissible fade show h-100 mb-0">
										Secondary alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
								<div className="col-md-4 pb-2">
									<div className="alert alert-light alert-dismissible fade show h-100 mb-0">
										Light alert with <a href="#/" className="alert-link">an example link</a>.
										<button type="button" className="btn-close" data-bs-dismiss="alert"></button>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Notes</PanelHeader>
						<PanelBody>
							<div className="note alert-primary mb-2">
								<div className="note-icon"><i className="fab fa-facebook-f"></i></div>
								<div className="note-content">
									<h4><b>Note with icon!</b></h4>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
										Maecenas id gravida libero. Etiam semper id sem a ultricies.
									</p>
								</div>
							</div>
							<div className="note alert-warning note-with-end-icon mb-2">
								<div className="note-content text-end">
									<h4><b>Note with right icon!</b></h4>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
										Maecenas id gravida libero. Etiam semper id sem a ultricies.
									</p>
								</div>
								<div className="note-icon"><i className="fa fa-lightbulb"></i></div>
							</div>
							<div className="note alert-secondary mb-2">
								<div className="note-content">
									<h4><b>Note without icon!</b></h4>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
										Maecenas id gravida libero. Etiam semper id sem a ultricies.
									</p>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Labels & Badges <span className="badge bg-success">NEW</span>
						</PanelHeader>
						<PanelBody>
							<div className="row fs-15px">
								<div className="col-md-8">
									<div className="mb-3px">
										<span className="badge me-1 bg-danger">Danger</span>
										<span className="badge me-1 bg-warning">Warning</span>
										<span className="badge me-1 bg-yellow text-black">Yellow</span>
										<span className="badge me-1 bg-lime">Lime</span>
										<span className="badge me-1 bg-green">Green</span>
										<span className="badge bg-success">Success</span>
									</div>
									<div className="mb-3px">
										<span className="badge me-1 bg-primary">Primary</span>
										<span className="badge me-1 bg-info">Info</span>
										<span className="badge me-1 bg-purple">Purple</span>
										<span className="badge me-1 bg-indigo">Indigo</span>
										<span className="badge bg-dark">Dark</span>
									</div>
									<div className="">
										<span className="badge me-1 bg-pink">Pink</span>
										<span className="badge me-1 bg-secondary">Secondary</span>
										<span className="badge me-1 bg-default text-black">Default</span>
										<span className="badge bg-light text-dark">Light</span>
									</div>
								</div>
								<div className="col-md-4">
									<div className="mb-3px">
										<span className="badge bg-inverse rounded-pill">Badge pill</span>
									</div>
									<div>
										<span className="badge bg-secondary rounded-0">Badge square</span>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>Pagination & Pager</PanelHeader>
						<PanelBody>
							<div>
								<div className="pagination pagination-lg mb-2">
									<div className="page-item disabled"><Link href="/ui/general" className="page-link">«</Link></div>
									<div className="page-item active"><Link href="/ui/general" className="page-link">1</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">2</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">3</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">4</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">5</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">»</Link></div>
								</div>
							</div>
							<div>
								<ul className="pagination mb-2">
									<div className="page-item disabled"><Link href="/ui/general" className="page-link">«</Link></div>
									<div className="page-item active"><Link href="/ui/general" className="page-link">1</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">2</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">3</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">4</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">5</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">»</Link></div>
								</ul>
							</div>
							<div>
								<div className="pagination pagination-sm mb-3">
									<div className="page-item disabled"><Link href="/ui/general" className="page-link">«</Link></div>
									<div className="page-item active"><Link href="/ui/general" className="page-link">1</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">2</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">3</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">4</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">5</Link></div>
									<div className="page-item"><Link href="/ui/general" className="page-link">»</Link></div>
								</div>
							</div>
							<div className="pagination mb-2">
								<div className="page-item ms-auto"><Link href="/ui/general" className="page-link rounded-pill px-3">Previous</Link></div>
								<div className="page-item me-auto"><Link href="/ui/general" className="page-link rounded-pill px-3">Next</Link></div>
							</div>
							<div className="pagination">
								<div className="page-item disabled"><Link href="/ui/general" className="page-link rounded-pill px-3">&larr; Older</Link></div>
								<div className="page-item ms-auto"><Link href="/ui/general" className="page-link rounded-pill px-3">Newer &rarr;</Link></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[5]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>Progress bar</PanelHeader>
						<PanelBody>
							<div className="row">
								<div className="col-md-6 mb-3 mb-md-0">
									<div className="progress mb-2">
										<div className="progress-bar fs-10px fw-bold" style={{width: '80%'}}>Basic</div>
									</div>
									<div className="progress">
										<div className="progress-bar bg-warning progress-bar-striped fs-10px fw-bold" style={{width: '80%'}}>Striped</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="progress rounded-pill mb-2">
										<div className="progress-bar bg-indigo progress-bar-striped progress-bar-animated rounded-pill fs-10px fw-bold" style={{width: '80%'}}>Animated</div>
									</div>
									<div className="progress rounded-pill">
										<div className="progress-bar bg-dark fs-10px fw-bold" style={{width: '25%'}}>Stacked</div>
										<div className="progress-bar bg-grey fs-10px fw-bold" style={{width: '25%'}}>Stacked</div>
										<div className="progress-bar bg-lime fs-10px fw-bold" style={{width: '25%'}}>Stacked</div>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[6]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}