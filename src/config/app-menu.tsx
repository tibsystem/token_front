const Menu = [
	{ is_header: true, title: 'Navigation' },
	{ path: '/dashboard', icon: 'fa fa-sitemap', title: 'Dashboard'},
  { path: '/investimentos', icon: 'fa fa-dollar-sign', title: 'Investimentos' },
  { path: '/imoveis', icon: 'fa fa-building', title: 'Imóveis',
    children: [
      { path: '/imoveis', title: 'Lista de Imóveis' }
    ]
  },
  { path: '/p2p', icon: 'fa fa-exchange-alt', title: 'P2P',
    children: [
      { path: '/p2p/nova', title: 'Nova Oferta' },
      { path: '/p2p/ofertas', title: 'Ofertas Disponíveis' }
    ]
  },

];

export default Menu;