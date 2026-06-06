import logo from "../../assets/logo.png";
import logo2 from "../../assets/logo2.png";

import room1 from '../../assets/room1.jpeg';  
import room2 from "../../assets/room2.jpeg";
import room3 from "../../assets/room3.jpeg";
 


export const LOGO_URL =  logo;
export const LOGO_URL2 =  logo2;
    

export const HERO_VIDEO = {
  poster:
    "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec%2F69610a0c261bf5a0d9012dd6_hero%203%20%281%29_poster.0000000.jpg",
  mp4: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec%2F69610a0c261bf5a0d9012dd6_hero%203%20%281%29_mp4.mp4",
  webm: "https://cdn.prod.website-files.com/69372e47ab695bf5546b46ec%2F69610a0c261bf5a0d9012dd6_hero%203%20%281%29_webm.webm",
};

export const ABOUT_STATS = [
  {
    value: 60,
    suffix: "%",
    text: "green spaces for tranquility & wellness.",
  },
  {
    value: 30,
    suffix: "",
    text: "exclusive residences, each tailored for comfort & elegance.",
  },
  {
    value: 150,
    suffix: "k",
    unit: "sq. ft.",
    text: "green spaces for tranquility & wellness.",
  },
  {
    value: "24/7",
    suffix: "",
    text: "concierge services, meeting every need effortlessly.",
  },
];

export const PROJECTS = [
  {
    navLabel: "Bhopal: The Final Countdown",
    titleLines: ["BHOPAL: THE", "FINAL COUNTDOWN"],
    summaryLines: [
      "A classified experiment has gone wrong and",
      "the clock is already ticking. 60 minutes.",
      "One chance. Can your team stop the countdown?",
    ],
    image: room1,
    alt: "Dark atmospheric escape room with radiation warning signs, hazmat suits, and a glowing countdown timer.",
    description:
      "A classified experiment has gone wrong deep inside Lab 07. Radiation levels are rising, the lab is sealed, and your team has exactly 60 minutes to contain the threat before the city is lost. This high-intensity thriller escape room demands sharp thinking, real teamwork, and nerves of steel. Genre: Thriller Strategy | Players: 2 to 8 | Time Limit: 60 Minutes.",
    slides: [
      {
        main: room1,
        thumb: room1,
        label: "THE LAB",
        area: 60,
        areaText: "minutes to escape",
      },
      {
        main: room1,
        thumb: room1,
        label: "DIFFICULTY",
        area: 8,
        areaText: "out of 10",
      },
      {
        main: room1,
        thumb: room1,
        label: "PLAYERS",
        area: 8,
        areaText: "max players per session",
      },
      {
        main: room1,
        thumb: room1,
        label: "GENRE",
        area: null,
        areaText: "Thriller Strategy",
      },
    ],
  },
  {
    navLabel: "Prison Escape",
    titleLines: ["PRISON", "ESCAPE"],
    summaryLines: [
      "The guards are patrolling and the clock is running.",
      "Work together, find the way out, and break free",
      "before Bhopal's most notorious prison swallows you whole.",
    ],
    image: room2,
    alt: "Gritty prison escape room with iron bars, dim corridor lighting, and two players trapped inside a cell.",
    description:
      "You are locked inside the Bhopal prison. The guards are on patrol, the walls are closing in, and freedom is only possible if your team plans fast and executes faster. Crack the clues, break the system, and escape before your 60 minutes are up — or face the consequences. Genre: Strategy Escape | Players: 2 to 8 | Time Limit: 60 Minutes.",
    slides: [
      {
        main: room2,
        thumb: room2,
        label: "THE CELL",
        area: 60,
        areaText: "minutes to escape",
      },
      {
        main: room2,
        thumb: room2,
        label: "DIFFICULTY",
        area: 7,
        areaText: "out of 10",
      },
      {
        main: room2,
        thumb: room2,
        label: "PLAYERS",
        area: 8,
        areaText: "max players per session",
      },
      {
        main: room2,
        thumb: room2,
        label: "GENRE",
        area: null,
        areaText: "Strategy Escape",
      },
    ],
  },
  {
    navLabel: "Raja Bhoj ka Khazana",
    titleLines: ["RAJA BHOJ", "KA KHAZANA"],
    summaryLines: [
      "Ancient ruins hide a secret untouched by time.",
      "Decode royal symbols, outsmart history, and",
      "claim the lost treasure before it's sealed forever.",
    ],
    image: room3,
    alt: "Ancient temple escape room with golden treasure, carved stone doors, and the statue of Raja Bhoj guarding the chamber.",
    description:
      "Hidden beneath the ruins of Raja Bhoj's kingdom lies a forgotten chamber, sealed for centuries and guarded by royal symbols only the worthy can decode. Your team has 60 minutes to unravel the mystery, uncover the Khazana, and walk out before history buries it — and you — forever. Genre: Mystery Adventure | Players: 2 to 8 | Time Limit: 60 Minutes.",
    slides: [
      {
        main: room3,
        thumb: room3,
        label: "THE CHAMBER",
        area: 60,
        areaText: "minutes to escape",
      },
      {
        main: room3,
        thumb: room3,
        label: "DIFFICULTY",
        area: 7,
        areaText: "out of 10",
      },
      {
        main: room3,
        thumb: room3,
        label: "PLAYERS",
        area: 8,
        areaText: "max players per session",
      },
      {
        main: room3,
        thumb: room3,
        label: "GENRE",
        area: null,
        areaText: "Mystery Adventure",
      },
    ],
  },
];

export const BELIEFS = [
  {
    titleLines: ["Holistic", "well-being"],
    text: "Spaces designed to nurture the mind, body, and soul.",
  },
  {
    titleLines: ["Discretion &", "exclusivity"],
    text: "Privacy and personal growth at the forefront.",
  },
  {
    titleLines: ["Cultural", "enrichment"],
    text: "Spaces designed to nurture the mind, body, and soul.",
  },
  {
    titleLines: ["Community &", "connection"],
    text: "Privacy and personal growth at the forefront.",
  },
  {
    titleLines: ["Sustainable", "elegance"],
    text: "Luxury that respects our environment.",
  },
];

export const AMENITIES = [
  { 
    titleLines: ["AXE", "THROWING"], 
    textLines: [ 
      "Step up to the lane and let", 
      "instinct take over. Unlimited", 
      "throws, dedicated lanes, and", 
      "expert guidance deliver pure", 
      "adrenaline from first release", 
      "to final bullseye.", 
    ], 
   
    bigImage: "https://images.unsplash.com/photo-1661475733918-b64f18904b86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGF4ZSUyMHRocm93aW5nfGVufDB8fDB8fHww", 
 
    smallImage: "https://images.unsplash.com/photo-1761873763418-2c9596bc8c65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF4ZSUyMHRocm93aW5nfGVufDB8fDB8fHww", 
  },
  // { 
  //   titleLines: ["ESCAPE", "ROOMS"], 
  //   textLines: [ 
  //     "Three immersive themed rooms.", 
  //     "One ticking 60-minute clock.", 
  //     "Communicate fast, solve harder,", 
  //     "and discover whether your team", 
  //     "has what it takes to escape", 
  //     "before time runs out.", 
  //   ], 
  //   // Big image: Moody, atmospheric wide view of a mysterious dimly lit escape room corridor with dramatic lighting and clues
  //   bigImage: "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&w=2400&h=1600&q=85", 
  //   // Small image: Sharp macro close-up of an antique combination padlock with keys, dramatic shadows and metallic texture
  //   smallImage: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&h=1000&q=80", 
  // },
  { 
    titleLines: ["REMOTE", "CONTROL"], 
    textLines: [ 
      "Take command of powerful RC", 
      "machines across our custom-built", 
      "sand pit track. Precision, speed,", 
      "and competitive energy combine", 
      "into an experience built for", 
      "all ages and thrill seekers.", 
    ], 
    // Big image: High-energy action shot of an RC buggy aggressively drifting and kicking up sand on a custom dirt track
    bigImage: "https://images.unsplash.com/photo-1672682523537-3422c97b98d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlbW90ZSUyMGNvbnRyb2wlMjB0cnVja3xlbnwwfHwwfHx8MA%3D%3D", 
    // Small image: Close-up detail of an RC controller with focused lighting on the joystick and buttons
    smallImage: "https://images.unsplash.com/photo-1675301586777-2c56ee8aa5ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVtb3RlJTIwY29udHJvbGxlciUyMHZlaGljbGVzfGVufDB8fDB8fHww", 
  },
  { 
    titleLines: ["VR", "GAMING"], 
    textLines: [ 
      "Step beyond reality into fully", 
      "immersive virtual worlds. Enjoy", 
      "unlimited gaming sessions and", 
      "Meta Shot Cricket experiences", 
      "that blur the line between", 
      "digital and real adrenaline.", 
    ], 
    // Big image: Immersive cyberpunk-style gaming setup with vibrant neon lights, multiple VR users in action
    bigImage: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=2400&h=1600&q=85", 
    // Small image: Sleek, high-detail close-up of a modern VR headset with glowing cyan/magenta accents in dark environment
    smallImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&h=1000&q=80", 
  },
];

export const FAQS = [
  {
    question: "What activities does House of Thrill offer?",
    answer:
      "House of Thrill is India's first axe throwing and escape room arena, offering four distinct experiences under one roof — axe throwing, immersive escape rooms, remote control construction vehicles, and VR gaming. Every activity is designed for groups and built to deliver maximum adrenaline.",
  },
  {
    question: "How long does each escape room session last?",
    answer:
      "Each escape room session runs for 60 minutes of gameplay. We recommend planning for a total of 1.5 hours per visit, which accounts for the pre-game briefing, the session itself, and reset time. For example, an 11:00 AM slot would be followed by the next available slot at 12:30 PM.",
  },
  {
    question: "How many players can participate in an escape room?",
    answer:
      "Each escape room accommodates groups of 2 to 8 players. Pricing is structured by group size, making it an excellent value for larger groups. Whether you're planning a friends' outing, a family visit, or a corporate team event, we have a format that works for you.",
  },
  {
    question: "Do I need prior experience for axe throwing?",
    answer:
      "No prior experience is required. Our trained staff will walk you through a complete safety briefing and throwing technique before your session begins. Every lane is supervised throughout, making it a safe and enjoyable experience for first-timers and seasoned throwers alike.",
  },
  {
    question: "Are weekday and weekend prices different?",
    answer:
      "Yes. Monday to Thursday rates are lower across all activities compared to Friday to Sunday. We recommend booking on weekdays for the best value, particularly for larger groups. Contact us at +91-7987097199 for a full breakdown of current pricing.",
  },
  {
    question: "Can House of Thrill host corporate events or private celebrations?",
    answer:
      "Absolutely. House of Thrill is well suited for corporate team outings, birthday parties, and group celebrations of all kinds. We offer custom packages tailored to your group size and activity preferences. Reach out to us at +91-7987097199 to discuss your requirements and make a reservation.",
  },
];

export const HERO_WORDS = ["India's", "First", "Axe", "Throwing", "+ ", "Escape", "Rooms", "Arena"];
