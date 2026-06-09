import { useEffect, useRef, useState } from 'react';
import { recognizeDigit } from './handwriting/digitRecognizer.js';
import { useCahierT } from './cahierI18n.js';

const MIN_POINT_DISTANCE = 3;

function createPoint(event, rect) {
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function cloneStrokes(strokes) {
  return strokes.map((stroke) => ({
    mode: stroke.mode,
    points: stroke.points.map((point) => ({ x: point.x, y: point.y })),
  }));
}

function simplifyPoints(points) {
  if (points.length < 3) return points;
  const simplified = [points[0]];
  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = simplified[simplified.length - 1];
    const next = points[i + 1];
    if (distance(prev, points[i]) >= MIN_POINT_DISTANCE || distance(points[i], next) >= MIN_POINT_DISTANCE) {
      simplified.push(points[i]);
    }
  }
  simplified.push(points[points.length - 1]);
  return simplified;
}

export default function HandwritingPad({ expectedValue, onRecognized, onClose }) {
  const L = useCahierT();
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const frameRef = useRef(0);
  const [snapshot, setSnapshot] = useState([]);
  const [tool, setTool] = useState('pen');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw(ctx, rect.width, rect.height, strokesRef.current, tool);
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    redraw(ctx, rect.width, rect.height, strokesRef.current, tool);
  }, [snapshot, tool]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  function commitSnapshot() {
    setSnapshot(cloneStrokes(strokesRef.current));
  }

  function schedulePaint() {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      redraw(ctx, rect.width, rect.height, strokesRef.current, tool);
    });
  }

  function startStroke(event) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = createPoint(event, rect);
    canvas.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    setRecognition(null);
    const stroke = { mode: tool, points: [point] };
    strokesRef.current = [...strokesRef.current, stroke];
    currentStrokeRef.current = strokesRef.current.length - 1;
    schedulePaint();
    commitSnapshot();
  }

  function moveStroke(event) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = createPoint(event, rect);
    const strokeIndex = currentStrokeRef.current;
    const stroke = strokesRef.current[strokeIndex];
    if (!stroke) return;
    const lastPoint = stroke.points[stroke.points.length - 1];
    if (distance(lastPoint, point) < MIN_POINT_DISTANCE) return;
    stroke.points.push(point);
    schedulePaint();
  }

  function endStroke(event) {
    canvasRef.current?.releasePointerCapture?.(event.pointerId);
    drawingRef.current = false;
    const strokeIndex = currentStrokeRef.current;
    if (strokeIndex != null && strokesRef.current[strokeIndex]) {
      strokesRef.current[strokeIndex] = {
        ...strokesRef.current[strokeIndex],
        points: simplifyPoints(strokesRef.current[strokeIndex].points),
      };
    }
    currentStrokeRef.current = null;
    commitSnapshot();
    schedulePaint();
  }

  function clearAll() {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setRecognition(null);
    commitSnapshot();
    schedulePaint();
  }

  function recognize() {
    const drawingStrokes = strokesRef.current
      .filter((stroke) => stroke.mode === 'pen')
      .map((stroke) => ({ points: simplifyPoints(stroke.points) }))
      .filter((stroke) => stroke.points.length > 0);
    const result = recognizeDigit(drawingStrokes);
    setRecognition(result);
    if (result.value) onRecognized(result.value, result);
  }

  const hasInk = snapshot.some((stroke) => stroke.mode === 'pen' && stroke.points.length > 0);
  const bestGuess = recognition?.value || recognition?.candidates?.[0]?.digit || '?';

  return (
    <div className="handwriting-pad">
      <div className="handwriting-pad__header">
        <div>
          <strong>{L.t('handwritingTitle')}</strong>
          <p>{L.t('handwritingHelp')}</p>
        </div>
        <button type="button" className="handwriting-pad__close" onClick={onClose} aria-label={L.t('fermer')}>
          ×
        </button>
      </div>

      <div className="handwriting-pad__hero">
        <div className="handwriting-pad__badge">{hasInk ? '1' : '0'} trait</div>
        <div className={`handwriting-pad__preview${recognition?.value ? ' is-success' : ''}`}>
          <span className="handwriting-pad__preview-label">{L.t('jAiLu')}</span>
          <strong>{bestGuess}</strong>
        </div>
      </div>

      <div className="handwriting-pad__board">
        <canvas
          ref={canvasRef}
          className="handwriting-pad__canvas"
          onPointerDown={startStroke}
          onPointerMove={moveStroke}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
          touchAction="none"
        />
      </div>

      <div className="handwriting-pad__toolbar">
        <button type="button" className={`handwriting-tool${tool === 'pen' ? ' is-active' : ''}`} onClick={() => setTool('pen')}>
          ✏️ {L.t('ecrire')}
        </button>
        <button type="button" className={`handwriting-tool${tool === 'erase' ? ' is-active' : ''}`} onClick={() => setTool('erase')}>
          🩹 {L.t('effacer')}
        </button>
        <button type="button" className="handwriting-tool" onClick={clearAll}>
          🧼 {L.t('toutEffacer')}
        </button>
      </div>

      <div className="handwriting-pad__actions">
        <button type="button" className="cahier-cta cahier-cta--soft" onClick={onClose}>
          {L.t('retour')}
        </button>
        <button type="button" className="cahier-cta cahier-cta--go" onClick={recognize} disabled={!hasInk}>
          {L.t('reconnaitre')}
        </button>
      </div>

      <div className="handwriting-pad__status">
        {!recognition && <span className="handwriting-pad__hint">Écris grand au centre, puis appuie sur reconnaître.</span>}
        {recognition?.value && <span>{L.t('jAiLu')} <strong>{recognition.value}</strong></span>}
        {recognition && !recognition.value && <span>{L.t('recognitionRetry')}</span>}
      </div>
    </div>
  );
}

function drawStroke(ctx, points) {
  if (!points.length) return;
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, 6, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

function redraw(ctx, width, height, strokes, tool) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(33, 56, 92, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 28; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.save();
  ctx.strokeStyle = 'rgba(241, 196, 15, 0.24)';
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(width * 0.2, height * 0.12, width * 0.6, height * 0.76);
  ctx.restore();

  for (const stroke of strokes) {
    const points = stroke.points || [];
    if (!points.length) continue;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = stroke.mode === 'erase' ? 26 : 12;
    ctx.strokeStyle = '#21385c';
    ctx.fillStyle = '#21385c';
    ctx.globalCompositeOperation = stroke.mode === 'erase' ? 'destination-out' : 'source-over';
    drawStroke(ctx, points);
    ctx.restore();
  }

  if (tool === 'erase') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 120, 120, 0.12)';
    ctx.fillRect(width - 84, 14, 70, 32);
    ctx.fillStyle = '#c0392b';
    ctx.font = '700 12px Nunito, sans-serif';
    ctx.fillText('Gomme', width - 66, 34);
    ctx.restore();
  }
}
