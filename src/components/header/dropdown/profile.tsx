/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import UseProfile from "@/hooks/UseProfile";

export default function DropdownProfile() {

const {profileData, isLoggedIn,getUserName, getUserEmail, getUserRole, loadProfile, checkAuthAndRedirect} = UseProfile ();

if (!isLoggedIn) {
    return (
      <div className="navbar-item navbar-user">
        <Link href="/login" className="navbar-link">
         
          <span className="d-none d-md-inline fw-bold">Entrar</span>
        </Link>
      </div>
    );
  }




  return (
    <div className="navbar-item navbar-user dropdown">
      <a
        href="#"
        className="navbar-link dropdown-toggle d-flex align-items-center"
        data-bs-toggle="dropdown"
      >
        <Image
          src="/assets/img/user/profile-user.jpeg"
          alt=""
          width="30"
          height="30"
        />
        <span>
          <span className="d-none d-md-inline fw-bold">{getUserName()}</span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        <Link
          href="#"
          className="dropdown-item"
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== "undefined") {
              if (localStorage.getItem("admin_token")) {
                window.location.href = "/admin/myprofile";
              } else {
                window.location.href = "/myprofile";
              }
            }
          }}
        >
          Meu perfil
        </Link>
        {/* <Link href="/email/inbox" className="dropdown-item d-flex align-items-center">
          Inbox
          <span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span> 
        </Link>
        <Link href="/calendar" className="dropdown-item">Calendar</Link>
        <Link href="/extra/settings-page" className="dropdown-item">Settings</Link> */}
        <div className="dropdown-divider"></div>
        <Link
          href="#"
          className="dropdown-item"
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== "undefined") {
              if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("profileData");
                window.location.href = "/login";
              } else if (localStorage.getItem("admin_token")) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("profileData");
                window.location.href = "/admin/login";
              }
            }
          }}
        >
          Sair
        </Link>
      </div>
    </div>
  );
}
