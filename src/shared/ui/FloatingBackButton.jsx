import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_POSITION = { x: 24, y: 96 };

function clampPosition(position, size = { width: 148, height: 42 }) {
  if (typeof window === 'undefined') {
    return position;
  }

  const maxX = Math.max(12, window.innerWidth - size.width - 12);
  const maxY = Math.max(12, window.innerHeight - size.height - 12);

  return {
    x: Math.min(Math.max(12, position.x), maxX),
    y: Math.min(Math.max(12, position.y), maxY)
  };
}

export default function FloatingBackButton({ to, label, storageKey = 'floating-back-button' }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const dragRef = useRef(null);
  const buttonRef = useRef(null);

  function getButtonSize() {
    const rect = buttonRef.current?.getBoundingClientRect();
    return {
      width: rect?.width || 148,
      height: rect?.height || 42
    };
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      setPosition(clampPosition(JSON.parse(raw), getButtonSize()));
    } catch {
      setPosition(DEFAULT_POSITION);
    }
  }, [storageKey]);

  useEffect(() => {
    const syncPosition = () => setPosition((current) => clampPosition(current, getButtonSize()));
    window.addEventListener('resize', syncPosition);
    return () => window.removeEventListener('resize', syncPosition);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(position));
    } catch {
      // Ignore storage failures and keep the default in memory.
    }
  }, [position, storageKey]);

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: position.x,
      startY: position.y,
      moved: false
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragRef.current) return;

    const deltaX = event.clientX - dragRef.current.pointerX;
    const deltaY = event.clientY - dragRef.current.pointerY;
    const next = clampPosition({
      x: dragRef.current.startX + deltaX,
      y: dragRef.current.startY + deltaY
    }, getButtonSize());

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragRef.current.moved = true;
    }

    setPosition(next);
  }

  function handlePointerUp(event) {
    if (!dragRef.current) return;

    const wasDragged = dragRef.current.moved;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (wasDragged) {
      event.preventDefault();
    }
  }

  return (
    <Link
      ref={buttonRef}
      className="floating-back-button"
      to={to}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  );
}
