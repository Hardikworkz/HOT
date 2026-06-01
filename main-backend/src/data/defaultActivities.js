const defaultActivities = [
  {
    id: 1,
    name: "Escape Rooms",
    type: "group",
    slotConfig: { duration: 60, buffer: 30, openTime: "11:00", closeTime: "22:00" },
    pricing: {
      2: { weekday: 1500, weekend: 1700 },
      3: { weekday: 2100, weekend: 2300 },
      4: { weekday: 2800, weekend: 3000 },
      5: { weekday: 3500, weekend: 3700 },
      6: { weekday: 3900, weekend: 4100 },
      7: { weekday: 4200, weekend: 4400 },
      8: { weekday: 4800, weekend: 5000 }
    }
  },
  {
    id: 2,
    name: "VR Gaming",
    type: "package",
    slotConfig: { duration: 30, buffer: 0, openTime: "11:00", closeTime: "22:00" },
    pricing: {
      "15_MINS_PLAY": { weekday: 200, weekend: 250 },
      "30_MINS_PLAY": { weekday: 350, weekend: 400 },
      "META_SHOT_2_OVERS": { weekday: 200, weekend: 200 },
      "META_SHOT_5_OVERS": { weekday: 400, weekend: 400 }
    }
  },
  {
    id: 3,
    name: "Axe Throwing",
    type: "package",
    slotConfig: { duration: 30, buffer: 0, openTime: "11:00", closeTime: "22:00" },
    pricing: {
      "TRIAL_PACKAGE": { weekday: 250, weekend: 300 },
      "30_MIN_1_LANE": { weekday: 800, weekend: 1000 },
      "60_MIN_1_LANE": { weekday: 1500, weekend: 1800 }
    }
  },
  {
    id: 4,
    name: "Remote Control Construction",
    type: "package",
    slotConfig: { duration: 20, buffer: 0, openTime: "11:00", closeTime: "22:00" },
    pricing: {
      "1_RC_VEHICLE": { weekday: 200, weekend: 250 },
      "1_PREMIUM_RC_VEHICLE": { weekday: 350, weekend: 400 },
      "ENTIRE_SAND_PIT": { weekday: 1200, weekend: 1500 }
    }
  },
  {
    id: 5,
    name: "Mini House of Thrill",
    type: "package",
    slotConfig: { duration: 30, buffer: 0, openTime: "11:00", closeTime: "20:00" },
    pricing: {
      "30_MINS_PLAY": { weekday: 200, weekend: 250 },
      "60_MINS_PLAY": { weekday: 350, weekend: 400 },
      "120_MINS_PLAY": { weekday: 600, weekend: 700 }
    }
  }
];

module.exports = defaultActivities;
