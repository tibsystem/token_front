/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import UseProfile from '../../hooks/UseProfile';


export default function SidebarProfile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const {
    getUserName,
    getUserEmail,
    getUserData,
    getUserRole,
    getTokenType,
    isLoggedIn,
    isAdmin,
    loading,
    error
  } = UseProfile();



  return (
    <div className="menu">
      <div className="menu-profile">
        <div className="menu-profile-cover with-shadow"></div>
      
        <div className="menu-profile-image">
          </div>
      
        <div className="menu-profile-info">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {loading ? (
                <div className="placeholder-glow">
                  <span className="placeholder col-8"></span>
                  <br />
                  <span className="placeholder col-6"></span>
                </div>
              )  : isLoggedIn ? (
                <>
                  <div className="menu-profile-link">
                    <div className="menu-profile-name">{getUserName()}</div>
                
                  </div>
                </>
              ) : (
                <div className="menu-profile-link">
                  <div className="menu-profile-name">Usuário</div>
                  <div className="menu-profile-desc">Não logado</div>
                </div>
              )}
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}