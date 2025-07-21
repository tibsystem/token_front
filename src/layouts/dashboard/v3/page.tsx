'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'jsvectormap/dist/jsvectormap.min.css';

export default function DashboardV3() {
	const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
	const startDate = Moment().subtract(7, 'days');
	const endDate = Moment();
	const [dateRange, setDateRange] = useState({
    currentWeek: Moment().subtract(7, 'days').format('D MMMM YYYY') + ' - ' + Moment().format('D MMMM YYYY'),
    prevWeek: Moment().subtract(15, 'days').format('D MMMM') + ' - ' + Moment().subtract(8, 'days').format('D MMMM YYYY'),
  });
  const [initChart, setInitChart] = useState(false);
  const [visitorChartOptions, setVisitorChartOptions] = useState({});
  const [visitorChartSeries, setVisitorChartSeries] = useState<{ name: string; data: { x: Date; y: number }[] }[]>([]);
  const [totalSalesChartOptions, setTotalSalesChartOptions] = useState({});
  const [totalSalesChartSeries, setTotalSalesChartSeries] = useState<{ data: number[] }[]>([]);
  const [conversionRateChartOptions, setConversionRateChartOptions] = useState({});
  const [conversionRateChartSeries, setConversionRateChartSeries] = useState<{ data: number[] }[]>([]);
  const [storeSessionChartOptions, setStoreSessionChartOptions] = useState({});
  const [storeSessionChartSeries, setStoreSessionChartSeries] = useState<{ data: number[] }[]>([]);
	
	function convertNumberWithCommas(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleDateApplyEvent(event: any, picker: any) {
		const startDate = picker.startDate;
		const endDate = picker.endDate;
		const gap = endDate.diff(startDate, 'days');
		
		const currentWeek = startDate.format('D MMMM YYYY') + ' - ' + endDate.format('D MMMM YYYY');
		const prevWeek = Moment(startDate).subtract('days', gap).format('D MMMM') + ' - ' + Moment(startDate).subtract('days', 1).format('D MMMM YYYY');
		
		setDateRange({
      currentWeek,
      prevWeek,
    });
	}
	
	function renderChart() {
		const handleGetDate = (minusDate: number): Date => {
			const d = new Date();
			d.setDate(d.getDate() - minusDate);
			return d;
		};
		if (typeof window !== "undefined") {
			const blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
			const indigo = (getComputedStyle(document.body).getPropertyValue('--bs-indigo')).trim();
			const red = (getComputedStyle(document.body).getPropertyValue('--bs-red')).trim();
			const orange = (getComputedStyle(document.body).getPropertyValue('--bs-orange')).trim();
			const lime = (getComputedStyle(document.body).getPropertyValue('--bs-lime')).trim();
			const cyan = (getComputedStyle(document.body).getPropertyValue('--bs-cyan')).trim();
			const teal = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
			const white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
			
			setVisitorChartSeries([
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
			setVisitorChartOptions({
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
			
			setTotalSalesChartOptions({
				chart: { type: 'line', width: 200, height: 36, sparkline: { enabled: true }, stacked: true },
				stroke: { curve: 'smooth', width: 3 },
				fill: {
					type: 'gradient',
					gradient: {
						opacityFrom: 1,
						opacityTo: 1,
						colorStops: [
							{ offset: 0, color: blue, opacity: 1 }, 
							{ offset: 100, color: indigo, opacity: 1 }
						]
					},
				},
				tooltip: {
					theme: 'dark',
					fixed: { enabled: false },
					x: { show: false },
					y: {
						title: { formatter: function () { return '' } },
						formatter: (value: number) => { return '$'+ convertNumberWithCommas(value) },
					},
					marker: { show: false }
				},
				responsive: [
					{ breakpoint: 3000, options: { chart: { width: 130 } } },
					{ breakpoint: 1300, options: { chart: { width: 100 } } },
					{ breakpoint: 1200, options: { chart: { width: 200 } } },
					{ breakpoint: 576, options: { chart: { width: 180 } } },
					{ breakpoint: 400, options: { chart: { width: 120 } } }
				]
			});
			setTotalSalesChartSeries([{ data: [9452.37, 11018.87, 7296.37, 6274.29, 7924.05, 6581.34, 12918.14] }]);
			
			setConversionRateChartOptions({
				chart: { type: 'line', width: 160, height: 28, sparkline: { enabled: true } },
				stroke: { curve: 'smooth', width: 3 },
				fill: {
					type: 'gradient',
					gradient: {
						opacityFrom: 1,
						opacityTo: 1,
						colorStops: [
						{ offset: 0, color: red, opacity: 1 },
						{ offset: 50, color: orange, opacity: 1 },
						{ offset: 100, color: lime, opacity: 1 }]
					}
				},
				labels: ['Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29'],
				xaxis: { crosshairs: { width: 1 } },
				tooltip: {
					theme: 'dark',
					fixed: { enabled: false },
					x: { show: false },
					y: {
						title: { formatter: function () { return '' } },
						formatter: (value: number) => { return value + '%' },
					},
					marker: { show: false }
				},
				responsive: [
					{ breakpoint: 3000, options: { chart: { width: 120 } } },
					{ breakpoint: 1300, options: { chart: { width: 100 } } },
					{ breakpoint: 1200, options: { chart: { width: 160 } } },
					{ breakpoint: 900, options: { chart: { width: 120 } } },
					{ breakpoint: 576, options: { chart: { width: 180 } } },
					{ breakpoint: 400, options: { chart: { width: 120 } } }
				]
			});
			setConversionRateChartSeries([{ data: [2.68, 2.93, 2.04, 1.61, 1.88, 1.62, 2.80] }]);
			
			setStoreSessionChartOptions({
				chart: { type: 'line', width: 160, height: 28, sparkline: { enabled: true }, stacked: false },
				stroke: { curve: 'smooth', width: 3 },
				fill: {
					type: 'gradient',
					gradient: {
						opacityFrom: 1,
						opacityTo: 1,
						colorStops: [
							{ offset: 0, color: teal, opacity: 1 },
							{ offset: 50, color: blue, opacity: 1 },
							{ offset: 100, color: cyan, opacity: 1 }
						]
					},
				},
				labels: ['Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29'],
				xaxis: { crosshairs: { width: 1 } },
				tooltip: {
					theme: 'dark',
					fixed: { enabled: false },
					x: { show: false },
					y: {
						title: { formatter: function () { return '' } },
						formatter: (value: number) => { return convertNumberWithCommas(value) },
					},
					marker: { show: false }
				},
				responsive: [
					{ breakpoint: 3000, options: { chart: { width: 120 } } },
					{ breakpoint: 1300, options: { chart: { width: 100 } } },
					{ breakpoint: 1200, options: { chart: { width: 160 } } },
					{ breakpoint: 900, options: { chart: { width: 120 } } },
					{ breakpoint: 576, options: { chart: { width: 180 } } },
					{ breakpoint: 400, options: { chart: { width: 120 } } }
				]
			});
			setStoreSessionChartSeries([{ data: [10812, 11393, 7311, 6834, 9612, 11200, 13557] }]);
			
			setInitChart(true);
		}
	}
	
	function renderMap() {
		if (typeof window !== 'undefined') {
			(async () => {
				const { default: jsVectorMap } = await import('jsvectormap');
				await import('jsvectormap/dist/maps/world.js');
						
				const theme = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
				const gray600 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-600')).trim();
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
						zoomButtons: false,
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
						backgroundColor: 'transparent'
					});
				}
			})();
		}
	}
	
	function renderPopover() {
    const popoverInterval = setInterval(() => {
			if (window.bootstrap) {
				clearInterval(popoverInterval);
				const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
				popoverTriggerList.forEach(elm => {
					new window.bootstrap.Popover(elm, { trigger: "hover", container: "body" });
				});
			}
		}, 100);
	}
	
	useEffect(() => {
    renderMap();
    renderChart();
    renderPopover();
    
		// eslint-disable-next-line
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/dashboard/v3">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/dashboard/v3">Dashboard</Link></li>
				<li className="breadcrumb-item active">Dashboard v3</li>
			</ol>
			<h1 className="page-header mb-3">Dashboard v3</h1>
			<div className="d-sm-flex align-items-center mb-3">
				<DateRangePicker initialSettings={{ startDate: startDate, endDate: endDate }} onApply={handleDateApplyEvent}>
					<button className="btn btn-inverse me-2 text-truncate">
						<i className="fa fa-calendar fa-fw text-white text-opacity-50 ms-n1 me-1"></i> 
						<span>{dateRange.currentWeek}</span>
						<b className="caret ms-1 opacity-5"></b>
					</button>
				</DateRangePicker>
				<div className="text-gray-600 fw-bold mt-2 mt-sm-0">compared to <span>{dateRange.prevWeek}</span></div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<div className="card border-0 mb-3 overflow-hidden bg-gray-800 text-white">
						<div className="card-body">
							<div className="row">
								<div className="col-xl-7 col-lg-8">
									<div className="mb-3 text-gray-500">
										<b>TOTAL SALES</b>
										<span className="ms-2">
											<i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Total sales" data-bs-placement="top" data-bs-content="Net sales (gross sales minus discounts and returns) plus taxes and shipping. Includes orders from all sales channels."></i>
										</span>
									</div>
									<div className="d-flex mb-1">
										<h2 className="mb-0">$64,559.25</h2>
										<div className="ms-auto mt-n1 mb-n1">
											{initChart && <ApexChart type="line" height={'36px'} width="100" options={totalSalesChartOptions} series={totalSalesChartSeries} />}
										</div>
									</div>
									<div className="mb-3 text-gray-500">
										<i className="fa fa-caret-up"></i> 33.21% compare to last week
									</div>
									<hr className="bg-white-transparent-2" />
									<div className="row text-truncate">
										<div className="col-6">
											<div className="fs-12px text-gray-500">Total sales order</div>
											<div className="fs-18px mb-5px fw-bold">1,568</div>
											<div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
												<div className="progress-bar progress-bar-striped rounded-right bg-teal" style={{width: '55%'}}></div>
											</div>
										</div>
										<div className="col-6">
											<div className="fs-12px text-gray-500">Avg. sales per order</div>
											<div className="fs-18px mb-5px fw-bold">$41.20</div>
											<div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
												<div className="progress-bar progress-bar-striped rounded-right" style={{width: '55%'}}></div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
									<Image src="/assets/img/svg/img-1.svg" alt="" width="229" height="150" className="d-none d-lg-block" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-sm-6">
							<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
								<div className="card-body">
									<div className="mb-3 text-gray-500">
										<b className="mb-3">CONVERSION RATE</b> 
										<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Conversion Rate" data-bs-placement="top" data-bs-content="Percentage of sessions that resulted in orders from total number of sessions." data-original-title="" title=""></i></span>
									</div>
									<div className="d-flex align-items-center mb-1">
										<h2 className="text-white mb-0">2.19%</h2>
										<div className="ms-auto">
											{initChart && <ApexChart type="line" height={'28px'} options={conversionRateChartOptions} series={conversionRateChartSeries} />}
										</div>
									</div>
									<div className="mb-4 text-gray-500 ">
										<i className="fa fa-caret-down"></i> 0.50% compare to last week
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-red fs-8px me-2"></i>
											Added to cart
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 262%</div>
											<div className="w-50px text-end ps-2 fw-bold">3.79%</div>
										</div>
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-warning fs-8px me-2"></i>
											Reached checkout
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 11%</div>
											<div className="w-50px text-end ps-2 fw-bold">3.85%</div>
										</div>
									</div>
									<div className="d-flex">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-lime fs-8px me-2"></i>
											Sessions converted
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 57%</div>
											<div className="w-50px text-end ps-2 fw-bold">2.19%</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
								<div className="card-body">
									<div className="mb-3 text-gray-500">
										<b className="mb-3">STORE SESSIONS</b> 
										<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Store Sessions" data-bs-placement="top" data-bs-content="Number of sessions on your online store. A session is a period of continuous activity from a visitor." data-original-title="" title=""></i></span>
									</div>
									<div className="d-flex align-items-center mb-1">
										<h2 className="text-white mb-0">70,719</h2>
										<div className="ms-auto">
											{initChart && <ApexChart type="line" height={'28px'} options={storeSessionChartOptions} series={storeSessionChartSeries} />}
										</div>
									</div>
									<div className="mb-4 text-gray-500 ">
										<i className="fa fa-caret-up"></i> 9.5% compare to last week
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-teal fs-8px me-2"></i>
											Mobile
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 25.7%</div>
											<div className="w-50px text-end ps-2 fw-bold">53,210</div>
										</div>
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-blue fs-8px me-2"></i>
											Desktop
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 16.0%</div>
											<div className="w-50px text-end ps-2 fw-bold">11,959</div>
										</div>
									</div>
									<div className="d-flex">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-aqua fs-8px me-2"></i>
											Tablet
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 7.9%</div>
											<div className="w-50px text-end ps-2 fw-bold">5,545</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-8 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>VISITORS ANALYTICS</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Top products with units sold" data-bs-placement="top" data-bs-content="Products with the most individual units sold. Includes orders from all sales channels." data-original-title="" title=""></i></span>
							</div>
							<div className="row">
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">127.1K</h3>
									<div>New Visitors</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 25.5% from previous 7 days</div>
								</div>
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">179.9K</h3>
									<div>Returning Visitors</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 5.33% from previous 7 days</div>
								</div>
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">766.8K</h3>
									<div>Total Page Views</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 0.323% from previous 7 days</div>
								</div>
							</div>
						</div>
						<div className="card-body p-0">
							<div style={{height: '269px'}}>
								<div className="widget-chart-full-width pe-4" data-bs-theme="dark" style={{height: '254px'}}>
									{initChart && <ApexChart type="area" height="254" width="100%" options={visitorChartOptions} series={visitorChartSeries} />}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card bg-gray-800 border-0 text-white mb-3">
						<div className="card-body">
							<div className="mb-2 text-grey">
								<b>SESSION BY LOCATION</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Total sales" data-bs-placement="top" data-bs-content="Net sales (gross sales minus discounts and returns) plus taxes and shipping. Includes orders from all sales channels."></i></span>
							</div>
							<div className="mb-3" style={{height: '192px'}}>
								<div id="jvectorMap" style={{height: '192px'}}></div>
							</div>
							<div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/us.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>United States</div>
										<div className="ms-auto text-gray-500">39.85%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/cn.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>China</div>
										<div className="ms-auto text-gray-500">14.23%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/de.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>Germany</div>
										<div className="ms-auto text-gray-500">12.83%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/fr.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>France</div>
										<div className="ms-auto text-gray-500">11.14%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-0">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/jp.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>Japan</div>
										<div className="ms-auto text-gray-500">10.75%</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-900 text-white">
						<div className="card-body" style={{ background: 'no-repeat bottom right', backgroundImage: 'url(/assets/img/svg/img-4.svg)', backgroundSize: 'auto 60%'}}>
							<div className="mb-3 text-gray-500 ">
								<b>SALES BY SOCIAL SOURCE</b>
								<span className="text-gray-500 ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Sales by social source" data-bs-placement="top" data-bs-content="Total online store sales that came from a social referrer source."></i></span>
							</div>
							<h3 className="mb-10px">$55,547.89</h3>
							<div className="text-gray-500 mb-1px"><i className="fa fa-caret-up"></i> 45.76% increased</div>
						</div>
						<div className="widget-list rounded-bottom" data-bs-theme="dark">
							<Link href="/dashboard/v3" className="widget-list-item rounded-0 pt-3px">
								<div className="widget-list-media icon">
									<i className="fab fa-apple bg-indigo text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Apple Store</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$34,840.17
								</div>
							</Link>
							<Link href="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-facebook-f bg-blue text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Facebook</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$12,502.67
								</div>
							</Link>
							<Link href="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-twitter bg-info text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Twitter</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$4,799.20
								</div>
							</Link>
							<Link href="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-google bg-red text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Google Adwords</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$3,405.85
								</div>
							</Link>
							<Link href="/dashboard/v3" className="widget-list-item pb-3px rounded-bottom">
								<div className="widget-list-media icon">
									<i className="fab fa-instagram bg-pink text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Instagram</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$0.00
								</div>
							</Link>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>TOP PRODUCTS BY UNITS SOLD</b>
								<span className="ms-2 "><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Top products with units sold" data-bs-placement="top" data-bs-content="Products with the most individual units sold. Includes orders from all sales channels."></i></span>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-8.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XR (2025)</div>
									<div className="text-gray-500">$799.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">195</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-9.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XS (2025)</div>
									<div className="text-gray-500">$1,199.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">185</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-10.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XS Max (2025)</div>
									<div className="text-gray-500">$3,399</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">129</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-11.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Huawei Y5 (2025)</div>
									<div className="text-gray-500">$99.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">96</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-12.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Huawei Nova 4 (2025)</div>
									<div className="text-gray-500">$499.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">55</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>MARKETING CAMPAIGN</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Marketing Campaign" data-bs-placement="top" data-bs-content="Campaign that run for getting more returning customers."></i></span>
							</div>
							<div className="row align-items-center pb-1px">
								<div className="col-4">
									<div className="h-100px d-flex align-items-center justify-content-center">
										<Image src="/assets/img/svg/img-2.svg" width="107" height="100" alt="" className="mw-100 mh-100" />
									</div>
								</div>
								<div className="col-8">
									<div className="mb-2px text-truncate">Email Marketing Campaign</div>
									<div className="mb-2px  text-gray-500  fs-11px">Mon 12/6 - Sun 18/6</div>
									<div className="d-flex align-items-center mb-2px">
										<div className="flex-grow-1">
											<div className="progress h-5px rounded-pill bg-white bg-opacity-10">
												<div className="progress-bar progress-bar-striped bg-indigo" style={{width: '80%'}}></div>
											</div>
										</div>
										<div className="ms-2 fs-11px w-30px text-center">80%</div>
									</div>
									<div className="text-gray-500 small mb-15px text-truncate">
										57.5% people click the email
									</div>
									<Link href="/dashboard/v3" className="btn btn-xs btn-indigo fs-10px ps-2 pe-2">View campaign</Link>
								</div>
							</div>
							<hr className="bg-white-transparent-2 mt-20px mb-20px" />
							<div className="row align-items-center">
								<div className="col-4">
									<div className="h-100px d-flex align-items-center justify-content-center">
										<Image src="/assets/img/svg/img-3.svg" width="157" height="100" alt="" className="mw-100 mh-100" />
									</div>
								</div>
								<div className="col-8">
									<div className="mb-2px text-truncate">Facebook Marketing Campaign</div>
									<div className="mb-2px  text-gray-500  fs-11px">Sat 10/6 - Sun 18/6</div>
									<div className="d-flex align-items-center mb-2px">
										<div className="flex-grow-1">
											<div className="progress h-5px rounded-pill bg-white bg-opacity-10">
												<div className="progress-bar progress-bar-striped bg-warning" style={{width: '60%'}}></div>
											</div>
										</div>
										<div className="ms-2 fs-11px w-30px text-center">60%</div>
									</div>
									<div className="text-gray-500 small mb-15px text-truncate">
										+124k visitors from facebook
									</div>
									<Link href="/dashboard/v3" className="btn btn-xs btn-warning fs-10px ps-2 pe-2">View campaign</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}