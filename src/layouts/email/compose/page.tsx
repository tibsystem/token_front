'use client';

import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import dynamic from 'next/dynamic';
import { useAppSettings } from '@/config/app-settings';
import Link from 'next/link';
import { TagsInput } from 'react-tag-input-component';
import 'quill/dist/quill.snow.css';

export default function EmailCompose() {
	const { updateSettings } = useAppSettings();
	const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
	
	const mailTo: string[] = ['support@seantheme.com'];
	const mailCc: string[] = [];
	const mailBcc: string[] = [];
	const mailBody: string = '';
	const [isMobileEmailNavOn, setIsMobileEmailNavOn] = useState(false);
	const [cc, setCc] = useState(false);
	const [bcc, setBcc] = useState(false);
  
  function toggleMobileEmailNav() {
		setIsMobileEmailNavOn(!isMobileEmailNavOn);
	}
  
  function setMailBody() {
  
  }
  
	function handleCc() {
		setCc(true);
	}

	function handleBcc() {
		setBcc(true);
	}

	useEffect(() => {
		updateSettings({
			appContentFullHeight: true,
			appContentClass: 'p-0'
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
		<div className="mailbox">
			<div className="mailbox-sidebar">
				<div className="mailbox-sidebar-header d-flex justify-content-center">
					<button onClick={toggleMobileEmailNav} className="btn btn-dark btn-sm me-auto d-block d-lg-none">
						<i className="fa fa-cog"></i>
					</button>
					<Link href="/email/compose" className="btn btn-dark ps-40px pe-40px btn-sm">
						Compose
					</Link>
				</div>
				<div className={'mailbox-sidebar-content collapse d-lg-block ' + (isMobileEmailNavOn ? 'show' : '') }>
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<div className="nav-title"><b>FOLDERS</b></div>
						<ul className="nav nav-inbox">
							<li className="active"><Link href="/email/inbox"><i className="fa fa-hdd fa-lg fa-fw me-2"></i> Inbox <span className="badge bg-gray-600 fs-10px rounded-pill ms-auto fw-bolder pt-4px pb-5px px-8px">52</span></Link></li>
							<li><Link href="/email/inbox"><i className="fa fa-flag fa-lg fa-fw me-2"></i> Important</Link></li>
							<li><Link href="/email/inbox"><i className="fa fa-envelope fa-lg fa-fw me-2"></i> Sent</Link></li>
							<li><Link href="/email/inbox"><i className="fa fa-save fa-lg fa-fw me-2"></i> Drafts</Link></li>
							<li><Link href="/email/inbox"><i className="fa fa-trash-alt fa-lg fa-fw me-2"></i> Trash</Link></li>
						</ul>
						<div className="nav-title"><b>LABEL</b></div>
						<ul className="nav nav-inbox">
							<li><Link href="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-dark"></i> Admin</Link></li>
							<li><Link href="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-blue"></i> Designer & Employer</Link></li>
							<li><Link href="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-success"></i> Staff</Link></li>
							<li><Link href="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-warning"></i> Sponsorer</Link></li>
							<li><Link href="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-danger"></i> Client</Link></li>
						</ul>
					</PerfectScrollbar>
				</div>
			</div>
			<div className="mailbox-content">
				<div className="mailbox-content-header">
					<div className="btn-toolbar align-items-center">
						<div className="btn-group me-2">
							<Link href="/email/compose" className="btn btn-white btn-sm"><i className="fa fa-fw fa-envelope"></i> <span className="hidden-xs">Send</span></Link>
							<Link href="/email/compose" className="btn btn-white btn-sm"><i className="fa fa-fw fa-paperclip"></i> <span className="hidden-xs">Attach</span></Link>
						</div>
						<div>
							<a href="#/" className="btn btn-white btn-sm" data-bs-toggle="dropdown"><i className="fa fa-fw fa-ellipsis-h"></i></a>
							<div className="dropdown-menu dropdown-menu-end">
								<a href="#/" className="dropdown-item">Save draft</a>
								<a href="#/" className="dropdown-item">Show From</a>
								<a href="#/" className="dropdown-item">Check names</a>
								<a href="#/" className="dropdown-item">Switch to plain text</a>
								<a href="#/" className="dropdown-item">Check for accessibility issues</a>
							</div>
						</div>
						<div className="ms-auto">
							<Link href="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-times"></i> <span className="hidden-xs">Discard</span></Link>
						</div>
					</div>
				</div>
				<div className="mailbox-content-body">
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<form action="/" method="POST" name="email_to_form" className="mailbox-form">
							<div className="mailbox-to">
								<label className="control-label">To:</label>
								<TagsInput value={mailTo} name="mailTo" placeHolder="enter email" />
								<span className="mailbox-float-link">
									{!cc && <Link href="/email/compose" onClick={handleCc} className="me-5px">Cc</Link>}
									{!bcc && <Link href="/email/compose" onClick={handleBcc}>Bcc</Link>}
								</span>
							</div>
							{cc &&
								<div className="mailbox-to">
									<label className="control-label">Cc:</label>
									<TagsInput value={mailCc} name="mailCc" placeHolder="" />
								</div>
							}
							{bcc &&
								<div className="mailbox-to">
									<label className="control-label">Bcc:</label>
									<TagsInput value={mailBcc} name="mailBcc" placeHolder="" />
								</div>
							}
							<div className="mailbox-subject">
								<input type="text" className="form-control" placeholder="Subject" />
							</div>
							<div className="mailbox-input">
								<ReactQuill theme="snow" className="border-0 h-100" value={mailBody} onChange={setMailBody} />
							</div>
						</form>
					</PerfectScrollbar>
				</div>
				<div className="mailbox-content-footer d-flex align-items-center justify-content-end">
					<button type="submit" className="btn btn-white ps-40px pe-40px me-5px">Discard</button>
					<button type="submit" className="btn btn-primary ps-40px pe-40px">Send</button>
				</div>
			</div>
		</div>
	)
}