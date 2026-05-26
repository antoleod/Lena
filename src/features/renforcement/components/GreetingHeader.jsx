import { getProfile } from '../../../services/storage/profileStore.js';

export default function GreetingHeader() {
  const prenom = getProfile().name || '';
  const nameText = prenom ? `Bonjour ${prenom} 🌟` : 'Bonjour 🌟';
  return (
    <section className="panel panel--tight reinforcement-greeting" style={{ marginBottom: 14 }}>
      <div className="panel__header">
        <div>
          <span className="eyebrow">Renforcement</span>
          <h1 style={{ margin: 0 }}>{nameText}</h1>
        </div>
      </div>
    </section>
  );
}

