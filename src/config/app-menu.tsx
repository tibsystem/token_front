
const Menu = [
	{ is_header: true, title: '' },
	// Admin
	{ path: '/admin/dashboard', icon: 'fa fa-chart-pie', title: 'Dashboard', role: 'admin' },
	{ path: '/admin/investors', icon: 'fa fa-users', title: 'Investidores', role: 'admin' },
	{ path: '/admin/properties', icon: 'fa fa-building', title: 'Propriedades', role: 'admin',
		children: [
			{ path: '/admin/properties', title: 'Todos as Propriedades', role: 'admin' },
			{ path: '/admin/properties/register', title: 'Cadastrar Propriedade', role: 'admin' }
		]
	},
	{ path: '/admin/raisers', icon: 'fa fa-user', title: 'Captadores', role: 'admin',
		children: [
			{ path: '/admin/raisers', title: 'Todos os Captadores', role: 'admin' },
			{ path: '/admin/raisers/register', title: 'Cadastrar Captador', role: 'admin' }
		]
	},

	// Investidor
	{ path: '/dashboard', icon: 'fa fa-home', title: 'Dashboard', role: 'investidor' },
	{ path: '/properties', icon: 'fa fa-chart-pie', title: 'Investir', role: 'investidor' },
	{ path: '/investments', icon: 'fa fa-chart-line', title: 'Meus Investimentos', role: 'investidor' },
	{ path: '/p2p/offers', icon: 'fa fa-exchange-alt', title: 'P2P', role: 'investidor',
		children: [
			{ path: '/p2p/offers', title: 'Ofertas', role: 'investidor' },
			{ path: '/p2p/new_offer', title: 'Nova Oferta', role: 'investidor' }
		]
	},
	{ path: '/financial-transactions', icon: 'fa fa-receipt', title: 'Extrato Financeiro', role: 'investidor' },
];

export default Menu;