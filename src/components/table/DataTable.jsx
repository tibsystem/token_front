import React, { useState, useEffect } from 'react';
import { FaSort, FaSortAmountUp, FaSortAmountDownAlt, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaSearch, FaTimes } from 'react-icons/fa';
import useDarkMode from '@/hooks/useDarkMode';

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function sortData(data, sorts) {
  if (!sorts.length) return data;
  return [...data].sort((a, b) => {
    for (let { field, direction } of sorts) {
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

function filterData(data, searchTerm, columns) {
  if (!searchTerm.trim()) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(row => {
    return columns.some(col => {
      const value = getNestedValue(row, col.field);
      return value && value.toString().toLowerCase().includes(term);
    });
  });
}

const DataTable = ({
  value = [],
  children,
  showGridlines = false,
  tableStyle = {},
  paginator = true,
  rows = 10,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  sortMode = 'single',
  globalFilter = true,
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  className = "",
  responsive = true,
  striped = true,
  hover = true,
  size = "md"
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [sorts, setSorts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isDarkMode } = useDarkMode();

  const columns = React.Children.toArray(children)
    .filter(child => child.type && child.type.name === 'Column')
    .map(child => child.props);

  // Filtrar dados primeiro, depois ordenar
  const filteredData = filterData(value, searchTerm, columns);
  const sortedValue = sortData(filteredData, sorts);

  const totalRecords = sortedValue.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedValue = paginator ? sortedValue.slice(start, end) : sortedValue;

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage]);

  const handleSort = field => {
    setSorts(prev => {
      const existing = prev.find(s => s.field === field);
      let newSorts;
      if (sortMode === 'single') {
        if (!existing) {
          newSorts = [{ field, direction: 'asc' }];
        } else if (existing.direction === 'asc') {
          newSorts = [{ field, direction: 'desc' }];
        } else {
          newSorts = []; 
        }
      } else {
        if (!existing) {
          newSorts = [...prev, { field, direction: 'asc' }];
        } else if (existing.direction === 'asc') {
          newSorts = prev.map(s =>
            s.field === field ? { ...s, direction: 'desc' } : s
          );
        } else {
          newSorts = prev.filter(s => s.field !== field);
        }
      }
      return newSorts;
    });
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let prev = -2;
    range.forEach(i => {
      if (prev + 1 !== i) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    });

    return rangeWithDots;
  };

  const tableSizeClass = {
    sm: 'table-sm',
    md: '',
    lg: 'table-lg'
  }[size];

  const tableClasses = [
    'table',
    tableSizeClass,
    striped ? 'table-striped' : '',
    hover ? 'table-hover' : '',
    showGridlines ? 'table-bordered' : '',
    responsive ? 'table-responsive' : '',
    className
  ].filter(Boolean).join(' ');

  const themeClasses = {
    table: isDarkMode ? 'table-dark' : '',
    tableHeader: isDarkMode ? 'table-dark' : 'table-light',
    card: isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-light text-dark border-light',
    input: isDarkMode ? 'bg-dark text-white border-dark' : 'bg-white text-dark border-light-subtle',
    inputIcon: isDarkMode ? 'bg-dark text-white border-dark' : 'bg-white text-muted border-light-subtle',
    select: isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-white text-dark border-light-subtle',
    button: isDarkMode ? 'btn-outline-light' : 'btn-outline-dark',
    text: isDarkMode ? 'text-light' : 'text-dark',
    searchFocus: isDarkMode ? '#6c757d' : '#0dcaf0'
  };

  return (
    <div className={`datatable-wrapper ${themeClasses.card} rounded shadow-sm p-3`}>
      {(globalFilter || paginator) && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className={`small fw-medium ${themeClasses.text}`}>
              {loading ? 'Carregando...' : `${totalRecords} registro${totalRecords !== 1 ? 's' : ''}`}
            </span>
            {searchTerm && (
              <span className="badge bg-info text-dark">
                Filtrado: {totalRecords}
              </span>
            )}
          </div>
          
          {globalFilter && (
            <div className="position-relative" style={{ minWidth: '250px' }}>
              <div className="input-group input-group-sm">
                <span className={`input-group-text ${themeClasses.inputIcon} border-end-0`}>
                  <FaSearch size={14} className={isDarkMode ? 'text-light' : 'text-muted'} />
                </span>
                <input
                  type="text"
                  className={`form-control ${themeClasses.input} border-start-0 shadow-none`}
                  placeholder="Pesquisar em todos os campos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    transition: 'all 0.2s ease',
                    borderColor: isSearchFocused ? themeClasses.searchFocus : undefined,
                    boxShadow: isSearchFocused ? `0 0 0 0.25rem ${isDarkMode ? 'rgba(108, 117, 125, 0.25)' : 'rgba(13, 202, 240, 0.25)'}` : 'none'
                  }}
                />
                {searchTerm && (
                  <button
                    className={`input-group-text ${themeClasses.inputIcon} border-start-0 btn p-0`}
                    onClick={clearSearch}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = isDarkMode ? '#495057' : '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = ''}
                  >
                    <FaTimes size={12} className={isDarkMode ? 'text-light' : 'text-muted'} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <div className={`mt-2 ${themeClasses.text}`}>Carregando dados...</div>
        </div>
      ) : (
        <>
          <div className={responsive ? 'table-responsive' : ''}>
            <table style={tableStyle} className={`${tableClasses} ${themeClasses.table} mb-0`}>
              <thead className={themeClasses.tableHeader}>
                <tr>
                  {columns.map(col => {
                    const sortObj = sorts.find(s => s.field === col.field);
                    let sortIcon = <FaSort className="ms-2 text-muted opacity-50" size={12} />;
                    
                    if (sortObj) {
                      sortIcon = sortObj.direction === 'asc'
                        ? <FaSortAmountUp className="ms-2 text-primary" size={12} />
                        : <FaSortAmountDownAlt className="ms-2 text-primary" size={12} />;
                    }

                    return (
                      <th
                        key={col.field}
                        style={{ 
                          ...col.style, 
                          cursor: col.sortable !== false ? 'pointer' : 'default',
                          userSelect: 'none',
                          position: 'sticky',
                          top: 0,
                          zIndex: 10
                        }}
                        onClick={() => col.sortable !== false && handleSort(col.field)}
                        scope="col"
                        className={`fw-semibold ${col.sortable !== false ? 'sortable-header' : ''}`}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{col.header}</span>
                          {col.sortable !== false && sortIcon}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedValue.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-muted">
                      <div>
                        <div className="mb-2">📋</div>
                        {emptyMessage}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedValue.map((row, idx) => (
                    <tr key={idx} style={{ transition: 'background-color 0.15s ease' }}>
                      {columns.map(col => (
                        <td key={col.field} style={col.style} className="align-middle">
                          {col.body ? col.body(row) : getNestedValue(row, col.field)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {paginator && totalPages > 1 && (
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3 gap-3">
              <div className={`small ${themeClasses.text} text-center text-md-start`}>
                Mostrando {start + 1} a {Math.min(end, totalRecords)} de {totalRecords} registros
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <label className={`small ${themeClasses.text}`} htmlFor="rowsPerPage">
                    Por página:
                  </label>
                  <select
                    id="rowsPerPage"
                    className={`form-select form-select-sm ${themeClasses.select} shadow-none`}
                    value={rowsPerPage}
                    onChange={e => setRowsPerPage(Number(e.target.value))}
                    style={{ width: 'auto', minWidth: '70px' }}
                  >
                    {rowsPerPageOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Page navigation */}
                <nav aria-label="Navegação da tabela">
                  <ul className="pagination pagination-sm mb-0 gap-1">
                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                      <button
                        className={`page-link border-0 rounded ${themeClasses.button}`}
                        onClick={() => setPage(0)}
                        disabled={page === 0}
                        aria-label="Primeira página"
                        style={{ minWidth: '36px', minHeight: '36px' }}
                      >
                        <FaAngleDoubleLeft size={12} />
                      </button>
                    </li>
                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                      <button
                        className={`page-link border-0 rounded ${themeClasses.button}`}
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                        aria-label="Página anterior"
                        style={{ minWidth: '36px', minHeight: '36px' }}
                      >
                        <FaAngleLeft size={12} />
                      </button>
                    </li>

                    {getPaginationRange().map((pageNum, index) => (
                      pageNum === '...' ? (
                        <li key={`dots-${index}`} className="page-item disabled">
                          <span className="page-link border-0 bg-transparent">...</span>
                        </li>
                      ) : (
                        <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                          <button
                            className={`page-link border-0 rounded ${
                              pageNum === page 
                                ? 'bg-primary text-white border-primary' 
                                : themeClasses.button
                            }`}
                            onClick={() => setPage(pageNum)}
                            style={{ minWidth: '36px', minHeight: '36px' }}
                          >
                            {pageNum + 1}
                          </button>
                        </li>
                      )
                    ))}

                    <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                      <button
                        className={`page-link border-0 rounded ${themeClasses.button}`}
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                        aria-label="Próxima página"
                        style={{ minWidth: '36px', minHeight: '36px' }}
                      >
                        <FaAngleRight size={12} />
                      </button>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                      <button
                        className={`page-link border-0 rounded ${themeClasses.button}`}
                        onClick={() => setPage(totalPages - 1)}
                        disabled={page >= totalPages - 1}
                        aria-label="Última página"
                        style={{ minWidth: '36px', minHeight: '36px' }}
                      >
                        <FaAngleDoubleRight size={12} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .sortable-header:hover {
          background-color: rgba(0, 123, 255, 0.1) !important;
          transition: background-color 0.15s ease;
        }
        
        .datatable-wrapper .table tbody tr:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .pagination .page-link:hover:not(.active) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .input-group:focus-within {
          box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default DataTable;