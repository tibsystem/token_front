'use client';

import { useEffect, useReducer } from 'react';
import Highlight from 'react-highlight';
import Link from 'next/link';
import Image from 'next/image';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
	
export default function UiModalNotifications() {
	const initialState: (string | undefined)[] = Array(2).fill(undefined);
	const [state, dispatch] = useReducer(reducer, initialState);
	
	function reducer(state: typeof initialState, action: { type: string; index?: number; payload?: string }) {
		if (action.type === "SET_CODE" && action.index !== undefined) {
			const newState = [...state];
			newState[action.index] = action.payload;
			return newState;
		}
		return state;
	}
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function addNotification(notificationType: any, notificationTitle: any, notificationMessage: any, notificationPosition: any, notificationContent?: any) {
		if (notificationContent) {
			notificationContent = (
				<div className="d-flex align-items-center bg-gray-900 rounded p-2 text-white w-100">
					<Image src="/assets/img/user/user-12.jpg" width="52" height="52" alt="" className="rounded" />
					<div className="flex-1 ps-2">
						<h6 className="mb-1">Christopher Struth</h6>
						<p className="mb-0">Bank Transfer</p>
					</div>
				</div>
			);
		}
		Store.addNotification({
			title: notificationTitle,
			message: notificationMessage,
			type: notificationType,
			insert: "top",
			container: notificationPosition,
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			dismiss: { duration: 2000 },
			content: notificationContent
		});
	}

	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const fetchData = async (index: number) => {
			try {
				const response = await fetch(`/assets/data/ui/modal-notification-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 2; i++) {
			fetchData(i);
		}
		
		return () => {
			controller.abort();
		};
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui">UI Elements</Link></li>
				<li className="breadcrumb-item active">Modal & Notification</li>
			</ol>
			<h1 className="page-header">Modal & Notification <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							React Notifications Component <span className="badge bg-success">NEW</span>
						</PanelHeader>
						<ReactNotifications />
						<PanelBody>
							<table className="table mb-0">
								<thead>
									<tr>
										<th>Description</th>
										<th>Demo</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><b className="text-dark">Bottom Left</b> Success Notification</td>
										<td><button onClick={() => addNotification('success', 'Success', 'All your data has been successfully updated', 'bottom-left')} className="btn btn-sm btn-dark">Demo</button></td>
									</tr>
									<tr>
										<td><b className="text-dark">Bottom Right</b> Default Notification</td>
										<td><button onClick={() => addNotification('default', 'Default', 'A new issue has been reported by Office Desk', 'bottom-right')} className="btn btn-sm btn-primary">Demo</button></td>
									</tr>
									<tr>
										<td><b className="text-dark">Bottom Center</b> Info Notification</td>
										<td><button onClick={() => addNotification('info', 'Info', 'You have an appointment at 4PM today', 'bottom-center')} className="btn btn-sm btn-info">Demo</button></td>
									</tr>
									<tr>
										<td><b className="text-dark">Top Left</b> Success Notification</td>
										<td><button onClick={() => addNotification('warning', 'Success', 'All your data has been successfully updated', 'top-left')} className="btn btn-sm btn-warning">Demo</button></td>
									</tr>
									<tr>
										<td><b className="text-dark">Top Right</b> Warning Notification</td>
										<td><button onClick={() => addNotification('danger', 'Danger', 'Document has been permanently removed', 'top-right')} className="btn btn-sm btn-danger">Demo</button></td>
									</tr>
									<tr>
										<td><b className="text-dark">Top Center</b> Custom Notification</td>
										<td>
											<button onClick={() => addNotification('custom', 'Success', 'All your data has been successfully updated', 'top-center', true)} className="btn btn-sm btn-default">Demo</button></td>
									</tr>
								</tbody>
							</table>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[1]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Modal</PanelHeader>
						<PanelBody>
							<table className="table">
								<thead>
									<tr>
										<th>Description</th>
										<th>Demo</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Default Modal Dialog Box.</td>
										<td><button data-bs-toggle="modal" data-bs-target="#modalDialog" className="btn btn-sm btn-success">Demo</button></td>
									</tr>
									<tr>
										<td>Modal Dialog Box with fade out animation.</td>
										<td><button data-bs-toggle="modal" data-bs-target="#modalWithoutAnimation" className="btn btn-sm btn-default">Demo</button></td>
									</tr>
									<tr>
										<td>Modal Dialog Box with full width white background.</td>
										<td><button data-bs-toggle="modal" data-bs-target="#modalMessage" className="btn btn-sm btn-primary">Demo</button></td>
									</tr>
									<tr>
										<td>Modal Dialog Box with alert message.</td>
										<td><button data-bs-toggle="modal" data-bs-target="#modalAlert" className="btn btn-sm btn-danger">Demo</button></td>
									</tr>
								</tbody>
							</table>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[2]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			
		
			<div className="modal fade" id="modalDialog">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Modal Dialog</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div className="modal-body">
							<p>
								Modal body content here...
							</p>
						</div>
						<div className="modal-footer">
							<a href="#/" className="btn btn-white" data-bs-dismiss="modal">Close</a>
							<a href="#/" className="btn btn-success">Action</a>
						</div>
					</div>
				</div>
			</div>
	
			<div className="modal" id="modalWithoutAnimation">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Modal Without Animation</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div className="modal-body">
							Modal body content here...
						</div>
						<div className="modal-footer">
							<a href="#/" className="btn btn-white" data-bs-dismiss="modal">Close</a>
						</div>
					</div>
				</div>
			</div>
	
			<div className="modal modal-message fade" id="modalMessage">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Modal Message Header</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div className="modal-body">
							<p>Text in a modal</p>
							<p>Do you want to turn on location services so GPS can use your location ?</p>
						</div>
						<div className="modal-footer">
							<a href="#/" className="btn btn-white" data-bs-dismiss="modal">Close</a>
							<a href="#/" className="btn btn-primary">Save Changes</a>
						</div>
					</div>
				</div>
			</div>
	
			<div className="modal fade" id="modalAlert">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Alert Header</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div className="modal-body">
							<div className="alert alert-danger">
								<h5><i className="fa fa-info-circle"></i> Alert Header</h5>
								<p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
							</div>
						</div>
						<div className="modal-footer">
							<a href="#/" className="btn btn-white" data-bs-dismiss="modal">Close</a>
							<a href="#/" className="btn btn-danger" data-bs-dismiss="modal">Action</a>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}