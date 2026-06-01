const { isWeekend } = require('./time');

const getBucketPrice = (pricingMap, key, weekend) => {
  const entry = pricingMap?.[key];
  if (!entry) {
    const err = new Error(`Invalid pricing key: ${key}`);
    err.statusCode = 400;
    throw err;
  }
  const amount = weekend ? entry.weekend : entry.weekday;
  if (typeof amount !== "number") {
    const err = new Error(`Invalid price config for key: ${key}`);
    err.statusCode = 400;
    throw err;
  }
  return amount;
};

const calculatePrice = ({ activity, date, groupSize, packageType }) => {
  const weekend = isWeekend(date);
  const name = activity?.name;

  if (!name || !activity?.pricing) {
    const err = new Error("Activity pricing configuration missing");
    err.statusCode = 400;
    throw err;
  }

  if (name === "Escape Rooms") {
    return getBucketPrice(activity.pricing, String(groupSize), weekend);
  }

  if (name === "VR Gaming" || name === "Axe Throwing" || name === "Remote Control Construction") {
    return getBucketPrice(activity.pricing, String(packageType), weekend);
  }

  // Generic fallback for future package-based activities.
  if (packageType) return getBucketPrice(activity.pricing, String(packageType), weekend);
  if (groupSize) return getBucketPrice(activity.pricing, String(groupSize), weekend);

  const err = new Error(`Unsupported activity pricing flow: ${name}`);
  err.statusCode = 400;
  throw err;
};

module.exports = calculatePrice;
