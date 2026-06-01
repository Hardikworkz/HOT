import { useMemo } from 'react';

const toMinutes = (time) => {
  const [h,m] = time.split(':').map(Number);
  return h*60+m;
};
const toTime = (mins) => {
  const h = Math.floor(mins/60); const m = mins%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
};

const generateAllSlots = (slotConfig) => {
  if (!slotConfig) return [];
  const start = toMinutes(slotConfig.openTime);
  const end = toMinutes(slotConfig.closeTime);
  const duration = Number(slotConfig.duration);
  const buffer = Number(slotConfig.buffer);
  const interval = duration + buffer;
  const slots = [];
  for (let t = start; t + duration <= end; t += interval) slots.push(toTime(t));
  return slots;
};

export default function SlotSelector({ activity, date, availableSlots, selectedSlot, onSelect, loading }) {
  const allSlots = useMemo(()=>generateAllSlots(activity?.slotConfig), [activity]);
  if (!activity) return null;
  return (
    <div className="panel">
      <div className="panel-header"><h4>Pick a Slot</h4>{loading && <span className="muted">Loading slots...</span>}</div>
      <div className="slot-grid">
        {allSlots.map(slot => {
          const past = new Date(`${date}T${slot}:00`) < new Date();
          const available = availableSlots.includes(slot);
          const disabled = past || !available;
          const stateClass = past ? 'past' : available ? 'available' : 'booked';
          const selected = selectedSlot === slot;
          return (
            <button key={slot} type="button" disabled={disabled} className={`slot-btn ${stateClass} ${selected ? 'selected' : ''}`} onClick={() => onSelect(slot)}>{slot}</button>
          );
        })}
      </div>
      <div className="slot-legend"><span><i className="legend available"/> Available</span><span><i className="legend booked"/> Booked</span><span><i className="legend past"/> Past</span></div>
    </div>
  );
}
