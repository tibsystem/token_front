'use client';

import { useEffect, useReducer, useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Highlight from 'react-highlight';
import DateTime from 'react-datetime';
import DatePicker from 'react-datepicker';
import InputMask from '@mona-health/react-input-mask';
import Moment from 'moment';
import 'quill/dist/quill.snow.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
	
export default function FormPlugins() {
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [maxDateDisabled, setMaxDateDisabled] = useState(false);
	const [maxYesterday, setMaxYesterday] = useState<Moment.Moment | undefined>(undefined);
	const [sketchBackgroundColor, setSketchBackgroundColor] = useState<string>('#348fe2');
	const [chromeBackgroundColor, setChromeBackgroundColor] = useState<string>('#8753de');
	const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
	const Select = dynamic(() => import('react-select'), { ssr: false });
  const SketchPicker = dynamic(() => import('react-color').then((mod) => mod.SketchPicker), { ssr: false });
  const ChromePicker = dynamic(() => import('react-color').then((mod) => mod.ChromePicker), { ssr: false });
	const minYesterday = Moment().subtract(1, 'day');
	const minDateRange = (current: Moment.Moment) => { return current.isAfter( minYesterday ); };
	const maxDateRange = (current: Moment.Moment) => { return current.isAfter( maxYesterday ); };
	const selectOptions = [
		{ value: 'chocolate', label: 'Chocolate' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' }
	];
	const selected = ['Apples', 'Pears'];
	const value = '';
	const initialState: (string | undefined)[] = Array(8).fill(undefined);
	const [state, dispatch] = useReducer(reducer, initialState);
	
	function reducer(state: typeof initialState, action: { type: string; index?: number; payload?: string }) {
		if (action.type === "SET_CODE" && action.index !== undefined) {
			const newState = [...state];
			newState[action.index] = action.payload;
			return newState;
		}
		return state;
	}
	
	function minDateChange(value: string | Moment.Moment) {
		const momentValue = Moment.isMoment(value) ? value : Moment(value);
    
    setMaxDateDisabled(false);
    setMaxYesterday(momentValue);
	}
	
	function handleChange(date: Date | null) {
		if (date) {
			setStartDate(date);
		} else {
			setStartDate(new Date());
		}
	}
	
	function handleSketchChangeComplete(color: { hex: string }) {
		setSketchBackgroundColor(color.hex);
	}
	
	function handleChromeChangeComplete(color: { hex: string }) {
		setChromeBackgroundColor(color.hex);
	};
	
	function setValue() {
	};
	
	useEffect(() => {
		const controller = new AbortController();
  	const { signal } = controller;
		const fetchData = async (index: number) => {
			try {
				const response = await fetch(`/assets/data/form/plugin-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 8; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
	}, []);
	
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/form/plugins">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/form/plugins">Form Stuff</Link></li>
				<li className="breadcrumb-item active">Form Plugins</li>
			</ol>
			<h1 className="page-header">Form Plugins <small>header small text goes here...</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							Bootstrap Date Time Picker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Date Time</label>
									<div className="col-lg-8">
										<DateTime inputProps={{ placeholder: 'Datepicker' }} closeOnSelect={true} />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Select Time</label>
									<div className="col-lg-8">
										<DateTime dateFormat={false} inputProps={{ placeholder: 'Timepicker' }} />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Range Pickers</label>
									<div className="col-lg-8">
										<div className="row gx-2">
											<div className="col-6">
												<DateTime isValidDate={ minDateRange } inputProps={{ placeholder: 'Min Date' }} closeOnSelect={true} onChange={ minDateChange } />
											</div>
											<div className="col-6">
												<DateTime isValidDate={ maxDateRange } inputProps={{ placeholder: 'Max Date', disabled: maxDateDisabled }} closeOnSelect={true} />
											</div>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[1]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							React Select
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">React Select Dropdown</label>
									<div className="col-lg-8">
										<Select options={selectOptions} classNamePrefix="react-select" />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[2]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							Datepicker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Datepicker</label>
									<div className="col-lg-8">
										<DatePicker selected={startDate} onChange={handleChange} className="form-control" />
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Inline Datepicker</label>
									<div className="col-lg-8">
										<DatePicker inline selected={startDate} onChange={handleChange} />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[3]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>
							React Input Mask
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Date</label>
									<div className="col-lg-8">
										<InputMask mask="9999/99/99" className="form-control" placeholder="yyyy/mm/dd"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Phone</label>
									<div className="col-lg-8">
										<InputMask mask="(999) 999-999" className="form-control" placeholder="(999) 999-9999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Tax ID</label>
									<div className="col-lg-8">
										<InputMask mask="99-999999" className="form-control" placeholder="99-9999999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Product Key</label>
									<div className="col-lg-8">
										<InputMask mask="a\*-999-a999" className="form-control" placeholder="a*-999-a999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">SSN</label>
									<div className="col-lg-8">
										<InputMask mask="999/99/9999" className="form-control" placeholder="999/99/9999"></InputMask>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">SSN</label>
									<div className="col-lg-8">
										<InputMask mask="AAA-1111-A" className="form-control" placeholder="AAA-9999-A"></InputMask>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[4]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>
							React Colorpicker
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Sketch Type Colorpicker</label>
									<div className="col-lg-8">
										<div className="input-group">
											<input type="text" className="form-control" readOnly value={sketchBackgroundColor} />
											<span className="input-group-text">
												<a href="#/" data-bs-toggle="dropdown" className="p-0 border-0">
													<i style={{width: '16px', height: '16px', display: 'block', background: sketchBackgroundColor}}></i>
												</a>
												<div className="dropdown-menu">
													<SketchPicker color={ sketchBackgroundColor } onChangeComplete={ handleSketchChangeComplete } />
												</div>
											</span>
										</div>
									</div>
								</div>
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Chrome Type Colorpicker</label>
									<div className="col-lg-8">
										<div className="input-group">
											<input type="text" className="form-control" readOnly value={chromeBackgroundColor} />
											<span className="input-group-text">
												<a href="#/" data-bs-toggle="dropdown" className="p-0 border-0">
													<i style={{width: '16px', height: '16px', display: 'block', background: chromeBackgroundColor}}></i>
												</a>
												<div className="dropdown-menu">
													<ChromePicker color={ chromeBackgroundColor } onChangeComplete={ handleChromeChangeComplete } />
												</div>
											</span>
										</div>
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[5]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>React Quill</PanelHeader>
						<PanelBody>
							<div className="pb-2px">
								<ReactQuill theme="snow" className="h-100" value={value} onChange={setValue} />
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[6]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>
							React Tag Input Component
						</PanelHeader>
						<PanelBody className="p-0">
							<form className="form-horizontal form-bordered">
								<div className="form-group row">
									<label className="col-lg-4 col-form-label">Default Input Tag</label>
									<div className="col-lg-8">
										<TagsInput value={selected} name="fruits" placeHolder="enter fruits" />
									</div>
								</div>
							</form>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='typescript'>{state[7]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}