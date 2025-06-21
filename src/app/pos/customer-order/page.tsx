'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAppSettings } from '@/config/app-settings';
import { Icon } from '@iconify/react';

interface Option {
  key: string;
  value: string;
}

interface FoodOption {
  size: { text: string; price: string }[];
  addon?: { text: string; price: string }[];
}

interface Food {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  type: string;
  available: boolean;
  options: FoodOption;
  hide?: boolean;
}

interface Category {
  icon: string;
  text: string;
  type: string;
  active: boolean;
}

interface OrderItem {
  id: number;
  image: string;
  title: string;
  price: string;
  options: Option[];
  quantity: number;
  confirmation?: boolean;
}

interface Table {
  tableNo: string;
  orderNo: string;
  category: Category[];
  food: Food[];
  order: OrderItem[];
  orderHistory: string;
}

interface Modal {
  show: () => void;
  hide: () => void;
};

export default function PosCustomerOrder() {
	const { updateSettings } = useAppSettings();
	const [posMobileSidebarToggled, setPosMobileSidebarToggled] = useState<boolean>(false);
	const [categoryType, setCategoryType] = useState<string>('all');
	const [tableData, setTableData] = useState<Table | undefined>(undefined);
	const [orderData, setOrderData] = useState<OrderItem[]>([]);
	const [orderHistoryData, setOrderHistoryData] = useState<OrderItem[]>([]);
	const [modal, setModal] = useState<Modal | undefined>(undefined);
	const [modalData, setModalData] = useState<Food | undefined>(undefined);
	const [modalQuantity, setModalQuantity] = useState<number>(1);
	const [modalSelectedSize, setModalSelectedSize] = useState<string>('Small');
	const [modalSelectedAddon, setModalSelectedAddon] = useState<string[]>([]);
	
	const toggleMobileSidebar = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		
		setPosMobileSidebarToggled(true);
	}
	
	const dismissMobileSidebar = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		
		setPosMobileSidebarToggled(false);
	}
	
	const showType = (event: React.MouseEvent<HTMLAnchorElement>, type: string) => {
		event.preventDefault();
		
		if (tableData && tableData.food) {
			for (let i = 0; i < tableData.food.length; i++) {
				if (tableData.food[i].type === type || type === 'all') {
					tableData.food[i].hide = false;
				} else {
					tableData.food[i].hide = true;
				}
			}
			
			setTableData(tableData);
			setCategoryType(type);
		}
	}
	
	const showPosItemModal = (event: React.MouseEvent<HTMLAnchorElement>, food: Food) => {
		event.preventDefault();
		
		if (food.available) {
			setModalData(food);
			setModalQuantity(1);
			setModalSelectedAddon([]);
			
			if (modal) {
				modal.show();
			}
		}
	}
	
	const getOrderTotal = () => {
		return (orderData) ? orderData.length : 0;
	}
	
	const getOrderHistoryTotal = () => {
		return (orderHistoryData) ? orderHistoryData.length : 0;
	}
	
	const deductQty = (event: React.MouseEvent<HTMLAnchorElement>, id: number) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					let newQty = parseInt(obj.quantity.toString(), 10) - 1;
					
					if (newQty < 1) {
						newQty = 1;
					}
					return {...obj, quantity: newQty};
				}
				
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	const addQty = (event: React.MouseEvent<HTMLAnchorElement>, id: number) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					const newQty = parseInt(obj.quantity.toString(), 10) + 1;
					return {...obj, quantity: newQty};
				}
				
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	const getSubTotalPrice = () => {
		let value = 0;
		
		if (orderData) {
			for (let i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity.toString(), 10);
			}
		}
		return value.toFixed(2);
	}
	
	const getTaxesPrice = () => {
		let value = 0;
		
		if (orderData) {
			for (let i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity.toString(), 10) * .06;
			}
		}
		return value.toFixed(2);
	}
	
	const getTotalPrice = () =>  {
		let value = 0;
		
		if (orderData) {
			for (let i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity.toString(), 10);
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity.toString(), 10) * .06;
			}
		}
		return value.toFixed(2);
	}
	
	const toggleConfirmation = (event: React.MouseEvent<HTMLButtonElement>, id: number, value: boolean) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					return {...obj, confirmation: value};
				}
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	const removeOrder = (event: React.MouseEvent<HTMLButtonElement>, id:number) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.filter(function(order) { 
				return order.id !== id
			});
			
			setOrderData(newData);
		}
	}
	
	const addModalQty = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (modalQuantity) {
			const newQty = parseInt(modalQuantity.toString(), 10) + 1;
			
			setModalQuantity(newQty);
		}
	}
	
	const deductModalQty = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		
		if (modalQuantity) {
			let newQty = parseInt(modalQuantity.toString(), 10) - 1;
		
			if (newQty < 1) {
				newQty = 1;
			}
			setModalQuantity(newQty);
		}
	}
	
	const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = '';
		if (event.target.checked) {
			value = event.target.value;
		}
		
		setModalSelectedSize(value);
	}
	
	const handleAddonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		
		const elms = Array.from(document.querySelectorAll('input[name="addon"]')) as HTMLInputElement[];
		const targetValue: string[] = [];
		
		elms.forEach((elm) => {
			if (elm.checked) {
				targetValue.push(elm.value);
			}
		});
		
		setModalSelectedAddon(targetValue);
	}
	
	const addToCart = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		if (modal) {
			modal.hide();
		}
		
		const options: { key: string; value: string }[] = [];
		if (modalSelectedSize) {
			const option = {
				"key": "size",
				"value": modalSelectedSize
			};
			options.push(option);
		}
		if (modalSelectedAddon) {
			for (let i = 0; i < modalSelectedAddon.length; i++) {
				const option2 = {
					"key": "addon",
					"value": modalSelectedAddon[i]
				};
				options.push(option2);
			}
		}
		
		setTimeout(() => {
			const id: number = (tableData) ? tableData.order.length + 1 : 1;
			const modalImage: string = (modalData) ? modalData.image : '';
			const modalTitle: string = (modalData) ? modalData.title : '';
			const modalPrice: string = (modalData) ? modalData.price : '';
 			setOrderData([...orderData, {
				"id": id,
				"image": modalImage,
				"title": modalTitle,
				"price": modalPrice,
				"quantity": modalQuantity,
				"options": options
			}]);
		}, 500);
	}
  
	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;
		
		updateSettings({
			appHeaderNone: true,
			appSidebarNone: true,
			appContentFullHeight: true,
			appContentClass: 'p-0'
		});
		
		const modalInterval = setInterval(() => {
			const modalElement = document.getElementById('modalPosItem');
			if (modalElement && window && window.bootstrap) {
				setModal(new window.bootstrap.Modal(modalElement));
    		clearInterval(modalInterval);
			}
		}, 100);
		
		const fetchData = async () => {
			try {
				const response = await fetch('/assets/data/pos/customer-order.json', { signal });
	
				if (!response.ok) {
					throw new Error(`Failed to fetch data (HTTP ${response.status})`);
				}
	
				const result = await response.json();
				setTableData(result);
				setOrderData(result.order);
				setOrderHistoryData(result.history);
			} catch (error) {
				if (error instanceof Error && error.name !== 'AbortError') {
					console.error('Error fetching customer order data:', error);
				}
			}
		};
	
		fetchData();
		
		return () => {
			controller.abort();
    	clearInterval(modalInterval);
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
		<>
			<div className={'pos pos-with-menu pos-with-sidebar ' + ((posMobileSidebarToggled) ? 'pos-mobile-sidebar-toggled' : '')} id="pos">
				<div className="pos-menu">
					<div className="logo">
						<Link href="/">
							<div className="logo-img"><i className="fa fa-bowl-rice"></i></div>
							<div className="logo-text">Pine & Dine</div>
						</Link>
					</div>
					<div className="nav-container">
						<PerfectScrollbar className="h-100">
							<ul className="nav nav-tabs">
								{tableData && tableData.category && (tableData.category.map((category, index) => (
								<li className="nav-item" key={index}>
									<a className={'nav-link' + ((category.type === categoryType) ? ' active' : '')} onClick={(event) => showType(event, category.type)} href="#/">
										<div className="nav-icon"><i className={category.icon}></i></div>
										<div className="nav-text">{category.text}</div>
									</a>
								</li>
								)))}
							</ul>
						</PerfectScrollbar>
					</div>
				</div>
					
				<div className="pos-content">
					<div className="pos-content-container h-100">
						<div className="product-row">
							{tableData && tableData.food ? (tableData.food.map((food, index) => (
								<div className={'product-container'+ ((food.hide) ? ' d-none' : '')} key={index}>
									<a href="#/" className={'product'+ ((!food.available) ? ' not-available': '')} onClick={(event) => showPosItemModal(event, food)}>
										<div className="img" style={{backgroundImage: 'url('+ food.image +')'}}></div>
										<div className="text">
											<div className="title">{food.title}</div>
											<div className="desc">{food.description}</div>
											<div className="price">${food.price}</div>
										</div>
										{!food.available && (<div className="not-available-text"><div>Not Available</div></div>)}
									</a>
								</div>
							))) : (
								<div className="py-3">
									No records found
								</div>
							)}
						</div>
					</div>
				</div>
				
				<div className="pos-sidebar" id="pos-sidebar">
					<div className="h-100 d-flex flex-column p-0">
						<div className="pos-sidebar-header">
							<div className="back-btn">
								<button type="button" onClick={dismissMobileSidebar} className="btn">
									<i className="fa fa-chevron-left"></i>
								</button>
							</div>
							<div className="icon"><i className="fa fa-plate-wheat"></i></div>
							<div className="title">Table {tableData && tableData.tableNo && (tableData.tableNo)}</div>
							<div className="order">Order: <b>{tableData && tableData.orderNo && (tableData.orderNo)}</b></div>
						</div>
				
						<div className="pos-sidebar-nav">
							<ul className="nav nav-tabs nav-fill">
								<li className="nav-item">
									<a className="nav-link active" href="#/" data-bs-toggle="tab" data-bs-target="#newOrderTab">New Order ({getOrderTotal()})</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#/" data-bs-toggle="tab" data-bs-target="#orderHistoryTab">Order History ({getOrderHistoryTotal()})</a>
								</li>
							</ul>
						</div>
						
						<PerfectScrollbar className="pos-sidebar-body tab-content h-100">
							<div className="tab-pane fade h-100 show active" id="newOrderTab">
								<div className="pos-table">
									{orderData && orderData.length > 0 ? (orderData.map((order, index) => (
										<div className="row pos-table-row" key={index}>
											<div className="col-9">
												<div className="pos-product-thumb">
													<div className="img" style={{backgroundImage: 'url('+ order.image +')'}}></div>
													<div className="info">
														<div className="title">{order.title}</div>
														<div className="single-price">${order.price}</div>
														<div className="desc">
															{order.options && (order.options.map((option, index) => (
																<div key={index}>- { option.key }: { option.value }</div>
															)))}
														</div>
														<div className="input-group qty">
															<div className="input-group-append">
																<a href="#/" className="btn btn-default" onClick={(event) => deductQty(event, order.id)}><i className="fa fa-minus"></i></a>
															</div>
															<input type="text" className="form-control" value={order.quantity} readOnly />
															<div className="input-group-prepend">
																<a href="#/" className="btn btn-default" onClick={(event) => addQty(event, order.id)}><i className="fa fa-plus"></i></a>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="col-3 total-price d-flex flex-column">
												<div>${ (Number(order.price) * Number(order.quantity)).toFixed(2) }</div>
												<div className="text-end mt-auto">
													<button onClick={(event) => toggleConfirmation(event, order.id, true)} className="btn btn-sm btn-outline-gray-500">
														<i className="fa fa-trash"></i>
													</button>
												</div>
											</div>
											{order.confirmation && (
												<div className="pos-remove-confirmation">
													<div className="text-center mx-auto">
														<div><i className="far fa-trash-can fa-2x text-body text-opacity-50"></i></div>
														<div className="mt-1 mb-2">Confirm to remove this item? </div>
														<div>
															<button onClick={(event) => toggleConfirmation(event, order.id, false)} className="btn btn-default w-60px me-2">No</button>
															<button onClick={(event) => removeOrder(event, order.id)} className="btn btn-danger w-60px">Yes</button>
														</div>
													</div>
												</div>
											)}
										</div>
									))) : (
										<div className="h-100 d-flex align-items-center justify-content-center text-center p-20">
											<div>
												<div className="mb-3 mt-n5">
													<i className="bi bi-bag" style={{fontSize: '6em'}}></i>
												</div>
												<h5>No order found</h5>
											</div>
										</div>
									)}
								</div>
							</div>
					
							<div className="tab-pane fade h-100" id="orderHistoryTab">
								<div className="h-100 d-flex align-items-center justify-content-center text-center p-20">
									<div>
										<div className="mb-3 mt-n5">
											<svg width="6em" height="6em" viewBox="0 0 16 16" className="text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" d="M14 5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM1 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4H1z"/>
												<path d="M8 1.5A2.5 2.5 0 0 0 5.5 4h-1a3.5 3.5 0 1 1 7 0h-1A2.5 2.5 0 0 0 8 1.5z"/>
											</svg>
										</div>
										<h5>No order history found</h5>
									</div>
								</div>
							</div>
						</PerfectScrollbar>
						
						<div className="pos-sidebar-footer">
							<div className="d-flex align-items-center mb-2">
								<div>Subtotal</div>
								<div className="flex-1 text-end h6 mb-0">${getSubTotalPrice()}</div>
							</div>
							<div className="d-flex align-items-center">
								<div>Taxes (6%)</div>
								<div className="flex-1 text-end h6 mb-0">${getTaxesPrice()}</div>
							</div>
							<hr className="opacity-1 my-10px" />
							<div className="d-flex align-items-center mb-2">
								<div>Total</div>
								<div className="flex-1 text-end h4 mb-0">${getTotalPrice()}</div>
							</div>
							<div className="d-flex align-items-center mt-3">
								<button className="btn btn-default rounded-3 text-center me-10px w-70px"><i className="fa fa-bell d-block fs-18px my-1"></i> Service</button>
								<button className="btn btn-default rounded-3 text-center me-10px w-70px"><i className="fa fa-receipt d-block fs-18px my-1"></i> Bill</button>
								<button className="btn btn-theme rounded-3 text-center flex-1"><i className="fa fa-shopping-cart d-block fs-18px my-1"></i> Submit Order</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<a href="#/" className="pos-mobile-sidebar-toggler" onClick={toggleMobileSidebar}>
				<Icon className="iconify display-6" icon="solar:bag-smile-bold-duotone" />
				<span className="badge">{getOrderTotal()}</span>
			</a>
	
			<div className="modal modal-pos fade" id="modalPosItem">
				<div className="modal-dialog modal-lg">
					<div className="modal-content border-0">
						<button data-bs-dismiss="modal" className="btn-close position-absolute top-0 end-0 m-4">&nbsp;</button>
						<div className="modal-pos-product">
							{modalData && (
								<>
								<div className="modal-pos-product-img">
									<div className="img" style={{backgroundImage: 'url('+ modalData.image +')'}}></div>
								</div>
								<div className="modal-pos-product-info">
									<div className="fs-4 fw-bold">{ modalData.title }</div>
									<div className="fs-6 text-body text-opacity-50 mb-2">
										{ modalData.description }
									</div>
									<div className="fs-3 fw-bolder mb-3">${ modalData.price }</div>
									<div className="option-row">
										<div className="d-flex mb-3">
											<button className="btn btn-default d-flex align-items-center" onClick={(event) => deductModalQty(event)}><i className="fa fa-minus"></i></button>
											<input type="text" value={modalQuantity} readOnly className="form-control w-30px fw-bold fs-5 px-0 mx-2 text-center border-0" />
											<button className="btn btn-default d-flex align-items-center" onClick={(event) => addModalQty(event)}><i className="fa fa-plus"></i></button>
										</div>
									</div>
									<hr className="mx-n4" />
									{modalData && modalData.options && modalData.options.size && (
										<div className="mb-2">
											<div className="fw-bold">Size:</div>
											<div className="option-list">
												{modalData.options.size.map((size, index) => (
													<div className="option" key={index}>
														<input type="radio" id={'size' + index} name="size" className="option-input" defaultValue={size.text} onChange={(event) => handleSizeChange(event)} defaultChecked={((index === 0) ? true : false)} />
														<label className="option-label" htmlFor={'size' + index}>
															<span className="option-text">{size.text}</span>
															<span className="option-price">+{size.price}</span>
														</label>
													</div>
												))}
											</div>
										</div>
									)}
									{modalData && modalData.options && modalData.options.addon && (
										<div className="mb-2">
											<div className="fw-bold">Add On:</div>
											<div className="option-list">
												{modalData.options.addon.map((addon, index) => (
													<div className="option" key={index}>
														<input type="checkbox" name="addon" className="option-input" onChange={(event) => handleAddonChange(event)} value={addon.text} id={'addon'+ index} />
														<label className="option-label" htmlFor={'addon'+ index}>
															<span className="option-text">{addon.text}</span>
															<span className="option-price">+{addon.price}</span>
														</label>
													</div>
												))}
											</div>
										</div>
									)}
									
									<hr />
									<div className="row gx-3">
										<div className="col-4">
											<a href="#/" className="btn btn-default fs-14px rounded-3 fw-bold mb-0 d-block py-3" data-bs-dismiss="modal">Cancel</a>
										</div>
										<div className="col-8">
											<a href="#/" className="btn btn-theme fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0" onClick={(event) => addToCart(event)}>Add to cart <i className="fa fa-plus ms-3"></i></a>
										</div>
									</div>
								</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}