
export default function CardsAdminDash ({ Propiedades, investidores, valorNegociado }) {
    return (
        <div className="row mb-4">
            <div className="col-xl-4 mb-4 mb-xl-0">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 90, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',  }}>
                  <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.10, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
                    <i className="fa fa-building fa-fw" style={{ color: '#fff' }}></i>
                  </div>
                  <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="stats-title" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>IMÓVEIS CADASTRADOS</div>
                    <div className="stats-number" style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '8px 0' }}>
                      {Propiedades.toLocaleString("pt-BR")}
                    </div>
                    <div className="stats-desc" style={{ color: '#e0e7ff', fontSize: 14 }}>Total de imóveis na plataforma</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4  mb-4 mb-xl-0">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 90, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', boxShadow: '0 4px 24px rgba(67,206,162,0.12)' }}>
                  <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.10, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
                    <i className="fa fa-users fa-fw" style={{ color: '#fff' }}></i>
                  </div>
                  <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="stats-title" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>INVESTIDORES</div>
                    <div className="stats-number" style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '8px 0' }}>
                      {investidores.toLocaleString("pt-BR")}
                    </div>
                    <div className="stats-desc" style={{ color: '#e0fff4', fontSize: 14 }}>Total de investidores ativos</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 ">
                <div className="widget widget-stats" style={{ borderRadius: 20, minHeight: 90, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', boxShadow: '0 4px 24px rgba(142,45,226,0.12)' }}>
                  <div className="stats-icon stats-icon-lg" style={{ position: 'absolute', right: -10, top: -40, opacity: 0.10, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
                    <i className="fa fa-coins fa-fw" style={{ color: '#fff' }}></i>
                  </div>
                  <div className="stats-content" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="stats-title" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>VALOR NEGOCIADO</div>
                    <div className="stats-number" style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '8px 0' }}>
                      R${" "}
                      {Number(valorNegociado).toLocaleString("pt-BR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div className="stats-desc" style={{ color: '#f3e8ff', fontSize: 14 }}>Total negociado na plataforma</div>
                  </div>
                </div>
              </div>
            </div>
                    )
                }