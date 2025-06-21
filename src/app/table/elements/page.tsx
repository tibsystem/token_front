'use client';

import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import Link from 'next/link';
import Image from 'next/image';
import Highlight from 'react-highlight';
	
export default function TableElements() {
	const initialState: (string | undefined)[] = Array(10).fill(undefined);
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
				const response = await fetch(`/assets/data/table/element-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 10; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
	}, []);

	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/table/basic">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/table/basic">Tables</Link></li>
				<li className="breadcrumb-item active">Table Elements</li>
			</ol>
			<h1 className="page-header">Table Elements <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Default Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Hover Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Small</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-sm mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Responsive Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th>#</th>
											<th className="text-nowrap">Table heading</th>
											<th className="text-nowrap">Table heading</th>
											<th className="text-nowrap">Table heading</th>
											<th className="text-nowrap">Table heading</th>
											<th className="text-nowrap">Table heading</th>
											<th className="text-nowrap">Table heading</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
											<td>Table cell</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Striped</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[5]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Bordered Table</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-bordered mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>2</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>3</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[6]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>UI Elements in Table <span className="badge bg-success ms-5px">NEW</span></PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped mb-0 align-middle">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
											<th style={{ width: "1%" }}></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<Image src="/assets/img/user/user-1.jpg" alt="" width="30" height="30" className="rounded h-30px" />
											</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
											<td className="text-nowrap">
												<Link href="/table/basic" className="btn btn-sm btn-primary w-60px me-1">Edit</Link>
												<Link href="/table/basic" className="btn btn-sm btn-white w-60px">Delete</Link>
											</td>
										</tr>
										<tr>
											<td>
												<Image src="/assets/img/user/user-2.jpg" alt="" width="30" height="30" className="rounded h-30px" />
											</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
											<td className="text-nowrap">
												<div className="btn-group">
													<Link href="/table/basic" className="btn btn-white btn-sm w-90px">Settings</Link>
													<Link href="/table/basic" className="btn btn-white btn-sm dropdown-toggle w-30px no-caret" data-bs-toggle="dropdown">
													<span className="caret"></span>
													</Link>
													<div className="dropdown-menu dropdown-menu-end">
														<Link href="/table/basic" className="dropdown-item">Action 1</Link>
														<Link href="/table/basic" className="dropdown-item">Action 2</Link>
														<Link href="/table/basic" className="dropdown-item">Action 3</Link>
														<div className="dropdown-divider"></div>
														<Link href="/table/basic" className="dropdown-item">Action 4</Link>
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<td>
												<Image src="/assets/img/user/user-3.jpg" alt="" width="30" height="30" className="rounded h-30px" />
											</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
											<td className="with-btn text-nowrap">
												<Link href="/table/basic" className="btn btn-sm btn-primary w-60px me-1">Edit</Link>
												<Link href="/table/basic" className="btn btn-sm btn-white w-60px">Delete</Link>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[7]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Form Elements in Table <span className="badge bg-success ms-1">NEW</span></PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table table-striped align-middle mb-0">
									<thead>
										<tr>
											<th>
												<div className="form-check">
													<input type="checkbox" value="" id="table_checkbox_1" className="form-check-input" />
													<label htmlFor="table_checkbox_1" className="form-check-label">&nbsp;</label>
												</div>
											</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<div className="form-check">
													<input type="checkbox" value="" id="table_checkbox_2" className="form-check-input" />
													<label htmlFor="table_checkbox_2" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" id="table_radio_1" className="form-check-input" />
													<label htmlFor="table_radio_1" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" id="table_radio_2" className="form-check-input" />
													<label htmlFor="table_radio_2" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td><input type="text" className="form-control my-n1" defaultValue="Harvinder Singh" /></td>
											<td>harvinder@gmail.com</td>
										</tr>
										<tr>
											<td>
												<div className="form-check">
													<input type="radio" value="" id="table_radio_3" className="form-check-input" />
													<label htmlFor="table_radio_3" className="form-check-label">&nbsp;</label>
												</div>
											</td>
											<td>
												<div className="input-group my-n1">
													<div className="input-group-text">@</div>
													<input type="text" className="form-control" placeholder="Terry" />
												</div>
											</td>
											<td>terry@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[8]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Table Row Classes</PanelHeader>
						<PanelBody>
							<div className="table-responsive">
								<table className="table mb-0">
									<thead>
										<tr>
											<th>#</th>
											<th>Username</th>
											<th>Email Address</th>
										</tr>
									</thead>
									<tbody>
										<tr className="table-active">
											<td>1</td>
											<td>Nicky Almera</td>
											<td>nicky@hotmail.com</td>
										</tr>
										<tr className="table-info">
											<td>2</td>
											<td>Terry Khoo</td>
											<td>terry@gmail.com</td>
										</tr>
										<tr className="table-success">
											<td>3</td>
											<td>Edmund Wong</td>
											<td>edmund@yahoo.com</td>
										</tr>
										<tr className="table-warning">
											<td>4</td>
											<td>Harvinder Singh</td>
											<td>harvinder@gmail.com</td>
										</tr>
										<tr className="table-danger">
											<td>5</td>
											<td>Terry Khoo</td>
											<td>terry@gmail.com</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[9]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}