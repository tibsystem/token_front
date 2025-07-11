const Menu = [
	{ is_header: true, title: '' },
	// Admin
	{ path: '/admin/dashboard', icon: 'fa fa-chart-pie', title: 'Dashboard', role: 'admin' },
	{ path: '/admin/investors', icon: 'fa fa-users', title: 'Investidores', role: 'admin' },
	{ path: '/admin/properties', icon: 'fa fa-building', title: 'Imóveis', role: 'admin',
		children: [
			{ path: '/admin/properties', title: 'Todos os Imóveis', role: 'admin' },
			{ path: '/admin/properties/register', title: 'Cadastrar Imóvel', role: 'admin' }
		]
	},
	// Investidor
	{ path: '/dashboard', icon: 'fa fa-home', title: 'Dashboard', role: 'investidor' },
	{ path: '/properties', icon: 'fa fa-building', title: 'Imóveis', role: 'investidor' },
	{ path: '/investments', icon: 'fa fa-chart-line', title: 'Investimentos', role: 'investidor' },
	{ path: '/p2p/offers', icon: 'fa fa-exchange-alt', title: 'P2P', role: 'investidor',
		children: [
			{ path: '/p2p/offers', title: 'Ofertas', role: 'investidor' },
			{ path: '/p2p/new_offer', title: 'Nova Oferta', role: 'investidor' }
		]
	},
	{ path: '/financial-transactions', icon: 'fa fa-receipt', title: 'Extrato Financeiro', role: 'investidor' },
];

export default Menu;