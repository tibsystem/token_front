
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
    <div className="invoice card p-4 shadow-sm border-0 rounded-4 animate__animated animate__fadeIn" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="invoice-company mb-4">
        <span className="float-end hidden-print">
        </span>
        Nome da Propriedade: {form.titulo || 'Imóvel sem título'}
      </div>
      <div className="invoice-header d-flex justify-content-between mb-4">
        <div className="invoice-from">
          <small>Captador</small>
          <address className="mt-5px mb-5px">
            <strong className="text-dark">{captador?.label || form.agent_id || 'N/A'}</strong><br />
          </address>
        </div>
        <div className="invoice-to">
          <small>Tipo de Contrato</small>
          <address className="mt-5px mb-5px">
            <strong className="text-dark">{capitalizeFirstLetter(tipoContrato)}</strong><br />
          </address>
        </div>
        <div className="invoice-date">
          <small>Cadastro realizado em</small>
          <div className="date text-dark mt-5px">
            {(() => {
              const now = new Date();
              const data = now.toLocaleDateString('pt-BR');
              const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              return `${data} às ${hora}`;
            })()}
          </div>
          <div className="invoice-detail">
            <span className="fw-bold">Rentabilidade:</span> {form.rentabilidade || rentabilidade || 'N/A'}<br />
          </div>
        </div>
      </div>
      <div className="invoice-content mb-4">
        <div className="table-responsive">
          <table className="table table-invoice">
            <thead>
              <tr>
                <th>QTD Tokens</th>
                <th className="text-center" style={{ width: "30%" }}>Valor Total</th>
                <th className="text-center" style={{ width: "30%" }}>Valor por Token</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{form.qtd_tokens || '-'}</td>
                <td className="text-center">{form.valor_total || '-'}</td>
                <td className="text-center">{form.valor_total_ptoken || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="invoice-price mt-4">
          <div className="invoice-price-left">
            <div className="invoice-price-row">
              <div className="sub-price">
                <small>SUBTOTAL</small>
                <span className="text-dark">{form.valor_total || '-'}</span>
              </div>

            </div>
          </div>
          <div className="invoice-price-right">
            <small>TOTAL</small> <span className="fw-bold">{form.valor_total || '-'}</span>
          </div>
        </div>
      </div>
      <div className="invoice-note text-dark mb-4">
        <strong>Descrição do Imóvel:</strong><br />
        {form.descricao
          ? <span style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>{form.descricao}</span>
          : (
            <span className="text-dark" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
              Este imóvel ainda não possui uma descrição detalhada. Para mais informações sobre localização, características, infraestrutura, documentação, potencial de valorização e outros detalhes relevantes, entre em contato com nossa equipe. Estamos à disposição para esclarecer dúvidas e fornecer todo o suporte necessário para sua decisão de investimento.
            </span>
          )
        }
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
  );
}