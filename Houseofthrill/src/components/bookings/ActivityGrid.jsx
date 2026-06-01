export default function ActivityGrid({ activities, selectedActivityId, onSelect }) {
  return (
    <section className="activity-grid">
      {activities.map((activity) => (
        <button
          key={activity.id}
          type="button"
          className={`activity-card ${selectedActivityId === activity.id ? 'selected' : ''}`}
          onClick={() => onSelect(activity)}
        >
          <div className="activity-visual">
            <div className="activity-shade">
              <span>{activity.imageLabel || activity.title?.slice(0, 2)}</span>
            </div>
          </div>
          <div className="activity-content">
            <span className="activity-subtitle">{activity.subtitle}</span>
            <h3 className="activity-title">{activity.title}</h3>
            <p className="activity-description">{activity.description}</p>
            <div className="activity-price">{activity.price ? `From ${activity.price.toLocaleString('en-IN')}₹` : 'Starting from Rs. 0'}</div>
          </div>
        </button>
      ))}
    </section>
  );
}
