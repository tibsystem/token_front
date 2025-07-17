
export default function PropertySummary({
  form,
  tipoContrato,
  rentabilidade,
  attachedFiles = [],
  smartContractFiles = [],
  imagePreviews = [],
  options = [],
}) {
  return (
    <div className="property-summary card p-4 shadow-sm border-0 rounded-4 animate__animated animate__fadeIn">
      <div className="d-flex align-items-center mb-4">
        {imagePreviews[0] && (
          <img src={imagePreviews[0].url} alt="Imagem do imóvel" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 24 }} />
        )}
        <div>
          <h3 className="fw-bold mb-1">{form.titulo || 'Imóvel sem título'}</h3>
          <span className="badge bg-success text-uppercase">{form.status || 'ativo'}</span>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <strong>Tipo de Contrato:</strong> {tipoContrato}
        </div>
        <div className="col-md-6">
          <strong>Rentabilidade:</strong> {rentabilidade || 'N/A'}
        </div>
      </div>

      
      <div className="row mb-3">
      
        <div className="col-md-6">
          <strong>Agente:</strong> {form.agent_id || 'N/A'}
        </div>
      </div>

      <div className="mb-3">
        <strong>Descrição:</strong>
        <div className="text-muted">{form.descricao || 'Sem descrição.'}</div>
      </div>

      <table className="table table-bordered mb-4">
        <thead className="">
          <tr>
            <th>QTD Tokens</th>
            <th>Valor Total</th>
            <th>Valor por Token</th>
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

      {imagePreviews.length > 0 && (
        <div className="mb-3">
          <strong>Imagens:</strong>
          <div className="d-flex gap-2 flex-wrap mt-2">
            {imagePreviews.map((img, idx) => (
              <img key={idx} src={img.url} alt={`Imagem ${idx + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
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
  );
}