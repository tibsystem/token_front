'use client';

import { useEffect, useState } from 'react';
import { Panel, PanelHeader, PanelFooter } from '@/components/panel/panel';
import Link from  'next/link';
import Image from  'next/image';
import dynamic from 'next/dynamic';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'jsvectormap/dist/jsvectormap.min.css';

export default function DashboardV2() {
	const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [initChart, setInitChart] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: Date; y: number }[] }[]>([]);
  const [pieChartOptions, setPieChartOptions] = useState({});
  const [pieChartSeries, setPieChartSeries] = useState<number[]>([]);
	
	function handleChange(date: Date | null) {
		if (date) {
			setStartDate(date);
		} else {
			setStartDate(new Date());
		}
	}
	
	function renderMap() {
		if (typeof window !== 'undefined') {
			(async () => {
				const { default: jsVectorMap } = await import('jsvectormap');
				await import('jsvectormap/dist/maps/world.js');
						
				const theme = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
				const gray600 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-600')).trim();
				const gray900 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900')).trim();
				const white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
				const bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
				const map = document.getElementById('jvectorMap');
				const mapElm = document.querySelectorAll('.jvm-tooltip');
				
				if (map) {
					for (let i = 0; i < mapElm.length; i++) {
						mapElm[i].remove();
					}
					map.innerHTML = '';
				
					const markers = [
						{ name: "Egypt", coords: [26.8206, 30.8025] },
						{ name: "Russia", coords: [61.524, 105.3188] },
						{ name: "Canada", coords: [56.1304, -106.3468] },
						{ name: "Greenland", coords: [71.7069, -42.6043] },
						{ name: "Brazil", coords: [-14.235, -51.9253] }
					];
					new jsVectorMap({
						selector: '#jvectorMap',
						map: 'world',
						normalizeFunction: 'polynomial',
						hoverOpacity: 0.5,
						hoverColor: false,
						zoomOnScroll: false,
						series: { regions: [{ normalizeFunction: 'polynomial' }] },
						labels: { markers: { render: (marker) => marker.name } },
						focusOn: { x: 0.5, y: 0.5, scale: 1 },
						markers: markers,
						markerStyle: {
							initial: { fill: theme, stroke: 'none', r: 5 },
							hover: { fill: theme }
						},
						markerLabelStyle: {
							initial: { fontFamily: bodyFontFamily, fontSize: '12px', fill: white }
						},
						regionStyle: {
							initial: { fill: gray600, fillOpacity: .5, stroke: 'none', strokeWidth: 0.4, strokeOpacity: 1 },
							hover: { fillOpacity: 1 }
						},
						backgroundColor: gray900
					});
				}
			})();
		}
	}
	
	function renderChart() {
		const handleGetDate = (minusDate: number): Date => {
			const d = new Date();
			d.setDate(d.getDate() - minusDate);
			return d;
		};
		
		if (typeof window !== "undefined") {
			const blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
			const teal = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
			const white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
			
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
			setChartOptions({
				colors: [teal, blue],
				fill: { opacity: .75, type: 'solid' },
				legend: {
					position: 'top',
					horizontalAlign: 'right',
					offsetY: 15,
					offsetX: 500,
					labels: { colors: white }
				},
				xaxis: {
					type: 'datetime',
					tickAmount: 6,
					labels: { style: { colors: white } }
				},
				yaxis: { labels: { style: { colors: white } } },
				tooltip: { y: { formatter: function (val: number) { return "$ " + val + " thousands" } } },
				chart: { height: '100%', type: 'area', toolbar: { show: false }, stacked: true, zoom: false },
				plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
				dataLabels: { enabled: false },
				grid: { 
					show: true, borderColor: 'rgba(255,255,255, .15)',
					xaxis: { lines: { show: true } },   
					yaxis: { lines: { show: true } },
					padding: { top: -40, right: 3, bottom: 0, left: 10 }
				},
				stroke: {  show: false, curve: 'straight' }
			});
			
			setPieChartSeries([416747,784466]);
			setPieChartOptions({
				labels: ['New Visitors', 'Return Visitors'],
				chart: { type: 'donut' },
				dataLabels: { dropShadow: { enabled: false }, style: { colors: [white] } },
				stroke: { show: false },
				colors: [blue, teal],
				legend: { show: false }
			});
			
			setInitChart(true);
		}
	}
    
	useEffect(() => {
		renderMap();
		renderChart();
	}, []);	
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/dashboard/v2">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/dashboard/v2">Dashboard</Link></li>
				<li className="breadcrumb-item active">Dashboard v2</li>
			</ol>
			<h1 className="page-header">Dashboard v2 <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-teal">
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
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-blue">
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
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-indigo">
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
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-dark">
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
			</div>
			<div className="row">
				<div className="col-xl-8">
					<div className="widget-chart with-sidebar inverse-mode">
						<div className="widget-chart-content bg-gray-800">
							<h4 className="chart-title">
								Visitors Analytics
								<small>Where do our visitors come from</small>
							</h4>
							<div className="widget-chart-full-width dark-mode overflow-hidden pe-3 mb-n3 pt-3">
								{initChart && <ApexChart type="area" height="244" width="100%" options={chartOptions} series={chartSeries} />}
							</div>
						</div>
						<div className="widget-chart-sidebar bg-gray-900">
							<div className="chart-number">
								1,225,729
								<small>Total visitors</small>
							</div>
							<div className="flex-grow-1 d-flex align-items-center justify-content-center dark-mode">
								{initChart && <ApexChart type="donut" height={'180'} width={'180'} options={pieChartOptions} series={pieChartSeries} />}
							</div>
							<ul className="chart-legend fs-11px">
								<li><i className="fa fa-circle fa-fw text-blue fs-9px me-5px t-minus-1"></i> 34.0% <span>New Visitors</span></li>
								<li><i className="fa fa-circle fa-fw text-teal fs-9px me-5px t-minus-1"></i> 56.0% <span>Return Visitors</span></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-xl-4">
					<Panel>
						<PanelHeader noButton={true}>
							Visitors Origin
						</PanelHeader>
						<div style={{height: '170px'}}>
							<div id="jvectorMap" style={{height: '170px'}}></div>
						</div>
						<div className="list-group" data-bs-theme="dark">
							<div className="list-group list-group-flush "  data-bs-theme="dark">
								<a href="#/" className="list-group-item list-group-item-action d-flex">
									<span className="flex-1">1. United State</span>
									<span className="badge bg-teal fs-10px">20.95%</span>
								</a>
								<a href="#/" className="list-group-item list-group-item-action d-flex">
									<span className="flex-1">2. India</span>
									<span className="badge bg-blue fs-10px">16.12%</span>
								</a>
								<a href="#/" className="list-group-item list-group-item-action d-flex rounded-bottom">
									<span className="flex-1">3. Mongolia</span>
									<span className="badge bg-gray-600 fs-10px">14.99%</span>
								</a>
							</div>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-4 col-lg-6">
					<Panel className="bg-light">
						<PanelHeader noButton={true}>
							<div className="d-flex">
								Chat History <span className="badge bg-teal ms-auto">4 message</span>
							</div>
						</PanelHeader>
						<PerfectScrollbar className="chats" style={{height: '260px'}} options={{suppressScrollX: true}}>
							<div className="chats-item start">
								<span className="date-time">yesterday 11:23pm</span>
								<Link href="/dashboard/v2" className="name">Sowse Bawdy</Link>
								<Link href="/dashboard/v2" className="image"><Image alt="" width="128" height="128" className="h-auto" src="/assets/img/user/user-12.jpg" /></Link>
								<div className="message">
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit volutpat. Praesent mattis interdum arcu eu feugiat.
								</div>
							</div>
							<div className="chats-item end">
								<span className="date-time">08:12am</span>
								<Link href="/dashboard/v2" className="name"><span className="badge bg-blue">ADMIN</span> Me</Link>
								<Link href="/dashboard/v2" className="image"><Image alt="" width="128" height="128" className="h-auto" src="/assets/img/user/user-13.jpg" /></Link>
								<div className="message">
									Nullam posuere, nisl a varius rhoncus, risus tellus hendrerit neque.
								</div>
							</div>
							<div className="chats-item start">
								<span className="date-time">09:20am</span>
								<Link href="/dashboard/v2" className="name">Neck Jolly</Link>
								<Link href="/dashboard/v2" className="image"><Image alt="" width="128" height="128" className="h-auto" src="/assets/img/user/user-10.jpg" /></Link>
								<div className="message">
									Euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
								</div>
							</div>
							<div className="chats-item start">
								<span className="date-time">11:15am</span>
								<Link href="/dashboard/v2" className="name">Shag Strap</Link>
								<Link href="/dashboard/v2" className="image"><Image alt="" width="128" height="128" className="h-auto" src="/assets/img/user/user-14.jpg" /></Link>
								<div className="message">
									Nullam iaculis pharetra pharetra. Proin sodales tristique sapien mattis placerat.
								</div>
							</div>
						</PerfectScrollbar>
						<PanelFooter>
							<form name="send_message_form" data-id="message-form">
								<div className="input-group">
									<input type="text" className="form-control" name="message" placeholder="Enter your message here." />
									<button className="btn btn-primary" type="button"><i className="fa fa-camera"></i></button>
									<button className="btn btn-primary" type="button"><i className="fa fa-link"></i></button>
								</div>
							</form>
						</PanelFooter>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader noButton={true}>
							Today&#39;s Schedule
						</PanelHeader>
						<div className="p-1">
							<DatePicker inline selected={startDate} onChange={handleChange} />
						</div>
						<hr className="m-0 bg-gray-500" />
						<div className="list-group list-group-flush">
							<Link href="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis">
								Sales Reporting
								<span className="badge bg-teal fs-10px">9:00 am</span>
							</Link> 
							<Link href="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis rounded-bottom">
								Have a meeting with sales team
								<span className="badge bg-blue fs-10px">2:45 pm</span>
							</Link>
						</div>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader noButton={true}>
							<div className="d-flex">
								New Registered Users 
								<span className="badge bg-teal ms-auto">24 new users</span>
							</div>
						</PanelHeader>
						<ul className="registered-users-list clearfix">
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-5.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Savory Posh
									<small>Algerian</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-3.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Ancient Caviar
									<small>Korean</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-1.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Marble Lungs
									<small>Indian</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-8.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Blank Bloke
									<small>Japanese</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-2.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Hip Sculling
									<small>Cuban</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-6.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Flat Moon
									<small>Nepalese</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-4.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Packed Puffs
									<small>Malaysian</small>
								</h4>
							</li>
							<li>
								<Link href="/dashboard/v2"><Image src="/assets/img/user/user-9.jpg" width="128" height="128" alt="" className="h-auto" /></Link>
								<h4 className="username text-ellipsis">
									Clay Hike
									<small>Swedish</small>
								</h4>
							</li>
						</ul>
						<PanelFooter className="text-center">
							<Link href="/dashboard/v2" className="text-decoration-none text-body">View All</Link>
						</PanelFooter>
					</Panel>
				</div>
			</div>
		</>
	)
}