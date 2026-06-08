import { useEffect, useState } from 'react';
import { getRewardCatalog, getRewardState } from '../../services/storage/rewardStore.js';

export default function PetMascot() {
  const [petId, setPetId] = useState(() => getRewardState().equippedPetId);

  useEffect(() => {
    function sync() {
      setPetId(getRewardState().equippedPetId);
    }
    window.addEventListener('lena-rewards-change', sync);
    return () => window.removeEventListener('lena-rewards-change', sync);
  }, []);

  if (!petId) return null;

  const pet = getRewardCatalog().find((item) => item.id === petId);
  if (!pet) return null;

  return (
    <div className="pet-mascot" aria-hidden="true" title={pet.name}>
      <span className="pet-mascot__bubble">{pet.icon}</span>
    </div>
  );
}
