import React from 'react';
import Link from 'next/link';

const Breadcrumb = ({ route = '', items = [], className = '' }) => {
  const formatBreadcrumbs = () => {
    if (items && items.length > 0) {
      return [
        { label: 'Início', path: null, icon: true },
        ...items.map(item => ({
          ...item,
          icon: false
        }))
      ];
    }
    
    if (!route) return [{ label: 'Início', path: '../dashboard', icon: true }];
    
    const segments = route.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Início', path: null, icon: true }
    ];
    
    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbs.push({
        label,
        path: currentPath,
        icon: false
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = formatBreadcrumbs();

  return (
    <nav className={`breadcrumb-nav ${className}`} aria-label="breadcrumb">
      <ol className="breadcrumb mb-0">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li 
              key={index} 
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast || !crumb.path ? (
                <span className="d-flex align-items-center">
                  {crumb.icon && (
                    <i className="fa fa-home me-2" aria-hidden="true"></i>
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.path} 
                  className="text-decoration-none d-flex align-items-center"
                >
                  {crumb.icon && (
                    <i className="fa fa-home me-2" aria-hidden="true"></i>
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>


      
    </nav>
  );
};

export default Breadcrumb;