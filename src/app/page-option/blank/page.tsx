import Link from 'next/link';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';

export default function PageOptionBlank() {
  return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/page-option/blank">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/page-option/blank">Page Options</Link></li>
				<li className="breadcrumb-item active">Blank Page</li>
			</ol>
			<h1 className="page-header">Blank Page <small>header small text goes here...</small></h1>
			<Panel>
				<PanelHeader>Panel Title here</PanelHeader>
				<PanelBody>
					Panel Content Here
				</PanelBody>
			</Panel>
		</>
  )
}