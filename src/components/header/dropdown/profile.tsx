'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DropdownProfile() {
  return (
    <div className="navbar-item navbar-user dropdown">
      <a href="#" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
        <Image src="/assets/img/user/user-13.jpg" alt="" width="30" height="30" /> 
        <span>
          <span className="d-none d-md-inline fw-bold">Adam Schwartz</span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        <Link href="/extra/profile" className="dropdown-item">Edit Profile</Link>
        <Link href="/email/inbox" className="dropdown-item d-flex align-items-center">
          Inbox
          <span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span> 
        </Link>
        <Link href="/calendar" className="dropdown-item">Calendar</Link>
        <Link href="/extra/settings-page" className="dropdown-item">Settings</Link>
        <div className="dropdown-divider"></div>
        <Link href="/user/login-v1" className="dropdown-item">Log Out</Link>
      </div>
    </div>
  );
}