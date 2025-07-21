'use client';

import Image from 'next/image';
import { useEffect, useReducer } from 'react';
import Highlight from 'react-highlight';
import Link from 'next/link';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
	
export default function UiMediaObject() {
	const initialState: (string | undefined)[] = Array(4).fill(undefined);
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
				const response = await fetch(`/assets/data/ui/media-object-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 4; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
  }, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/ui/media-object">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui/media-object">UI Elements</Link></li>
				<li className="breadcrumb-item active">Media Object</li>
			</ol>
			<h1 className="page-header">Media Object <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Default Media Object</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-1.jpg" width="60" height="60" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-2.jpg" width="60" height="60" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link href="/ui/media-object" className="w-60px">
											<Image src="/assets/img/user/user-3.jpg" width="60" height="60" alt="" className="mw-100 rounded" />
										</Link>
										<div className="ps-3 flex-1">
											<h5 className="mb-1">Nested media heading</h5>
											<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
										</div>
									</div>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-4.jpg" width="60" height="60" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-10.jpg" width="60" height="60" alt="" className="mw-100 rounded" />
								</Link>
								<div className="ps-3 flex-1">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.</p>
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
						<PanelHeader>Media List</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-5.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link href="/ui/media-object" className="w-60px">
											<Image src="/assets/img/user/user-6.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
										</Link>
										<div className="flex-1 ps-3">
											<h5 className="mb-1">Nested media heading</h5>
											<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
										
											<hr className="bg-gray-500" />
										
											<div className="d-flex">
												<Link href="/ui/media-object" className="w-60px">
													<Image src="/assets/img/user/user-7.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
												</Link>
											
												<div className="flex-1 ps-3">
													<h5 className="mb-1">Nested media heading</h5>
													<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
												</div>
											</div>
										</div>
									</div>
								
									<hr className="bg-gray-500" />
								
									<div className="d-flex">
										<Link href="/ui/media-object" className="w-60px">
											<Image src="/assets/img/user/user-8.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
										</Link>
										<div className="flex-1 ps-3">
											<h5 className="mb-1">Nested media heading</h5>
											<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
										</div>
									</div>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<div className="flex-1 pe-3">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-0">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
								</div>
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-9.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Media Object Sizes</PanelHeader>
						<PanelBody>
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-lg-250px w-100px">
									<Image src="/assets/img/gallery/gallery-1.jpg" width="250" height="250" alt="" className="mw-100 h-auto rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-lg-200px w-80px">
									<Image src="/assets/img/gallery/gallery-2.jpg" width="200" height="200" alt="" className="mw-100 h-auto rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
								
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-lg-150px w-60px">
									<Image src="/assets/img/gallery/gallery-3.jpg" width="150" height="150" alt="" className="mw-100 h-auto rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
								</div>
							</div>
						
							<hr className="bg-gray-500" />
								
							<div className="d-flex">
								<Link href="/ui/media-object" className="w-lg-100px w-40px">
									<Image src="/assets/img/gallery/gallery-4.jpg" width="40" height="40" alt="" className="mw-100 h-auto rounded" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
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
						<PanelHeader>Media List with Button</PanelHeader>
						<PanelBody>
							<div className="d-flex mb-3">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-5.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, tempus viverra turpis.</p>
									<p className="mb-0">
										<Link href="/ui/media-object" className="btn btn-sm btn-danger me-5px">Reject</Link>
										<Link href="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex mb-3">
								<div className="flex-1 pe-3 text-end">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,  tempus viverra turpis.</p>
									<p className="mb-0">
										<Link href="/ui/media-object" className="btn btn-sm btn-success me-5px">Published</Link>
										<Link href="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-6.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex mb-3">
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-8.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
								<div className="flex-1 ps-3">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, tempus viverra turpis.</p>
									<p className="mb-0">
										<Link href="/ui/media-object" className="btn btn-sm btn-primary me-5px">Confirm</Link>
										<Link href="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
							</div>
						
							<hr className="bg-gray-500" />
						
							<div className="d-flex">
								<div className="flex-1 pe-3 text-end">
									<h5 className="mb-1">Nested media heading</h5>
									<p className="mb-2">Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,  tempus viverra turpis.</p>
									<p className="mb-0">
										<Link href="/ui/media-object" className="btn btn-sm btn-warning me-5px">Edit</Link>
										<Link href="/ui/media-object" className="btn btn-sm btn-default">Cancel</Link>
									</p>
								</div>
								<Link href="/ui/media-object" className="w-60px">
									<Image src="/assets/img/user/user-7.jpg" width="60" height="60" alt="" className="mw-100 rounded-pill" />
								</Link>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}