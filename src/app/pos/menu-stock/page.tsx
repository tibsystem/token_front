'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSettings } from '@/config/app-settings';

interface StockItem {
  id: string;
  image: string;
  title: string;
  description: string;
  stock: number;
  available: boolean;
}

export default function PosMenuStock() {
	const { updateSettings } = useAppSettings();
	const [time, setTime] = useState(getTime());
	const [stockData, setStockData] = useState<StockItem[]>([]);
	
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
				const response = await fetch('/assets/data/pos/menu-stock.json', { signal });
	
				if (!response.ok) throw new Error(`Failed to fetch data (HTTP ${response.status})`);
	
				const result = await response.json();
				setStockData(result);
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
				<div className="pos-content-container">
					<div className="row gx-0">
						{stockData && stockData.length > 0 ? (stockData.map((stock) => (
						<div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={stock.id}>
							<div className="pos-stock-product">
								<div className="pos-stock-product-container">
									<div className="product">
										<div className="product-img">
											<div className="img" style={{backgroundImage: 'url('+ stock.image +')'}}></div>
										</div>
										<div className="product-info">
											<div className="title">{stock.title}</div>
											<div className="desc">{stock.description}</div>
											
											<div className="product-option">
												<div className="option">
													<div className="option-label">Stock:</div>
													<div className="option-input">
														<input type="text" className="form-control" defaultValue={stock.stock} />
													</div>
												</div>
												<div className="option">
													<div className="option-label">Stock:</div>
													<div className="option-input">
														<div className="form-check form-switch">
															<input className="form-check-input" type="checkbox" name="qty" id="product1" defaultChecked={stock.available} defaultValue="1" />
															<label className="form-check-label" htmlFor="product1"></label>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="product-action">
											<a href="#/" className="btn btn-success"><i className="fa fa-check fa-fw"></i> Update</a>
											<a href="#/" className="btn btn-default"><i className="fa fa-times fa-fw"></i> Cancel</a>
										</div>
									</div>
								</div>
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
		</div>
	)
}