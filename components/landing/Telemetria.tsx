const readouts = [
  { value: '< 3 s', label: 'Inferencia YOLOv8' },
  { value: '85 %', label: 'Umbral de llenado' },
  { value: '320 ms', label: 'Latencia media HTTP' },
  { value: '5 min', label: 'Muestreo de nivel' },
  { value: '4', label: 'Categorías de residuo' },
  { value: 'TLS 8883', label: 'MQTT cifrado' },
];

export default function Telemetria() {
  return (
    <section className="telemetry" aria-label="Especificaciones del sistema">
      <div className="telemetry__row">
        {readouts.map((r) => (
          <div className="readout" key={r.label}>
            <span className="readout__value">{r.value}</span>
            <span className="readout__label">{r.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
