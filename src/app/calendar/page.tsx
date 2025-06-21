'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import Link from 'next/link';

export default function Calendar() {
	const plugins = [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin ];
	const headerToolbar = {
		left: 'dayGridMonth,timeGridWeek,timeGridDay',
		center: 'title',
		right: 'prev,next today'
	};
	const buttonText = {
		today:    'Today',
		month:    'Month',
		week:     'Week',
		day:      'Day'
	};
	const views = {
		timeGrid: {
			eventLimit: 6
		}
	};
	const [events, setEvents] = useState<{ title: string; start: string; end?: string; color?: string }[]>([]);
	
	useEffect(() => {
		const containerEl = document.getElementById('external-events');
		
		if (containerEl) {
			new Draggable(containerEl, {
				itemSelector: '.fc-event',
				eventData: function(eventEl) {
					return {
						title: eventEl.innerText,
						color: eventEl.getAttribute('data-color')
					};
				}
			});
		}
		
		const themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-theme')).trim();
		const blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
		const pink = (getComputedStyle(document.body).getPropertyValue('--bs-pink')).trim();
		const indigo = (getComputedStyle(document.body).getPropertyValue('--bs-indigo')).trim();
		const green = (getComputedStyle(document.body).getPropertyValue('--bs-green')).trim();
		const red = (getComputedStyle(document.body).getPropertyValue('--bs-red')).trim();
		const orange = (getComputedStyle(document.body).getPropertyValue('--bs-orange')).trim();
		
		const date = new Date();
		const year = date.getFullYear();
		let month: string | number = date.getMonth() + 1;
				month = (month < 10) ? '0' + month : month;
		
		setEvents([{
			title: 'Trip to London',
			start: year + '-'+ month +'-01',
			end: year + '-'+ month +'-05',
			color: themeColor
		},{
			title: 'Meet with Sean Ngu',
			start: year + '-'+ month +'-02T06:00:00',
			color: blue
		},{
			title: 'Mobile Apps Brainstorming',
			start: year + '-'+ month +'-10',
			end: year + '-'+ month +'-12',
			color: pink
		},{
			title: 'Stonehenge, Windsor Castle, Oxford',
			start: year + '-'+ month +'-05T08:45:00',
			end: year + '-'+ month +'-06T18:00',
			color: indigo
		},{
			title: 'Paris Trip',
			start: year + '-'+ month +'-12',
			end: year + '-'+ month +'-16'
		},{
			title: 'Domain name due',
			start: year + '-'+ month +'-15',
			end: year + '-'+ month +'-15',
			color: blue
		},{
			title: 'Cambridge Trip',
			start: year + '-'+ month +'-19',
			end: year + '-'+ month +'-19'
		},{
			title: 'Visit Apple Company',
			start: year + '-'+ month +'-22T05:00:00',
			color: green
		},{
			title: 'Exercise Class',
			start: year + '-'+ month +'-22T07:30:00',
			color: orange
		},{
			title: 'Live Recording',
			start: year + '-'+ month +'-22T03:00:00',
			color: blue
		},{
			title: 'Announcement',
			start: year + '-'+ month +'-22T15:00:00',
			color: red
		},{
			title: 'Dinner',
			start: year + '-'+ month +'-22T18:00:00'
		},{
			title: 'New Android App Discussion',
			start: year + '-'+ month +'-25T08:00:00',
			end: year + '-'+ month +'-25T10:00:00',
			color: red
		},{
			title: 'Marketing Plan Presentation',
			start: year + '-'+ month +'-25T12:00:00',
			end: year + '-'+ month +'-25T14:00:00',
			color: blue
		},{
			title: 'Chase due',
			start: year + '-'+ month +'-26T12:00:00',
			color: orange
		},{
			title: 'Heartguard',
			start: year + '-'+ month +'-26T08:00:00',
			color: orange
		},{
			title: 'Lunch with Richard',
			start: year + '-'+ month +'-28T14:00:00',
			color: blue
		},{
			title: 'Web Hosting due',
			start: year + '-'+ month +'-30',
			color: blue
		}]);
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/calendar">Home</Link></li>
				<li className="breadcrumb-item active">Calendar</li>
			</ol>
			<h1 className="page-header">Calendar <small>header small text goes here...</small></h1>
			<hr />
			
			<div className="row">
				<div className="d-none d-lg-block" style={{width: '215px'}}>
					<div id="external-events" className="fc-event-list">
						<h5 className="mb-3">Draggable Events</h5>
						<div className="fc-event" data-color="#00acac">
							<div className="fc-event-text">Meeting with Client</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-success"></i></div>
						</div>
						<div className="fc-event" data-color="#348fe2">
							<div className="fc-event-text">IOS App Development</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-blue"></i></div>
						</div>
						<div className="fc-event" data-color="#f59c1a">
							<div className="fc-event-text">Group Discussion</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-warning"></i></div>
						</div>
						<div className="fc-event" data-color="#ff5b57">
							<div className="fc-event-text">New System Briefing</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-danger"></i></div>
						</div>
						<div className="fc-event">
							<div className="fc-event-text">Brainstorming</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-dark"></i></div>
						</div>
						<hr className="my-3" />
						<h5 className="mb-3">Other Events</h5>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 1</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 2</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 3</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 4</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 5</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
					</div>
				</div>
				<div className="col-lg">
					<FullCalendar 
						plugins={plugins}
						initialView="dayGridMonth"
						themeSystem="bootstrap"
						headerToolbar={headerToolbar}
						buttonText={buttonText}
						events={events}
						views={views}
					/>
				</div>
			</div>
		</>
	)
}