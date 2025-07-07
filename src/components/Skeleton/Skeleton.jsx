import React from 'react';

const Skeleton = ({ width = '100%', height = '1rem', className = '', rounded = false }) => {
  return (
    <div
      className={`placeholder ${className} ${rounded ? 'rounded' : ''}`}
      style={{
        width,
        height,
        display: 'inline-block'
      }}
    ></div>
  );
};

const PropertyCardSkeleton = () => {
  return (
    <div className="col-xl-3 col-lg-6">
      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="placeholder bg-light placeholder-glow" style={{ height: '180px', width: '100%' }}></div>
        
        <div className="card-body d-flex flex-column">
          <div className="placeholder bg-light rounded mb-2 placeholder-glow" style={{ height: '1.5rem', width: '80%' }}></div>
          
          <div className="placeholder bg-light rounded mb-3 placeholder-glow" style={{ height: '1rem', width: '100%' }}></div>
          
          <div className="mb-2">
            <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '40%' }}></div>
            <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '70%' }}></div>
            <div className="progress bg-light mt-1" style={{ height: '6px' }}>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ width: '60%', height: '100%' }}></div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between border-top pt-2 mt-2 mb-3">
            <div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '80px' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '90px' }}></div>
            </div>
            <div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '80px' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '70px' }}></div>
            </div>
          </div>
          
          <div className="d-flex flex-column gap-1 mt-3 mb-3">
            <div className="d-flex align-items-center">
              <div className="placeholder bg-light rounded me-2 placeholder-glow" style={{ height: '0.875rem', width: '0.875rem' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '60%' }}></div>
            </div>
            <div className="d-flex align-items-center">
              <div className="placeholder bg-light rounded me-2 placeholder-glow" style={{ height: '0.875rem', width: '0.875rem' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '70%' }}></div>
            </div>
            <div className="d-flex align-items-center">
              <div className="placeholder bg-light rounded me-2 placeholder-glow" style={{ height: '0.875rem', width: '0.875rem' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '50%' }}></div>
            </div>
            <div className="d-flex align-items-center">
              <div className="placeholder bg-light rounded me-2 placeholder-glow" style={{ height: '0.875rem', width: '0.875rem' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '40%' }}></div>
              <div className="placeholder bg-light rounded ms-2 placeholder-glow" style={{ height: '1rem', width: '60px' }}></div>
            </div>
            <div className="d-flex align-items-center">
              <div className="placeholder bg-light rounded me-2 placeholder-glow" style={{ height: '0.875rem', width: '0.875rem' }}></div>
              <div className="placeholder bg-light rounded placeholder-glow" style={{ height: '0.875rem', width: '80%' }}></div>
            </div>
          </div>
          
          <div className="placeholder bg-light rounded mt-3 placeholder-glow" style={{ height: '2.5rem', width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

const OfferCardSkeleton = () => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <div className="placeholder bg-light placeholder-glow rounded-start" style={{ height: '120px', width: '100%' }}></div>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <div className="placeholder bg-light rounded mb-2 placeholder-glow" style={{ height: '1.25rem', width: '70%' }}></div>
              <div className="placeholder bg-light rounded mb-2 placeholder-glow" style={{ height: '1rem', width: '50%' }}></div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '40%' }}></div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '60%' }}></div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '55%' }}></div>
              <div className="placeholder bg-light rounded mb-1 placeholder-glow" style={{ height: '0.875rem', width: '45%' }}></div>
              <div className="placeholder bg-light rounded mb-2 placeholder-glow" style={{ height: '0.875rem', width: '35%' }}></div>
              <div className="placeholder bg-light rounded mt-2 placeholder-glow" style={{ height: '2rem', width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PropertyCardSkeleton, OfferCardSkeleton, Skeleton };