import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isCurrentUserAdmin, listAllUsers, decodeChildCode, resetChildCode } from '../../services/firebase/adminService.js';
import { sendPasswordReset } from '../../services/firebase/authService.js';
import { computeGlobalLevel } from '../../services/learning/levelSystem.js';
import { assetUrl } from '../../shared/assets/assetUrl.js';
import { avatarSrc, isPictureAvatar } from '../../shared/avatars/avatarCatalog.js';
import IconPinPad, { IconPinSlots } from '../auth/IconPinPad.jsx';

// Firestore Timestamp | number | undefined → readable local string.
function fmtDate(ts) {
  if (!ts) return '—';
  try {
    const d = typeof ts?.toDate === 'function' ? ts.toDate() : new Date(ts);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  } catch {
    return '—';
  }
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(null); // null = checking
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const ok = await isCurrentUserAdmin();
      if (!active) return;
      setAllowed(ok);
      if (!ok) { setLoading(false); return; }
      try {
        const list = await listAllUsers();
        if (active) setUsers(list);
      } catch (e) {
        if (active) setError('No se pudieron cargar los usuarios. ¿Reglas desplegadas?');
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = [...users].sort((a, b) => {
      const ta = a.lastSync?.toMillis?.() ?? 0;
      const tb = b.lastSync?.toMillis?.() ?? 0;
      return tb - ta; // most-recently active first
    });
    if (!q) return rows;
    return rows.filter((u) => (u.profile?.name || '').toLowerCase().includes(q) || u.uid.toLowerCase().includes(q));
  }, [users, query]);

  async function refresh() {
    try { setUsers(await listAllUsers()); } catch { /* keep stale */ }
  }

  if (allowed === null) {
    return <div className="admin-page admin-page--center"><p>Verificando acceso…</p></div>;
  }
  if (!allowed) {
    return (
      <div className="admin-page admin-page--center">
        <span style={{ fontSize: '3rem' }}>🔒</span>
        <h1>Acceso restringido</h1>
        <p className="admin-muted">Esta zona es solo para administradores.</p>
        <button className="primary-action" type="button" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <button type="button" className="admin-back" onClick={() => navigate('/')} aria-label="Volver">←</button>
        <div>
          <span className="eyebrow">ADMIN</span>
          <h1>Panel de control</h1>
        </div>
        <span className="admin-count">{users.length} usuarios</span>
      </header>

      <input
        className="admin-search"
        type="search"
        placeholder="Buscar por username o uid…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-muted">Cargando…</p>}
      {!loading && filtered.length === 0 && <p className="admin-muted">Sin resultados.</p>}

      <ul className="admin-list">
        {filtered.map((u) => (
          <UserRow
            key={u.uid}
            user={u}
            expanded={expanded === u.uid}
            onToggle={() => setExpanded(expanded === u.uid ? null : u.uid)}
            onChanged={refresh}
          />
        ))}
      </ul>
    </div>
  );
}

function UserRow({ user, expanded, onToggle, onChanged }) {
  const profile = user.profile || {};
  const done = profile.totalActivitiesCompleted || 0;
  const level = computeGlobalLevel(done);
  const code = decodeChildCode(user.iconPin);

  const [revealed, setRevealed] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [email, setEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleNewCode(ids) {
    setBusy(true); setResetMsg('');
    try {
      await resetChildCode(user.uid, ids);
      setResetMsg('✓ Código reseteado. Se aplicará en su próxima conexión.');
      setResetting(false);
      onChanged?.();
    } catch (e) {
      setResetMsg(e.message || 'Error al resetear.');
    }
    setBusy(false);
  }

  async function handleSendReset(e) {
    e.preventDefault();
    setBusy(true); setEmailMsg('');
    try {
      await sendPasswordReset(email.trim());
      setEmailMsg('✓ Email de reset enviado (si la cuenta existe).');
    } catch (err) {
      setEmailMsg(err.code === 'auth/invalid-email' ? 'Email inválido.' : 'Error al enviar. Revisa el email.');
    }
    setBusy(false);
  }

  return (
    <li className={`admin-card${expanded ? ' is-open' : ''}`}>
      <button type="button" className="admin-card__head" onClick={onToggle}>
        <span className="admin-avatar">
          {isPictureAvatar(profile.avatarId)
            ? <img src={assetUrl(avatarSrc(profile.avatarId))} alt="" draggable="false" />
            : <span>{(profile.name || '?').charAt(0).toUpperCase()}</span>}
        </span>
        <span className="admin-card__id">
          <strong>{profile.name || <em className="admin-muted">sin nombre</em>}</strong>
          <small className="admin-muted">{user.uid.slice(0, 10)}…</small>
        </span>
        <span className="admin-card__meta">
          <span>Niv. {level}</span>
          <small className="admin-muted">{fmtDate(user.lastSync)}</small>
        </span>
        <span className="admin-chevron">{expanded ? '▴' : '▾'}</span>
      </button>

      {expanded && (
        <div className="admin-card__body">
          <div className="admin-stats">
            <div><span>Actividades</span><strong>{done}</strong></div>
            <div><span>Exámenes</span><strong>{profile.totalExamsCompleted || 0}</strong></div>
            <div><span>Minutos</span><strong>{profile.totalStudyMinutes || 0}</strong></div>
            <div><span>Racha</span><strong>{profile.streakCurrent || 0}</strong></div>
            <div><span>Grado</span><strong>{profile.schoolGrade || '—'}</strong></div>
            <div><span>Creado</span><strong>{fmtDate(profile.createdAt)}</strong></div>
          </div>

          {/* Child secret code — recover or reset */}
          <section className="admin-action">
            <h4>Código secreto del niño</h4>
            {code ? (
              <>
                {revealed
                  ? <div className="admin-code-reveal"><IconPinSlots pin={code} /></div>
                  : <button type="button" className="secondary-action" onClick={() => setRevealed(true)}>👁 Recuperar código</button>}
                <button type="button" className="secondary-action" onClick={() => { setResetting(true); setResetMsg(''); }}>♻️ Resetear código</button>
              </>
            ) : (
              <p className="admin-muted">Sin código sincronizado (cuenta invitado o sin código).</p>
            )}
            {resetMsg && <p className="admin-feedback">{resetMsg}</p>}
          </section>

          {/* Parent email reset */}
          <section className="admin-action">
            <h4>Reset de contraseña (padre)</h4>
            <form className="admin-email-form" onSubmit={handleSendReset}>
              <input
                type="email" required placeholder="email del usuario"
                value={email} onChange={(e) => { setEmail(e.target.value); setEmailMsg(''); }}
              />
              <button type="submit" className="secondary-action" disabled={busy}>Enviar email</button>
            </form>
            {emailMsg && <p className="admin-feedback">{emailMsg}</p>}
          </section>
        </div>
      )}

      {resetting && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__panel">
            <h3>Nuevo código para {profile.name || 'el niño'}</h3>
            <p className="admin-muted">Elige 4 iconos. Díselos al niño; se aplican en su próxima conexión.</p>
            <IconPinPad onComplete={handleNewCode} onBack={() => setResetting(false)} />
            {busy && <p className="admin-muted">Guardando…</p>}
          </div>
        </div>
      )}
    </li>
  );
}
