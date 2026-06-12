# Panel de administración (Fase 1)

Panel de operador en `/admin` para ver usuarios, su progreso y ayudar con el acceso
(recuperar/resetear el código del niño, enviar email de reset al padre).

## Qué incluye la Fase 1

- **Gate de admin** vía allowlist `admins/{uid}` en Firestore (no editable desde el cliente).
- **Ruta `/admin`** (top-level, fuera del shell infantil) — `src/features/admin/AdminPage.jsx`.
- **Lista de usuarios** ordenada por última actividad (`lastSync`), con buscador por
  username / uid, y por usuario: nivel, actividades, exámenes, minutos, racha, grado.
- **Código secreto del niño**: *Recuperar* (lo decodifica y lo muestra, porque
  `hashPin` es reversible) **y** *Resetear* (elige 4 iconos nuevos → se aplica en la
  próxima conexión del niño).
- **Reset de contraseña del padre**: campo de email → `sendPasswordResetEmail`.
- Enlace condicional en **Ajustes → "Panel de administración"** (solo visible si eres admin).

## ⚠️ Antes de que funcione: desplegar reglas + crear el admin

### 1. Desplegar las reglas de Firestore
Se ampliaron en [`firestore.rules`](../firestore.rules): un admin puede **leer** todos los
`users/*` y **escribir solo el campo `iconPin`** (reset de código). El resto sigue owner-only.

```bash
firebase deploy --only firestore:rules
```
(o pegarlas en Firebase Console → Firestore Database → Rules)

### 2. Marcar una cuenta como admin
1. Inicia sesión en la app con la cuenta que será admin (email+contraseña o Google).
2. Copia su **UID**: Firebase Console → Authentication → busca el usuario → UID.
3. Firestore Database → crea colección `admins` → documento con **ID = ese UID**.
   El contenido da igual (puede ir vacío o `{ note: "owner" }`). Lo que cuenta es que
   el documento **exista**.
4. Recarga la app → en Ajustes aparece "Panel de administración" y `/admin` funciona.

> Mantén la lista de admins mínima y protege esas cuentas (idealmente MFA): al ampliar la
> lectura, una cuenta admin comprometida expone datos de todas las familias y niños.

## Arreglo de sync incluido (necesario para que funcione)

El `iconPin` **nunca se sincronizaba** por un bug: `pushToCloud` hacía `JSON.parse` sobre la
cadena base64 cruda del código y lanzaba excepción (silenciada). Se corrigió en
[`syncService.js`](../src/services/firebase/syncService.js): `iconPin` ahora se sube/baja como
**cadena cruda**. Sin este arreglo, "Recuperar/Resetear código" mostraría "Sin código" para todos.

> Los niños **ya existentes** poblarán su `iconPin` en la nube en su **próxima sesión** (el
> push periódico lo sube). Hasta entonces, el panel mostrará "Sin código sincronizado" para ellos.

## Límites conocidos (Fase 1)

- **Recuperación de código** solo para niños con cuenta real sincronizada. Los **invitados**
  no tienen doc en la nube → no hay nada que recuperar/resetear remotamente.
- **"Última actividad"** usa `lastSync`. El registro de **visitas** reales (login/última
  conexión) es Fase 2 — hoy no se registra.
- **Email de reset** solo para cuentas email+contraseña (no Google/anónimo/invitado).
- El **admin no puede fijar la contraseña** del padre directamente (eso requiere Cloud
  Functions + Admin SDK; no es parte de la Fase 1).

## Archivos

- `firestore.rules` — allowlist `admins` + lectura admin de `users/*` + update de `iconPin`.
- `src/services/firebase/adminService.js` — `isCurrentUserAdmin`, `listAllUsers`, `decodeChildCode`, `resetChildCode`.
- `src/services/firebase/authService.js` — `sendPasswordReset`.
- `src/features/admin/AdminPage.jsx` — el panel.
- `src/app/routing/AppRouter.jsx` — ruta `/admin`.
- `src/features/settings/SettingsPage.jsx` — enlace condicional.
- `src/shared/theme/app.css` — estilos `.admin-*`.
