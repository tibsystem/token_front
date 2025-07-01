import Link from 'next/link';

const adminMenu = [
  { path: '/admin/dashboard', icon: 'fa fa-home', title: 'Dashboard' },
  { path: '/admin/investidores', icon: 'fa fa-users', title: 'Investidores' },
  { path: '/admin/imoveis', icon: 'fa fa-building', title: 'Imóveis' },
  { path: '/admin/imoveis/cadastrar', icon: 'fa fa-plus', title: 'Cadastrar Imóvel' },
  // Adicione mais itens conforme necessário
];

export default function AdminMenu() {
  return (
    <nav className="bg-white border-r border-gray-200 min-h-screen w-64 p-6 flex flex-col">
      <div className="mb-8 text-2xl font-bold text-theme">Admin</div>
      <ul className="space-y-2">
        {adminMenu.map((item) => (
          <li key={item.path}>
            <Link href={item.path} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition">
              <i className={`${item.icon} text-blue-600`}></i>
              <span className="font-medium text-gray-700">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
