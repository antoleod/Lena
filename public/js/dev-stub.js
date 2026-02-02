(function(){
  // Bloquea las peticiones a LaunchDarkly en el entorno de desarrollo local.
  const blockedEndpoints = [/events\.launchdarkly\.com/i, /clientstream\.launchdarkly\.com/i, /app\.launchdarkly\.com/i];
  const matchesBlocked = (url) => {
    if (!url) return false;
    try { return blockedEndpoints.some((pattern) => pattern.test(String(url))); }
    catch { return false; }
  };
  const createStubResponse = () => new Response('', { status: 204, statusText: 'Local Dev Stub' });

  // Sobrescribir window.fetch
  const originalFetch = window.fetch;
  if (typeof originalFetch === 'function') {
    window.fetch = function(input, init) {
      try {
        const url = typeof input === 'string' ? input : (input && input.url);
        if (matchesBlocked(url)) {
          console.info('[LD-Stub] fetch blocked:', url);
          return Promise.resolve(createStubResponse());
        }
      } catch {}
      return originalFetch.apply(this, arguments);
    };
  }

  // Sobrescribir XMLHttpRequest
  const OriginalXHR = window.XMLHttpRequest;
  if (OriginalXHR) {
    const originalOpen = OriginalXHR.prototype.open;
    OriginalXHR.prototype.open = function(method, url) {
      if (matchesBlocked(url)) {
        console.info('[LD-Stub] XHR blocked:', url);
        this.__ld_blocked = true;
      }
      return originalOpen.apply(this, arguments);
    };
    const originalSend = OriginalXHR.prototype.send;
    OriginalXHR.prototype.send = function(body) {
      if (this.__ld_blocked) {
        return; // Simplemente no enviar la petición
      }
      return originalSend.apply(this, arguments);
    };
  }
})();