'use client';

import Link from 'next/link';
import { useEffect, useState, useReducer } from 'react';
import Highlight from 'react-highlight';
import dynamic from 'next/dynamic';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';

export default function ChartApex() {
	const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
	const [lineChartOptions, setLineChartOptions] = useState(() => getLineChartOptions());
	const [columnChartOptions, setColumnChartOptions] = useState(() => getColumnChartOptions());
	const [areaChartOptions, setAreaChartOptions] = useState(() => getAreaChartOptions());
	const [barChartOptions, setBarChartOptions] = useState(() => getBarChartOptions());
	const [mixedChartOptions, setMixedChartOptions] = useState(() => getMixedChartOptions());
	const [candlestickChartOptions, setCandlestickChartOptions] = useState(() => getCandlestickChartOptions());
	const [bubbleChartOptions, setBubbleChartOptions] = useState(() => getBubbleChartOptions());
	const [scatterChartOptions, setScatterChartOptions] = useState(() => getScatterChartOptions());
	const [heatmapChartOptions, setHeatmapChartOptions] = useState(() => getHeatmapChartOptions());
	const [pieChartOptions, setPieChartOptions] = useState(() => getPieChartOptions());
	const [radialBarChartOptions, setRadialBarChartOptions] = useState(() => getRadialBarChartOptions());
	const [radarChartOptions, setRadarChartOptions] = useState(() => getRadarChartOptions());	
	const initialState: (string | undefined)[] = Array(12).fill(undefined);
	const [state, dispatch] = useReducer(reducer, initialState);
	
	function reducer(state: typeof initialState, action: { type: string; index?: number; payload?: string }) {
		if (action.type === "SET_CODE" && action.index !== undefined) {
			const newState = [...state];
			newState[action.index] = action.payload;
			return newState;
		}
		return state;
	}
	
	function generateBubbleChartData(baseval: number, count: number, yrange: { min: number, max: number }) {
		let i = 0;
		const series = [];
		while (i < count) {
			const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
			const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
			const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
			series.push([x, y, z]);
			baseval += 86400000;
			i++;
		}
		return series;
	}
	function generateHeatmapData(count: number, yrange: { min: number, max: number }) {
		let i = 0;
		const series = [];
		while (i < count) {
			const x = 'w' + (i + 1).toString();
			const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
			series.push({ x: x, y: y });
			i++;
		}
		return series;
	}
		
	const lineChartData = [
		{ name: 'High - 2025', data: [28, 29, 33, 36, 32, 32, 33]	}, 
		{ name: 'Low - 2025', data: [12, 11, 14, 18, 17, 13, 13] }
	];
	const columnChartData = [
		{ name: 'Net Profit', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] }, 
		{ name: 'Revenue', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] }, 
		{ name: 'Free Cash Flow', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] }
	];
	const areaChartData = [
		{ name: 'series1', data: [31, 40, 28, 51, 42, 109, 100] }, 
		{ name: 'series2', data: [11, 32, 45, 32, 34, 52, 41] }
	];
	const barChartData = [
		{ data: [44, 55, 41, 64, 22, 43, 21] },
		{ data: [53, 32, 33, 52, 13, 44, 32] }
	];
	const mixedChartData = [
		{ name: 'Income', type: 'column', data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6] }, 
		{ name: 'Cashflow', type: 'column',	data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5] },
		{ name: 'Revenue', type: 'line', data: [20, 29, 37, 36, 44, 45, 50, 58] }
	];
	const candlestickChartData = [{
		data: [
			{ x: new Date(1538778600000), y: [6629.81, 6650.5, 6623.04, 6633.33] }, { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] }, { x: new Date(1538782200000), y: [6630.71, 6648.95, 6623.34, 6635.65] }, { x: new Date(1538784000000), y: [6635.65, 6651, 6629.67, 6638.24] }, { x: new Date(1538785800000), y: [6638.24, 6640, 6620, 6624.47] }, { x: new Date(1538787600000), y: [6624.53, 6636.03, 6621.68, 6624.31] }, { x: new Date(1538789400000), y: [6624.61, 6632.2, 6617, 6626.02] }, { x: new Date(1538791200000), y: [6627, 6627.62, 6584.22, 6603.02] }, { x: new Date(1538793000000), y: [6605, 6608.03, 6598.95, 6604.01] }, 
			{ x: new Date(1538794800000), y: [6604.5, 6614.4, 6602.26, 6608.02] }, { x: new Date(1538796600000), y: [6608.02, 6610.68, 6601.99, 6608.91] }, { x: new Date(1538798400000), y: [6608.91, 6618.99, 6608.01, 6612] }, { x: new Date(1538800200000), y: [6612, 6615.13, 6605.09, 6612] }, { x: new Date(1538802000000), y: [6612, 6624.12, 6608.43, 6622.95] }, { x: new Date(1538803800000), y: [6623.91, 6623.91, 6615, 6615.67] }, { x: new Date(1538805600000), y: [6618.69, 6618.74, 6610, 6610.4] }, { x: new Date(1538807400000), y: [6611, 6622.78, 6610.4, 6614.9] }, { x: new Date(1538809200000), y: [6614.9, 6626.2, 6613.33, 6623.45] }, { x: new Date(1538811000000), y: [6623.48, 6627, 6618.38, 6620.35] }, { x: new Date(1538812800000), y: [6619.43, 6620.35, 6610.05, 6615.53] }, { x: new Date(1538814600000), y: [6615.53, 6617.93, 6610, 6615.19] }, { x: new Date(1538816400000), y: [6615.19, 6621.6, 6608.2, 6620] }, { x: new Date(1538818200000), y: [6619.54, 6625.17, 6614.15, 6620] }, 
			{ x: new Date(1538820000000), y: [6620.33, 6634.15, 6617.24, 6624.61] }, { x: new Date(1538821800000), y: [6625.95, 6626, 6611.66, 6617.58] }, { x: new Date(1538823600000), y: [6619, 6625.97, 6595.27, 6598.86] }, { x: new Date(1538825400000), y: [6598.86, 6598.88, 6570, 6587.16] }, { x: new Date(1538827200000), y: [6588.86, 6600, 6580, 6593.4] }, { x: new Date(1538829000000), y: [6593.99, 6598.89, 6585, 6587.81] }, { x: new Date(1538830800000), y: [6587.81, 6592.73, 6567.14, 6578] }, { x: new Date(1538832600000), y: [6578.35, 6581.72, 6567.39, 6579] }, { x: new Date(1538834400000), y: [6579.38, 6580.92, 6566.77, 6575.96] }, { x: new Date(1538836200000), y: [6575.96, 6589, 6571.77, 6588.92] }, { x: new Date(1538838000000), y: [6588.92, 6594, 6577.55, 6589.22] }, { x: new Date(1538839800000), y: [6589.3, 6598.89, 6589.1, 6596.08] }, { x: new Date(1538841600000), y: [6597.5, 6600, 6588.39, 6596.25] }, { x: new Date(1538843400000), y: [6598.03, 6600, 6588.73, 6595.97] }, 
			{ x: new Date(1538845200000), y: [6595.97, 6602.01, 6588.17, 6602] }, { x: new Date(1538847000000), y: [6602, 6607, 6596.51, 6599.95] }, { x: new Date(1538848800000), y: [6600.63, 6601.21, 6590.39, 6591.02] }, { x: new Date(1538850600000), y: [6591.02, 6603.08, 6591, 6591] }, { x: new Date(1538852400000), y: [6591, 6601.32, 6585, 6592] }, { x: new Date(1538854200000), y: [6593.13, 6596.01, 6590, 6593.34] }, { x: new Date(1538856000000), y: [6593.34, 6604.76, 6582.63, 6593.86] }, { x: new Date(1538857800000), y: [6593.86, 6604.28, 6586.57, 6600.01] }, { x: new Date(1538859600000), y: [6601.81, 6603.21, 6592.78, 6596.25] }, { x: new Date(1538861400000), y: [6596.25, 6604.2, 6590, 6602.99] }, { x: new Date(1538863200000), y: [6602.99, 6606, 6584.99, 6587.81] }, { x: new Date(1538865000000), y: [6587.81, 6595, 6583.27, 6591.96] }, { x: new Date(1538866800000), y: [6591.97, 6596.07, 6585, 6588.39] }, { x: new Date(1538868600000), y: [6587.6, 6598.21, 6587.6, 6594.27] }, { x: new Date(1538870400000), y: [6596.44, 6601, 6590, 6596.55] }, 
			{ x: new Date(1538872200000), y: [6598.91, 6605, 6596.61, 6600.02] }, { x: new Date(1538874000000), y: [6600.55, 6605, 6589.14, 6593.01] }, { x: new Date(1538875800000), y: [6593.15, 6605, 6592, 6603.06] }, { x: new Date(1538877600000), y: [6603.07, 6604.5, 6599.09, 6603.89] }, { x: new Date(1538879400000), y: [6604.44, 6604.44, 6600, 6603.5] }, { x: new Date(1538881200000), y: [6603.5, 6603.99, 6597.5, 6603.86] }, { x: new Date(1538883000000), y: [6603.85, 6605, 6600, 6604.07] }, { x: new Date(1538884800000), y: [6604.98, 6606, 6604.07, 6606]
		}]
	}];
	const bubbleChartData = [
		{ name: 'Bubble1', data: generateBubbleChartData(new Date('11 Feb 2025 GMT').getTime(), 20, { min: 10, max: 60 }) },
		{	name: 'Bubble2', data: generateBubbleChartData(new Date('11 Feb 2025 GMT').getTime(), 20, { min: 10, max: 60 }) },
		{ name: 'Bubble3', data: generateBubbleChartData(new Date('11 Feb 2025 GMT').getTime(), 20, { min: 10, max: 60 }) },
		{ name: 'Bubble4', data: generateBubbleChartData(new Date('11 Feb 2025 GMT').getTime(), 20, { min: 10, max: 60 }) }
	];
	const scatterChartData = [
		{ name: "SAMPLE A", data: [[16.4, 5.4],[21.7, 2],[25.4, 3],[19, 2],[10.9, 1],[13.6, 3.2],[10.9, 7.4],[10.9, 0],[10.9, 8.2],[16.4, 0],[16.4, 1.8],[13.6, 0.3],[13.6, 0],[29.9, 0],[27.1, 2.3],[16.4, 0],[13.6, 3.7],[10.9, 5.2],[16.4, 6.5],[10.9, 0],[24.5, 7.1],[10.9, 0],[8.1, 4.7],[19, 0],[21.7, 1.8],[27.1, 0],[24.5, 0],[27.1, 0],[29.9, 1.5],[27.1, 0.8],[22.1, 2]] }, 
		{ name: "SAMPLE B", data: [[36.4, 13.4],[1.7, 11],[5.4, 8],[9, 17],[1.9, 4],[3.6, 12.2],[1.9, 14.4],[1.9, 9],[1.9, 13.2],[1.4, 7],[6.4, 8.8],[3.6, 4.3],[1.6, 10],[9.9, 2],[7.1, 15],[1.4, 0],[3.6, 13.7],[1.9, 15.2],[6.4, 16.5],[0.9, 10],[4.5, 17.1],[10.9, 10],[0.1, 14.7],[9, 10],[12.7, 11.8],[2.1, 10],[2.5, 10],[27.1, 10],[2.9, 11.5],[7.1, 10.8],[2.1, 12]] }, 
		{ name: "SAMPLE C", data: [[21.7, 3],[23.6, 3.5],[24.6, 3],[29.9, 3],[21.7, 20],[23, 2],[10.9, 3],[28, 4],[27.1, 0.3],[16.4, 4],[13.6, 0],[19, 5],[22.4, 3],[24.5, 3],[32.6, 3],[27.1, 4],[29.6, 6],[31.6, 8],[21.6, 5],[20.9, 4],[22.4, 0],[32.6, 10.3],[29.7, 20.8],[24.5, 0.8],[21.4, 0],[21.7, 6.9],[28.6, 7.7],[15.4, 0],[18.1, 0],[33.4, 0],[16.4, 0]] }
	];
	const heatmapChartData = [
		{ name: 'Metric1', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric2', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric3', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric4', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric5', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric6', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric7', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric8', data: generateHeatmapData(18, {	min: 0, max: 90 }) }, 
		{ name: 'Metric9', data: generateHeatmapData(18, {	min: 0, max: 90 }) }
	];
	const pieChartData = [44, 55, 13, 43, 22];
	const radialBarChartData = [76, 67, 61, 90];
	const radarChartData = [
		{ name: 'Series 1', data: [20, 100, 40, 30, 50, 80, 33] }
	];
	
	function getLineChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const secondary = (window.getComputedStyle(document.body).getPropertyValue('--bs-secondary')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyBg = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-bg')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { toolbar: { show: false }, zoom: { enabled: false } },
				title: { text: 'Average High & Low Temperature', align: 'center' as const, style: { fontSize:  '14px', fontWeight:  '600', fontFamily:  bodyFontFamily, color: bodyColor } },
				colors: [theme, secondary],
				dataLabels: { enabled: true, style: { fontSize: '11px', fontFamily: bodyFontFamily, fontWeight: 500 }, background: { enabled: true, padding: 4, borderRadius: 2, borderWidth: 0, opacity: 0.9, dropShadow: { enabled: false } } },
				stroke: { curve: 'smooth' as const, width: 3 },
				grid: { borderColor: borderColor, row: { colors: [ bodyBg, 'transparent'], opacity: 0.5 } },
				markers: { size: 4 },
				xaxis: { 
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { 
					min: 5, max: 40,
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				legend: { show: true, position: 'top' as const, offsetY: -10, horizontalAlign: 'right' as const, floating: true, fontFamily: bodyFontFamily, labels: { colors: bodyColor } }
			};
		}
		return undefined;
	}
	
	function getColumnChartOptions() {
		if (typeof window !== 'undefined') {
			const gray300 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-300')).trim();
			const gray600 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-600')).trim();
			const indigo = (window.getComputedStyle(document.body).getPropertyValue('--bs-indigo')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				title: { text: 'Profit & Margin Chart', align: 'center' as const, style: { fontSize: '14px', fontWeight: bodyFontWeight, fontFamily: bodyFontFamily, color: bodyColor } },
				plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
				dataLabels: { enabled: false },
				stroke: { show: true, width: 2, colors: ['transparent'] },
				colors: [gray600, indigo, gray300],
				grid: { borderColor: borderColor },
				xaxis: { 
					categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { title: { text: '$ (thousands)' }, labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } },
				fill: { opacity: 1 },
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } },
				tooltip: { y: { formatter: function (val: number) { return "$ " + val + " thousands" } } }
			};
		}
		return undefined;
	}
	
	function getAreaChartOptions() {
		if (typeof window !== 'undefined') {
			const gray600 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-600')).trim();
			const pink = (window.getComputedStyle(document.body).getPropertyValue('--bs-pink')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { zoom: { enabled: false } },
				dataLabels: { enabled: false },
				stroke: { curve: 'smooth' as const, width: 3 },
				colors: [pink, gray600],
				grid: { borderColor: borderColor },
				xaxis: { 
					type: 'datetime' as const, categories: ['2025-09-19T00:00:00', '2025-09-19T01:30:00', '2025-09-19T02:30:00', '2025-09-19T03:30:00', '2025-09-19T04:30:00', '2025-09-19T05:30:00', '2025-09-19T06:30:00'],
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } },
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } },
				tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
			};
		}
		return undefined;
	}
	
	function getBarChartOptions() {
		if (typeof window !== 'undefined') {
			const gray500 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
			const orange = (window.getComputedStyle(document.body).getPropertyValue('--bs-warning')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				plotOptions: { bar: { horizontal: true, dataLabels: { position: 'top' as const } } },
				dataLabels: { enabled: true, offsetX: -6, style: { fontSize: '12px', colors: ['#ffffff'] } },
				colors: [orange, gray500],
				stroke: { show: false },
				grid: { borderColor: borderColor },
				xaxis: { 
					categories: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } },
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } }
			};
		}
		return undefined;
	}
	
	function getMixedChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const gray300 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-300')).trim();
			const orange = (window.getComputedStyle(document.body).getPropertyValue('--bs-warning')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyColorRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color-rgb')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { stacked: false, zoom: { enabled: false } },
				dataLabels: { enabled: false },
				stroke: { width: [0, 0, 3] },
				colors: [theme, 'rgba('+ bodyColorRgb +', .5)', orange],
				grid: { borderColor: borderColor },
				title: { text: 'XYZ - Stock Analysis (2016 - 2025)', align: 'center' as const, style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } },
				xaxis: {
					categories: [2016, 2017, 2018, 2019, 2020, 2021, 2023, 2024, 2025],
					axisBorder: { show: true, color: gray300, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: gray300, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: [{
					axisTicks: { show: true },
					axisBorder: { show: true, color: theme },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } },
					title: { text: "Income (thousand crores)", style: { color: theme } },
					tooltip: { enabled: true }
				},{
					seriesName: 'Income',
					opposite: true,
					axisTicks: { show: true, },
					axisBorder: { show: true, color: 'rgba('+ bodyColorRgb +', .5)' },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } },
					title: { text: "Operating Cashflow (thousand crores)", style: { color: 'rgba('+ bodyColorRgb +', .5)' } },
				}, {
					seriesName: 'Revenue',
					opposite: true,
					axisTicks: { show: true },
					axisBorder: { show: true, color: orange },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } },
					title: { text: "Revenue (thousand crores)", style: { color: orange } }
				}],
				tooltip: { fixed: { enabled: true, position: 'topLeft' as const, offsetY: 30, offsetX: 60 } },
				legend: { horizontalAlign: 'left' as const, offsetX: 40, fontFamily: bodyFontFamily, labels: { colors: bodyColor } }
			};
		}
		return undefined;
	}
	
	function getCandlestickChartOptions() {
		if (typeof window !== 'undefined') {
			const gray300 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-300')).trim();
			const success = (window.getComputedStyle(document.body).getPropertyValue('--bs-success')).trim();
			const danger = (window.getComputedStyle(document.body).getPropertyValue('--bs-danger')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { zoom: { enabled: false } },
				title: { text: 'CandleStick Chart', align: 'left' as const, style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } },
				grid: { borderColor: borderColor },
				plotOptions: {
					candlestick: {
						colors: { upward: success, downward: danger },
						wick: { useFillColor: true }
					}
				},
				xaxis: {
					type: 'datetime' as const,
					axisBorder: { show: true, color: gray300, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: gray300, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { tooltip: { enabled: true }, labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } }
			};
		}
		return undefined;
	}
	
	function getBubbleChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const pink = (window.getComputedStyle(document.body).getPropertyValue('--bs-pink')).trim();
			const orange = (window.getComputedStyle(document.body).getPropertyValue('--bs-warning')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyColorRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color-rgb')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { zoom: { enabled: false } },
				dataLabels: { enabled: false },
				colors: [theme, orange, 'rgba('+ bodyColorRgb +', .5)', pink],
				grid: { borderColor: borderColor },
				fill: { opacity: 0.8 },
				title: { text: 'Simple Bubble Chart', style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } },
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } },
				xaxis: { tickAmount: 12, type: 'category' as const, labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } },
				yaxis: { max: 70, labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } }
			};
		}
		return undefined;
	}
	
	function getScatterChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const orange = (window.getComputedStyle(document.body).getPropertyValue('--bs-warning')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyColorRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color-rgb')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				chart: { zoom: { enabled: false, type: 'xy' as const } },
				colors: [theme, orange, 'rgba('+ bodyColorRgb +', .5)'],
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } },
				grid: { borderColor: borderColor },
				xaxis: { 
					tickAmount: 10, 
					labels: { 
						formatter: function(val: string) { return parseFloat(val).toFixed(1) },
						style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' }
					}
				},
				yaxis: { tickAmount: 7, labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } }
			};
		}
		return undefined;
	}
	
	function getHeatmapChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				dataLabels: { enabled: false },
				colors: [theme],
				title: { text: 'HeatMap Chart (Single color)', style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } },
				xaxis: {
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				},
				yaxis: { labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } } }
			};
		}
		return undefined;
	}
	
	function getPieChartOptions() {
		if (typeof window !== 'undefined') {
			const themeRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme-rgb')).trim();
			const indigoRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-indigo-rgb')).trim();
			const pinkRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-pink-rgb')).trim();
			const orangeRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-warning-rgb')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyColorRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color-rgb')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			
			return {
				dataLabels: { dropShadow: { enabled: false, top: 1, left: 1, blur: 1, opacity: 1 } },
				stroke: { show: false },
				colors: [ 'rgba('+ pinkRgb +', .75)',  'rgba('+ orangeRgb +', .75)',  'rgba('+ themeRgb +', .75)', 'rgba('+ bodyColorRgb +', .5)',  'rgba('+ indigoRgb +', .75)'],
				labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
				legend: { fontFamily: bodyFontFamily, labels: { colors: bodyColor } },
				title: { text: 'HeatMap Chart (Single color)', style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } }
			};
		}
		return undefined;
	}
	
	function getRadialBarChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const cyan = (window.getComputedStyle(document.body).getPropertyValue('--bs-cyan')).trim();
			const indigo = (window.getComputedStyle(document.body).getPropertyValue('--bs-indigo')).trim();
			const gray300 = (window.getComputedStyle(document.body).getPropertyValue('--bs-gray-300')).trim();
			const bodyBg = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-bg')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			
			return {
				plotOptions: {
					radialBar: {
						offsetY: -10,
						startAngle: 0,
						endAngle: 270,
						hollow: { margin: 5, size: '30%', background: 'transparent', image: undefined },
						track: { background: bodyBg },
						dataLabels: { name: { show: false }, value: { show: false } }
					}
				},
				colors: [cyan, theme, indigo, gray300],
				labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
				legend: {
					show: true,
					floating: true,
					position: 'left' as const,
					offsetX: 140,
					offsetY: 15,
					labels: { useSeriesColors: true },
					markers: { size: 0 },
					formatter: function(seriesName: string, opts: { w: { globals: { series: number[] } }; seriesIndex: number }) { return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] },
					itemMargin: { horizontal: 1, },
					fontFamily: bodyFontFamily
				}
			};
		}
		return undefined;
	}
	
	function getRadarChartOptions() {
		if (typeof window !== 'undefined') {
			const theme = (window.getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
			const bodyBg = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-bg')).trim();
			const bodyColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
			const bodyColorRgb = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-color-rgb')).trim();
			const bodyFontFamily = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
			const bodyFontWeight = (window.getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
			const borderColor = (window.getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
			
			return {
				labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				plotOptions: {
					radar: {
						size: 140,
						polygons: {
							strokeColors: borderColor,
							strokeWidth: '1',
							connectorColors: borderColor,
							fill: { colors: [bodyBg, 'rgba('+ bodyColorRgb +', .05)'] }
						}
					}
				},
				title: { text: 'Radar with Polygon Fill', style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  bodyFontFamily, color: bodyColor } },
				colors: [theme],
				markers: { size: 4, colors: [theme], strokeColor: theme, strokeWidth: 2 },
				tooltip: { y: { formatter: function(val: number) { return `${val}` } } },
				yaxis: {
					tickAmount: 7,
					labels: { 
						formatter: function(val: string | number, i: number) { return (i % 2 === 0) ? `${val}` : ''; },
						style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } 
					}
				},
				xaxis: {
					axisBorder: { show: true, color: borderColor, height: 1, width: '100%', offsetX: 0, offsetY: -1 },
					axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
					labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: bodyFontFamily, fontWeight: bodyFontWeight, cssClass: 'apexcharts-xaxis-label' } }
				}
			};
		};
		return undefined;
	}
	
	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const fetchData = async (index: number) => {
			try {
				const response = await fetch(`/assets/data/chart/apexchart-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 12; i++) {
			fetchData(i);
		}
    
		function setChartOptionsState() {
			setLineChartOptions(getLineChartOptions());
			setColumnChartOptions(getColumnChartOptions());
			setAreaChartOptions(getAreaChartOptions());
			setBarChartOptions(getBarChartOptions());
			setMixedChartOptions(getMixedChartOptions());
			setCandlestickChartOptions(getCandlestickChartOptions());
			setBubbleChartOptions(getBubbleChartOptions());
			setScatterChartOptions(getScatterChartOptions());
			setHeatmapChartOptions(getHeatmapChartOptions());
			setPieChartOptions(getPieChartOptions());
			setRadialBarChartOptions(getRadialBarChartOptions());
			setRadarChartOptions(getRadarChartOptions());
		}
		
		const handleThemeReload = () => {
			setChartOptionsState();
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
				<li className="breadcrumb-item"><Link href="/chart/apex">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/chart/apex">Chart</Link></li>
				<li className="breadcrumb-item active">Apex Chart</li>
			</ol>
			<h1 className="page-header">Apex Chart <small>header small text goes here...</small></h1>
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Line Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								JavaScript Line Charts are a typical pictorial representation that depicts trends and behaviors over time. It is represented by a series of data points connected with a line.
							</p>
							<div className="pe-10px">
								<ApexChart type="line" options={lineChartOptions} series={lineChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[1]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Column Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								A JavaScript Column Chart, just like other bar graphs uses vertical bars to display data and is used to compare values across categories.
							</p>
							<div className="ps-10px pe-10px">
								<ApexChart type="bar" options={columnChartOptions} series={columnChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[2]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Area Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								With their mountain-like appearance, JavaScript Area Charts are used to represent quantitative variations.
							</p>
							<div className="pe-10px">
								<ApexChart type="area" options={areaChartOptions} series={areaChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[3]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Bar Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								Unlike the Column chart, a JavaScript Bar Chart is oriented in a horizontal manner using rectangular bars. 
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="bar" options={barChartOptions} series={barChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[4]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Mixed Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								A JavaScript Mixed Chart or a Combo Chart is a visualization that allows the combination of two or more distinct graphs. 
							</p>
							<div className="pe-10px">
								<ApexChart type="line" options={mixedChartOptions} series={mixedChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[5]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Candlestick Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								A candlestick chart (also called Japanese candlestick chart) is a style of financial chart used to describe price movements of a security, derivative, or currency. 
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="candlestick" options={candlestickChartOptions} series={candlestickChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[6]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Bubble Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								JavaScript Bubble Charts are useful for showing data in a three-dimensional manner. In a bubble chart, data points are depicted with bubbles.
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="bubble" options={bubbleChartOptions} series={bubbleChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[7]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Scatter Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								For non-linearly related variables, JavaScript Scatter Charts are quite useful when there is a need to graphically establish a relationship between the variables.
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="scatter" options={scatterChartOptions} series={scatterChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[8]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Heatmap Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								A heat map is a two-dimensional representation of data in which values are represented by colors.
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="heatmap" options={heatmapChartOptions} series={heatmapChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[9]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Pie Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								A pie chart (or a circle chart) is a circular statistical graphic, which is divided into slices to illustrate numerical proportion. 
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="pie" options={pieChartOptions} series={pieChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[10]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Radial Bar Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								Radial Bar Charts are valuable in showing comparisons between categories by using circularly shaped bars.
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="radialBar" options={radialBarChartOptions} series={radialBarChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[11]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Radar Chart</PanelHeader>
						<PanelBody className="p-0">
							<p className="mb-0 p-3">
								Radar chart is a graphical method of displaying two-dimensional chart of three or more quantitative variables represented on axes starting from the same point.
							</p>
							<div className="ps-5px pe-10px">
								<ApexChart type="radar" options={radarChartOptions} series={radarChartData} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[12]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}