'use client';

import { useEffect, useReducer } from 'react';
import Highlight from 'react-highlight';
import Link from 'next/link';
import { Panel, PanelHeader, PanelBody } from '@/components/panel/panel';
	
export default function UiTypography() {
	const initialState: (string | undefined)[] = Array(9).fill(undefined);
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
				const response = await fetch(`/assets/data/ui/typography-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 14; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
	}, []);

	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui">UI Elements</Link></li>
				<li className="breadcrumb-item active">Typography</li>
			</ol>
			<h1 className="page-header">Typography <small>header small text goes here...</small></h1>
	
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Headings</PanelHeader>
						<PanelBody>
							<h1>h1. Heading 1</h1>
							<h2>h2. Heading 2</h2>
							<h3>h3. Heading 3</h3>
							<h4>h4. Heading 4</h4>
							<h5>h5. Heading 5</h5>
							<h6>h6. Heading 6</h6>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
					
					<Panel>
						<PanelHeader>small, semiBold, Bold, Italic</PanelHeader>
						<PanelBody>
							<div className="text-dark">
								<div className="row f-s-14">
									<div className="col-md-6">
										<div className="f-s-12"><small>This line of text is meant to be treated as fine print.</small></div>
										<div><em>rendered as italicized text</em></div>
									</div>
									<div className="col-md-6">
										<div><span className="semi-bold">rendered as semi bold text</span></div>
										<div><strong>rendered as bold text</strong></div>
									</div>
								</div>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[2]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Alignment Classes</PanelHeader>
						<PanelBody>
							<div className="text-dark">
								<p className="text-left">Left aligned text.</p>
								<p className="text-center">Center aligned text.</p>
								<p className="text-end">Right aligned text.</p>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[3]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Emphasis classes</PanelHeader>
						<PanelBody>
							<p className="text-muted">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>
							<p className="text-warning">Etiam porta sem malesuada magna mollis euismod.</p>
							<p className="text-danger">Donec ullamcorper nulla non metus auctor fringilla.</p>
							<p className="text-info">Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.</p>
							<p className="text-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[4]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Unordered List</PanelHeader>
						<PanelBody>
							<div className="text-dark">
								<ul>
									<li>Lorem ipsum dolor sit amet</li>
									<li>Consectetur adipiscing elit</li>
									<li>Nulla volutpat aliquam velit
										<ul>
										<li>Phasellus iaculis neque</li>
										<li>Purus sodales ultricies</li>
										</ul>
									</li>
									<li>Faucibus porta lacus fringilla vel</li>
								</ul>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[5]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Ordered List</PanelHeader>
						<PanelBody>
							<div className="text-dark">
								<ol>
									<li>Lorem ipsum dolor sit amet</li>
									<li>Consectetur adipiscing elit</li>
									<li>Integer molestie lorem at massa</li>
									<li>Facilisis in pretium nisl aliquet</li>
									<li>Nulla volutpat aliquam velit</li>
									<li>Faucibus porta lacus fringilla vel</li>
									<li>Aenean sit amet erat nunc</li>
									<li>Eget porttitor lorem</li>
								</ol>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[6]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Unstyled & Inline List Classes</PanelHeader>
						<PanelBody>
							<div className="text-dark">
								<ul className="list-unstyled">
									<li>Lorem ipsum dolor sit amet</li>
									<li>Consectetur adipiscing elit</li>
									<li>Integer molestie lorem at massa</li>
									<li>Facilisis in pretium nisl aliquet</li>
									<li>Nulla volutpat aliquam velit</li>
								</ul>
								<hr className="mt-3 mb-3" />
								<ul className="list-inline">
									<li className="list-inline-item">Lorem ipsum dolor sit amet</li>
									<li className="list-inline-item">Consectetur adipiscing elit</li>
									<li className="list-inline-item">Integer molestie lorem at massa</li>
								</ul>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[7]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Body Copy</PanelHeader>
						<PanelBody>
							<p>
								Quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, 
								nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.
							</p>
							<p>
								Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus
								auctor fringilla. 
							</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[8]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Lead body copy</PanelHeader>
						<PanelBody>
							<p className="lead">
								Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
							</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[9]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Abbreviation</PanelHeader>
						<PanelBody>
							<p>An abbreviation of the word attribute is  <abbr title="attribute">attr</abbr></p>
							<p><abbr title="HyperText Markup Language" className="initialism">HTML</abbr> is the best thing since sliced bread.</p>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[10]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Addresses</PanelHeader>
						<PanelBody>
							<address>
								<strong>Twitter, Inc.</strong><br />
								795 Folsom Ave, Suite 600<br />
								San Francisco, CA 94107<br />
								<abbr title="Phone">P:</abbr> (123) 456-7890
							</address>
							<address>
								<strong>Full Name</strong><br />
								<a href="mailto:#">first.last@example.com</a>
							</address>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[11]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Blockquote</PanelHeader>
						<PanelBody>
							<blockquote className="blockquote">
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
								<footer className="blockquote-footer">Someone famous <cite title="Source Title">Source Title</cite></footer>
							</blockquote>
							<blockquote className="blockquote text-end">
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
								<footer className="blockquote-footer">Someone famous <cite title="Source Title">Source Title</cite></footer>
							</blockquote>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[12]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Description List</PanelHeader>
						<PanelBody>
							<dl>
								<dt className="text-dark">Description lists</dt>
								<dd>A description list is perfect for defining terms.</dd>
								<dt className="text-dark mt-10px">Euismod</dt>
								<dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
								<dd>Donec id elit non mi porta gravida at eget metus.</dd>
								<dt className="text-dark mt-10px">Malesuada porta</dt>
								<dd>Etiam porta sem malesuada magna mollis euismod.</dd>
							</dl>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[13]}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Horizontal Description List</PanelHeader>
						<PanelBody>
							<dl className="row">
								<dt className="col-md-3">Description lists</dt>
								<dd className="col-md-9">A description list is perfect for defining terms.</dd>
								<dt className="col-md-3">Euismod</dt>
								<dd className="col-md-9">
									Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.
									Donec id elit non mi porta gravida at eget metus.
								</dd>
								<dt className="col-md-3">Malesuada porta</dt>
								<dd className="col-md-9">Etiam porta sem malesuada magna mollis euismod.</dd>
							</dl>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[14]}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
		</>
	)
}