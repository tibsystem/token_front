import useDarkMode from '@/hooks/useDarkMode';


export default function OfferPageHeader({ totalTokens }) {
    const { isDarkMode } = useDarkMode();
    const headerClass = isDarkMode ? "text-white" : "text-dark";
  
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className={`text-2xl mb-2 ${headerClass} d-flex align-items-center`}>
          <i className={`fa fa-store me-3 ${headerClass}`}></i>
          Marketplace de Tokens
        </h1>
        <p className="text-muted mb-0">
          Venda seus tokens de propriedades no marketplace P2P
        </p>
      </div>
      <div className={`badge bg-light ${headerClass} fs-6 p-2`}>
        <i className={`fa fa-cubes me-2 ${headerClass}`}></i>
        {totalTokens} tokens disponíveis
      </div>
    </div>
  );
}