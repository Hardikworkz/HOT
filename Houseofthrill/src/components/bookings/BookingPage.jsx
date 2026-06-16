import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { createBookingWithActivity } from '../../lib/api';
import { getActivities, getSlots } from '../../lib/bookingData';

// ─── Data ─────────────────────────────────────────────────────────────────────

const tierOptions = [
  {
    id: 'escape-room',
    title: 'Escape Room',
    price: 'Rs. 1500+',
    // SEO: Escape room experience Bhopal — immersive puzzle adventure
    description:
      'Bhopal\'s most immersive puzzle adventure. Step inside a fully themed cinematic chamber, decode hidden clues, and race against the clock in a live, actor-free escape room experience built for thrill seekers.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    alt: 'Dark atmospheric escape room with dramatic lighting and puzzle elements.',
  },
  {
    id: 'axe-throwing',
    title: 'Axe Throwing',
    price: 'Rs. 1500+',
    // SEO: Axe throwing Bhopal — best group activity for corporate & friends
    description:
      'Bhopal\'s premier axe throwing lane — no experience needed. Under expert supervision, hurl a real axe at a bullseye target and feel the rush. The ultimate group activity for birthdays, corporates, and casual hangouts.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    alt: 'Rustic axe throwing range with wooden bullseye targets and dramatic lighting.',
  },

  {
    id: 'virtual-reality',
    title: 'Virtual Reality',
    price: 'Rs. 1500+',
    // SEO: VR gaming Bhopal — virtual reality experience center
    description:
      'Enter next-generation virtual worlds with Bhopal\'s most advanced VR setup. From heart-pounding horror to multiplayer combat arenas — our curated VR library guarantees a 360° rush you can\'t find anywhere else in the city.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&q=80',
    alt: 'Person wearing VR headset immersed in a futuristic virtual reality environment.',
  },
  {
    id: 'rc-truck-controller',
    title: 'RC Truck Controller',
    price: 'Rs. 1500+',
    // SEO: RC truck experience Bhopal — remote control obstacle course
    description:
      'Command high-performance, large-scale remote control trucks across custom obstacle tracks and rugged terrain courses. A crowd favourite for kids and adults alike — pure mechanical adrenaline without leaving the floor.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    alt: 'Large scale remote control truck navigating a challenging obstacle course terrain.',
  },
    {
    id: 'mini-house-of-thrill',
    title: 'Mini House of Thrill',
    // SEO: Kids play area Bhopal — indoor play zone for children near Vande Matram Square
    price: 'Rs. 200+',
    description:
      "Bhopal's most vibrant indoor kids play area — open all days, 11 AM to 10 PM. A fully safe, supervised play zone designed for children, with colourful obstacle courses, soft play structures, and non-stop fun. Perfect for birthday parties, family outings, and summer holidays.",
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    alt: 'Colourful indoor kids play area with soft play structures and bright climbing zones.',
    badge: 'Kids Special',
    isKids: true,
  }
];

const ACTIVITY_TIER_NAME_MAP = {
  'escape-room': 'Escape Rooms',
  'axe-throwing': 'Axe Throwing',
  'virtual-reality': 'VR Gaming',
  'rc-truck-controller': 'Remote Control Construction',
  'mini-house-of-thrill': 'Mini House of Thrill',
};

const FALLBACK_ACTIVITIES = [
  {
    id: 1,
    name: 'Escape Rooms',
    type: 'group',
    slotConfig: { duration: 60, buffer: 30, openTime: '11:00', closeTime: '22:00' },
    pricing: {
      2: { weekday: 1500, weekend: 1700 },
      3: { weekday: 2100, weekend: 2300 },
      4: { weekday: 2800, weekend: 3000 },
      5: { weekday: 3500, weekend: 3700 },
      6: { weekday: 3900, weekend: 4100 },
      7: { weekday: 4200, weekend: 4400 },
      8: { weekday: 4800, weekend: 5000 },
    },
  },
  {
    id: 2,
    name: 'VR Gaming',
    type: 'package',
    slotConfig: { duration: 30, buffer: 0, openTime: '11:00', closeTime: '22:00' },
    pricing: {
      '15_MINS_PLAY': { weekday: 200, weekend: 250 },
      '30_MINS_PLAY': { weekday: 350, weekend: 400 },
      'META_SHOT_2_OVERS': { weekday: 200, weekend: 200 },
      'META_SHOT_5_OVERS': { weekday: 400, weekend: 400 },
    },
  },
  {
    id: 3,
    name: 'Axe Throwing',
    type: 'package',
    slotConfig: { duration: 30, buffer: 0, openTime: '11:00', closeTime: '22:00' },
    pricing: {
      'TRIAL_PACKAGE': { weekday: 250, weekend: 300 },
      '30_MIN_1_LANE': { weekday: 800, weekend: 1000 },
      '60_MIN_1_LANE': { weekday: 1500, weekend: 1800 },
    },
  },
  {
    id: 4,
    name: 'Remote Control Construction',
    type: 'package',
    slotConfig: { duration: 20, buffer: 0, openTime: '11:00', closeTime: '22:00' },
    pricing: {
      '1_RC_VEHICLE': { weekday: 200, weekend: 250 },
      '1_PREMIUM_RC_VEHICLE': { weekday: 350, weekend: 400 },
      'ENTIRE_SAND_PIT': { weekday: 1200, weekend: 1500 },
    },
  },
  {
    id: 5,
    name: 'Mini House of Thrill',
    type: 'package',
    slotConfig: { duration: 30, buffer: 0, openTime: '11:00', closeTime: '20:00' },
    pricing: {
      '30_MINS_PLAY': { weekday: 200, weekend: 250 },
      '60_MINS_PLAY': { weekday: 350, weekend: 400 },
      '120_MINS_PLAY': { weekday: 600, weekend: 700 },
    },
  },
];

const GUEST_LIMITS_BY_TIER = {
  'escape-room': { min: 2, max: 8 },
  'axe-throwing': { min: 1, max: 4 },
  'virtual-reality': { min: 1, max: 1 },
  'rc-truck-controller': { min: 1, max: 1 }, 
  'mini-house-of-thrill': { min: 1, max: 1 },
};

// ─── New escape room themes (images hosted via the actual uploaded poster crops)
// Using Unsplash stand-ins that match each theme's visual language.
// Replace src values with your CDN URLs once images are uploaded.
const escapeRoomOptions = [
  {
    id: 'raja-bhoj-khazana',
    title: 'Raja Bhoj ka Khazana',
    tagline: 'The Lost Treasure of Bhojpur',
    description:
      'Ancient secrets lie sealed beneath the ruins of Bhojpur. Decipher royal inscriptions, navigate mythic traps, and claim the lost khazana of Raja Bhoj before the chamber buries its truth forever.',
    // Warm temple-treasure aesthetic — replace with your actual poster CDN URL
    image: 'https://images.unsplash.com/photo-1608178398319-48f814d0750c?w=900&q=85',
    alt: 'Ancient temple ruins with golden treasure chest illuminated by torchlight.',
    difficulty: 'Medium',
    duration: '60 min',
    theme: 'Historical Mystery',
  },
  {
    id: 'prison-escape',
    title: 'Prison Escape',
    tagline: 'Break the Bars. Beat the System.',
    description:
      'Wrongfully locked inside a crumbling jailhouse, you have one hour to outsmart the system. Find hidden contraband clues, bribe your way past dead ends, and break free before the warden returns.',
    // Gritty prison corridor — replace with your actual poster CDN URL
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=900&q=85',
    alt: 'Dark prison corridor with iron bars and a single overhead light.',
    difficulty: 'Hard',
    duration: '60 min',
    theme: 'Crime & Thriller',
  },
  {
    id: 'bhopal-final-countdown',
    title: 'Bhopal: The Final Countdown',
    tagline: 'Save the City. Stop the Countdown.',
    description:
      'A biohazard breach in Lab 07 has triggered a 60-minute city-wide countdown. Suit up, trace the contamination trail through a classified underground facility, and shut down the reactor before Bhopal goes dark.',
    // Industrial hazmat lab — replace with your actual poster CDN URL
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85',
    alt: 'Hazmat warning signs and blinking countdown display inside a dark industrial lab.',
    difficulty: 'Expert',
    duration: '60 min',
    theme: 'Sci-Fi · Bio-Thriller',
  },
];

// ─── Per-package descriptions for non-escape-room session size cards ──────────
// Key format: `${activityName}::${packageKey}`
// activityName matches selectedActivity.name from the API
const PACKAGE_DESCRIPTIONS = {
 
  // ── Axe Throwing ──────────────────────────────────────────────────────────
  'Axe Throwing::30_MIN_1_LANE':
    'One lane, 30 minutes, one target. Ideal for a solo challenger or a duo competing head-to-head. Coach included — no prior experience required.',
  'Axe Throwing::60_MIN_1_LANE':
    'A full hour on one lane — enough time to master your grip, dial in your release, and make it a proper competitive session with friends.',
  'Axe Throwing::30_MIN_2_LANES':
    'Two lanes side by side for 30 minutes. Best for groups of 3–4 who want to compete simultaneously with bragging rights on the line.',
  'Axe Throwing::60_MIN_2_LANES':
    'Two lanes, a full hour — the complete axe throwing experience for parties. Run your own mini tournament with coached throwing and open play.',

  // ── VR Gaming ─────────────────────────────────────────────────────────────
  'VR Gaming::30_MINS_PLAY':
    '30 minutes of solo immersion in any world from our curated VR library — from free-roam horror to high-altitude adventure. No motion-sickness guarantee on selected titles.',
  'VR Gaming::60_MINS_PLAY':
    'A full hour of uninterrupted VR. Enough time to try two or three experiences, or go deep into a single narrative game. Best for first-timers who want the full ride.',
  'VR Gaming::MULTIPLAYER_SESSION':
    'A shared multiplayer session for friends in adjacent rigs. Compete, co-operate, or battle — synced lobbies let everyone play inside the same virtual arena simultaneously.',

  // ── RC Truck / Remote Control Construction ────────────────────────────────
  'Remote Control Construction::1_RC_VEHICLE':
    'Solo control of one large-scale RC truck across our custom obstacle terrain. Perfect for a first-timer wanting to learn the controls and run a full course lap.',
  'Remote Control Construction::2_RC_VEHICLES':
    'Two trucks, two drivers, one course. Race a friend, attempt tandem obstacles, or just see who navigates the terrain faster.',
  'Remote Control Construction::GROUP_SESSION':
    'Fleet control for groups — multiple trucks, a full course, and timed lap scoring. Great for corporate team outings or group birthday experiences.',

  // ── Mini House of Thrill (Kids Play Area) ─────────────────────────────────
  'Mini House of Thrill::30_MINS_PLAY':
    '30 minutes of free play in the full kids zone — soft obstacle courses, climbing structures, and ball pits. Ideal for younger children getting their first taste of the Mini House.',
  'Mini House of Thrill::60_MINS_PLAY':
    'A full hour in the play area — enough time for kids to explore every zone, make new friends, and burn real energy. Most popular session for families on a casual outing.',
  'Mini House of Thrill::120_MINS_PLAY':
    'The complete 2-hour experience — maximum play time for birthday parties, group school visits, or families wanting to spend a full afternoon. Includes a dedicated play coordinator.',
};

function getPackageDescription(activityName, packageKey) {
  const mapKey = `${activityName}::${packageKey}`;
  if (PACKAGE_DESCRIPTIONS[mapKey]) return PACKAGE_DESCRIPTIONS[mapKey];
  // Graceful fallback — still better than the tier-level SEO blurb
  return `Your ${formatPackageLabel(packageKey)} session. Pricing shown reflects your selected date — weekday and weekend rates may differ.`;
}

function formatCurrency(value) {
  return `Rs. ${value?.toLocaleString('en-IN') || '0'}`;
}

function formatPackageLabel(key, activityType = 'package') {
  const stringKey = String(key);
  if (/^\d+$/.test(stringKey)) {
    return `${stringKey} Guests`;
  }
  const formatted = stringKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
  return formatted || `${activityType} Package`;
}

function resolvePackagePrice(pricingValue, isWeekend) {
  if (typeof pricingValue === 'number') return pricingValue;
  if (pricingValue && typeof pricingValue === 'object') {
    if (isWeekend && typeof pricingValue.weekend === 'number') return pricingValue.weekend;
    if (typeof pricingValue.weekday === 'number') return pricingValue.weekday;
    if (typeof pricingValue.weekend === 'number') return pricingValue.weekend;
  }
  return 0;
}

function resolveFixedSessionBaseKey(activityName) {
  if (activityName === 'VR Gaming') return '30_MINS_PLAY';
  if (activityName === 'Axe Throwing') return '30_MIN_1_LANE';
  if (activityName === 'Remote Control Construction') return '1_RC_VEHICLE';
  return null;
}

function getPackageDurationFromKey(key, fallback = 30) {
  const match = String(key).match(/(\d+)(?:_MIN(?:S)?|_MINS?_PLAY)/i);
  if (match) return Number(match[1]);
  return fallback;
}

function resolveDynamicSessionPricing(activity, guests, isWeekend) {
  if (!activity?.pricing) {
    return { totalPrice: 0, weekdayPrice: 0, weekendPrice: 0, perGuestPrice: 0, baseKey: null };
  }

  if (activity.name === 'Escape Rooms') {
    const pricingValue = activity.pricing[String(guests)] || Object.values(activity.pricing)[0];
    const weekdayPrice = typeof pricingValue === 'object' ? Number(pricingValue.weekday || 0) : Number(pricingValue || 0);
    const weekendPrice = typeof pricingValue === 'object' ? Number(pricingValue.weekend || 0) : Number(pricingValue || 0);
    return {
      totalPrice: resolvePackagePrice(pricingValue, isWeekend),
      weekdayPrice,
      weekendPrice,
      perGuestPrice: isWeekend ? weekendPrice : weekdayPrice,
      baseKey: String(guests),
    };
  }

  const baseKey = resolveFixedSessionBaseKey(activity.name);
  const basePricing = baseKey ? activity.pricing[baseKey] : Object.values(activity.pricing)[0];
  const weekdayPrice = typeof basePricing === 'object' ? Number(basePricing.weekday || 0) : Number(basePricing || 0);
  const weekendPrice = typeof basePricing === 'object' ? Number(basePricing.weekend || 0) : Number(basePricing || 0);
  const perGuestPrice = isWeekend ? weekendPrice : weekdayPrice;

  return {
    totalPrice: perGuestPrice * guests,
    weekdayPrice,
    weekendPrice,
    perGuestPrice,
    baseKey,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UnderlineField({ label, type = 'text', value, placeholder, onChange, required, showRequired }) {
  return (
    <div className="w-full">
      <span
        className="block text-[10px] sm:text-[11px] tracking-widest font-sans font-semibold uppercase mb-2 sm:mb-3"
        style={{ color: 'rgba(17,63,49,0.45)' }}
      >
        {label}
      </span>
      <div
        className="relative border-b pb-2 sm:pb-3 transition-colors"
        style={{ borderBottom: '1px solid #184E4A' }}
      >
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-[#113f31] transition-colors"
          style={{ fontFamily: "'Georgia', serif", fontSize: 'clamp(14px, 1.8vw, 20px)' }}
        />
      </div>
      {showRequired && required && !value && (
        <span className="text-[10px] sm:text-[11px] font-sans text-red-600 mt-1 block">required</span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingPage() {
  const { user } = useAuth();
  const { activity: activityParam } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [guests, setGuests] = useState(2);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [currentStep, setCurrentStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showRequired, setShowRequired] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dateMenuRef = useRef(null);
  const timeMenuRef = useRef(null);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(date));

  const isEscapeRoom = selectedTier?.id === 'escape-room';
  const totalSteps = 4;
  const resolvedActivities = activities.length ? activities : FALLBACK_ACTIVITIES;

  const activitiesWithFallback = useMemo(() => {
    if (!resolvedActivities?.length) return [];
    return resolvedActivities.map((a) => ({
      id: a.id,
      title: a.name || 'Experience',
      description: a.description || 'A premium curated experience.',
      price:
        a.pricing && Object.values(a.pricing)[0]
          ? Object.values(a.pricing)[0].weekday || Object.values(a.pricing)[0].weekend || 0
          : 0,
      type: a.type || 'package',
    }));
  }, [resolvedActivities]);

  useEffect(() => {
    if (user?.email) {
      setContact((prev) => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    setPageLoading(true);
    getActivities()
      .then((data) => { if (active) setActivities(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (active) setPageLoading(false); });
    return () => { active = false; };
  }, []);

  // Pre-select tier from URL parameter
  useEffect(() => {
    if (activityParam && tierOptions.length > 0) {
      const matchedTier = tierOptions.find((tier) => tier.id === activityParam);
      if (matchedTier) {
        setSelectedTier(matchedTier);
        // Reset other selections to ensure fresh booking flow
        setSelectedRoom(null);
        setSelectedSlot('');
        setCurrentStep(1);
      }
    }
  }, [activityParam]);

  const findMatchingActivityForTier = (tierId, activityList = []) => {
    const expectedName = ACTIVITY_TIER_NAME_MAP[tierId];
    return activityList.find(
      (activity) => activity.name === expectedName || String(activity.id) === String(tierId)
    );
  };

  useEffect(() => {
    if (!resolvedActivities?.length) return;
    if (selectedTier?.id) {
      const matched = findMatchingActivityForTier(selectedTier.id, resolvedActivities);
      if (matched && matched.id !== selectedActivity?.id) {
        setSelectedActivity(matched);
        setSelectedSlot('');
      }
      return;
    }
    if (!selectedActivity) {
      setSelectedActivity(resolvedActivities[0]);
    }
  }, [resolvedActivities, selectedTier, selectedActivity]);

  useEffect(() => {
    if (!selectedActivity?.id) return;
    let active = true;
    setSlotsLoading(true);
    getSlots({ activityId: selectedActivity.id, date })
      .then((slots) => { if (active) setAvailableSlots(Array.isArray(slots) ? slots : []); })
      .catch(() => { if (active) setAvailableSlots([]); })
      .finally(() => { if (active) setSlotsLoading(false); });
    return () => { active = false; };
  }, [selectedActivity?.id, date]);

  const { min: minGuests, max: maxGuests } = selectedTier?.id
    ? GUEST_LIMITS_BY_TIER[selectedTier.id] || { min: 1, max: 12 }
    : selectedActivity?.type === 'group'
    ? { min: 2, max: 8 }
    : { min: 1, max: 12 };

  const isStep1Complete = Boolean(selectedTier);
  const isPackageStepComplete = Boolean(selectedRoom);
  const isContactComplete = Boolean(
    contact.name.trim() && contact.email.trim() && contact.phone.trim()
  );
  const isLogisticsComplete = Boolean(
    date && selectedSlot && selectedRoom && guests >= minGuests && guests <= maxGuests
  );
  const isDetailsComplete = isContactComplete && isLogisticsComplete;

  const normalizedSlots = useMemo(
    () => availableSlots.map((s) => (typeof s === 'string' ? s : s?.time || s?.label || String(s))),
    [availableSlots]
  );

  const selectedDate = useMemo(() => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [date]);

  const selectedActivityOptions = useMemo(() => {
    if (!selectedActivity?.pricing) return [];

    const isWeekend = [0, 6].includes(selectedDate.getDay());
    const operatingHours = `${selectedActivity.slotConfig?.openTime || '11:00'} – ${selectedActivity.slotConfig?.closeTime || '22:00'}`;

    if (selectedActivity.name === 'Escape Rooms') {
      const pricingValue =
        selectedActivity.pricing[String(guests)] ||
        selectedActivity.pricing[String(Math.max(minGuests, Math.min(maxGuests, guests)))] ||
        Object.values(selectedActivity.pricing)[0];
      const weekdayPrice = typeof pricingValue === 'object' ? pricingValue.weekday : pricingValue;
      const weekendPrice = typeof pricingValue === 'object' ? pricingValue.weekend : pricingValue;

      return escapeRoomOptions.map((room) => ({
        ...room,
        price: resolvePackagePrice(pricingValue, isWeekend),
        priceText:
          typeof pricingValue === 'object'
            ? `${formatCurrency(pricingValue.weekday)} weekday • ${formatCurrency(pricingValue.weekend)} weekend`
            : formatCurrency(resolvePackagePrice(pricingValue, isWeekend)),
        weekdayPrice,
        weekendPrice,
        guestCount: guests,
        duration: room.duration,
        buffer: selectedActivity.slotConfig?.buffer || 30,
        operatingHours,
        description: room.description,
        type: selectedActivity.type,
        activityId: selectedActivity.id,
        activityName: selectedActivity.name,
      }));
    }

    return Object.entries(selectedActivity.pricing).map(([key, pricingValue]) => {
      const weekdayPrice =
        typeof pricingValue === 'object' ? Number(pricingValue.weekday || 0) : Number(pricingValue || 0);
      const weekendPrice =
        typeof pricingValue === 'object' ? Number(pricingValue.weekend || 0) : Number(pricingValue || 0);
      const currentPrice = isWeekend ? weekendPrice : weekdayPrice;

      return {
        id: key,
        label: formatPackageLabel(key, selectedActivity.type),
        title: `${selectedActivity.name} • ${formatPackageLabel(key, selectedActivity.type)}`,
        price: currentPrice,
        priceText: `${formatCurrency(weekdayPrice)} weekday • ${formatCurrency(weekendPrice)} weekend`,
        weekdayPrice,
        weekendPrice,
        guestCount: guests,
        duration: getPackageDurationFromKey(key, selectedActivity.slotConfig?.duration || 30),
        buffer: selectedActivity.slotConfig?.buffer || 0,
        operatingHours,
        description: getPackageDescription(selectedActivity.name, key),
        type: selectedActivity.type,
        activityId: selectedActivity.id,
        activityName: selectedActivity.name,
      };
    });
  }, [selectedActivity, selectedDate, guests, minGuests, maxGuests]);

  const formattedDateLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [selectedDate]
  );

  const calendarMonthLabel = useMemo(
    () => calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [calendarMonth]
  );

  const calendarWeeks = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const monthStart = new Date(year, month, 1);
    const startDay = monthStart.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = 0; i < startDay; i += 1) {
      cells.push({ day: daysInPrevMonth - startDay + 1 + i, monthOffset: -1 });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, monthOffset: 0 });
    }
    const trailing = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= trailing; day += 1) {
      cells.push({ day, monthOffset: 1 });
    }

    return Array.from({ length: cells.length / 7 }, (_, rowIndex) =>
      cells.slice(rowIndex * 7, rowIndex * 7 + 7)
    );
  }, [calendarMonth]);

  useEffect(() => {
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedActivity?.id) {
      setSelectedRoom(null);
      return;
    }
    const currentActivityId = selectedActivity.id;
    if (!selectedRoom || String(selectedRoom.activityId) !== String(currentActivityId)) {
      const firstOption = selectedActivityOptions[0];
      setSelectedRoom(firstOption || null);
      setActiveSlideIndex(0);
      if (firstOption?.guestCount) {
        setGuests(firstOption.guestCount);
      }
    }
  }, [selectedActivity, selectedActivityOptions, selectedRoom]);

  useEffect(() => {
    if (!selectedRoom?.id || !selectedActivityOptions.length) return;
    const refreshedOption = selectedActivityOptions.find((option) => option.id === selectedRoom.id);
    if (!refreshedOption) return;
    setSelectedRoom((current) => {
      if (!current) return refreshedOption;
      if (
        current.price !== refreshedOption.price ||
        current.priceText !== refreshedOption.priceText ||
        current.description !== refreshedOption.description
      ) {
        return refreshedOption;
      }
      return current;
    });
  }, [selectedActivityOptions, selectedRoom?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateMenuOpen && dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setDateMenuOpen(false);
      }
      if (timeMenuOpen && timeMenuRef.current && !timeMenuRef.current.contains(event.target)) {
        setTimeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dateMenuOpen, timeMenuOpen]);

  useEffect(() => {
    setGuests((value) => Math.min(maxGuests, Math.max(minGuests, value)));
  }, [minGuests, maxGuests]);

  const stepReady = useMemo(() => {
    if (currentStep === 1) return isStep1Complete;
    if (currentStep === 2) return isPackageStepComplete;
    if (currentStep === 3) return isDetailsComplete;
    return true;
  }, [currentStep, isStep1Complete, isPackageStepComplete, isDetailsComplete]);

  const estimatedPackagePrice =
    selectedRoom?.price ??
    resolveDynamicSessionPricing(selectedActivity, guests, [0, 6].includes(selectedDate.getDay()))
      .totalPrice;
  const costLabel =
    selectedRoom || selectedActivity ? formatCurrency(estimatedPackagePrice) : '0';

  const handleExit = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleNext = async () => {
    if (!stepReady) { setShowRequired(true); return; }
    setShowRequired(false);
    if (currentStep === totalSteps) {
      setBookingLoading(true);
      setError(''); setSuccess('');
      try {
        await createBookingWithActivity({
          activityId: selectedActivity?.id,
          date,
          timeSlot: selectedSlot,
          contact,
          groupSize: guests,
          packageType: selectedRoom?.id,
          paymentMethod,
          notes: `Booking for ${selectedTier?.title}${selectedRoom ? ` — ${selectedRoom.title}` : ''} from ${contact.name}`,
        });
        setSuccess('Your booking is confirmed. A confirmation has been sent to your inbox.');
      } catch (err) {
        setError(err?.message || 'Unable to complete booking. Please try again.');
      } finally { setBookingLoading(false); }
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) { setShowRequired(false); setCurrentStep((s) => s - 1); }
  };
  const goToSlide = (idx) => setActiveSlideIndex(idx);
  const nextSlide = () => goToSlide((activeSlideIndex + 1) % Math.max(selectedActivityOptions.length, 1));
  const prevSlide = () =>
    goToSlide(
      (activeSlideIndex - 1 + Math.max(selectedActivityOptions.length, 1)) %
        Math.max(selectedActivityOptions.length, 1)
    );

  const isPackageSelectionStep = currentStep === 2;
  const isDetailsStep = currentStep === 3;
  const isReviewStep = currentStep === totalSteps;
  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const currentTierImage = tierOptions.find((t) => t.id === selectedTier?.id)?.image || '';
  const currentTierAlt = tierOptions.find((t) => t.id === selectedTier?.id)?.alt || '';

  if (pageLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: '#f4f0ea' }}>
        <p className="text-[#113f31] font-serif text-base sm:text-lg tracking-wide animate-pulse">
          Loading experience environment…
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen max-w-full flex flex-col overflow-x-hidden relative"
      style={{
        background: '#f4f0ea',
        color: '#113f31',
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">

        {/* ══════════════════════════════════════════════════════
            STEP 1 — Activity Selection
        ════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="flex flex-col w-full h-full px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-3">

            {/* Header row */}
            <div className="flex items-center justify-between mt-6 sm:mt-10 mb-5 sm:mb-7">
              <button
                type="button"
                onClick={handleExit}
                className="flex items-center gap-1.5 flex-shrink-0 transition-opacity hover:opacity-100"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'rgba(17,63,49,0.55)',
                  opacity: 0.75,
                }}
              >
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 border rounded-full flex items-center justify-center"
                  style={{ fontSize: '8px', borderColor: 'rgba(17,63,49,0.4)' }}
                >
                  ✕
                </span>
                <span className="hidden sm:inline">Exit</span>
              </button>
              <h1
                className="flex-1 text-center font-serif font-normal text-[#113f31] px-2"
                style={{ fontSize: 'clamp(18px, 3.5vw, 45px)' }}
              >
                Choose your <em className="italic font-normal">activity</em> *
              </h1>
              <div className="flex-shrink-0 w-8 sm:w-16" />
            </div>

            {/* Card row */}
            <div className="flex-1 min-h-0 flex flex-col justify-center ">
              <div
                className="flex flex-row gap-3 sm:gap-5 pb-3 sm:pb-4 items-stretch"
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  height: 'clamp(500px, 55vh, 500px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(17,63,49,0.15) transparent',
                  WebkitOverflowScrolling: 'touch',
                  alignItems: 'center'
                }}
              >
                {tierOptions.map((tier) => {
                  const isSelected = selectedTier?.id === tier.id;
                  return (
                    <label
                      key={tier.id}
                      className="flex-shrink-0 cursor-pointer block transition-all duration-300 hover:-translate-y-1"
                      style={{
                        width: 'clamp(440px, 28vw, 420px)',
                        height: 'clamp(420px, 38vh, 420px)',
                      }}
                    >
                      <input
                        type="radio"
                        name="activity-tier"
                        className="sr-only"
                        value={tier.id}
                        checked={isSelected}
                        onChange={() => setSelectedTier(tier)}
                      />
                      <div
                        className="h-full flex flex-col rounded-xl overflow-hidden transition-all duration-300 p-4 sm:p-5 hover:border
                          hover:border-[#113f31]/30"
                        style={{
                          background: '#ece7e0',
                          boxShadow: isSelected
                            ? '0 0 0 2px #ece7e0, 0 8px 24px rgba(17,63,49,0.12)'
                            : '0 0 0 1px transparent',
                          transform: isSelected ? 'translateY(-4px)' : 'translateY(0px)',
                        }}
                      >
                        {/* Image */}
                        <div
                          className="w-full overflow-hidden flex-shrink-0 rounded-lg"
                          style={{ aspectRatio: '16/10' }}
                        >
                          <img
                            src={tier.image}
                            alt={tier.alt}
                            className="w-full h-full object-cover transition-transform duration-500"
                            style={{
                              transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                              filter: isSelected ? 'brightness(1)' : 'brightness(0.93)',
                            }}
                          />
                        </div>
                        {/* Body */}
                        <div className="flex flex-col flex-1 pt-3 sm:pt-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4
                              className="font-serif font-normal text-[#113f31] leading-tight italic"
                              style={{ fontSize: 'clamp(14px, 1.5vw, 22px)' }}
                            >
                              {tier.title}
                            </h4>
                            {isSelected && (
                              <span
                                className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                                style={{ background: '#113f31' }}
                              >
                                <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                                  <path
                                    d="M1 4L3.5 6.5L9 1"
                                    stroke="#f4f0ea"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p
                            className="leading-relaxed flex-1"
                            style={{
                              fontSize: 'clamp(11px, 1vw, 13px)',
                              color: '#5a5a5a',
                              fontFamily: 'Helvetica, Arial, sans-serif',
                              fontWeight: 500,
                            }}
                          >
                            {tier.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            STEP 2 — Activity-Specific Selection
        ══════════════════════════════════════════════════════ */}
        {isPackageSelectionStep && (
          <div className="flex flex-col w-full px-3 sm:px-8 md:px-12 pt-4 sm:pt-6 pb-4 sm:pb-6">

            {/* Header — updated to be more engaging */}
            <div
              className="flex items-center justify-between"
              style={{
                marginTop: 'clamp(32px, 5vw, 60px)',
                marginBottom: 'clamp(24px, 4vw, 52px)',
              }}
            >
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 flex-shrink-0 hover:opacity-100 transition-opacity"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'rgba(17,63,49,0.55)',
                }}
              >
                ←<span className="hidden sm:inline ml-1">Back</span>
              </button>

              {/* ── UPDATED HEADING — more interactive & engaging ── */}
              <div className="flex-1 flex flex-col items-center gap-1 px-2">
                {selectedActivity?.name === 'Escape Rooms' ? (
                  <>
                    <span
                      className="font-sans font-bold uppercase tracking-widest"
                      style={{ fontSize: '10px', color: 'rgba(17,63,49,0.4)', letterSpacing: '0.2em' }}
                    >
                      Pick your mission
                    </span>
                    <h1
                      className="font-serif font-normal text-[#113f31] text-center leading-tight"
                      style={{ fontSize: 'clamp(18px, 3.5vw, 42px)' }}
                    >
                      Which <em className="italic">story</em> calls to you?
                    </h1>
                  </>
                ) : (
                  <>
                    <span
                      className="font-sans font-bold uppercase tracking-widest"
                      style={{ fontSize: '10px', color: 'rgba(17,63,49,0.4)', letterSpacing: '0.2em' }}
                    >
                      Tailor your experience
                    </span>
                    <h1
                      className="font-serif font-normal text-[#113f31] text-center leading-tight"
                      style={{ fontSize: 'clamp(18px, 3.5vw, 42px)' }}
                    >
                      Choose your <em className="italic">session size</em>
                    </h1>
                  </>
                )}
              </div>

              <div className="flex-shrink-0 w-8 sm:w-16" />
            </div>

            {/* ── Escape Room: carousel ── */}
            {selectedActivity?.name === 'Escape Rooms' ? (
              <div className="relative w-full max-w-5xl mx-auto px-8 sm:px-10">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
                  >
                    {selectedActivityOptions.map((room, idx) => {
                      const isRoomSelected = selectedRoom?.id === room.id;
                      return (
                        <div
                          key={room.id}
                          className="w-full flex-shrink-0 flex flex-col sm:flex-row overflow-hidden rounded-xl transition-all duration-300"
                          style={{
                            background: '#ece7e0',
                            boxShadow: '0 12px 30px -24px rgba(17,63,49,0.8)',
                          }}
                        >
                          {/* Poster image */}
                          <div
                            className="w-full sm:w-1/2 flex-shrink-0 overflow-hidden"
                            style={{
                              aspectRatio: '4/3',
                              minHeight: '140px',
                              maxHeight: 'clamp(180px, 40vw, 360px)',
                            }}
                          >
                            <img
                              src={room.image}
                              alt={room.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info panel — no price, no CTA button; just story + meta */}
                          <div className="w-full sm:w-1/2 flex flex-col justify-center p-4 sm:p-6 md:p-8">

                            {/* Room counter */}
                            <span
                              className="font-sans font-bold uppercase mb-2"
                              style={{
                                fontSize: '10px',
                                letterSpacing: '0.15em',
                                color: 'rgba(17,63,49,0.4)',
                              }}
                            >
                              {idx + 1} of {selectedActivityOptions.length}
                            </span>

                            {/* Title & tagline */}
                            <h3
                              className="font-serif font-normal text-[#113f31] mb-1 leading-snug"
                              style={{ fontSize: 'clamp(16px, 2.5vw, 30px)' }}
                            >
                              {room.title}
                            </h3>
                            <p
                              className="font-sans italic mb-4"
                              style={{ fontSize: '12px', color: 'rgba(17,63,49,0.5)' }}
                            >
                              {room.tagline}
                            </p>

                            {/* Story description */}
                            <p
                              className="leading-relaxed mb-5"
                              style={{
                                fontSize: 'clamp(12px, 1.2vw, 14px)',
                                color: '#5a5a5a',
                                fontFamily: 'sans-serif',
                              }}
                            >
                              {room.description}
                            </p>

                            {/* Meta tags — difficulty, duration, theme */}
                            <div className="flex gap-2 flex-wrap">
                              {[room.difficulty, room.duration, room.theme].map((tag) => (
                                <span
                                  key={tag}
                                  className="font-sans font-semibold uppercase px-3 py-1 rounded-full border"
                                  style={{
                                    fontSize: '10px',
                                    letterSpacing: '0.1em',
                                    color: 'rgba(17,63,49,0.6)',
                                    borderColor: 'rgba(17,63,49,0.18)',
                                    background: 'rgba(17,63,49,0.05)',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Subtle selection indicator — no loud CTA */}
                            {isRoomSelected && (
                              <div
                                className="mt-5 flex items-center gap-2"
                                style={{ color: 'rgba(17,63,49,0.55)' }}
                              >
                                <span
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: '#113f31' }}
                                >
                                  <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                                    <path
                                      d="M1 4L3.5 6.5L9 1"
                                      stroke="#f4f0ea"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                                <span
                                  className="font-sans font-semibold uppercase"
                                  style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                                >
                                  This mission is selected
                                </span>
                              </div>
                            )}

                            {/* Tap to select — only shown when not selected */}
                            {!isRoomSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRoom(room);
                                  setGuests(Math.max(minGuests, Math.min(maxGuests, guests)));
                                  setSelectedSlot('');
                                }}
                                className="mt-5 self-start font-sans font-semibold uppercase transition-opacity hover:opacity-80"
                                style={{
                                  fontSize: '10px',
                                  letterSpacing: '0.14em',
                                  color: 'rgba(17,63,49,0.45)',
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  textUnderlineOffset: '3px',
                                }}
                              >
                                Select this mission →
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedActivityOptions.length > 1 && (
                  <>
                    {[-1, 1].map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={dir === -1 ? prevSlide : nextSlide}
                        className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all"
                        style={{
                          [dir === -1 ? 'left' : 'right']: '0px',
                          width: 'clamp(28px, 3vw, 40px)',
                          height: 'clamp(28px, 3vw, 40px)',
                          background: '#f4f0ea',
                          border: '1px solid rgba(17,63,49,0.25)',
                          color: '#113f31',
                          fontSize: 'clamp(14px, 1.5vw, 20px)',
                          zIndex: 10,
                        }}
                      >
                        {dir === -1 ? '‹' : '›'}
                      </button>
                    ))}

                    <div className="flex justify-center gap-2 mt-4 sm:mt-5">
                      {selectedActivityOptions.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => goToSlide(i)}
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: activeSlideIndex === i ? '24px' : '8px',
                            background: activeSlideIndex === i ? '#113f31' : 'rgba(17,63,49,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

            ) : (
              /* ── Non-escape-room: session size cards ── */
              <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
                {selectedActivityOptions.length ? (
                  <div
                    className="grid gap-3 sm:gap-4"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                    }}
                  >
                    {selectedActivityOptions.map((option) => {
                      const isSelected = selectedRoom?.id === option.id;
                      return (
                        <article
                          key={option.id}
                          className="rounded-[6px] cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col"
                          style={{
                            background: '#ece7e0',
                            padding: 'clamp(14px, 2vw, 22px)',
                            boxShadow: isSelected
                              ? '0 0 0 2px #113f31, 0 16px 40px -20px rgba(17,63,49,0.55)'
                              : '0 4px 20px -10px rgba(17,63,49,0.2)',
                            minHeight: 'clamp(160px, 22vh, 220px)',
                          }}
                          onClick={() => setSelectedRoom(option)}
                        >
                          {/* Header row — thumbnail + selection dot */}
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className="overflow-hidden rounded-md flex-shrink-0"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <img
                                src={currentTierImage}
                                alt={currentTierAlt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {isSelected && (
                              <span
                                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: '#113f31' }}
                              >
                                <svg width="7" height="5" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="#f4f0ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3
                            className="font-serif font-normal text-[#184E4D] leading-snug mb-2"
                            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)' }}
                          >
                            {option.label}
                          </h3>

                          {/* Description — per-package copy */}
                          <p
                            className="leading-relaxed flex-1"
                            style={{
                              fontSize: 'clamp(11px, 1vw, 13px)',
                              color: '#0F2020',
                              fontFamily: 'Helvetica, Arial, sans-serif',
                              lineHeight: 1.6,
                            }}
                          >
                            {option.description}
                          </p>

                          {/* Price — pinned to bottom */}
                          <p
                            className="font-sans-serif text-[#184E4D] mt-3 pt-2"
                            style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}
                          >
                            {formatCurrency(option.price)}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="rounded-[8px] text-center"
                    style={{
                      background: 'rgba(17,63,49,0.05)',
                      border: '1px solid rgba(17,63,49,0.12)',
                      padding: '24px',
                      color: 'rgba(17,63,49,0.72)',
                    }}
                  >
                    Session sizes are loading. If they do not appear, go back and reselect the activity.
                  </div>
                )}
              </div>
            )}

            <p
              className="text-center font-sans mt-4 transition-opacity"
              style={{ fontSize: '11px', color: '#b91c1c', opacity: selectedRoom ? 0 : 1 }}
            >
              {selectedActivity?.name === 'Escape Rooms'
                ? 'Browse all three missions and select one to continue'
                : 'Pick a session size to continue. Pricing updates automatically with your date.'}
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            DETAILS STEP — Contact + Booking Info
        ══════════════════════════════════════════════════════ */}
        {isDetailsStep && (
          <div className="w-full px-4 sm:px-10 md:px-16 lg:px-24 pt-6 sm:pt-8 md:pt-10 pb-4">

            {/* Header */}
            <div className="flex items-start mb-7 sm:mb-10 md:mb-12">
              <button
                type="button"
                onClick={handleExit}
                className="flex items-center gap-1.5 flex-shrink-0 mt-1 sm:mt-2 hover:opacity-100 transition-opacity"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'rgba(17,63,49,0.5)',
                }}
              >
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 border rounded-full flex items-center justify-center"
                  style={{ fontSize: '8px', borderColor: 'rgba(17,63,49,0.35)' }}
                >
                  ✕
                </span>
                <span className="hidden sm:inline">Exit</span>
              </button>
              <h1
                className="flex-1 text-center font-serif font-normal text-[#113f31] leading-tight px-2"
                style={{ fontSize: 'clamp(20px, 4vw, 52px)' }}
              >
                Share your <em className="italic font-normal">event</em> details *
              </h1>
              <div className="flex-shrink-0 w-8 sm:w-16" />
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto  }}" >

              {/* Contact fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-16 lg:gap-x-24 gap-y-7 sm:gap-y-9 mb-7 sm:mb-10 " >
                <UnderlineField
                  label="FULL NAME"
                  type="text"
                  value={contact.name}
                  placeholder="e.g. Vedant Bharadwaj"
                  onChange={(v) => setContact((p) => ({ ...p, name: v }))}
                  required
                  showRequired={showRequired}
                />
                <UnderlineField
                  label="EMAIL ADDRESS"
                  type="email"
                  value={contact.email}
                  placeholder="e.g. vedant@email.com"
                  onChange={(v) => setContact((p) => ({ ...p, email: v }))}
                  required
                  showRequired={showRequired}
                />
                <UnderlineField
                  label="PHONE NUMBER"
                  type="tel"
                  value={contact.phone}
                  placeholder="e.g. +91 98765 43210"
                  onChange={(v) => setContact((p) => ({ ...p, phone: v }))}
                  required
                  showRequired={showRequired}
                />
                <div className="hidden sm:block" />
              </div>

              {/* Booking fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-16 lg:gap-x-24 gap-y-7 sm:gap-y-9">

                {/* Date */}
                <div ref={dateMenuRef} className="relative">
                  <span
                    className="block font-sans font-semibold uppercase mb-2 sm:mb-3"
                    style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.45)' }}
                  >
                    Date
                  </span>
                  <button
                    type="button"
                    className="w-full text-left border-b pb-3 sm:pb-3.5 flex items-center justify-between gap-3 transition-all duration-200"
                    style={{
                      borderBottom: '1px solid #184E4A',
                      color: '#113f31',
                      fontFamily: "'Georgia', serif",
                      fontSize: 'clamp(14px, 1.8vw, 20px)',
                    }}
                    onClick={() => { setDateMenuOpen((open) => !open); setTimeMenuOpen(false); }}
                  >
                    <span className={date ? 'text-[#113f31]' : 'text-[rgba(17,63,49,0.32)]'}>
                      {formattedDateLabel}
                    </span>
                    <ChevronDown
                      className={`flex-shrink-0 transition-transform ${dateMenuOpen ? 'rotate-180' : ''} text-[#113f31]/70`}
                      width={18}
                      height={18}
                    />
                  </button>
                  {dateMenuOpen && (
                    <div
                      className="absolute left-0 z-20 mt-2 rounded-[30px] border border-[#113f31]/10 bg-[#fffdf9] p-4 shadow-[0_24px_70px_-30px_rgba(17,63,49,0.8)]"
                      style={{ width: '100%', maxWidth: '340px' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <button
                          type="button"
                          onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                          className="p-2 rounded-full text-[#113f31]/70 hover:bg-[#113f31]/5 transition-colors"
                        >
                          <ChevronLeft width={16} height={16} />
                        </button>
                        <span
                          className="text-sm font-semibold text-[#113f31]"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {calendarMonthLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                          className="p-2 rounded-full text-[#113f31]/70 hover:bg-[#113f31]/5 transition-colors"
                        >
                          <ChevronRight width={16} height={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-[0.2em] text-[#113f31]/40 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label) => (
                          <span key={label} className="text-center">{label}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarWeeks.map((week, rowIndex) =>
                          week.map((cell, cellIndex) => {
                            const cellMonth = new Date(
                              calendarMonth.getFullYear(),
                              calendarMonth.getMonth() + cell.monthOffset,
                              cell.day
                            );
                            const isSelected =
                              cell.monthOffset === 0 &&
                              cell.day === selectedDate.getDate() &&
                              calendarMonth.getMonth() === selectedDate.getMonth() &&
                              calendarMonth.getFullYear() === selectedDate.getFullYear();
                            return (
                              <button
                                key={`${rowIndex}-${cellIndex}`}
                                type="button"
                                onClick={() => {
                                  const selected = cellMonth;
                                  const newDate = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
                                  setDate(newDate);
                                  setSelectedSlot('');
                                  setDateMenuOpen(false);
                                }}
                                className={`h-9 rounded-2xl text-sm transition-all ${
                                  cell.monthOffset === 0 ? 'text-[#113f31]' : 'text-[#113f31]/25'
                                } ${isSelected ? 'bg-[#113f31] text-[#fffdf9]' : 'hover:bg-[#113f31]/5'}`}
                                style={{ fontFamily: "'Georgia', serif" }}
                              >
                                {cell.day}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                  {showRequired && !date && (
                    <span className="font-sans text-red-600 mt-1 block" style={{ fontSize: '11px' }}>
                      required
                    </span>
                  )}
                </div>

                {/* Time slot dropdown */}
                <div ref={timeMenuRef} className="relative">
                  <span
                    className="block font-sans font-semibold uppercase mb-2 sm:mb-3"
                    style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.45)' }}
                  >
                    Time
                  </span>
                  <button
                    type="button"
                    className="w-full text-left border-b pb-3 sm:pb-3.5 flex items-center justify-between gap-3 transition-all duration-200"
                    style={{
                      borderBottom: '1px solid #184E4A',
                      color: '#113f31',
                      fontFamily: "'Georgia', serif",
                      fontSize: 'clamp(14px, 1.8vw, 20px)',
                    }}
                    onClick={() => { setTimeMenuOpen((open) => !open); setDateMenuOpen(false); }}
                  >
                    <span className={selectedSlot ? 'text-[#113f31]' : 'text-[rgba(17,63,49,0.32)]'}>
                      {slotsLoading
                        ? 'Loading slots…'
                        : selectedSlot || (normalizedSlots.length ? 'Select a time slot' : 'No slots available')}
                    </span>
                    <ChevronDown
                      className={`flex-shrink-0 transition-transform ${timeMenuOpen ? 'rotate-180' : ''} text-[#113f31]/70`}
                      width={18}
                      height={18}
                    />
                  </button>
                  {timeMenuOpen && (
                    <div
                      className="absolute left-0 z-20 mt-2 rounded-[30px] border border-[#113f31]/10 bg-[#fffdf9] p-3 shadow-[0_24px_70px_-30px_rgba(17,63,49,0.8)]"
                      style={{ width: '100%', maxWidth: '340px', maxHeight: '260px', overflowY: 'auto' }}
                    >
                      {slotsLoading ? (
                        <div
                          className="rounded-2xl bg-[#113f31]/5 px-4 py-3 text-sm text-[#113f31]/55"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          Loading available times…
                        </div>
                      ) : normalizedSlots.length ? (
                        normalizedSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`w-full text-left rounded-2xl px-4 py-3 mb-2 transition-all ${
                              selectedSlot === slot
                                ? 'bg-[#113f31] text-[#fffdf9]'
                                : 'bg-[#f6f1eb] text-[#113f31] hover:bg-[#113f31]/5'
                            }`}
                            style={{ fontFamily: "'Georgia', serif", fontSize: '15px' }}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setTimeMenuOpen(false);
                            }}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <div
                          className="rounded-2xl bg-[#113f31]/5 px-4 py-3 text-sm text-[#113f31]/55"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          No times available for this date.
                        </div>
                      )}
                    </div>
                  )}
                  {showRequired && !selectedSlot && !slotsLoading && (
                    <span className="font-sans text-red-600 mt-1 block" style={{ fontSize: '11px' }}>
                      required
                    </span>
                  )}
                </div>

                {/* Guests counter */}
                <div>
                  <span
                    className="block font-sans font-semibold uppercase mb-2 sm:mb-3"
                    style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.45)' }}
                  >
                    Number of Guests
                  </span>
                  <div
                    className="flex items-center pb-2 sm:pb-3"
                    style={{ borderBottom: '1px solid #184E4A', gap: '16px' }}
                  >
                    <button
                      type="button"
                      onClick={() => setGuests((v) => Math.max(minGuests, v - 1))}
                      className="flex items-center justify-center select-none transition-colors hover:text-[#113f31]"
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '20px',
                        color: 'rgba(17,63,49,0.5)',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      −
                    </button>
                    <span
                      className="text-center font-serif text-[#113f31]"
                      style={{ fontSize: 'clamp(14px, 1.8vw, 20px)', minWidth: '2rem' }}
                    >
                      {guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((v) => Math.min(maxGuests, v + 1))}
                      className="flex items-center justify-center select-none transition-colors hover:text-[#113f31]"
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '20px',
                        color: 'rgba(17,63,49,0.5)',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      +
                    </button>
                    <span
                      className="ml-auto font-sans"
                      style={{ fontSize: '11px', color: 'rgba(17,63,49,0.3)' }}
                    >
                      max {maxGuests}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block" />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            REVIEW STEP
        ════════════════════════════════════════════════════════ */}
        {isReviewStep && (
          <div className="flex flex-col items-center px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-4">
            <div className="w-full max-w-lg">

              {/* Top nav */}
              <div className="flex items-center justify-between mb-5 sm:mb-7">
                <button
                  type="button"
                  onClick={handleBack}
                  className="font-sans font-semibold uppercase hover:opacity-100 transition-opacity"
                  style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(17,63,49,0.5)' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(isEscapeRoom ? 3 : 2)}
                  className="font-sans font-semibold uppercase underline underline-offset-2 hover:opacity-100 transition-opacity"
                  style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(17,63,49,0.5)' }}
                >
                  Edit Details
                </button>
              </div>

              <h2
                className="font-serif font-normal text-[#113f31] text-center mb-1"
                style={{ fontSize: 'clamp(20px, 3.5vw, 40px)' }}
              >
                Confirm your <em className="italic font-normal">booking</em>
              </h2>
              <p
                className="text-center font-sans mb-6 sm:mb-8"
                style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', color: '#5a5a5a' }}
              >
                Review every detail before finalizing your reservation.
              </p>

              {/* Receipt card */}
              <div className="rounded-2xl overflow-hidden mb-4 sm:mb-6" style={{ background: '#ece7e0' }}>
                <div className="px-5 sm:px-6 py-3 sm:py-4" style={{ background: '#113f31' }}>
                  <span
                    className="font-sans font-semibold uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(244,240,234,0.6)' }}
                  >
                    Booking Summary
                  </span>
                  <p
                    className="font-serif mt-1"
                    style={{ fontSize: 'clamp(13px, 1.6vw, 18px)', color: '#f4f0ea' }}
                  >
                    {selectedTier?.title}
                    {isEscapeRoom && selectedRoom ? ` — ${selectedRoom.title}` : ''}
                  </p>
                </div>
                <div
                  className="px-5 sm:px-6 py-3 sm:py-4"
                  style={{ borderTop: '1px solid rgba(17,63,49,0.08)' }}
                >
                  {[
                    { label: 'Full Name', value: contact.name },
                    { label: 'Email', value: contact.email },
                    { label: 'Phone', value: contact.phone },
                    { label: 'Guests', value: guests },
                    {
                      label: 'Date',
                      value: new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }),
                    },
                    { label: 'Time Slot', value: selectedSlot || '—' },
                    { label: 'Est. Cost', value: costLabel },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                      style={{ padding: '10px 0', borderBottom: '1px solid rgba(17,63,49,0.08)' }}
                    >
                      <span
                        className="font-sans font-semibold uppercase"
                        style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(17,63,49,0.4)' }}
                      >
                        {label}
                      </span>
                      <span
                        className="font-sans font-medium text-right ml-4 break-all"
                        style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', color: '#113f31', maxWidth: '60%' }}
                      >
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="mb-4">
                <span
                  className="block font-sans font-semibold uppercase mb-2 sm:mb-3"
                  style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.5)' }}
                >
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { id: 'online', label: 'Pay Online Now' },
                    { id: 'offline', label: 'Pay at Venue' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className="rounded-xl font-sans font-medium transition-all"
                      style={{
                        padding: 'clamp(10px,1.2vw,14px) clamp(10px,1.5vw,16px)',
                        fontSize: 'clamp(11px,1.1vw,13px)',
                        background: paymentMethod === id ? '#113f31' : '#ece7e0',
                        color: paymentMethod === id ? '#f4f0ea' : '#113f31',
                        border: paymentMethod === id ? '1px solid #113f31' : '1px solid rgba(17,63,49,0.15)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {success && (
                <div
                  className="rounded-xl px-4 py-3 mt-3"
                  style={{ background: 'rgba(17,63,49,0.08)', border: '1px solid rgba(17,63,49,0.2)' }}
                >
                  <p className="font-sans leading-relaxed" style={{ fontSize: '13px', color: '#113f31' }}>
                    {success}
                  </p>
                </div>
              )}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 mt-3"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
                >
                  <p className="font-sans leading-relaxed" style={{ fontSize: '13px', color: '#b91c1c' }}>
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          FOOTER — fixed to bottom, always visible
      ════════════════════════════════════════════════════════ */}
      <div
        className="flex-shrink-0 flex flex-row items-center justify-between"
        style={{
          paddingTop: '12px',
          paddingBottom: 'clamp(16px, 4vw, 40px)',
          paddingInline: 'clamp(16px, 3.5vw, 48px)',
          background: '#f4f0ea',
        }}
      >
        {/* Progress */}
        <div className="flex flex-col items-start" style={{ minWidth: 'clamp(56px, 8vw, 96px)' }}>
          <span
            className="font-sans font-bold uppercase leading-none mb-1"
            style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.4)' }}
          >
            Progress
          </span>
          <div
            className="mt-2 rounded-full overflow-hidden"
            style={{ width: 'clamp(52px, 7vw, 100px)', height: '5px', background: 'rgba(17,63,49,0.12)' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${progressWidth}%`, background: '#113f31', transition: 'width 0.35s ease' }}
            />
          </div>
          <span
            className="font-serif italic font-normal text-[#113f31] leading-none mt-2"
            style={{ fontSize: 'clamp(16px, 2.5vw, 30px)' }}
          >
            {String(currentStep).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
          </span>
        </div>

        {/* Back + Next */}
        <div className="flex items-center" style={{ gap: 'clamp(8px, 1.5vw, 16px)' }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || bookingLoading}
            className="rounded-full font-serif transition-all duration-200 hover:scale-[0.97] disabled:opacity-25 disabled:pointer-events-none"
            style={{
              padding: 'clamp(8px,1vw,12px) clamp(12px,2vw,24px)',
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              border: '1px solid rgba(17,63,49,0.5)',
              color: '#113f31',
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={bookingLoading}
            className="rounded-full font-serif transition-all duration-200 hover:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            style={{
              padding: 'clamp(8px,1vw,12px) clamp(14px,2.5vw,28px)',
              fontSize: 'clamp(11px, 1.2vw, 15px)',
              background: '#113f31',
              color: '#f4f0ea',
              opacity: !stepReady && !bookingLoading ? 0.45 : 1,
            }}
          >
            {bookingLoading ? 'Submitting…' : isReviewStep ? 'Submit Booking ✓' : 'Next →'}
          </button>
        </div>

        {/* Est. Cost */}
        <div className="flex flex-col items-end" style={{ minWidth: 'clamp(56px, 8vw, 96px)' }}>
          <span
            className="font-sans font-bold uppercase leading-none mb-1"
            style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(17,63,49,0.4)' }}
          >
            Est. Cost
          </span>
          <span
            className="font-serif italic font-normal text-[#113f31] leading-none"
            style={{ fontSize: 'clamp(14px, 2.5vw, 30px)' }}
          >
            {costLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
