'use client';

import { useEffect, useReducer } from 'react';
import Highlight from 'react-highlight';
import Link from 'next/link';
import { Panel, PanelHeader, PanelBody, PanelFooter } from '@/components/panel/panel';
import PerfectScrollbar from 'react-perfect-scrollbar';
	
export default function UiWidgetBoxes() {
	const initialState: (string | undefined)[] = Array(23).fill(undefined);
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
				const response = await fetch(`/assets/data/ui/widget-boxes-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 23; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
  }, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/ui/widget-boxes">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui/widget-boxes">UI Elements</Link></li>
				<li className="breadcrumb-item active">Widget Boxes</li>
			</ol>
			<h1 className="page-header">Widget Boxes <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Panel (Default)</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								<div className="flex-1">Panel Header with Dropdown</div>
								<div className="btn-group my-n1">
									<button type="button" className="btn btn-success btn-xs">Action</button>
									<button type="button" className="btn btn-success btn-xs dropdown-toggle" data-bs-toggle="dropdown"><b className="caret"></b></button>
									<div className="dropdown-menu dropdown-menu-end">
										<a href="#/" className="dropdown-item">Action</a>
										<a href="#/" className="dropdown-item">Another action</a>
										<a href="#/" className="dropdown-item">Something else here</a>
										<div className="dropdown-divider"></div>
										<a href="#/" className="dropdown-item">Separated link</a>
									</div>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
						<Highlight className='html'>{state[2]}</Highlight>
					</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								<div className="flex-1">Panel Header with Radio Button</div>
								<div className="btn-group btn-group-toggle my-n1" data-toggle="buttons">
									<input type="radio" name="options" className="btn-check" id="option1" autoComplete="off" defaultChecked />
									<label className="btn btn-success btn-xs" htmlFor="option1"> Option 1</label>
						
									<input type="radio" name="options" className="btn-check" id="option2" autoComplete="off" />
									<label className="btn btn-success btn-xs" htmlFor="option2"> Option 2</label>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex align-items-center">
								Panel Header with Progress Bar
								<div className="progress progress-sm ms-auto my-n1 w-150px h-10px bg-gray-700">
									<div className="progress-bar progress-bar-striped bg-success progress-bar-animated" style={{width: '40%'}}>40%</div>
								</div>
							</div>
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader noButton={true}>
							Panel Header with Badge <span className="badge bg-success ms-2">NEW</span> 
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[5]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Alert Box
						</PanelHeader>
						<div className="alert alert-success alert-dismissible fade show rounded-0 mb-0">
							<div className="d-flex">
								<i className="fa fa-check fa-2x me-1"></i>
								<div className="mb-0 ps-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac posuere lacus, quis suscipit sem. Nulla sagittis aliquam erat non convallis.
								</div>
							</div>
							<button type="button" className="btn-close ms-3" data-bs-dismiss="alert"></button>
						</div>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[6]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel className="panel-hover-icon">
						<PanelHeader>
							Hover View Icon
						</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[7]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Scrollbar
						</PanelHeader>
						<PanelBody>
							<PerfectScrollbar style={{height: '280px'}} options={{suppressScrollX: true}}>
								<p>
									<span className="fa-stack fa-4x float-start me-10px text-dark">
										<i className="fab fa-twitter fa-stack-1x"></i>
									</span>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed enim arcu. 
									Ut posuere in ligula quis ultricies. In in justo turpis. Donec ut dui at massa gravida 
									interdum nec vitae justo. Quisque ullamcorper vehicula dictum. Nullam hendrerit interdum eleifend. 
									Aenean luctus sed arcu laoreet scelerisque. Vivamus non ullamcorper mauris, id sagittis lorem. 
									Proin tincidunt mauris et dolor mattis imperdiet. Sed facilisis mattis diam elementum adipiscing. 
								</p>
								<p>
									<span className="fa-stack fa-4x float-end ms-10px text-dark">
										<i className="fab fa-google-plus fa-stack-1x"></i>
									</span>
									Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
									Ut ante velit, pretium non nisi a, egestas placerat diam. Nullam aliquet iaculis ultricies. 
									Aliquam volutpat, sapien quis volutpat elementum, ligula purus auctor diam, at vestibulum nulla augue 
									vel purus. Praesent ac nisl a magna tincidunt interdum sed in turpis. Maecenas nec condimentum risus. 
									In congue pretium est, eget euismod tortor ornare quis.
								</p>
								<p>
									<span className="fa-stack fa-4x float-start me-10px text-dark">
										<i className="fab fa-facebook fa-stack-1x"></i>
									</span>
									Praesent eu ultrices justo. Vestibulum ante 
									ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
									Cras mattis ipsum quis sapien consectetur fringilla. 
									Etiam sagittis sem tempus purus elementum, vitae pretium sapien porta. Curabitur iaculis ante ut aliquam luctus. 
									Vivamus ullamcorper blandit imperdiet. Ut egestas, orci id rhoncus cursus, orci risus scelerisque enim, eget mattis eros lacus quis ligula. 
									Vivamus ullamcorper urna eget hendrerit laoreet.
								</p>
								<p>
									<span className="fa-stack fa-4x float-end ms-10px text-dark">
										<i className="fab fa-apple fa-stack-1x"></i>
									</span>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
									Morbi accumsan velit dolor. Donec convallis eleifend magna, at euismod tellus convallis a. 
									Curabitur in nisi dolor. Cras viverra scelerisque orci, sed interdum ligula volutpat non. 
									Nunc eu enim ac neque tempor feugiat. Duis posuere lacus non magna eleifend, 
									non dictum sem feugiat. Duis eleifend condimentum pulvinar.
								</p>
							</PerfectScrollbar>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[8]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader>
							Panel with Toolbar & Footer
						</PanelHeader>
						<div className="panel-toolbar">
							<div className="btn-group me-5px">
								<button className="btn btn-white"><i className="fa fa-bold"></i></button>
								<button className="btn btn-white active"><i className="fa fa-italic"></i></button>
								<button className="btn btn-white"><i className="fa fa-underline"></i></button>
							</div>
							<div className="btn-group">
								<button className="btn btn-white"><i className="fa fa-align-left"></i></button>
								<button className="btn btn-white active"><i className="fa fa-align-center"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-right"></i></button>
								<button className="btn btn-white"><i className="fa fa-align-justify"></i></button>
							</div>
						</div>
						<textarea className="form-control rounded-0 border-start-0 border-end-0 p-3 bg-light" rows={5} defaultValue="This is a form textarea."></textarea>
						<PanelFooter className="text-end border-0">
							<button className="btn btn-white btn-sm">Cancel</button>
							<button className="btn btn-primary btn-sm ms-5px">Action</button>
						</PanelFooter>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[9]}</Highlight>
						</div>
					</Panel>
			
					<Panel theme="default" className="panel-with-tabs">
						<PanelHeader noButton={true} className="pb-0">
							<div className="d-flex align-items-end">
								<div className="flex-1 pb-3">Panel with Tabs</div>
								<ul className="nav nav-tabs">
									<li className="nav-item"><a href="#home" data-bs-toggle="tab" className="nav-link active"><i className="fa fa-home"></i> <span className="d-none d-md-inline">Home</span></a></li>
									<li className="nav-item"><a href="#profile" data-bs-toggle="tab" className="nav-link"><i className="fa fa-user"></i> <span className="d-none d-md-inline">Profile</span></a></li>
								</ul>
							</div>
						</PanelHeader>
						<PanelBody>
							<div className="tab-content">
								<div className="tab-pane fade show active" id="home">
									<p>Raw denim you probably haven&#39;t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
								</div>
								<div className="tab-pane fade" id="profile">
									<p>Food truck fixie locavore, accusamus mcsweeney&#39;s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[10]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
	
			<h3 className="mb-3 mt-4">Panel Theme</h3>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel theme="default">
						<PanelHeader>Panel (Default)</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[11]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-teal-700 text-white">Panel Success</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[12]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-orange-700 text-white">Panel Warning</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[13]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-red-700 text-white">Panel Danger</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[14]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Panel Inverse</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[15]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-blue-700 text-white">Panel Primary</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[16]}</Highlight>
						</div>
					</Panel>
			
					<Panel>
						<PanelHeader className="bg-cyan-700 text-white">Panel Info</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[17]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
	
	
			<h3 className="mt-4">Full Color Panel Theme</h3>
			<p className="mb-3">
				You can customize the panel body / header <code>background</code> & <code>text color</code> by adding predefined CSS class. E.g <code>.bg-black</code>. Full list of available predefined background class can be found <a href="helper_css.html">here</a>.
			</p>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel className="bg-gray-700">
						<PanelHeader>Full Color Panel</PanelHeader>
						<PanelBody className="text-white">
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[18]}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-blue text-white">
						<PanelHeader className="bg-blue-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[19]}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-teal text-white">
						<PanelHeader className="bg-teal-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[20]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel className="bg-orange text-white">
						<PanelHeader className="bg-orange-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[21]}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-red text-white">
						<PanelHeader className="bg-red-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[22]}</Highlight>
						</div>
					</Panel>
			
					<Panel className="bg-cyan text-white">
						<PanelHeader className="bg-cyan-700 text-white">Full Color Panel</PanelHeader>
						<PanelBody>
							<p>Panel Content Here</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[23]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}