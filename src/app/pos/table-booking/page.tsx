'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppSettings } from '@/config/app-settings';
import { Icon } from '@iconify/react';

interface Reservation {
  time: string;
  text: string;
}

interface Table {
  id: number;
  name: string;
  pax: number;
  reservation: Reservation[];
}

export default function PosTableBooking() {
	const { updateSettings } = useAppSettings();
	const [time, setTime] = useState(getTime());
	const [tableData, setTableData] = useState<Table[]>([]);
	
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
	
	function getStatus(time: string, text: string) {
		const timeSplit = time.split(':');
		const clock = timeSplit[1].split('00');
		const ampm = clock[1];
		const hour = parseInt(timeSplit[0]);
		const fullHour = (ampm === 'pm' && hour < 12) ? hour + 12 : hour;
		const today = new Date();
		const currentFullHour = today.getHours();
		
		if (fullHour === currentFullHour && text) {
			return 'in-progress';
		} else if (currentFullHour > fullHour && text) {
			return 'completed';
		} else if (currentFullHour < fullHour && text) {
			return 'upcoming';
		}
		return '';
	}
	
	function checkSameHour(time:string) {
		const today = new Date();
		const currentFullHour = today.getHours();
		const currentAmPm = (currentFullHour > 12) ? 'pm' : 'am';
		const currentHour = (currentFullHour > 12) ? currentFullHour - 12 : currentFullHour;
		const currentHourFinal = (currentHour < 10) ? '0' + currentHour : currentHour;
		const currentTime = currentHourFinal + ':00' + currentAmPm;
		
		if (currentTime === time) {
			return true;
		}
		return false;
	}
	
	function getAvailableTable() {
		let count = 0;
		const today = new Date();
		let h = today.getHours();
		const a = (h > 11) ? 'pm' : 'am';
		h = (h > 12) ? h - 12 : h;
		
		const currentHour = checkTime(h) + ":00" + a;
		
		if (tableData) {
			for (let i = 0; i < tableData.length; i++) {
				for (let x = 0; x < tableData[i].reservation.length; x++) {
					if (tableData[i].reservation[x].time === currentHour && !tableData[i].reservation[x].text) {
						count++;
					}
				}
			}
		}
		return count;
	}
	
	function checkAvailable(reservation: Reservation[]) {
		for (let x = 0; x < reservation.length; x++) {
			const time = reservation[x].time.split(':');
			const hour = parseInt(time[0]);
			const today = new Date();
			let currentHour = today.getHours();
					currentHour = (currentHour > 12) ? currentHour - 12 : currentHour;
					
			if (currentHour === hour && reservation[x].text) {
				return true;
			}
		}
		return false;
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
				const response = await fetch('/assets/data/pos/table-booking.json', { signal });
	
				if (!response.ok) throw new Error(`Failed to fetch data (HTTP ${response.status})`);
	
				const result = await response.json();
				setTableData(result);
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
		<>
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
					<div className="pos-content-container p-4">
						<div className="d-md-flex align-items-center mb-4">
							<div className="flex-1">
								<div className="fs-20px mb-1">Available Table ({getAvailableTable()}/20)</div>
								<div className="mb-2 mb-md-0 d-flex">
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-body text-opacity-25 fs-9px me-1"></i> Completed
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> Upcoming
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-theme fs-9px me-1"></i> In-progress
									</div>
								</div>
							</div>
							<div>
								<div className="w-200px">
									<input type="date" className="form-control form-control-lg fs-13px" placeholder="Today's" />
								</div>
							</div>
						</div>
						<div className="row gx-4">
							{tableData && tableData.length > 0 ? (tableData.map((table, index) => (
								<div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={index}>
									<div className="pos-table-booking">
										<div className="pos-table-booking-container position-relative">
											<div className="pos-table-booking-header">
												<div className="d-flex align-items-center">
													<div className="flex-1">
														<div className="title">TABLE</div>
														<div className="no">{table.name}</div>
														<div className="desc">max {table.pax} pax</div>
													</div>
													<div className={'display-5 ' + (!checkAvailable(table.reservation) ? 'text-success' : 'text-gray-600')}>
														<Icon icon="solar:check-circle-line-duotone" />
													</div>
												</div>
											</div>
											<div className="pos-table-booking-body">
												{table.reservation.length > 0 ? (table.reservation.map((reservation, index) => (
													<div className={'booking' + ((checkSameHour(reservation.time)) ? ' highlight' : '')} key={index}>
														<div className="time">{reservation.time}</div>
														<div className="info">{(reservation.text) ? reservation.text : '-'}</div>
														<div className={'status '+ getStatus(reservation.time, reservation.text)}>{reservation.text && (<i className="fa fa-circle"></i>)}</div>
													</div>
												))) : (
													<div>
														No records found
													</div>
												)}
											</div>
											<a href="#/" className="stretched-link" data-bs-toggle="modal" data-bs-target="#modalPosBooking"><span className="d-none">&nbsp;</span></a>
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
			<div className="modal modal-pos fade" id="modalPosBooking">
				<div className="modal-dialog modal-lg">
					<div className="modal-content border-0">
						<div>
							<div className="p-0">
								<div className="modal-body">
									<div className="d-flex align-items-center mb-3">
										<h4 className="modal-title d-flex align-items-center"><i className="fa fa-bowl-rice fs-2 me-2 my-n1"></i> Table 01 <small className="fs-13px fw-bold ms-2">max 4 pax</small></h4>
										<button data-bs-dismiss="modal" className="ms-auto btn-close">&nbsp;</button>
									</div>
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">08:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">09:00am</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Sean" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">10:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">11:00am</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">12:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">01:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">02:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">03:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">04:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">05:00pm</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Irene Wong (4pax)" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">06:00pm</div>
													<input type="text" className="form-control" placeholder="" defaultValue="Reserved by Irene Wong (4pax)" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">07:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">08:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">09:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
											<div className="form-group mb-2">
												<div className="input-group">
													<div className="input-group-text fw-bold w-90px fs-13px">10:00pm</div>
													<input type="text" className="form-control" placeholder="" />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button className="btn btn-default w-100px" data-bs-dismiss="modal">Cancel</button>
									<button type="submit" className="btn btn-success w-100px">Book</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}