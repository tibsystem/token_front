/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef } from 'react';


export default function SidebarProfile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  function handleProfileExpand(e: React.MouseEvent) {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="menu">
      <div className="menu-profile">
          <div className="menu-profile-cover with-shadow"></div>
          <div className="menu-profile-image">
          </div>
          <div className="menu-profile-info">
            <div className="d-flex align-items-center">
            </div>
          </div>
        
      </div>

 
    </div>
  );
}