// Script para monitorar TODOS os redirecionamentos
// Cole este código no console do navegador em produção

console.log('🕵️ MONITOR DE REDIRECIONAMENTOS ATIVO');

// Interceptar router.push
const originalPush = window.history.pushState;
window.history.pushState = function(state, title, url) {
  console.log('🚨 [REDIRECT] history.pushState chamado:', {
    url: url,
    state: state,
    stack: new Error().stack
  });
  return originalPush.apply(this, arguments);
};

// Interceptar router.replace
const originalReplace = window.history.replaceState;
window.history.replaceState = function(state, title, url) {
  console.log('🚨 [REDIRECT] history.replaceState chamado:', {
    url: url,
    state: state,
    stack: new Error().stack
  });
  return originalReplace.apply(this, arguments);
};

// Interceptar window.location
let _location = window.location.href;
Object.defineProperty(window, 'location', {
  get: function() {
    return _location;
  },
  set: function(value) {
    console.log('🚨 [REDIRECT] window.location alterado:', {
      from: _location,
      to: value,
      stack: new Error().stack
    });
    _location = value;
  }
});

// Monitorar mudanças na URL
const originalReplaceState = History.prototype.replaceState;
History.prototype.replaceState = function() {
  console.log('🚨 [REDIRECT] History.replaceState:', arguments[2]);
  return originalReplaceState.apply(this, arguments);
};

console.log('🎯 Monitor instalado! Agora navegue para /admin/login');
console.log('🔍 Observe os logs com 🚨 [REDIRECT] para ver quem está fazendo o redirecionamento');
