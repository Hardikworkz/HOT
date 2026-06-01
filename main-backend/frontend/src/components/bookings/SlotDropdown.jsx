import { useMemo, useState } from 'react';

export default function SlotDropdown({ availableSlots, selectedSlot, onSelect, loading }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const slots = useMemo(() => [...(availableSlots || [])].sort(), [availableSlots]);

  return (
    <div className="panel slot-dropdown-panel" tabIndex={0} onBlur={() => setMenuOpen(false)}>
      <div className="panel-header">
        <h4>Available Slots</h4>
        {loading && <span className="muted">Refreshing availability…</span>}
      </div>

      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setMenuOpen((s) => !s)}
      >
        <span>{selectedSlot || 'Select a time slot'}</span>
        <span className="dropdown-arrow">▾</span>
      </button>

      {menuOpen && (
        <div className="dropdown-menu">
          {slots.length ? (
            slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`dropdown-item ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(slot);
                  setMenuOpen(false);
                }}
              >
                {slot}
              </button>
            ))
          ) : (
            <div className="dropdown-empty">No available slots for this date.</div>
          )}
        </div>
      )}
    </div>
  );
}
