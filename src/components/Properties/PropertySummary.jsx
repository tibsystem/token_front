
export default function PropertySummary({
  form,
  tipoContrato,
  rentabilidade,
  attachedFiles = [],
  smartContractFiles = [],
  imagePreviews = [],
  options = [],
}) {
  function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

  const captador = options.find(opt => String(opt.value) === String(form.agent_id));
  console.log('Captador:', captador);

  return (
    <div className="property-summary card p-4 shadow-sm border-0 rounded-4 animate__animated animate__fadeIn" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="d-flex align-items-center">
          {imagePreviews[0] && (
            <img src={imagePreviews[0].url} alt="Imagem do imóvel" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 24, border: '1px solid #eee', background: '#fff' }} />
          )}
          <div>
            <h2 className="fw-bold mb-1" style={{ fontSize: 28 }}>{form.titulo || 'Imóvel sem título'}</h2>
            <div className="text-muted" style={{ fontSize: 16 }}>
              Captador da Propiedade: {captador?.label || form.agent_id || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light p-3 rounded mb-4 d-flex flex-wrap gap-4" style={{ border: '1px solid #eee' }}>
        <div style={{ minWidth: 220 }}>
          <div className="text-muted mb-1">Tipo de Contrato</div>
          <div className="fw-bold">{capitalizeFirstLetter(tipoContrato)}</div>
        </div>
        <div style={{ minWidth: 220 }}>
          <div className="text-muted mb-1">Rentabilidade</div>
          <div className="fw-bold uppercase">{(form.rentabilidade || rentabilidade || 'N/A')}</div>
        </div>
      </div>

      <div className="mb-4">
        <table className="table table-bordered mb-0" style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ fontWeight: 600 }}>QTD Tokens</th>
              <th style={{ fontWeight: 600 }}>Valor Total</th>
              <th style={{ fontWeight: 600 }}>Valor por Token</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{form.qtd_tokens || '-'}</td>
              <td>{form.valor_total || '-'}</td>
              <td>{form.valor_total_ptoken || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4" style={{ border: '1px solid #eee', background: '#fafbfc', borderRadius: 8, padding: 20 }}>
        <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ fontSize: 18 }}>Descrição do Imóvel</h5>
        <div className="mb-3">
          <div className="text-muted">{form.descricao || 'Sem descrição.'}</div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mb-3">
            <strong>Imagens:</strong>
            <div className="d-flex gap-2 flex-wrap mt-2">
              {imagePreviews.map((img, idx) => (
                <img key={idx} src={img.url} alt={`Imagem ${idx + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', background: '#fff' }} />
              ))}
            </div>
          </div>
        )}
        {attachedFiles.length > 0 && (
          <div className="mb-3">
            <strong>Anexos:</strong>
            <ul className="list-unstyled mt-2">
              {attachedFiles.map((fileObj, idx) => (
                <li key={idx} className="mb-1">
                  <span className="fw-bold">{fileObj.file?.name || 'Arquivo'}</span>
                  {fileObj.description && <span className="ms-2 text-muted">({fileObj.description})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {smartContractFiles.length > 0 && (
          <div className="mb-3">
            <strong>Smart Contracts:</strong>
            <ul className="list-unstyled mt-2">
              {smartContractFiles.map((fileObj, idx) => (
                <li key={idx} className="mb-1">
                  <span className="fw-bold">{fileObj.file?.name || 'Arquivo'}</span>
                  {fileObj.description && <span className="ms-2 text-muted">({fileObj.description})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}