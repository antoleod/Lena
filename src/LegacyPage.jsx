import { useEffect, useRef, useState } from 'react';

const LEGACY_ATTR = 'data-legacy-managed';

function resolveUrl(raw, baseUrl) {
  if (!raw) return null;
  if (raw.startsWith('data:') || raw.startsWith('http:') || raw.startsWith('https:') || raw.startsWith('blob:') || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return raw;
  }
  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return raw;
  }
}

function normalizeBodyUrls(container, baseUrl) {
  const attributes = ['src', 'poster', 'data-src', 'data-avatar-icon'];
  const selector = attributes.map((attr) => `[${attr}]`).join(',');
  const nodes = container.querySelectorAll(selector);
  nodes.forEach((node) => {
    attributes.forEach((attr) => {
      const value = node.getAttribute(attr);
      if (!value) return;
      const resolved = resolveUrl(value, baseUrl);
      if (resolved && resolved !== value) {
        node.setAttribute(attr, resolved);
      }
    });
  });
}

function cloneHeadNode(node, baseUrl) {
  const clone = document.createElement(node.tagName.toLowerCase());
  Array.from(node.attributes).forEach((attr) => {
    if (attr.name === 'href') {
      const resolved = resolveUrl(attr.value, baseUrl);
      clone.setAttribute(attr.name, resolved || attr.value);
    } else {
      clone.setAttribute(attr.name, attr.value);
    }
  });
  clone.setAttribute(LEGACY_ATTR, 'true');
  if (node.tagName.toLowerCase() === 'style') {
    clone.textContent = node.textContent;
  }
  return clone;
}

function copyAttributes(source, target, baseUrl) {
  Array.from(source.attributes).forEach((attr) => {
    if (attr.name === 'src') {
      const resolved = resolveUrl(attr.value, baseUrl);
      target.setAttribute(attr.name, resolved || attr.value);
      return;
    }
    target.setAttribute(attr.name, attr.value);
  });
}

function loadScriptNode(source, baseUrl) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    copyAttributes(source, script, baseUrl);
    script.setAttribute(LEGACY_ATTR, 'true');
    if (!source.getAttribute('src')) {
      script.textContent = source.textContent || '';
      document.body.appendChild(script);
      resolve(script);
      return;
    }
    script.async = false;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${script.src}`));
    document.body.appendChild(script);
  });
}

export default function LegacyPage({ legacyPath }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const managedNodes = [];
    const baseUrl = new URL(legacyPath, window.location.origin).toString();
    const previous = {
      title: document.title,
      bodyClass: document.body.className,
      lang: document.documentElement.lang
    };

    async function loadLegacy() {
      try {
        setError(null);
        const response = await fetch(legacyPath, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Legacy page not found: ${legacyPath}`);
        }
        const html = await response.text();
        if (!active) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        document.title = doc.title || previous.title;
        document.documentElement.lang = doc.documentElement.lang || previous.lang || 'fr';
        document.body.className = doc.body.className || '';

        const headNodes = Array.from(doc.head.querySelectorAll('link, style'));
        headNodes.forEach((node) => {
          if (!active) return;
          if (node.tagName.toLowerCase() === 'link') {
            const href = node.getAttribute('href');
            const rel = node.getAttribute('rel') || '';
            if (!href) return;
            const resolved = resolveUrl(href, baseUrl);
            const existing = Array.from(document.head.querySelectorAll('link')).some((link) => {
              return link.rel === rel && link.href === resolved;
            });
            if (existing) return;
          }
          const cloned = cloneHeadNode(node, baseUrl);
          document.head.appendChild(cloned);
          managedNodes.push(cloned);
        });

        const bodyClone = doc.body.cloneNode(true);
        bodyClone.querySelectorAll('script').forEach((script) => script.remove());
        if (containerRef.current) {
          containerRef.current.innerHTML = bodyClone.innerHTML;
          normalizeBodyUrls(containerRef.current, baseUrl);
        }

        const scripts = Array.from(doc.querySelectorAll('script'));
        for (const script of scripts) {
          if (!active) return;
          const node = await loadScriptNode(script, baseUrl);
          managedNodes.push(node);
        }

        if (active && document.readyState !== 'loading') {
          document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
          window.dispatchEvent(new Event('load'));
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Erreur inattendue');
      }
    }

    loadLegacy();

    return () => {
      active = false;
      managedNodes.forEach((node) => {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      document.title = previous.title;
      document.body.className = previous.bodyClass;
      document.documentElement.lang = previous.lang;
    };
  }, [legacyPath]);

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Page introuvable</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <div ref={containerRef} />;
}
