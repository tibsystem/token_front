'use client';

import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import Highlight from 'react-highlight';
import Chart from 'chart.js/auto';

export default function ChartJs() {
	const initialState: (string | undefined)[] = Array(6).fill(undefined);
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
				const response = await fetch(`/assets/data/chart/chartjs-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 6; i++) {
			fetchData(i);
		}
    
		let chart1: Chart | null = null;
		let chart2: Chart | null = null;
		let chart3: Chart | null = null;
		let chart4: Chart | null = null;
		let chart5: Chart | null = null;
		let chart6: Chart | null = null;
	
		function renderChart() {
			const themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const themeColorRgb = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme-rgb')).trim();
			const gray900 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900')).trim();
			const gray900Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900-rgb')).trim();
			const gray800Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-800-rgb')).trim();
			const gray500 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
			const gray500Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500-rgb')).trim();
			const gray300Rgb = (getComputedStyle(document.body).getPropertyValue('--bs-gray-300-rgb')).trim();
			
			const bodyBg = (getComputedStyle(document.body).getPropertyValue('--bs-body-bg')).trim();
			const bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const borderColor = (getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			const inverse = (getComputedStyle(document.body).getPropertyValue('--bs-inverse')).trim();
			const inverseRgb = (getComputedStyle(document.body).getPropertyValue('--bs-inverse-rgb')).trim();
			
			Chart.defaults.font.family = bodyFontFamily;
			Chart.defaults.font.size = 12;
			Chart.defaults.color = bodyColor;
			Chart.defaults.borderColor = borderColor;
			Chart.defaults.plugins.legend.display = true;
			Chart.defaults.plugins.tooltip.padding = { left: 8, right: 12, top: 8, bottom: 8 };
			Chart.defaults.plugins.tooltip.cornerRadius = 8;
			Chart.defaults.plugins.tooltip.titleMarginBottom = 6;
			Chart.defaults.plugins.tooltip.displayColors = true;
			Chart.defaults.plugins.tooltip.boxPadding = 6;
			Chart.defaults.scale.grid.color = borderColor;
			
			const chart1Container = document.getElementById('chart-1');
			if (chart1) {
				chart1.destroy();
			}
			if (chart1Container) {
				chart1Container.innerHTML = '<canvas id="lineChart"></canvas>';
				const chartElm1 = document.getElementById('lineChart') as HTMLCanvasElement;
    		if (chartElm1) {
					chart1 = new Chart(chartElm1, {
						type: 'line',
						data: {
							labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
							datasets: [{
								backgroundColor: 'rgba('+ themeColorRgb +', .2)',
								borderColor: themeColor,
								borderWidth: 1.5,
								pointBackgroundColor: bodyBg,
								pointBorderWidth: 1.5,
								pointRadius: 4,
								pointHoverBackgroundColor: themeColor,
								pointHoverBorderColor: bodyBg,
								pointHoverRadius: 7,
								label: 'Total Sales',
								data: [12, 19, 4, 5, 2, 3]
							}]
						}
					});
				}
			}
		
			const chart2Container = document.getElementById('chart-2');
			if (chart2) {
				chart2.destroy();
			}
			if (chart2Container) {
				chart2Container.innerHTML = '<canvas id="barChart"></canvas>';
				const chartElm2 = document.getElementById('barChart') as HTMLCanvasElement;
    		if (chartElm2) {
					chart2 = new Chart(chartElm2, {
						type: 'bar',
						data: {
							labels: ['Jan','Feb','Mar','Apr','May','Jun'],
							datasets: [{
								label: 'Total Visitors',
								data: [37,31,36,34,43,31],
								backgroundColor: 'rgba('+ themeColorRgb +', .5)',
								borderColor: themeColor,
								borderWidth: 1.5
							},{
								label: 'New Visitors',
								data: [12,16,20,14,23,21],
								backgroundColor: 'rgba('+ inverseRgb +', .2)',
								borderColor: 'rgba('+ inverseRgb +', .65)',
								borderWidth: 1.5
							}]
						}
					});
				}
			}
		
			const chart3Container = document.getElementById('chart-3');
			if (chart3) {
				chart3.destroy();
			}
			if (chart3Container) {
				chart3Container.innerHTML = '<canvas id="radarChart"></canvas>';
				const chartElm3 = document.getElementById('radarChart') as HTMLCanvasElement;
    		if (chartElm3) {
					chart3 = new Chart(chartElm3, {
						type: 'radar',
						data: {
							labels: ['United States', 'Canada', 'Australia', 'Netherlands', 'Germany', 'New Zealand', 'Singapore'],
							datasets: [
								{
									label: 'Mobile',
									backgroundColor: 'rgba('+ themeColorRgb +', .2)',
									borderColor: themeColor,
									pointBackgroundColor: bodyBg,
									pointBorderColor: themeColor,
									pointHoverBackgroundColor: bodyBg,
									pointHoverBorderColor: themeColor,
									data: [65, 59, 90, 81, 56, 55, 40],
									borderWidth: 1.5
								},
								{
									label: 'Desktop',
									backgroundColor: 'rgba('+ gray500Rgb +', .2)',
									borderColor: gray500,
									pointBackgroundColor: bodyBg,
									pointBorderColor: gray500,
									pointHoverBackgroundColor: bodyBg,
									pointHoverBorderColor: gray500,
									data: [28, 48, 40, 19, 96, 27, 100],
									borderWidth: 1.5
								}
							]
						}
					});
				}
			}
			
			const chart4Container = document.getElementById('chart-4');
			if (chart4) {
				chart4.destroy();
			}
			if (chart4Container) {
				chart4Container.innerHTML = '<canvas id="polarAreaChart"></canvas>';
				const chartElm4 = document.getElementById('polarAreaChart') as HTMLCanvasElement;
    		if (chartElm4) {
					chart4 = new Chart(chartElm4, {
						type: 'polarArea',
						data: {
							datasets: [{
								data: [11, 16, 7, 3, 14],
								backgroundColor: ['rgba('+ themeColorRgb +', .5)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ gray300Rgb+', .5)', 'rgba('+ gray500Rgb +', .5)', 'rgba('+ gray800Rgb +', .5)'],
								borderWidth: 0
							}],
							labels: ['IE', 'Safari', 'Chrome', 'Firefox', 'Opera']
						}
					});
				}
			}
		
			const chart5Container = document.getElementById('chart-5');
			if (chart5) {
				chart5.destroy();
			}
			if (chart5Container) {
				chart5Container.innerHTML = '<canvas id="pieChart"></canvas>';
				const chartElm5 = document.getElementById('pieChart') as HTMLCanvasElement;
    		if (chartElm5) {
					chart5 = new Chart(chartElm5, {
						type: 'pie',
						data: {
							labels: ['Total Visitor', 'New Visitor', 'Returning Visitor'],
							datasets: [{
								data: [300, 50, 100],
								backgroundColor: ['rgba('+ themeColorRgb +', .5)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ themeColorRgb +', .5)'],
								hoverBackgroundColor: ['rgba('+ themeColorRgb +', 1)', 'rgba('+ inverseRgb +', 1)', 'rgba('+ gray900Rgb +', 1)'],
								borderWidth: 0
							}]
						}
					});
				}
			}
		
			const chart6Container = document.getElementById('chart-6');
			if (chart6) {
				chart6.destroy();
			}
			if (chart6Container) {
				chart6Container.innerHTML = '<canvas id="doughnutChart"></canvas>';
				const chartElm6 = document.getElementById('doughnutChart') as HTMLCanvasElement;
    		if (chartElm6) {
					chart6 = new Chart(chartElm6, {
						type: 'doughnut',
						data: {
							labels: ['Total Visitor', 'New Visitor', 'Returning Visitor'],
							datasets: [{
								data: [300, 50, 100],
								backgroundColor: ['rgba('+ themeColorRgb +', .25)', 'rgba('+ inverseRgb +', .2)', 'rgba('+ themeColorRgb +', .5)'],
								hoverBackgroundColor: [themeColor, inverse, gray900],
								borderWidth: 0
							}]
						}
					});
				}
			}
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
				<li className="breadcrumb-item"><Link href="/chart/js">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/chart/js">Chart</Link></li>
				<li className="breadcrumb-item active">Chart JS</li>
			</ol>
			<h1 className="page-header">Chart JS <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Line Chart</PanelHeader>
						<PanelBody>
							<p>
								A line chart is a way of plotting data points on a line.
								Often, it is used to show trend data, and the comparison of two data sets.
							</p>
							<div id="chart-1"></div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[1]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Bar Chart</PanelHeader>
						<PanelBody>
							<p>
								A bar chart is a way of showing data as bars.
								It is sometimes used to show trend data, and the comparison of multiple data sets side by side.
							</p>
							<div id="chart-2"></div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[2]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Radar Chart</PanelHeader>
						<PanelBody>
							<p>
								A radar chart is a way of showing multiple data points and the variation between them.
								They are often useful for comparing the points of two or more different data sets.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-3"></div>
							</div>
						</PanelBody>
						
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[3]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Polar Area Chart</PanelHeader>
						<PanelBody>
							<p>
								Polar area charts are similar to pie charts, but each segment has the same angle - the radius of the segment 
								differs depending on the value.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-4"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[4]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Panel>
						<PanelHeader>Pie Chart</PanelHeader>
						<PanelBody>
							<p>
								Pie and doughnut charts are probably the most commonly used chart there are. They are divided into segments, the arc of each segment shows the proportional value of each piece of data.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-5"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[5]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-md-6">
					<Panel>
						<PanelHeader>Doughnut Chart</PanelHeader>
						<PanelBody>
							<p>
								Pie and doughnut charts are registered under two aliases in the Chart core. Other than their different default value, and different alias, they are exactly the same.
							</p>
							<div className="w-300px h-300px mx-auto">
								<div id="chart-6"></div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[6]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}