'use client';

import { useEffect, useState, useReducer } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Highlight from 'react-highlight';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'lity/dist/lity.min.css';
	
export default function Widgets() {
	const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
	const initialState: (string | undefined)[] = Array(11).fill(undefined);
	const [state, dispatch] = useReducer(reducer, initialState);
	const [lightTheme, setLightTheme] = useState(true);
	const [darkTheme, setDarkTheme] = useState(false);
  const [initChart, setInitChart] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: Date; y: number }[] }[]>([]);
  
  function renderChart() {
  	const handleGetDate = (minusDate: number): Date => {
			const d = new Date();
			d.setDate(d.getDate() - minusDate);
			return d;
		};
		
		if (typeof window !== "undefined") {
			setChartSeries([
				{ name: 'Unique Visitors', data: [
					{ x: handleGetDate(77), y: 13}, { x: handleGetDate(76), y: 13}, { x: handleGetDate(75), y: 6}, { x: handleGetDate(73), y: 6}, 
					{ x: handleGetDate(72), y: 6}, { x: handleGetDate(71), y: 5}, { x: handleGetDate(70), y: 5}, { x: handleGetDate(69), y: 5}, 
					{ x: handleGetDate(68), y: 6}, { x: handleGetDate(67), y: 7}, { x: handleGetDate(66), y: 6}, { x: handleGetDate(65), y: 9}, 
					{ x: handleGetDate(64), y: 9}, { x: handleGetDate(63), y: 8}, { x: handleGetDate(62), y: 10}, { x: handleGetDate(61), y: 10}, 
					{ x: handleGetDate(60), y: 10}, { x: handleGetDate(59), y: 10}, { x: handleGetDate(58), y: 9}, { x: handleGetDate(57), y: 9}, 
					{ x: handleGetDate(56), y: 10}, { x: handleGetDate(55), y: 9}, { x: handleGetDate(54), y: 9}, { x: handleGetDate(53), y: 8}, 
					{ x: handleGetDate(52), y: 8}, { x: handleGetDate(51), y: 8}, { x: handleGetDate(50), y: 8}, { x: handleGetDate(49), y: 8}, 
					{ x: handleGetDate(48), y: 7}, { x: handleGetDate(47), y: 7}, { x: handleGetDate(46), y: 6}, { x: handleGetDate(45), y: 6}, 
					{ x: handleGetDate(44), y: 6}, { x: handleGetDate(43), y: 6}, { x: handleGetDate(42), y: 5}, { x: handleGetDate(41), y: 5}, 
					{ x: handleGetDate(40), y: 4}, { x: handleGetDate(39), y: 4}, { x: handleGetDate(38), y: 5}, { x: handleGetDate(37), y: 5}, 
					{ x: handleGetDate(36), y: 5}, { x: handleGetDate(35), y: 7}, { x: handleGetDate(34), y: 7}, { x: handleGetDate(33), y: 7}, 
					{ x: handleGetDate(32), y: 10}, { x: handleGetDate(31), y: 9}, { x: handleGetDate(30), y: 9}, { x: handleGetDate(29), y: 10}, 
					{ x: handleGetDate(28), y: 11}, { x: handleGetDate(27), y: 11}, { x: handleGetDate(26), y: 8}, { x: handleGetDate(25), y: 8}, 
					{ x: handleGetDate(24), y: 7}, { x: handleGetDate(23), y: 8}, { x: handleGetDate(22), y: 9}, { x: handleGetDate(21), y: 8}, 
					{ x: handleGetDate(20), y: 9}, { x: handleGetDate(19), y: 10}, { x: handleGetDate(18), y: 9}, { x: handleGetDate(17), y: 10}, 
					{ x: handleGetDate(16), y: 16}, { x: handleGetDate(15), y: 17}, { x: handleGetDate(14), y: 16}, { x: handleGetDate(13), y: 17}, 
					{ x: handleGetDate(12), y: 16}, { x: handleGetDate(11), y: 15}, { x: handleGetDate(10), y: 14}, { x: handleGetDate(9), y: 24}, 
					{ x: handleGetDate(8), y: 18}, { x: handleGetDate(7), y: 15}, { x: handleGetDate(6), y: 14}, { x: handleGetDate(5), y: 16}, 
					{ x: handleGetDate(4), y: 16}, { x: handleGetDate(3), y: 17}, { x: handleGetDate(2), y: 7}, { x: handleGetDate(1), y: 7}, 
					{ x: handleGetDate(0), y: 7}
				] }, 
				{ name: 'Page Views', data: [
					{ x: handleGetDate(77), y: 14}, { x: handleGetDate(76), y: 13}, { x: handleGetDate(75), y: 15}, { x: handleGetDate(73), y: 14}, 
					{ x: handleGetDate(72), y: 13}, { x: handleGetDate(71), y: 15}, { x: handleGetDate(70), y: 16}, { x: handleGetDate(69), y: 16}, 
					{ x: handleGetDate(68), y: 14}, { x: handleGetDate(67), y: 14}, { x: handleGetDate(66), y: 13}, { x: handleGetDate(65), y: 12}, 
					{ x: handleGetDate(64), y: 13}, { x: handleGetDate(63), y: 13}, { x: handleGetDate(62), y: 15}, { x: handleGetDate(61), y: 16}, 
					{ x: handleGetDate(60), y: 16}, { x: handleGetDate(59), y: 17}, { x: handleGetDate(58), y: 17}, { x: handleGetDate(57), y: 18}, 
					{ x: handleGetDate(56), y: 15}, { x: handleGetDate(55), y: 15}, { x: handleGetDate(54), y: 15}, { x: handleGetDate(53), y: 19}, 
					{ x: handleGetDate(52), y: 19}, { x: handleGetDate(51), y: 18}, { x: handleGetDate(50), y: 18}, { x: handleGetDate(49), y: 17}, 
					{ x: handleGetDate(48), y: 16}, { x: handleGetDate(47), y: 18}, { x: handleGetDate(46), y: 18}, { x: handleGetDate(45), y: 18}, 
					{ x: handleGetDate(44), y: 16}, { x: handleGetDate(43), y: 14}, { x: handleGetDate(42), y: 14}, { x: handleGetDate(41), y: 13}, 
					{ x: handleGetDate(40), y: 14}, { x: handleGetDate(39), y: 13}, { x: handleGetDate(38), y: 10}, { x: handleGetDate(37), y: 9}, 
					{ x: handleGetDate(36), y: 10}, { x: handleGetDate(35), y: 11}, { x: handleGetDate(34), y: 11}, { x: handleGetDate(33), y: 11}, 
					{ x: handleGetDate(32), y: 10}, { x: handleGetDate(31), y: 9}, { x: handleGetDate(30), y: 10}, { x: handleGetDate(29), y: 13}, 
					{ x: handleGetDate(28), y: 14}, { x: handleGetDate(27), y: 14}, { x: handleGetDate(26), y: 13}, { x: handleGetDate(25), y: 12}, 
					{ x: handleGetDate(24), y: 11}, { x: handleGetDate(23), y: 13}, { x: handleGetDate(22), y: 13}, { x: handleGetDate(21), y: 13}, 
					{ x: handleGetDate(20), y: 13}, { x: handleGetDate(19), y: 14}, { x: handleGetDate(18), y: 13}, { x: handleGetDate(17), y: 13}, 
					{ x: handleGetDate(16), y: 19}, { x: handleGetDate(15), y: 21}, { x: handleGetDate(14), y: 22}, { x: handleGetDate(13), y: 25}, 
					{ x: handleGetDate(12), y: 24}, { x: handleGetDate(11), y: 24}, { x: handleGetDate(10), y: 22}, { x: handleGetDate(9), y: 16}, 
					{ x: handleGetDate(8), y: 15}, { x: handleGetDate(7), y: 12}, { x: handleGetDate(6), y: 12}, { x: handleGetDate(5), y: 15}, 
					{ x: handleGetDate(4), y: 15}, { x: handleGetDate(3), y: 15}, { x: handleGetDate(2), y: 18}, { x: handleGetDate(2), y: 18}, 
					{ x: handleGetDate(0), y: 17}
				] }
			]);
			
			setChartOptions ({
				colors: ['#ff5b57', '#f59c1a'],
				fill: { opacity: .75, type: 'solid' },
				legend: { position: 'top', horizontalAlign: 'right', offsetY: 15, offsetX: 500, labels: { colors: '#20252a' } },
				xaxis: { type: 'datetime', tickAmount: 6, labels: { style: { colors: 'var(--bs-component-color)' } } },
				yaxis: { labels: { style: { colors: 'var(--bs-component-color)' } } },
				tooltip: { y: { formatter: function (val: number) { return "$ " + val + " thousands" } } },
				chart: { height: '100%', toolbar: { show: false }, stacked: true },
				plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
				dataLabels: { enabled: false },
				grid: { 
					show: true, borderColor: 'var(--bs-component-border-color)',
					xaxis: { lines: { show: true } },   
					yaxis: { lines: { show: true } },
					padding: { top: -40, right: 3, bottom: 0, left: 10 }
				},
				stroke: { show: false, curve: 'straight' }
			});
			
			setInitChart(true);
		}
  }
	
	function reducer(state: typeof initialState, action: { type: string; index?: number; payload?: string }) {
		if (action.type === "SET_CODE" && action.index !== undefined) {
			const newState = [...state];
			newState[action.index] = action.payload;
			return newState;
		}
		return state;
	}
	
	function setWidgetTheme(theme: string) {
		if (theme === 'light') {
			setLightTheme(true);
			setDarkTheme(false);
		} else {
			setLightTheme(false);
			setDarkTheme(true);
		}
	}

	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const fetchData = async (index: number) => {
			try {
				const response = await fetch(`/assets/data/widgets/widget-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 11; i++) {
			fetchData(i);
		}
		
		if (typeof window !== 'undefined') {
      import('lity');
		}
		
		renderChart();
		
		const handleThemeReload = () => {
			renderChart();
		};
	
		document.addEventListener('theme-reload', handleThemeReload);
		
		return () => {
			document.removeEventListener('theme-reload', handleThemeReload);
			controller.abort();
		};
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/widget">Home</Link></li>
				<li className="breadcrumb-item active">Widgets</li>
			</ol>
			<h1 className="page-header">
				Widgets <small>header small text goes here...</small>
			</h1>
		
			<span className="btn-group float-end ms-20px p-2px bg-black bg-opacity-20 rounded">
				<button className={'btn btn-sm btn-white border-0 ' + (lightTheme ? 'active ' : '')} onClick={() => setWidgetTheme('light')}><i className={'fa fa-sun '+ (lightTheme ? 'text-blue ' : '')}></i> Light</button>
				<button className={'btn btn-sm btn-white border-0 ' + (darkTheme ? 'active ' : '')} onClick={() => setWidgetTheme('dark')}><i className={'fa fa-moon '+ (darkTheme ? 'text-blue ' : '')}></i> Dark</button>
			</span>
			<p className="mb-20px">
				All the widgets is reusable and responsive. You may use the predefined css to configure the padding, margin or background. Besides that, all the widgets have light and dark version. 
				Kindly add the <code>.dark-mode</code> to the widget will change it to the dark version.
			</p>
			
			<div className="row">
				<div className="col-lg-12 col-xl-4">
					<div className="row">
						<div className="col-xl-12 col-lg-6">
							<div className="mb-10px mt-10px fs-10px">
								<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetList" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
								<b className="text-dark">WIDGET LIST</b>
							</div>
							<div className="widget-list rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-list-item">
									<div className="widget-list-media">
										<Image src="/assets/img/user/user-12.jpg" width="50" height="50" alt="" className="rounded" />
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Christopher Struth</h4>
										<p className="widget-list-desc">Bank Transfer</p>
									</div>
									<div className="widget-list-action">
										<a href="#/" data-bs-toggle="dropdown" className="text-gray-500"><i className="fa fa-ellipsis-h fs-14px"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Option 1</a>
											<a href="#/" className="dropdown-item">Option 2</a>
											<a href="#/" className="dropdown-item">Option 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Option 4</a>
										</div>
									</div>
								</div>
								<div className="widget-list-item">
									<div className="widget-list-media">
										<Image src="/assets/img/user/user-13.jpg" width="50" height="50" alt="" className="rounded" />
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Janie Flowers</h4>
										<p className="widget-list-desc">Bank Transfer</p>
									</div>
									<div className="widget-list-action">
										<a href="#/" data-bs-toggle="dropdown" className="text-gray-500"><i className="fa fa-ellipsis-h fs-14px"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Option 1</a>
											<a href="#/" className="dropdown-item">Option 2</a>
											<a href="#/" className="dropdown-item">Option 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Option 4</a>
										</div>
									</div>
								</div>
								<div className="widget-list-item">
									<div className="widget-list-media">
										<Image src="/assets/img/user/user-14.jpg" width="50" height="50" alt="" className="rounded" />
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Janie Flowers</h4>
										<p className="widget-list-desc">Bank Transfer</p>
									</div>
									<div className="widget-list-action">
										<a href="#/" data-bs-toggle="dropdown" className="text-gray-500"><i className="fa fa-ellipsis-h fs-14px"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Option 1</a>
											<a href="#/" className="dropdown-item">Option 2</a>
											<a href="#/" className="dropdown-item">Option 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Option 4</a>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-xl-12 col-lg-6">
							<div className="mb-10px mt-10px fs-10px">
								<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetListWithIcon" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
								<b className="text-dark">WIDGET LIST WITH ICON</b>
							</div>
							<div className="widget-list rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<Link href="/widget" className="widget-list-item">
									<div className="widget-list-media icon">
										<i className="fa fa-plane bg-dark text-white"></i>
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Airplane Mode</h4>
									</div>
									<div className="widget-list-action text-end">
										<i className="fa fa-angle-right fa-lg text-gray-500"></i>
									</div>
								</Link>
								<Link href="/widget" className="widget-list-item">
									<div className="widget-list-media icon">
										<i className="fa fa-wifi bg-dark text-white"></i>
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Wi-Fi</h4>
									</div>
									<div className="widget-list-action text-nowrap text-gray-600 fw-bold text-decoration-none">
										Connected
										<i className="fa fa-angle-right fa-lg ms-3 text-gray-500"></i>
									</div>
								</Link>
								<Link href="/widget" className="widget-list-item">
									<div className="widget-list-media icon">
										<i className="fab fa-bluetooth bg-indigo text-white"></i>
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Bluetooth</h4>
									</div>
									<div className="widget-list-action text-nowrap text-gray-600 fw-bold text-decoration-none">
										On
										<i className="fa fa-angle-right text-gray-500 fa-lg ms-3"></i>
									</div>
								</Link>
								<Link href="/widget" className="widget-list-item">
									<div className="widget-list-media icon">
										<i className="fa fa-signal bg-pink text-white"></i>
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Cellular</h4>
									</div>
									<div className="widget-list-action text-decoration-none fw-bold">
										<i className="fa fa-angle-right text-gray-500 fa-lg"></i>
									</div>
								</Link>
								<Link href="/widget" className="widget-list-item">
									<div className="widget-list-media icon">
										<i className="fa fa-link bg-yellow text-dark"></i>
									</div>
									<div className="widget-list-content">
										<h4 className="widget-list-title">Personal Hotspot</h4>
									</div>
									<div className="widget-list-action text-nowrap text-gray-600 fw-bold text-decoration-none">
										Off
										<i className="fa fa-angle-right text-gray-500 fa-lg ms-3"></i>
									</div>
								</Link>
							</div>
						</div>
						
						<div className="col-xl-12 col-lg-6">
							<div className="mb-10px mt-10px fs-10px">
								<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetChatInput" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
								<b className="text-dark">WIDGET CHAT</b>
							</div>
							<div className="widget-chat rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-chat-header">
									<div className="widget-chat-header-icon">
										<i className="fab fa-earlybirds w-30px h-30px fs-20px bg-yellow text-dark d-flex align-items-center justify-content-center rounded"></i>
									</div>
									<div className="widget-chat-header-content">
										<h4 className="widget-chat-header-title">Company Discussion Group</h4>
										<p className="widget-chat-header-desc">55 members, 4 online</p>
									</div>
								</div>
								<PerfectScrollbar className="widget-chat-body" style={{height: '235px'}} options={{suppressScrollX: true}}>
									<div className="widget-chat-item with-media start">
										<div className="widget-chat-media">
											<Image alt="" src="/assets/img/user/user-1.jpg" width="38" height="38" />
										</div>
										<div className="widget-chat-info">
											<div className="widget-chat-info-container">
												<div className="widget-chat-name text-indigo">Hudson Mendes</div>
												<div className="widget-chat-message">Should we plan for a company trip this year?</div>
												<div className="widget-chat-time">6:00PM</div>
											</div>
										</div>
									</div>
									<div className="widget-chat-item with-media start">
										<div className="widget-chat-media">
											<Image alt="" src="/assets/img/user/user-2.jpg" width="38" height="38" />
										</div>
										<div className="widget-chat-info">
											<div className="widget-chat-info-container">
												<div className="widget-chat-name text-primary">Sam Sugerman</div>
												<div className="widget-chat-message">ok let&#39;s do it</div>
												<div className="widget-chat-time">6:01PM</div>
											</div>
										</div>
									</div>
									<div className="widget-chat-item end">
										<div className="widget-chat-info">
											<div className="widget-chat-info-container">
												<div className="widget-chat-message">i&#39;m ok with it</div>
												<div className="widget-chat-time">6:05PM</div>
											</div>
										</div>
									</div>
									<div className="text-center text-gray-500 m-2 fw-bold">Today</div>
									<div className="widget-chat-item with-media start">
										<div className="widget-chat-media">
											<Image alt="" src="/assets/img/user/user-3.jpg" width="38" height="38" />
										</div>
										<div className="widget-chat-info">
											<div className="widget-chat-info-container">
												<div className="widget-chat-name text-orange">Jaxon Allwood</div>
												<div className="widget-chat-message">
													Here is some images for New Zealand
													<div className="row gx-1 mt-5px">
														<div className="col-md-4">
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-51-thumb.jpg)'}}></div>
															</Link>
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-52-thumb.jpg)'}}></div>
															</Link>
														</div>
														<div className="col-md-4">
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-53-thumb.jpg)'}}></div>
															</Link>
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-54-thumb.jpg)'}}></div>
															</Link>
														</div>
														<div className="col-md-4">
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-59-thumb.jpg)'}}></div>
															</Link>
															<Link href="/widgets" className="widget-card widget-card-sm square mb-1">
																<div className="widget-card-cover" style={{backgroundImage: 'url(/assets/img/gallery/gallery-60-thumb.jpg)'}}></div>
															</Link>
														</div>
													</div>
												</div>
												<div className="widget-chat-time">6:20PM</div>
											</div>
										</div>
									</div>
								</PerfectScrollbar>
								<div className="widget-input">
									<form action="" method="POST" name="">
										<div className="widget-input-container">
											<div className="widget-input-icon"><Link href="/widgets" className="text-gray-500"><i className="fa fa-camera"></i></Link></div>
											<div className="widget-input-box">
												<input type="text" className="form-control" placeholder="Write a message..." />
											</div>
											<div className="widget-input-icon"><Link href="/widgets" className="text-gray-500"><i className="fa fa-smile"></i></Link></div>
											<div className="widget-input-divider"></div>
											<div className="widget-input-icon"><Link href="/widgets" className="text-gray-500"><i className="fa fa-microphone"></i></Link></div>
										</div>
									</form>
								</div>
							</div>
						</div>
						
						<div className="col-xl-12 col-lg-6">
							<div className="mb-10px mt-10px fs-10px">
								<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetTodolist" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
								<b className="text-dark">WIDGET TODOLIST</b>
							</div>
							<div className="widget-todolist rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-todolist-header">
									<div className="widget-todolist-header-title">Todolist</div>
									<div className="widget-todolist-header-total"><span>0</span><small>Done</small></div>
								</div>
								<div className="widget-todolist-body">
									<div className="widget-todolist-item">
										<div className="widget-todolist-input">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" id="widget_todolist_1" />
											</div>
										</div>
										<div className="widget-todolist-content">
											<h6 className="mb-2px">Borrow Tony&#39;s travel guide</h6>
											<div className="text-gray-500 fw-bold fs-11px">Vacation in Rome</div>
										</div>
										<div className="widget-todolist-icon">
											<Link href="/widgets"><i className="fa fa-question-circle"></i></Link>
										</div>
									</div>
									<div className="widget-todolist-item">
										<div className="widget-todolist-input">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" id="widget_todolist_2" />
											</div>
										</div>
										<div className="widget-todolist-content">
											<h6 className="mb-2px">Finish expense report</h6>
											<div className="text-gray-500 fw-bold fs-11px">Today, 4:00PM, Daily</div>
										</div>
										<div className="widget-todolist-icon">
											<Link href="/widgets"><i className="fa fa-question-circle"></i></Link>
										</div>
									</div>
									<div className="widget-todolist-item">
										<div className="widget-todolist-input">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" id="widget_todolist_3" />
											</div>
										</div>
										<div className="widget-todolist-content">
											<h6 className="mb-2px">Confirm conference call for Wednesday</h6>
											<div className="text-gray-500 fw-bold fs-11px">Work</div>
										</div>
										<div className="widget-todolist-icon">
											<Link href="/widgets"><i className="fa fa-question-circle"></i></Link>
										</div>
									</div>
									<div className="widget-todolist-item">
										<div className="widget-todolist-input">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" id="widget_todolist_4" />
											</div>
										</div>
										<div className="widget-todolist-content">
											<h6 className="mb-2px"><b className="text-warning">!!</b> Mobile App WIP Presentation</h6>
											<div className="text-gray-500 fw-bold fs-11px">Today, 12:00PM</div>
										</div>
										<div className="widget-todolist-icon">
											<Link href="/widgets"><i className="fa fa-question-circle"></i></Link>
										</div>
									</div>
									<div className="widget-todolist-item">
										<div className="widget-todolist-input">
											<i className="fa fa-plus text-gray-500 fa-fw"></i>
										</div>
										<div className="widget-todolist-content">
											<input type="text" className="form-control border-0 shadow-none rounded-0 p-0 h-20px bg-none" placeholder="Write your task here..." />
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-xl-12 col-lg-6">
							<div className="mb-10px mt-10px fs-10px">
								<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetMap" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
								<b className="text-dark">WIDGET MAP</b>
							</div>
							<div className="widget-map rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-input-container">
									<div className="widget-input-icon"><Link href="/widgets" className={(darkTheme ? 'text-white ' : 'text-gray-500')}><i className="fa fa-ellipsis-v"></i></Link></div>
									<div className="widget-input-box">
										<input type="text" className="form-control" placeholder="Search here" />
									</div>
									<div className="widget-input-icon"><Link href="/widgets" className={(darkTheme ? 'text-white ' : 'text-gray-500')}><i className="fa fa-microphone"></i></Link></div>
									<div className="widget-input-divider"></div>
									<div className="widget-input-icon"><Link href="/widgets" className={(darkTheme ? 'text-white ' : 'text-gray-500')}><i className="fa fa-location-arrow"></i></Link></div>
								</div>
								<div className="widget-map-body">
									<iframe className="d-block" title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.5650178360584!2d-122.41879278478642!3d37.77679637975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2smy!4v1524046379645" width="100%" height="230" frameBorder="0" style={{border:0}} allowFullScreen></iframe>
								</div>
								<div className="widget-map-list" data-id="widget">
									<div className="widget-list bg-none">
										<div className="widget-list-item">
											<div className="widget-list-media text-center">
												<Link href="/widgets"><i className="fab fa-twitter fa-3x"></i></Link>
											</div>
											<div className="widget-list-content">
												<h4 className="widget-list-title">Twitter Headquater</h4>
												<p className="widget-list-desc">Corporate Office</p>
											</div>
											<div className="widget-list-action">
												<Link href="/widgets" className="text-gray-500"><i className="fa fa-angle-right fa-2x"></i></Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-12 col-xl-8">
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetImgIcon" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET IMAGE / ICON</b>
					</div>
					<div className="row mb-4">
						<div className="col-sm-6">
							<div className="d-flex flex-wrap">
								<div className="widget-icon rounded bg-indigo me-5px mb-5px text-white">
									<i className="fab fa-digital-ocean"></i>
								</div>
								<div className="widget-icon rounded bg-blue me-5px mb-5px text-white">
									<i className="fab fa-twitter"></i>
								</div>
								<div className="widget-icon rounded bg-success me-5px mb-5px text-white">
									<i className="fab fa-android"></i>
								</div>
								<div className="widget-icon rounded bg-warning me-5px mb-5px text-white">
									<i className="fab fa-firefox"></i>
								</div>
								<div className="widget-icon rounded bg-danger me-5px mb-5px text-white">
									<i className="fab fa-google-plus-g"></i>
								</div>
								<div className="widget-icon rounded bg-pink me-5px mb-5px text-white">
									<i className="fab fa-pinterest"></i>
								</div>
							</div>
							<div className="clearfix">
								<div className={'widget-icon widget-icon-xl user rounded float-start me-5px mb-5px ' + (darkTheme ? 'text-white text-opacity-50 bg-dark ' : 'bg-gray-500 text-white')}>
									<i className="fa fa-user"></i>
								</div>
								<div className={'widget-icon widget-icon-lg user rounded float-start me-5px mb-5px ' + (darkTheme ? 'text-white text-opacity-50 bg-dark ' : 'bg-gray-500 text-white')}>
									<i className="fa fa-user"></i>
								</div>
								<div className={'widget-icon user rounded float-start me-5px mb-5px ' + (darkTheme ? 'text-white text-opacity-50 bg-dark ' : 'bg-gray-500 text-white')}>
									<i className="fa fa-user"></i>
								</div>
								<div className={'widget-icon widget-icon-sm user rounded float-start me-5px mb-5px ' + (darkTheme ? 'text-white text-opacity-50 bg-dark ' : 'bg-gray-500 text-white')}>
									<i className="fa fa-user"></i>
								</div>
								<div className={'widget-icon widget-icon-xs user rounded float-start me-5px mb-5px ' + (darkTheme ? 'text-white text-opacity-50 bg-dark ' : 'bg-gray-500 text-white')}>
									<i className="fa fa-user"></i>
								</div>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="float-start">
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-11-thumb.jpg)'}}
								></div>
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-12-thumb.jpg)'}}
								></div>
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-13-thumb.jpg)'}}
								></div>
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-14-thumb.jpg)'}}
								></div>
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-15-thumb.jpg)'}}
								></div>
								<div className="widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-16-thumb.jpg)'}}
								></div>
								<br />
								<div className="widget-img widget-img-xl rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-21-thumb.jpg)'}}
								></div>
								<div className="widget-img widget-img-lg rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-22-thumb.jpg)'}}
								></div>
								<div className="widget-img widget-img rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-23-thumb.jpg)'}}
								></div>
								<div className="widget-img widget-img-sm rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-24-thumb.jpg)'}}
								></div>
								<div className="widget-img widget-img-xs rounded bg-dark float-start me-5px mb-5px"
									style={{ backgroundImage: 'url(/assets/img/gallery/gallery-25-thumb.jpg)'}}
								></div>
							</div>
						</div>
					</div>
					
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetCard" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET CARD</b>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<Link href="/widgets" className="widget-card rounded mb-20px" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-card-cover rounded" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-portrait-11-thumb.jpg)'}}></div>
								<div className="widget-card-content">
									<b className="text-white">Download and get free trial.</b>
								</div>
								<div className="widget-card-content bottom">
									<i className="fab fa-pushed fa-5x text-indigo"></i>
									<h4 className="text-white mt-10px"><b>Apple Draw<br /> Photo Booth</b></h4>
									<h5 className="fs-12px text-white text-opacity-75 mb-0"><b>EASILY DRAW ON PHOTOS</b></h5>
								</div>
							</Link>
						</div>
						<div className="col-sm-6">
							<Link href="/widgets" className="widget-card rounded mb-20px" data-bs-theme={(darkTheme ? 'dark' : '')}>
								<div className="widget-card-cover rounded"></div>
								<div className="widget-card-content">
									<h5 className="fs-12px text-body"><b>MAKING A DIFFERENCE</b></h5>
									<h4 className="mb-10px text-pink"><b>Apple Heart<br /> Study App</b></h4>
									<i className="fa fa-heartbeat fa-5x text-pink text-opacity-50"></i>
								</div>
								<div className="widget-card-content bottom">
									<b className="fs-12px text-body">Opt in and help heart research.</b>
								</div>
							</Link>
						</div>
					</div>
					
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetCardSquare" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET CARD SQUARE</b>
					</div>
					<div className="row">
						<div className="col-xs-6 col-sm-3">
							<div className="row gx-1 mb-1">
								<div className="col-6">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-1-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-2-thumb.jpg)'}}></div>
									</Link>
								</div>
								<div className="col-6">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-3-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-4-thumb.jpg)'}}></div>
									</Link>
								</div>
							</div>
							<div className="fs-12px fw-bold text-black">Camera Roll</div>
							<div className="fs-10px fw-bold text-black-lighter mb-3">2,711</div>
						</div>
						<div className="col-xs-6 col-sm-3">
							<Link href="/widgets" className="widget-card rounded square mb-5px">
								<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-7-thumb.jpg)'}}>
									<span className="widget-card-cover-icon"><i className="fa fa-play fa-lg"></i></span>
								</div>
							</Link>
							<div className="fs-12px fw-bold text-black pt-2px">Videos</div>
							<div className="fs-10px fw-bold text-black-lighter mb-3">31</div>
						</div>
						<div className="col-xs-6 col-sm-3">
							<Link href="/widgets" className="widget-card rounded square mb-5px">
								<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-10-thumb.jpg)'}}>
									<div className="d-flex h-100 align-items-center justify-content-center">
										<div className="text-center">
											<div className="text-white fs-14px"><b>PORTRAITS OF</b></div>
											<div className="text-white-transparent-8 fw-bold">2025</div>
										</div>
									</div>
								</div>
							</Link>
							<div className="fs-12px fw-bold text-black pt-2px">Memory 2025</div>
							<div className="fs-10px fw-bold text-black-lighter mb-3">1,239</div>
						</div>
						<div className="col-xs-6 col-sm-3">
							<div className="row gx-1 mb-5px">
								<div className="col-3">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-1-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-2-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-3-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-4-thumb.jpg)'}}></div>
									</Link>
								</div>
								<div className="col-3">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-5-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-6-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-7-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-8-thumb.jpg)'}}></div>
									</Link>
								</div>
								<div className="col-3">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-9-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-10-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-11-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-12-thumb.jpg)'}}></div>
									</Link>
								</div>
								<div className="col-3">
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-13-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-14-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-15-thumb.jpg)'}}></div>
									</Link>
									<Link href="/widgets" className="widget-card rounded square mb-1">
										<div className="widget-card-cover" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-16-thumb.jpg)'}}></div>
									</Link>
								</div>
							</div>
							<div className="fs-12px fw-bold text-black">Albums</div>
							<div className="fs-10px fw-bold text-black-lighter mb-15px">8</div>
						</div>
					</div>
				
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetStat" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET STAT</b>
					</div>
					<div className="row gx-2 mb-20px">
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-teal mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-globe fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">TODAY&#39;S VISITS</div>
									<div className="stats-number">7,842,900</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '70.1%'}}></div>
									</div>
									<div className="stats-desc">Better than last week (70.1%)</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-blue mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-dollar-sign fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">TODAY&#39;S PROFIT</div>
									<div className="stats-number">180,200</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '40.5%'}}></div>
									</div>
									<div className="stats-desc">Better than last week (40.5%)</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-purple mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-archive fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">NEW ORDERS</div>
									<div className="stats-number">38,900</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '76.3%'}}></div>
									</div>
									<div className="stats-desc">Better than last week (76.3%)</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-dark mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-comment-alt fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">NEW COMMENTS</div>
									<div className="stats-number">3,988</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '54.9%'}}></div>
									</div>
									<div className="stats-desc">Better than last week (54.9%)</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-orange mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-file-alt fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">PENDING INVOICE</div>
									<div className="stats-number">20</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '23.5%'}}></div>
									</div>
									<div className="stats-desc">More than last week (23.5%)</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6">
							<div className="widget widget-stats bg-pink mb-7px">
								<div className="stats-icon stats-icon-lg"><i className="fa fa-exclamation-triangle fa-fw"></i></div>
								<div className="stats-content">
									<div className="stats-title">ERROR LOG</div>
									<div className="stats-number">5</div>
									<div className="stats-progress progress">
										<div className="progress-bar" style={{width: '10.5%'}}></div>
									</div>
									<div className="stats-desc">More than last week (10.5%)</div>
								</div>
							</div>
						</div>
					</div>
				
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetChart" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET CHART</b>
					</div>
					<div className="widget rounded mb-4" data-bs-theme={(darkTheme ? 'dark' : '')}>
						<div className="widget-header">
							<h4 className="widget-header-title">Audience Overview</h4>
							<div className="widget-header-icon"><Link href="/widgets" className="text-gray-500"><i className="fa fa-fw fa-upload"></i></Link></div>
							<div className="widget-header-icon"><Link href="/widgets" className="text-gray-500"><i className="fa fa-fw fa-cog"></i></Link></div>
						</div>
						<div className="row m-0">
							<div className="col widget-chart-content">
								{initChart && <ApexChart type="area" options={chartOptions} series={chartSeries} />}
							</div>
							<div className="col-lg-4 p-3">
								<div className="widget-chart-info">
									<h4 className="widget-chart-info-title">Total sales</h4>
									<p className="widget-chart-info-desc">Lorem ipsum dolor sit consectetur adipiscing elit.</p>
									<div className="widget-chart-info-progress">
										<b>Monthly Plan</b>
										<span className="float-end">70%</span>
									</div>
									<div className="progress h-10px">
										<div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill" style={{width: '70%'}}></div>
									</div>
								</div>
								<hr />
								<div className="widget-chart-info">
									<h4 className="widget-chart-info-title">Task progress</h4>
									<p className="widget-chart-info-desc">Vestibulum sollicitudin in lectus a cursus.</p>
									<div className="widget-chart-info-progress">
										<b>Marketing Research</b>
										<span className="float-end">74%</span>
									</div>
									<div className="progress h-10px mb-15px">
										<div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill bg-indigo" style={{width: '74%'}}></div>
									</div>
									<div className="widget-chart-info-progress">
										<b>Mobile App Development</b>
										<span className="float-end">25%</span>
									</div>
									<div className="progress h-10px mb-15px">
										<div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill bg-green" style={{width: '25%'}}></div>
									</div>
									<div className="widget-chart-info-progress">
										<b>Website Redesign</b>
										<span className="float-end">95%</span>
									</div>
									<div className="progress h-10px">
										<div className="progress-bar progress-bar-striped progress-bar-animated rounded-pill bg-orange" style={{width: '95%'}}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				
					<div className="mb-10px mt-10px fs-10px">
						<a href="#/" data-bs-toggle="modal" data-bs-target="#modalWidgetTable" className="float-end text-gray-600 text-decoration-none me-3px fw-bold">source code</a>
						<b className="text-dark">WIDGET TABLE</b>
					</div>
					<div className="table-responsive">
						<table className="table table-bordered widget-table rounded" data-bs-theme={(darkTheme ? 'dark' : '')}>
							<thead>
								<tr className="text-nowrap">
									<th style={{ width: "1%" }}>Image</th>
									<th>Product Info</th>
									<th>Price</th>
									<th>Qty</th>
									<th>Total</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<Image src="/assets/img/product/product-6.png" alt="" width="100" height="100" />
									</td>
									<td>
										<h5 className="mb-1">Mavic Pro Combo</h5>
										<p className="fs-11px fw-bold text-gray-600 mb-3">Portable yet powerful, the Mavic Pro is your personal drone, ready to go with you everywhere.</p>
										<div className="progress h-10px rounded-pill mb-5px">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-orange fs-10px fw-bold" style={{width: '30%'}}>30%</div>
										</div>
										<div className="clearfix fs-10px">
											status: 
											<b className={(darkTheme ? 'text-white ' : 'text-dark')}>Shipped</b>
										</div>
									</td>
									<td className="text-nowrap">
										<b className={(darkTheme ? 'text-white ' : 'text-dark')}>$999</b><br />
										<small className={(darkTheme ? 'text-white ' : 'text-dark')}><del>$1,202</del></small>
									</td>
									<td>1</td>
									<td>999.00</td>
									<td>
										<Link href="/widgets" className={'btn btn-sm w-80px rounded-pill '+ (darkTheme ? 'btn-inverse ' : 'btn-default ')}>Edit</Link>
									</td>
								</tr>
								<tr>
									<td>
										<Image src="/assets/img/product/product-7.png" alt="" width="100" height="100" />
									</td>
									<td>
										<h5 className="mb-1">Inspire 2</h5>
										<p className="fs-11px fw-bold text-gray-600 mb-3">Cinematic aerial performance for filmmakers.</p>
										<div className="progress h-10px rounded-pill mb-5px">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-success fs-10px fw-bold" style={{width: '100%'}}>100%</div>
										</div>
										<div className="clearfix fs-10px">
											status: 
											<b className={(darkTheme ? 'text-white ' : 'text-dark')}>received</b>
										</div>
									</td>
									<td className="text-nowrap">
										<b className={(darkTheme ? 'text-white ' : 'text-dark')}>$999</b><br />
										<small className={(darkTheme ? 'text-white ' : 'text-dark')}><del>$1,202</del></small>
									</td>
									<td>1</td>
									<td>999.00</td>
									<td>
										<Link href="/widgets" className={'btn btn-sm w-80px rounded-pill '+ (darkTheme ? 'btn-inverse ' : 'btn-default ')}>Edit</Link>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
			<div className="modal fade" id="modalWidgetList">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget List</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetListWithIcon">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Widget List with Icon</h4>
							<button data-bs-dismiss="modal" className="btn-close"></button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
						<div className="modal-footer">
							<a href="#/" data-bs-dismiss="modal" className="btn btn-default">Close</a>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetChatInput">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Chat & Input</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetTodolist">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Todolist</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetMap">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Map</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[5]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetImgIcon">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Image / Icon</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[6]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetCard">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget List Card</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[7]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetCardSquare">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget List Card Square</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[8]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetStat">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Stat</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[9]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetChart">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Chart</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[10]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="modalWidgetTable">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h4>Widget Table</h4>
							<button className="btn-close" data-bs-dismiss="modal"> </button>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[11]}</Highlight>
						</div>
						<div className="modal-footer">
							<button className="btn btn-default" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}