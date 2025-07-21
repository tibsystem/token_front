'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type GalleryState = { [key: string]: boolean };

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryState>({
    all: true,
    group1: false,
    group2: false,
    group3: false,
    group4: false
  });

  const toggle = (value: string) => {
    setGallery({
      all: value === 'all',
      group1: value === 'group1',
      group2: value === 'group2',
      group3: value === 'group3',
      group4: value === 'group4'
    });
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><Link href="/gallery">Home</Link></li>
        <li className="breadcrumb-item active">Gallery</li>
      </ol>
      <h1 className="page-header">Gallery <small>header small text goes here...</small></h1>
      
      <div id="options" className="mb-3">
        <div className="d-flex flex-wrap text-nowrap mb-n1" id="filter">
          {['all', 'group1', 'group2', 'group3', 'group4'].map(group => (
            <button 
              key={group} 
              onClick={() => toggle(group)} 
              className={`btn btn-white btn-sm border-0 me-1 mb-1 ${gallery[group] ? 'active' : ''}`}
            >
              {group === 'all' ? 'Show All' : `Gallery ${group.charAt(0).toUpperCase() + group.slice(1)}`}
            </button>
          ))}
        </div>
      </div>
      
      <div id="gallery" className="gallery row gx-0">
        {Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          src: `/assets/img/gallery/gallery-${i + 1}.jpg`,
          title: `Gallery Item ${i + 1}`,
          group: `group${(i % 4) + 1}`
        })).map(({ id, src, title, group }) => (
          <div key={id} className={`col-xl-3 col-md-6 ${gallery[group] || gallery.all ? '' : 'd-none'}`}>
            <div className="image w-100">
              <div className="image-inner">
                <Link href="/gallery">
                  <Image src={src} alt={title} width="1280" height="800" className="object-fit-cover" />
                </Link>
                <p className="image-caption">#{id} - {title}</p>
              </div>
              <div className="image-info">
                <h5 className="title">Sample Title {id}</h5>
                <div className="d-flex align-items-center mb-2">
                  <div className="rating">{Array(5).fill(0).map((_, index) => (
                    <span key={index} className={`star ${index < (id % 5) ? 'active' : ''}`}></span>
                  ))}</div>
                  <div className="ms-auto">
                    <small>by</small> <Link href="/gallery">Author {id}</Link>
                  </div>
                </div>
                <div className="desc">Sample description for gallery item {id}.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
