'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSettings } from '@/config/app-settings';

interface OrderItem {
  image: string;
  title: string;
  quantity: string;
  status: string;
  note: string[];
}

interface OrderData {
  tableNo: string;
  orderNo: string;
  orderType: string;
  orderTime: string;
  urgent?: boolean;
  orderStatus?: string;
  totalOrderTime?: string;
  items: OrderItem[];
}

export default function PosKitchenOrder() {
	const { updateSettings } = useAppSettings();
	const [time, setTime] = useState(getTime());
	const [orderData, setOrderData] = useState<OrderData[]>([]);
	
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
	
	function getTotalCompletedItems(items: { status: string }[]) {
		let count = 0;
		for (let i = 0; i < items.length; i++) {
			if (items[i].status === 'Completed') {
				count++;
			}
		}
		return count;
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
				const response = await fetch('/assets/data/pos/kitchen-order.json', { signal });
	
				if (!response.ok) throw new Error(`Failed to fetch data (HTTP ${response.status})`);
	
				const result = await response.json();
				setOrderData(result);
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
		<div className="pos pos-with-header" id="pos">
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
				<div className="pos-task-row">
					{orderData && orderData.length > 0 ? (orderData.map((order, index) => (
						<div className="pos-task" key={index}>
							<div className="pos-task-info">
								<div className="table-no">Table {order.tableNo}</div>
								<div className="order-no">Order No: #{order.orderNo}</div>
								<div className="order-type">
									<span className={'badge ' +
										((order.orderStatus !== 'Completed') ? ' bg-theme text-theme-color' : '') + 
										((order.orderStatus === 'Completed') ? ' bg-gray-500' : '')
									}>{order.orderType}</span>
								</div>
								<div className="time-pass">
									{order.orderTime && (<div className={((order.urgent) ? 'text-danger fw-bold' : '')}>{order.orderTime} time</div>)}
									{order.totalOrderTime && (<div>All dish served<br />{ order.totalOrderTime } total time</div>)}
								</div>
							</div>
							<div className="pos-task-body">
								<div className="pos-task-completed">
									Completed: ({getTotalCompletedItems(order.items)}/{order.items.length})
								</div>
								<div className="pos-task-product-row">
									{order.items && order.items.length > 0 ? (order.items.map((item, index) => (
										<div className={'pos-task-product' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' completed' : '')} key={index}>
											<div className="pos-task-product-img">
												<div className="cover" style={{backgroundImage: 'url('+ item.image +')'}}></div>
												{item.status === 'Completed' && (<div className="caption"><div>Completed</div></div>)}
												{item.status === 'Cancelled' && (<div className="caption"><div>Cancelled</div></div>)}
											</div>
											<div className="pos-task-product-info">
												<div className="info">
													<div className="title">{item.title}</div>
													<div className="desc">
														{item.note.length > 0 && (item.note.map((note, index) => (
															<div key={index}> - {note}</div>
														)))}
													</div>
												</div>
												<div className="qty">
													x{item.quantity}
												</div>
											</div>
											<div className="pos-task-product-action">
												<a href="#/" className={'btn btn-success' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' disabled' : '')}>Complete</a>
												<a href="#/" className={'btn btn-outline-inverse' + ((item.status === 'Completed' || item.status === 'Cancelled') ? ' disabled' : '')}>Cancel</a>
											</div>
										</div>
									))) : (
										<div className="py-3">
											No records found
										</div>
									)}
								</div>
							</div>
						</div>
					))) : (
						<div>
							No records found
						</div>
					)}
				</div>
			</div>
		</div>
	)
}