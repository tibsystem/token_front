// Exemplo de uso do componente Breadcrumb com textos personalizados

import React from 'react';
import Breadcrumb from './breadcrumb';

const ExemploUso = () => {
  return (
    <div>
      <Breadcrumb 
        items={[
          { label: 'Painel', path: '/dashboard' },
          { label: 'Investimentos', path: '/dashboard/investments' },
          { label: 'Detalhes', path: '/dashboard/investments/details' }
        ]}
      />
      
      <Breadcrumb route="/dashboard/investments" />
      
      <Breadcrumb 
        items={[
          { label: 'Administração', path: '/admin' },
          { label: 'Gestão de Usuários', path: '/admin/users' },
          { label: 'Perfil do Cliente', path: '/admin/users/profile' }
        ]}
        className="admin-breadcrumb"
      />
      
      <Breadcrumb />
      
      <Breadcrumb 
        items={[
          { label: 'Transações Financeiras', path: '/transactions' },
          { label: 'Nova Transação', path: null } // sem path = não clicável
        ]}
      />
    </div>
  );
};

/*
Estrutura do objeto item:
{
  label: 'Texto que aparece', // obrigatório
  path: '/rota/da/pagina'     // opcional - se não tiver, não será clicável
}
*/

export default ExemploUso;
