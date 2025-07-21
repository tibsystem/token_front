'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Countdown from 'react-countdown';
import { useAppSettings } from '@/config/app-settings';
	
export default function ExtraComingSoon() {
	
	const { updateSettings } = useAppSettings();
	
	useEffect(() => {
		updateSettings({
			appHeaderNone: true,
			appSidebarNone: true,
			appContentClass: 'p-0 h-100',
			appContentFullHeight: true
		});
		
		return () => {
			updateSettings({
				appHeaderNone: false,
				appSidebarNone: false,
				appContentClass: '',
				appContentFullHeight: false
			});
		};
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div className="coming-soon">
      <div className="coming-soon-header">
        <div className="bg-cover"></div>
        <div className="brand">
          <span className="logo"></span> <b>Color</b> Admin
        </div>
        <div className="desc">
          Our website is almost there and it’s rebuilt from scratch! A lot of great new features <br />and improvements are coming.
        </div>
        <div className="timer">
          <div id="timer" className="is-countdown">
          	<Countdown className="custom-counter"
							date={Date.now() + 1000000000}
							renderer={
								props =>
								<span className="countdown-row countdown-show4">
									<span className="d-flex flex-grow-1">
										<span className="countdown-section">
											<span className="countdown-amount">{props.days}</span>
											<span className="countdown-period">Days</span>
										</span>
										<span className="countdown-section">
											<span className="countdown-amount">{props.hours}</span>
											<span className="countdown-period">Hours</span>
										</span>
										<span className="countdown-section">
											<span className="countdown-amount">{props.minutes}</span>
											<span className="countdown-period">Minutes</span>
										</span>
										<span className="countdown-section">
											<span className="countdown-amount">{props.seconds}</span>
											<span className="countdown-period">Seconds</span>
										</span>
									</span>
								</span>
							}
						/>
          </div>
        </div>
      </div>
      <div className="coming-soon-content">
        <div className="desc">
          We are launching a closed <b>beta</b> soon!<br /> Sign up to try it before others and be the first to know when we <b>launch</b>.
        </div>
        <div className="input-group input-group-lg mx-auto mb-2">
          <span className="input-group-text border-0  bg-light"><i className="fa fa-envelope"></i></span>
          <input type="text" className="form-control fs-13px border-0 shadow-none ps-0 bg-light" placeholder="Email Address" />
          <button type="button" className="btn fs-13px btn-dark">Notify Me</button>
        </div>
        <p className="text-gray-500 mb-5">We don&#39;t spam. Your email address is secure with us.</p>
        <p>
          <span className="me-2">Follow us on</span>
          <Link href="/extra/coming-soon" className="mx-1 text-decoration-none text-dark">
            <i className="fab fa-twitter fa-lg fa-fw text-info"></i> Twitter
          </Link>
          <Link href="/extra/coming-soon" className="mx-1 text-decoration-none text-dark">
            <i className="fab fa-facebook-square fa-lg fa-fw text-blue"></i> Facebook
          </Link>
        </p>
      </div>
    </div>
	)
}