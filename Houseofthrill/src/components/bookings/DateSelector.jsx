export default function DateSelector({ value, onChange }) {
  const minDate = new Date().toISOString().slice(0,10);
  const addDays = (d, days) => {
    const next = new Date(`${d}T00:00:00`);
    next.setDate(next.getDate() + days);
    return next.toISOString().slice(0,10);
  };
  const quickOptions = [
    { label: 'Today', value: minDate },
    { label: 'Tomorrow', value: addDays(minDate, 1) },
  ];

  return (
    <div className="panel">
      <label className="label" htmlFor="booking-date">Select Date</label>
      <div className="date-quick-picks">
        {quickOptions.map(o => (
          <button key={o.label} type="button" className={`date-chip ${value===o.value ? 'selected' : ''}`} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
      <input id="booking-date" className="input" type="date" min={minDate} value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}
