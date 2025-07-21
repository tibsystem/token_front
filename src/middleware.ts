import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Para builds estáticos, o middleware tem limitações
  // Vamos apenas garantir que a estrutura de rotas funcione
  const { pathname } = request.nextUrl;
  
  // Verificar se está tentando acessar /admin/login
  if (pathname === '/admin/login') {
    // Permitir acesso direto à rota admin/login
    return NextResponse.next();
  }
  
  // Para outras rotas admin, verificar se há token
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Em produção estática, não podemos verificar localStorage aqui
    // A verificação será feita no client-side via ProtectedRoute
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
