

export default function BookingSummary({ activity, date, slot, selection, contact, paymentMethod, guestCount }) {
  if (!activity) return null;
  const priceItem = selection ? activity.pricing?.[selection] : null;
  const weekend = date ? false : false; // keep simple; main app provides pricing logic elsewhere
  const basePrice = priceItem ? (priceItem.weekend ?? priceItem.weekday) : 0;
  const serviceFee = basePrice ? Math.round(basePrice * 0.06) : 0;
  const processingFee = paymentMethod === 'online' ? Math.round(basePrice * 0.03) : 0;
  const totalPayment = basePrice + serviceFee + processingFee;
  const packageLabel = selection ? (activity.name === 'Escape Rooms' ? `Group of ${selection}` : selection.replaceAll('_', ' ')) : '-';
  const categoryLabel = activity.type === 'group' ? 'Group Experience' : 'Package';

  const prettyDate = date ? new Date(date).toLocaleDateString() : '-';

  return (
    <div className="summary-panel">
      <div className="summary-header">
        <div>
          <p className="summary-tag">{categoryLabel}</p>
          <h3>{activity.name}</h3>
        </div>
        <div className="summary-thumb" aria-hidden>{activity.name?.slice(0,2).toUpperCase()}</div>
      </div>

      <div className="spec-grid">
        <div>
          <span className="spec-label">Duration</span>
          <strong>{activity.duration} min</strong>
        </div>
        <div>
          <span className="spec-label">Window</span>
          <strong>{activity.openTime}–{activity.closeTime}</strong>
        </div>
      </div>

      <div className="divider" />

      <div className="summary-list">
        <div className="summary-line"><span>Date</span><strong>{prettyDate}</strong></div>
        <div className="summary-line"><span>Guests</span><strong>{guestCount || '-'}</strong></div>
        <div className="summary-line"><span>Slot</span><strong>{slot || 'No slot selected'}</strong></div>
        <div className="summary-line"><span>Package</span><strong>{packageLabel}</strong></div>
        <div className="summary-line"><span>Payment</span><strong>{paymentMethod === 'online' ? 'Online' : 'Offline'}</strong></div>
      </div>

      <div className="divider" />

      <div className="price-block">
        <div className="price-line"><span>Base price</span><strong>{basePrice ? `Rs. ${basePrice}` : '—'}</strong></div>
        <div className="price-line"><span>Service fee</span><strong>{serviceFee ? `Rs. ${serviceFee}` : 'Rs. 0'}</strong></div>
        <div className="price-line"><span>{paymentMethod === 'online' ? 'Online processing' : 'Offline service'}</span><strong>{processingFee ? `Rs. ${processingFee}` : 'Rs. 0'}</strong></div>
      </div>

      <div className="divider thick" />

      <div className="price-total"><span>Total payment</span><strong>Rs. {totalPayment}</strong></div>
    </div>
  );
}
