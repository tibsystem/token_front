'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/card/card';
import { useAppSettings } from '@/config/app-settings';

import 'lity/dist/lity.min.css';

export default function Profile() {
	const { updateSettings } = useAppSettings();
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
      import('lity');
		}
		
		updateSettings({ appContentClass: 'p-0' });
		
		return () => {
			updateSettings({ appContentClass: '' });
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div className="profile">
			<div className="profile-header">
				<div className="profile-header-cover"></div>
				
				<div className="profile-header-content">
					<div className="profile-header-img">
						<Image src="/assets/img/user/profile.jpg" width="194" height="194" className="h-auto" alt="" />
					</div>
					<ul className="profile-header-tab nav nav-tabs nav-tabs-v2">
						<li className="nav-item">
							<a href="#profile-post" className="nav-link active" data-bs-toggle="tab">
								<div className="nav-field">Posts</div>
								<div className="nav-value">382</div>
							</a>
						</li>
						<li className="nav-item">
							<a href="#profile-followers" className="nav-link" data-bs-toggle="tab">
								<div className="nav-field">Followers</div>
								<div className="nav-value">1.3m</div>
							</a>
						</li>
						<li className="nav-item">
							<a href="#profile-media" className="nav-link" data-bs-toggle="tab">
								<div className="nav-field">Photos</div>
								<div className="nav-value">1,397</div>
							</a>
						</li>
						<li className="nav-item">
							<a href="#profile-video" className="nav-link" data-bs-toggle="tab">
								<div className="nav-field">Videos</div>
								<div className="nav-value">120</div>
							</a>
						</li>
						<li className="nav-item">
							<a href="#profile-followers" className="nav-link" data-bs-toggle="tab">
								<div className="nav-field">Following</div>
								<div className="nav-value">2,592</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
			
			<div className="profile-container">
				<div className="profile-sidebar">
					<div className="desktop-sticky-top">
						<h4>John Smith</h4>
						<div className="fw-500 mb-3 text-muted mt-n2">@johnsmith</div>
						<p>
							Principal UXUI Design & Brand Architecture for Studio. Creator of SeanTheme.
							Bringing the world closer together. Studied Computer Science and Psychology at Harvard University.
						</p>
						<div className="mb-1">
							<i className="fa fa-map-marker-alt fa-fw text-muted"></i> New York, NY
						</div>
						<div className="mb-3">
							<i className="fa fa-link fa-fw text-muted"></i> seantheme.com/react-studio
						</div>
						
						<hr className="mt-4 mb-4" />
						
						<div className="fw-500 mb-3 fs-16px">People to follow</div>
						<div className="d-flex align-items-center mb-3">
							<Image src="/assets/img/user/user-1.jpg" alt="" width="30" height="30" className="rounded-circle" />
							<div className="flex-fill px-3">
								<div className="fw-500 text-truncate w-100px">Noor Rowe</div>
								<div className="fs-12px text-body text-opacity-50">3.1m followers</div>
							</div>
							<a href="#/" className="btn btn-sm btn-outline-theme fs-11px fw-500">Follow</a>
						</div>
						<div className="d-flex align-items-center mb-3">
							<Image src="/assets/img/user/user-2.jpg" alt="" width="30" height="30" className="rounded-circle" />
							<div className="flex-fill px-3">
								<div className="fw-500 text-truncate w-100px">Abbey Parker</div>
								<div className="fs-12px text-body text-opacity-50">302k followers</div>
							</div>
							<a href="#/" className="btn btn-sm btn-outline-theme fs-11px fw-500">Follow</a>
						</div>
						<div className="d-flex align-items-center mb-3">
							<Image src="/assets/img/user/user-3.jpg" alt="" width="30" height="30" className="rounded-circle" />
							<div className="flex-fill px-3">
								<div className="fw-500 text-truncate w-100px">Savannah Nicholson</div>
								<div className="fs-12px text-body text-opacity-50">720k followers</div>
							</div>
							<a href="#/" className="btn btn-sm btn-outline-theme fs-11px fw-500">Follow</a>
						</div>
						<div className="d-flex align-items-center mb-3">
							<Image src="/assets/img/user/user-4.jpg" alt="" width="30" height="30" className="rounded-circle" />
							<div className="flex-fill px-3">
								<div className="fw-500 text-truncate w-100px">Kenny Bright</div>
								<div className="fs-12px text-body text-opacity-50">1.4m followers</div>
							</div>
							<a href="#/" className="btn btn-sm btn-outline-theme fs-11px fw-500">Follow</a>
						</div>
						<div className="d-flex align-items-center">
							<Image src="/assets/img/user/user-5.jpg" alt="" width="30" height="30" className="rounded-circle" />
							<div className="flex-fill px-3">
								<div className="fw-500 text-truncate w-100px">Cara Poole</div>
								<div className="fs-12px text-body text-opacity-50">989k followers</div>
							</div>
							<a href="#/" className="btn btn-sm btn-outline-theme fs-11px fw-500">Follow</a>
						</div>
					</div>
				</div>
				
				<div className="profile-content">
					<div className="row">
						<div className="col-xl-8">
							<div className="tab-content p-0">
								<div className="tab-pane fade show active" id="profile-post">
									<Card className="mb-3">
										<CardBody>
											<div className="d-flex align-items-center mb-3">
												<a href="#/"><Image src="/assets/img/user/profile.jpg" alt="" width="50" height="50" className="rounded-circle" /></a>
												<div className="flex-fill ps-2">
													<div className="fw-500"><a href="#/" className="text-decoration-none">Clyde Stanley</a> at <a href="#/" className="text-decoration-none">South Lake Tahoe, California</a></div>
													<div className="text-body text-opacity-50 fs-13px">March 16</div>
												</div>
											</div>
							
											<p>Best vacation of 2025</p>
											<div className="profile-img-list">
												<div className="profile-img-list-item main"><a href="/assets/img/gallery/gallery-1.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-1.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-2.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-2.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-3.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-3.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-4.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-4.jpg)' }}></span></a></div>
												<div className="profile-img-list-item with-number">
													<a href="/assets/img/gallery/gallery-5.jpg" data-lity className="profile-img-list-link">
														<span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-5.jpg)' }}></span>
														<div className="profile-img-number">+12</div>
													</a>
												</div>
											</div>
											<hr className="mb-1 ms-n2 me-n2" />
									
											<div className="row text-center mb-n3 fw-500">
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-thumbs-up me-1 d-block d-sm-inline"></i> Likes
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-comment me-1 d-block d-sm-inline"></i> Comment
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="fa fa-share me-1 d-block d-sm-inline"></i> Share
													</a>
												</div>
											</div>
										</CardBody>
										<CardFooter className="pt-3 pb-3">
											<div className="d-flex align-items-center">
												<Image src="/assets/img/user/user.jpg" alt="" width="35" height="35" className="rounded-circle" />
												<div className="flex-fill ps-2">
													<div className="position-relative d-flex align-items-center">
														<input type="text" className="form-control rounded-pill" style={{ paddingRight: '120px' }} placeholder="Write a comment..." />
														<div className="position-absolute end-0 text-center">
															<a href="#/" className="text-muted me-2"><i className="fa fa-smile"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-camera"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-video"></i></a>
															<a href="#/" className="text-muted me-3"><i className="fa fa-paw"></i></a>
														</div>
													</div>
												</div>
											</div>
										</CardFooter>
									</Card>
									<Card className="mb-3">
										<CardBody className="pb-0">
											<div className="d-flex align-items-center mb-3">
												<a href="#/"><Image src="/assets/img/user/profile.jpg" alt="" width="50" height="50" className="rounded-circle" /></a>
												<div className="flex-fill ps-2">
													<div className="fw-500"><a href="#/" className="text-decoration-none">Clyde Stanley</a> is watching <a href="#/" className="text-decoration-none">PATAGONIA 8k</a></div>
													<div className="text-body text-opacity-50 fs-13px">March 12</div>
												</div>
											</div>
						
											<p>Nice PATAGONIA footage in 8K</p>
										</CardBody>
										<CardBody className="pt-0 ps-0 pe-0">
											<div className="ratio ratio-16x9">
												<iframe src="https://www.youtube.com/embed/ChOhcHD8fBA?showinfo=0" title="Youtube"></iframe>
											</div>
											<hr className="mb-1 ms-n2 me-n2" />
									
											<div className="row text-center mb-n3 fw-500">
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-thumbs-up me-1 d-block d-sm-inline"></i> Likes
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-comment me-1 d-block d-sm-inline"></i> Comment
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="fa fa-share me-1 d-block d-sm-inline"></i> Share
													</a>
												</div>
											</div>
										</CardBody>
										<CardFooter className="pt-3 pb-3">
											<div className="d-flex align-items-center">
												<Image src="/assets/img/user/user.jpg" alt="" width="35" height="35" className="rounded-circle" />
												<div className="flex-fill ps-2">
													<div className="position-relative d-flex align-items-center">
														<input type="text" className="form-control rounded-pill" style={{ paddingRight: '120px' }} placeholder="Write a comment..." />
														<div className="position-absolute end-0 text-center">
															<a href="#/" className="text-muted me-2"><i className="fa fa-smile"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-camera"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-video"></i></a>
															<a href="#/" className="text-muted me-3"><i className="fa fa-paw"></i></a>
														</div>
													</div>
												</div>
											</div>
										</CardFooter>
									</Card>
									<Card className="mb-3">
										<CardBody>
											<div className="d-flex align-items-center mb-3">
												<a href="#/" className="text-decoration-none"><Image src="/assets/img/user/profile.jpg" alt="" width="50" height="50" className="rounded-circle" /></a>
												<div className="flex-fill ps-2">
													<div className="fw-500"><a href="#/" className="text-decoration-none">Clyde Stanley</a></div>
													<div className="text-body text-opacity-50 fs-13px">March 4</div>
												</div>
											</div>
						
											<p>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />Quisque sodales urna justo, ac ultrices magna consectetur id.<br /><br />
												Donec tempor ligula sit amet nunc porta, sed aliquam leo sagittis.<br />
												Ut auctor congue efficitur. Praesent aliquam pulvinar neque, placerat semper massa elementum et.
											</p>
											<hr className="mb-1 ms-n2 me-n2" />
									
											<div className="row text-center mb-n3 fw-500">
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-thumbs-up me-1 d-block d-sm-inline"></i> Likes
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-comment me-1 d-block d-sm-inline"></i> Comment
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="fa fa-share me-1 d-block d-sm-inline"></i> Share
													</a>
												</div>
											</div>
										</CardBody>
										<CardFooter className="pt-3 pb-3">
											<div className="d-flex align-items-center">
												<Image src="/assets/img/user/user.jpg" alt="" width="35" height="35" className="rounded-circle" />
												<div className="flex-fill ps-2">
													<div className="position-relative d-flex align-items-center">
														<input type="text" className="form-control rounded-pill" style={{ paddingRight: '120px' }} placeholder="Write a comment..." />
														<div className="position-absolute end-0 text-center">
															<a href="#/" className="text-muted me-2"><i className="fa fa-smile"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-camera"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-video"></i></a>
															<a href="#/" className="text-muted me-3"><i className="fa fa-paw"></i></a>
														</div>
													</div>
												</div>
											</div>
										</CardFooter>
									</Card>
									<Card className="mb-3">
										<CardBody>
											<div className="d-flex align-items-center mb-3">
												<a href="#/"><Image src="/assets/img/user/profile.jpg" alt="" width="50" height="50" className="rounded-circle" /></a>
												<div className="flex-fill ps-2">
													<div className="fw-500"><a href="#/" className="text-decoration-none">Clyde Stanley</a> at <a href="#/" className="text-decoration-none">United States</a></div>
													<div className="text-body text-opacity-50 fs-13px">May 5</div>
												</div>
											</div>
							
											<p>Business Trip</p>
											<div className="profile-img-list">
												<div className="profile-img-list-item main"><a href="/assets/img/gallery/gallery-5.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-5.jpg)' }}></span></a></div>
												<div className="profile-img-list-item main"><a href="/assets/img/gallery/gallery-6.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-6.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-7.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-7.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-8.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-8.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-9.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-9.jpg)' }}></span></a></div>
												<div className="profile-img-list-item"><a href="/assets/img/gallery/gallery-10.jpg" data-lity className="profile-img-list-link"><span className="profile-img-content" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-10.jpg)' }}></span></a></div>
											</div>
											<hr className="mb-1 ms-n2 me-n2" />
									
											<div className="row text-center mb-n3 fw-500">
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-thumbs-up me-1 d-block d-sm-inline"></i> Likes
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="far fa-comment me-1 d-block d-sm-inline"></i> Comment
													</a>
												</div>
												<div className="col">
													<a href="#/" className="text-body text-opacity-75 text-decoration-none d-block p-2">
														<i className="fa fa-share me-1 d-block d-sm-inline"></i> Share
													</a>
												</div>
											</div>
										</CardBody>
										<CardFooter className="pt-3 pb-3">
											<div className="d-flex align-items-center">
												<Image src="/assets/img/user/user.jpg" alt="" width="35" height="35" className="rounded-circle" />
												<div className="flex-fill ps-2">
													<div className="position-relative d-flex align-items-center">
														<input type="text" className="form-control rounded-pill" style={{ paddingRight: '120px' }} placeholder="Write a comment..." />
														<div className="position-absolute end-0 text-center">
															<a href="#/" className="text-muted me-2"><i className="fa fa-smile"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-camera"></i></a>
															<a href="#/" className="text-muted me-2"><i className="fa fa-video"></i></a>
															<a href="#/" className="text-muted me-3"><i className="fa fa-paw"></i></a>
														</div>
													</div>
												</div>
											</div>
										</CardFooter>
									</Card>
								</div>
								
								<div className="tab-pane fade" id="profile-followers">
									<div className="list-group">
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-1.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Ethel Wilkes</a></div>
												<div className="text-muted fs-13px">North Raundspic</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-2.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Shanaya Hansen</a></div>
												<div className="text-muted fs-13px">North Raundspic</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-3.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">James Allman</a></div>
												<div className="text-muted fs-13px">North Raundspic</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-4.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Marie Welsh</a></div>
												<div className="text-muted fs-13px">Crencheporford</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-5.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Lamar Kirkland</a></div>
												<div className="text-muted fs-13px">Prince Ewoodswan</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-6.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Bentley Osborne</a></div>
												<div className="text-muted fs-13px">Red Suvern</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-7.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Ollie Goulding</a></div>
												<div className="text-muted fs-13px">Doa</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-8.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Hiba Calvert</a></div>
												<div className="text-muted fs-13px">Stemunds</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-9.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Rivka Redfern</a></div>
												<div className="text-muted fs-13px">Fallnee</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
										<div className="list-group-item d-flex align-items-center">
											<Image src="/assets/img/user/user-10.jpg" alt="" width="50" height="50" className="rounded-sm ms-n2" />
											<div className="flex-fill px-3">
												<div><a href="#/" className="text-body fw-500 text-decoration-none">Roshni Fernandez</a></div>
												<div className="text-muted fs-13px">Mount Lerdo</div>
											</div>
											<a href="#/" className="btn btn-outline-theme">Follow</a>
										</div>
									</div>
									<div className="text-center p-3"><a href="#/" className="text-body text-decoration-none">Show more <b className="caret"></b></a></div>
								</div>
								
								<div className="tab-pane fade" id="profile-media">
									<Card className="mb-3">
										<CardHeader className="fw-500 bg-transparent">May 20</CardHeader>
										<CardBody>
											<div className="widget-img-list">
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-1.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-1.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-2.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-2.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-3.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-3.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-4.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-4.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-5.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-5.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-6.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-6.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-7.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-7.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-8.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-8.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-9.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-9.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-10.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-10.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-11.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-11.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-12.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-12.jpg)' }}></span></a></div>
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardHeader className="fw-500 bg-transparent">May 16</CardHeader>
										<CardBody>
											<div className="widget-img-list">
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-13.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-13.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-14.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-14.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-15.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-15.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-16.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-16.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-17.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-17.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-18.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-18.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-19.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-19.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-20.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-20.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-21.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-21.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-22.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-22.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-23.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-23.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-24.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-24.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-25.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-25.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-26.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-26.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-27.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-27.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-28.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-28.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-29.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-29.jpg)' }}></span></a></div>
												<div className="widget-img-list-item"><a href="/assets/img/gallery/gallery-30.jpg" data-lity><span className="img" style={{ backgroundImage: 'url(/assets/img/gallery/gallery-30.jpg)' }}></span></a></div>
											</div>
										</CardBody>
									</Card>
									<div className="text-center p-3"><a href="#/" className="text-body text-decoration-none">Show more <b className="caret"></b></a></div>
								</div>
								
								<div className="tab-pane fade" id="profile-video">
									<Card className="mb-3">
										<CardHeader className="fw-bold bg-transparent">Collections #1</CardHeader>
										<CardBody>
											<div className="row gx-1">
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=RQ5ljyGg-ig" data-lity="">
														<Image src="https://img.youtube.com/vi/RQ5ljyGg-ig/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=5lWkZ-JaEOc" data-lity="">
														<Image src="https://img.youtube.com/vi/5lWkZ-JaEOc/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=9ZfN87gSjvI" data-lity="">
														<Image src="https://img.youtube.com/vi/9ZfN87gSjvI/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=w2H07DRv2_M" data-lity="">
														<Image src="https://img.youtube.com/vi/w2H07DRv2_M/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=PntG8KEVjR8" data-lity="">
														<Image src="https://img.youtube.com/vi/PntG8KEVjR8/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=q8kxKvSQ7MI" data-lity="">
														<Image src="https://img.youtube.com/vi/q8kxKvSQ7MI/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=cutu3Bw4ep4" data-lity="">
														<Image src="https://img.youtube.com/vi/cutu3Bw4ep4/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=gCspUXGrraM" data-lity="">
														<Image src="https://img.youtube.com/vi/gCspUXGrraM/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
											</div>
										</CardBody>
									</Card>
									<Card className="mb-3">
										<CardHeader className="fw-bold bg-transparent">Collections #2</CardHeader>
										<CardBody>
											<div className="row gx-1">
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=COtpTM1MpAA" data-lity="">
														<Image src="https://img.youtube.com/vi/COtpTM1MpAA/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=8NVkGHVOazc" data-lity="">
														<Image src="https://img.youtube.com/vi/8NVkGHVOazc/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=ZtT3jaTcCsY" data-lity="">
														<Image src="https://img.youtube.com/vi/ZtT3jaTcCsY/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=Dmw0ucCv8aQ" data-lity="">
														<Image src="https://img.youtube.com/vi/Dmw0ucCv8aQ/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=r1d7ST2TG2U" data-lity="">
														<Image src="https://img.youtube.com/vi/r1d7ST2TG2U/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=WUR-XWBcHvs" data-lity="">
														<Image src="https://img.youtube.com/vi/WUR-XWBcHvs/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=A7sQ8RWj0Cw" data-lity="">
														<Image src="https://img.youtube.com/vi/A7sQ8RWj0Cw/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
												<div className="col-md-4 col-sm-6 mb-1">
													<a href="https://www.youtube.com/watch?v=IMN2VfiXls4" data-lity="">
														<Image src="https://img.youtube.com/vi/IMN2VfiXls4/mqdefault.jpg" width="320" height="180" alt="" className="d-block w-100 h-auto" />
													</a>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
						<div className="col-xl-4">
							<div className="desktop-sticky-top d-none d-lg-block">
								<Card className="mb-3">
									<div className="list-group list-group-flush">
										<div className="list-group-item fw-500 px-3 d-flex">
											<span className="flex-fill">Trends for you</span> 
											<a href="#/" className="text-muted"><i className="fa fa-cog"></i></a>
										</div>
										<div className="list-group-item px-3">
											<div className="text-muted"><small><strong>Trending Worldwide</strong></small></div>
											<div className="fw-500 mb-2">#BreakingNews</div>
											<a href="#/" className="card overflow-hidden mb-1 text-body text-decoration-none">
												<div className="row no-gutters">
													<div className="col-md-8">
														<div className="card-body p-1 px-2">
															<div className="fs-12px text-muted">Space</div>
															<div className="h-40px fs-13px overflow-hidden">Distant star explosion is brightest ever seen, study finds</div>
														</div>
													</div>
													<div className="col-md-4 d-flex">
														<div className="h-100 w-100" style={{ background: 'url(/assets/img/gallery/news-1.jpg) center', backgroundSize: 'cover' }}></div>
													</div>
												</div>
											</a>
											<div><small className="text-muted">1.89m share</small></div>
										</div>
										<div className="list-group-item px-3">
											<div className="fw-500 mb-2">#TrollingForGood</div>
											<div className="fs-13px">Be a good Troll and spread some positivity on Studio today.</div>
											<div><small className="text-muted"><i className="fa fa-external-link-square-alt"></i> Promoted by Studio Trolls</small></div>
										</div>
										<div className="list-group-item px-3">
											<div className="text-muted"><small><strong>Trending Worldwide</strong></small></div>
											<div className="fw-500 mb-2">#CronaOutbreak</div>
											<div className="fs-13px">The coronavirus is affecting 210 countries around the world and 2 ...</div>
											<div><small className="text-muted">49.3m share</small></div>
										</div>
										<div className="list-group-item px-3">
											<div className="text-muted"><small><strong>Trending in New York</strong></small></div>
											<div className="fw-500 mb-2">#CoronavirusPandemic</div>
											<a href="#/" className="card overflow-hidden mb-1 text-body text-decoration-none">
												<div className="row no-gutters">
													<div className="col-md-8">
														<div className="card-body p-1 px-2">
															<div className="fs-12px text-muted">Coronavirus</div>
															<div className="h-40px fs-13px overflow-hidden">Coronavirus: US suspends travel from Europe</div>
														</div>
													</div>
													<div className="col-md-4 d-flex">
														<div className="h-100 w-100" style={{ background: 'url(/assets/img/gallery/news-2.jpg) center', backgroundSize: 'cover'}}></div>
													</div>
												</div>
											</a>
											<div><small className="text-muted">821k share</small></div>
										</div>
										<a href="#/" className="list-group-item list-group-action text-center">
											Show more
										</a>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}