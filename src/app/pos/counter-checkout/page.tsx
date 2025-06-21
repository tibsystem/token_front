'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAppSettings } from '@/config/app-settings';

interface Order {
  image: string;
  title: string;
  quantity: number;
  price: string;
  options: string[];
}

interface Table {
  id: number;
  tableNo: string;
  pax: string;
  totalPax: string;
  status: string;
  totalTime: string;
  orderNo?: string;
  orders?: Order[];
  reserveName?: string;
}

export default function PosCounterCheckout() {
	const { updateSettings } = useAppSettings();
	const [time, setTime] = useState(getTime());
	const [tableData, setTableData] = useState<Table[]>([]);
	const [posMobileSidebarToggled, setPosMobileSidebarToggled] = useState(false);
	const [selectedTable, setSelectedTable] = useState<Table | null | undefined>(undefined);
	
	function checkTime(i: number): string {
		return i < 10 ? `0${i}` : i.toString();
	}
	
	function getTime() {
		const today = new Date();
		const h = today.getHours();
		const m = today.getMinutes();
		const min = checkTime(m);
		const a = h >= 12 ? 'pm' : 'am';
		const hour = h > 12 ? h - 12 : h;
	
		return `${hour}:${min}${a}`;
	}
	
	
	function toggleMobileSidebar(event: React.MouseEvent<HTMLAnchorElement>, table: Table) {
		event.preventDefault();
		
		setPosMobileSidebarToggled(true);
		setSelectedTable(table);
	}
	
	function dismissMobileSidebar(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		
		setPosMobileSidebarToggled(false);
		setSelectedTable(null);
	}
	
	function getPrice(type: string) {
		let price = 0;
		
		if (selectedTable && selectedTable.orders) {
			const orders = selectedTable.orders;
			for (let i = 0; i < orders.length; i++) {
				if (type === 'subtotal') {
					price += parseFloat(orders[i].price);
				} else if (type === 'taxes') {
					price += parseFloat(orders[i].price) * 0.06;
				} else if (type === 'total') {
					price += parseFloat(orders[i].price);
					price += parseFloat(orders[i].price) * 0.06
				}
			}
		}
		
		return price.toFixed(2);
	}
	
	function getTotalPrice(orders: Order[] = []) {
		let total = 0;
		if (orders) {
			for (let i = 0; i < orders.length; i++) {
				total += parseFloat(orders[i].price);
			}
		}
		return total.toFixed(2);
	}
	
	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const interval = setInterval(() => {
			setTime(getTime());
		}, 1000);
		
		updateSettings({
			appHeaderNone: true,
			appSidebarNone: true,
			appContentFullHeight: true,
			appContentClass: 'p-0'
		});
		
		const fetchData = async () => {
			try {
				const response = await fetch('/assets/data/pos/counter-checkout.json', { signal });
	
				if (!response.ok) throw new Error(`Failed to fetch data (HTTP ${response.status})`);
	
				const result = await response.json();
				setTableData(result);
				setSelectedTable(result[0]);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") console.error("Error fetching POS data:", error);
			}
		};
	
		fetchData();
		
		return () => {
			clearInterval(interval);
			controller.abort();
			updateSettings({
				appHeaderNone: false,
				appSidebarNone: false,
				appContentFullHeight: false,
				appContentClass: ''
			});
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div className={'pos pos-with-header pos-with-sidebar ' + ((posMobileSidebarToggled) ? 'pos-sidebar-mobile-toggled' : '')} id="pos">
			<div className="pos-header">
				<div className="logo">
					<Link href="/">
						<div className="logo-img"><i className="fa fa-bowl-rice fs-2"></i></div>
						<div className="logo-text">Pine & Dine</div>
					</Link>
				</div>
				<div className="time" id="time">{time}</div>
				<div className="nav">
					<div className="nav-item">
						<Link href="/pos/counter-checkout" className="nav-link">
							<i className="far fa-credit-card nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link href="/pos/kitchen-order" className="nav-link">
							<i className="far fa-clock nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link href="/pos/table-booking" className="nav-link">
							<i className="far fa-calendar-check nav-icon"></i>
						</Link>
					</div>
					<div className="nav-item">
						<Link href="/pos/menu-stock" className="nav-link">
							<i className="fa fa-chart-pie nav-icon"></i>
						</Link>
					</div>
				</div>
			</div>	
			
			<div className="pos-content">
				<div className="pos-content-container">
					<div className="d-md-flex align-items-center mb-4">
						<div className="pos-booking-title flex-1">
							<div className="fs-24px mb-1">Available Table (13/20)</div>
							<div className="mb-2 mb-md-0 d-flex">
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-gray-500 fs-9px me-1"></i> Reserved
								</div>
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> Table In-use
								</div>
								<div className="d-flex align-items-center me-3">
									<i className="fa fa-circle fa-fw text-theme fs-9px me-1"></i> Table Available
								</div>
							</div>
						</div>
					</div>
					
					<div className="pos-table-row">
						{tableData && tableData.length > 0 ? (tableData.map((table, index) => (
							
							<div key={index} className={'pos-table' + 
								((selectedTable && table.tableNo === selectedTable.tableNo) ? ' selected' : '') + 
								((!table.orders && table.status !== 'Reserved') ? ' available' : '') + 
								((table.orders) ? ' in-use' : '') +
								((table.status === 'Reserved') ? ' disabled' : '')
							}>
								<div className="pos-table-container position-relative">
									<div className="pos-table-status"></div>
									<div className="pos-table-name">
										<div className="name">Table</div>
										<div className="no">{table.tableNo}</div>
										<div className="order">
											{table.orders && (<span>{table.orders.length} orders</span>)}
											{table.status === 'Reserved' && (<span>Reserved for {table.reserveName}</span>)}
											{!table.orders && table.status !== 'Reserved' && (<span>max { table.totalPax } pax</span>)}
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-user"></i></span>
												<span className="text">{table.pax} / {table.totalPax}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-clock"></i></span>
												<span className="text">{(table.totalTime) ? table.totalTime : '-'}</span>
											</div>
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-receipt"></i></span>
												<span className="text">${getTotalPrice(table.orders)}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-dollar-sign"></i></span>
												<span className={'text'+ ((table.status === 'Paid') ? ' text-success' : '')}>{(table.status !== 'Reserved') ? table.status : '-'}</span>
											</div>
										</div>
									</div>
									<a href="#/" className="stretched-link" onClick={(event) => toggleMobileSidebar(event, table)}><span className="d-none">&nbsp;</span></a>
								</div>
							</div>
						))) : (
							<div className="col-12">
								No records found
							</div>
						)}
					</div>
				</div>
			</div>
			
			<div className="pos-sidebar" id="pos-sidebar">
				<div className="pos-sidebar-header">
					<div className="back-btn">
						<button type="button" onClick={dismissMobileSidebar} className="btn">
							<i className="fa fa-chevron-left"></i>
						</button>
					</div>
					<div className="icon"><i className="fa fa-plate-wheat"></i></div>
					<div className="title">Table {(selectedTable && selectedTable.tableNo) ? selectedTable.tableNo : '-'}</div>
					<div className="order">Order: <b>#{ (selectedTable && selectedTable.orderNo) ? selectedTable.orderNo : '-' }</b></div>
				</div>
				<PerfectScrollbar className="pos-sidebar-body">
					<div className="pos-table">
						{selectedTable && selectedTable.orders ? (selectedTable.orders.map((order, index) => (
							<div className="row pos-table-row" key={index}>
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style={{backgroundImage: 'url('+ order.image +')'}}></div>
										<div className="info">
											<div className="title">{ order.title }</div>
											<div className="desc">
												{order.options && order.options.map((option, index) => (
													<div key={index}>- size: {option}</div>
												))}
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x{ order.quantity }</div>
								<div className="col-3 total-price">${ (parseFloat(order.price) * order.quantity).toFixed(2) }</div>
							</div>
						))) : (
							<div className="pos-order py-3">
								No records found
							</div>
						)}
					</div>
				</PerfectScrollbar>
				
				<div className="pos-sidebar-footer">
					<div className="d-flex align-items-center mb-2">
						<div>Subtotal</div>
						<div className="flex-1 text-end h6 mb-0">${getPrice('subtotal')}</div>
					</div>
					<div className="d-flex align-items-center">
						<div>Taxes (6%)</div>
						<div className="flex-1 text-end h6 mb-0">${getPrice('taxes')}</div>
					</div>
					<hr className="opacity-1 my-10px" />
					<div className="d-flex align-items-center mb-2">
						<div>Total</div>
						<div className="flex-1 text-end h4 mb-0">${getPrice('total')}</div>
					</div>
					<div className="d-flex align-items-center mt-3">
						<a href="#/" className="btn btn-default w-80px rounded-3 text-center me-10px">
							<i className="fab fa-paypal d-block fs-18px my-1"></i>
							E-Wallet
						</a>
						<a href="#/" className="btn btn-default w-80px rounded-3 text-center me-10px">
							<i className="fab fa-cc-visa d-block fs-18px my-1"></i>
							CC
						</a>
						<a href="#/" className="btn btn-theme rounded-3 text-center flex-1">
							<i className="fa fa-wallet d-block fs-18px my-1"></i>
							Pay by Cash
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}