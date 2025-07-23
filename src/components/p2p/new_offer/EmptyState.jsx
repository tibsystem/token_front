import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="fa fa-home" style={{ fontSize: "4rem", color: "#e9ecef" }}></i>
      </div>
      <h3 className="text-muted mb-3">Nenhum token disponível</h3>
      <p className="text-muted mb-4">
        Você ainda não possui tokens para vender no marketplace.
      </p>
      <Link href="/investments" className="btn btn-primary">
          <i className="fa fa-plus me-2"></i>Fazer Investimento
      </Link>
    </div>
  );
}