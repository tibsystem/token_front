'use client';

import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { Panel, PanelHeader } from '@/components/panel/panel';
import Highlight from 'react-highlight';
import 'bootstrap-social/bootstrap-social.css';

export default function UiSocialButtons() {
	const initialState: (string | undefined)[] = Array(1).fill(undefined);
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
				const response = await fetch(`/assets/data/ui/social-buttons-code-${index}.json`, { signal });
				
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
	
		for (let i = 1; i <= 1; i++) {
			fetchData(i);
		}
		
		return () => controller.abort();
  }, []);
	return (
		<>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link href="/ui/social-buttons">Home</Link></li>
				<li className="breadcrumb-item"><Link href="/ui/social-buttons">UI Elements</Link></li>
				<li className="breadcrumb-item active">Social Buttons</li>
			</ol>
			<h1 className="page-header">Social Buttons <small>header small text goes here...</small></h1>
		
			<div className="row">
				<div className="col-xl-8">
					<Panel>
						<PanelHeader>Installation </PanelHeader>
						<div className="table-responsive">
							<table className="table table-striped table-condensed text-nowrap m-0 table-panel">
								<thead>
									<tr>
										<th>Buttons</th>
										<th>className=&#34;&#34;</th>
										<th>Color Code</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-adn">
												<span className="fab fa-adn"></span> Sign in with App.net
											</Link>
										</td>
										<td><code>btn btn-social btn-adn</code></td>
										<td>#D87A68</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-bitbucket">
												<span className="fab fa-bitbucket"></span> Sign in with Bitbucket
											</Link>
										</td>
										<td><code>btn btn-social btn-bitbucket</code></td>
										<td>#205081</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-dropbox">
												<span className="fab fa-dropbox"></span> Sign in with Dropbox
											</Link>
										</td>
										<td><code>btn btn-social btn-dropbox</code></td>
										<td>#1087DD</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-facebook">
												<span className="fab fa-facebook"></span> Sign in with Facebook
											</Link>
										</td>
										<td><code>btn btn-social btn-facebook</code></td>
										<td>#3B5998</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-flickr">
												<span className="fab fa-flickr"></span> Sign in with Flickr
											</Link>
										</td>
										<td><code>btn btn-social btn-flickr</code></td>
										<td>#2BA9E1</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-foursquare">
												<span className="fab fa-foursquare"></span> Sign in with Foursquare
											</Link>
										</td>
										<td><code>btn btn-social btn-foursquare</code></td>
										<td>#f94877</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-github">
												<span className="fab fa-github"></span> Sign in with GitHub
											</Link>
										</td>
										<td><code>btn btn-social btn-github</code></td>
										<td>#444444</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-google">
												<span className="fab fa-google"></span> Sign in with Google
											</Link>
										</td>
										<td><code>btn btn-social btn-google</code></td>
										<td>#DD4B39</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-instagram">
												<span className="fab fa-instagram"></span> Sign in with Instagram
											</Link>
										</td>
										<td><code>btn btn-social btn-instagram</code></td>
										<td>#3F729B</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-linkedin">
												<span className="fab fa-linkedin"></span> Sign in with LinkedIn
											</Link>
										</td>
										<td><code>btn btn-social btn-linkedin</code></td>
										<td>#007BB6</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-microsoft">
												<span className="fab fa-windows"></span> Sign in with Microsoft
											</Link>
										</td>
										<td><code>btn btn-social btn-microsoft</code></td>
										<td>#2672EC</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-odnoklassniki">
												<span className="fab fa-odnoklassniki"></span> Sign in with Odnoklassniki
											</Link>
										</td>
										<td><code>btn btn-social btn-odnoklassniki</code></td>
										<td>#F4731C</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-openid">
												<span className="fab fa-openid"></span> Sign in with OpenID
											</Link>
										</td>
										<td><code>btn btn-social btn-openid</code></td>
										<td>#F7931E</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-pinterest">
												<span className="fab fa-pinterest"></span> Sign in with Pinterest
											</Link>
										</td>
										<td><code>btn btn-social btn-pinterest</code></td>
										<td>#CB2027</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-reddit">
												<span className="fab fa-reddit"></span> Sign in with Reddit
											</Link>
										</td>
										<td><code>btn btn-social btn-reddit</code></td>
										<td>#EFF7FF</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-soundcloud">
												<span className="fab fa-soundcloud"></span> Sign in with SoundCloud
											</Link>
										</td>
										<td><code>btn btn-social btn-soundcloud</code></td>
										<td>#FF5500</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-tumblr">
												<span className="fab fa-tumblr"></span> Sign in with Tumblr
											</Link>
										</td>
										<td><code>btn btn-social btn-tumblr</code></td>
										<td>#CB2027</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-twitter">
												<span className="fab fa-twitter"></span> Sign in with Twitter
											</Link>
										</td>
										<td><code>btn btn-social btn-twitter</code></td>
										<td>#55ACEE</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-vimeo">
												<span className="fab fa-vimeo-square"></span> Sign in with Vimeo
											</Link>
										</td>
										<td><code>btn btn-social btn-vimeo</code></td>
										<td>#1AB7EA</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-vk">
												<span className="fab fa-vk"></span> Sign in with VK
											</Link>
										</td>
										<td><code>btn btn-social btn-vk</code></td>
										<td>#587EA3</td>
									</tr>
									<tr>
										<td className="with-btn">
											<Link href="/ui/social-buttons" className="btn btn-sm w-250px btn-social btn-yahoo">
												<span className="fab fa-yahoo"></span> Sign in with Yahoo!
											</Link>
										</td>
										<td><code>btn btn-social btn-yahoo</code></td>
										<td>#720E9E</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="hljs-wrapper">
							<Highlight className='html'>{state[1]}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-4">
					<div className="lead mb-20px">
						<p className="mb-5px">Social Sign-In Buttons made in pure CSS based on Bootstrap and Font Awesome!</p>
						<Link href="https://lipis.github.io/bootstrap-social/" target="_blank" className="btn btn-sm btn-inverse">View Official Website <i className="fa fa-arrow-right ms-5px"></i></Link>
					</div>
					<div className="mb-10px"><b>Social Icons</b></div>
					<div className="clearfix mb-20px">
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-adn float-start me-5px mb-5px"><span className="fab fa-adn"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-bitbucket float-start me-5px mb-5px"><span className="fab fa-bitbucket"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-dropbox float-start me-5px mb-5px"><span className="fab fa-dropbox"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-facebook float-start me-5px mb-5px"><span className="fab fa-facebook"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-flickr float-start me-5px mb-5px"><span className="fab fa-flickr"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-foursquare float-start me-5px mb-5px"><span className="fab fa-foursquare"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-github float-start me-5px mb-5px"><span className="fab fa-github"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-google float-start me-5px mb-5px"><span className="fab fa-google"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-instagram float-start me-5px mb-5px"><span className="fab fa-instagram"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-linkedin float-start me-5px mb-5px"><span className="fab fa-linkedin"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-microsoft float-start me-5px mb-5px"><span className="fab fa-windows"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-odnoklassniki float-start me-5px mb-5px"><span className="fab fa-odnoklassniki"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-openid float-start me-5px mb-5px"><span className="fab fa-openid"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-pinterest float-start me-5px mb-5px"><span className="fab fa-pinterest"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-reddit float-start me-5px mb-5px"><span className="fab fa-reddit"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-soundcloud float-start me-5px mb-5px"><span className="fab fa-soundcloud"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-tumblr float-start me-5px mb-5px"><span className="fab fa-tumblr"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-twitter float-start me-5px mb-5px"><span className="fab fa-twitter"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-vimeo float-start me-5px mb-5px"><span className="fab fa-vimeo-square"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-vk float-start me-5px mb-5px"><span className="fab fa-vk"></span></Link>
						<Link href="/ui/social-buttons" className="btn btn-social-icon btn-yahoo float-start me-5px mb-5px"><span className="fab fa-yahoo"></span></Link>
					</div>
					<div className="mb-10px"><b>Different Sizes</b></div>
					<div className="mb-10px">
						<p>
							<Link href="/ui/social-buttons" className="btn btn-social btn-lg btn-facebook me-5px"><i className="fab fa-facebook-f"></i>Sign in with Facebook</Link>
							<Link href="/ui/social-buttons" className="btn btn-social-icon btn-lg btn-facebook"><i className="fab fa-facebook-f"></i></Link>
						</p>
						<p>
							<Link href="/ui/social-buttons" className="btn btn-social btn-facebook me-5px"><i className="fab fa-facebook-f"></i>Sign in with Facebook</Link>
							<Link href="/ui/social-buttons" className="btn btn-social-icon btn-facebook"><i className="fab fa-facebook-f"></i></Link>
						</p>
						<p>
							<Link href="/ui/social-buttons" className="btn btn-social btn-sm btn-facebook me-5px"><i className="fab fa-facebook-f"></i>Sign in with Facebook</Link>
							<Link href="/ui/social-buttons" className="btn btn-social-icon btn-sm btn-facebook"><i className="fab fa-facebook-f"></i></Link>
						</p>
						<p>
							<Link href="/ui/social-buttons" className="btn btn-social btn-xs btn-facebook me-5px"><i className="fab fa-facebook-f"></i>Sign in with Facebook</Link>
							<Link href="/ui/social-buttons" className="btn btn-social-icon btn-xs btn-facebook"><i className="fab fa-facebook-f"></i></Link>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}