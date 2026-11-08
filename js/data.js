/* =========================================================
   FOR ANEEBA — all the words live here.
   Change text here and the whole site updates.
   ========================================================= */

const DATA = {};

/* ---------------- the letter ---------------- */
DATA.letter = {
  title: "Aneeba,",
  paragraphs: [
    "I'm not very good at saying big things out loud. I get shy, I get awkward, and then I say something completely stupid. So I built you this instead — a quiet little corner of the internet where I could take my time.",
    "I don't know how to explain what you are to me. You're the first person I want to tell everything to, and the only person I don't have to explain anything to. You are the calm in a day that makes no sense, and the chaos I would choose every single time.",
    "I'm not promising you the stars. I'm promising you the ordinary things. The late-night calls. The good morning texts. The countdowns to the next time I see you. The <em>did you eat?</em> messages. The silences that never feel empty. The version of me that stays even when it's hard.",
    "You don't have to be perfect for me, and you don't have to be okay all the time. Just be here. I'll meet you wherever you are.",
    "There was nobody like you before. There will never be anyone like you after. You are my favourite person, my safest place, <strong>my home</strong>."
  ],
  sign: "always yours, Haris"
};

/* ---------------- our story ---------------- */
DATA.story = [
  {
    tag: "chapter one",
    title: "The beginning",
    text: "The first time we talked, I had no idea I was meeting the person who would become my favourite habit. I just knew I didn't want the conversation to end."
  },
  {
    tag: "chapter two",
    title: "The late nights",
    text: "Somewhere between 1am and 'just five more minutes', you became the best part of my day. Sleep became optional. You became the reason."
  },
  {
    tag: "chapter three",
    title: "The real stuff",
    text: "We disagreed, we apologised, we stayed. That was the moment I knew this wasn't fragile. It was real — and real things don't break that easily."
  },
  {
    tag: "chapter four",
    title: "Today",
    text: "Still here. Still choosing you. Still getting butterflies when your name shows up on my screen. Some things never get old."
  },
  {
    tag: "chapter five",
    title: "Every tomorrow",
    text: "Wherever life goes from here, I want the same boring, beautiful forever with you. Whatever you say — I'm still right here."
  }
];

/* ---------------- reasons ---------------- */
DATA.reasons = [
  {
    icon: "heart",
    title: "You, in my dreams",
    text: "Miles apart all day. Then I fall asleep and you're right here."
  },
  {
    icon: "star",
    title: "Your sleepy voice",
    text: "Half-asleep on a call, still refusing to hang up. That's the version of you I miss most at 3am."
  },
  {
    icon: "sparkle",
    title: "Your bad days",
    text: "You say 'fine' and then text me at 2am. I always know. I always come."
  },
  {
    icon: "infinity",
    title: "The silence with you",
    text: "An hour of saying nothing still feels like the best conversation of my week."
  },
  {
    icon: "sparkle",
    title: "Your stubbornness",
    text: "You don't back down from anything — not arguments, not me, not life. It's unreasonably attractive."
  },
  {
    icon: "heart",
    title: "That you're you",
    text: "Not edited, not improved, not fixed. Just you. And that has been more than enough, every single day."
  }
];

/* ---------------- nine promises ---------------- */
DATA.promises = [
  { x: 12, y: 24, title: "I will never walk away", text: "Not on the loud days, not on the quiet ones. Not when it's easy, and especially not when it isn't." },
  { x: 31, y: 13, title: "You will never be alone", text: "Not at 2am, not in a crowded room, not inside your own head. I'm one message away, always." },
  { x: 50, y: 30, title: "I will keep every secret", text: "Whatever you tell me stays with me. Softly. Permanently. Without a single exception." },
  { x: 69, y: 14, title: "I will protect your softness", text: "You feel everything deeply. I will stand between you and anything that tries to make that a weakness." },
  { x: 87, y: 33, title: "I will be patient", text: "Bad days, long silences, moods you can't name. I'm not going anywhere. Take your time." },
  { x: 19, y: 60, title: "I will keep my word", text: "Every promise on this sky is real. Hold me to any one of them, whenever you want." },
  { x: 39, y: 74, title: "I will grow with you", text: "Not ahead of you, not behind you. Beside you, always. We handle the rest together." },
  { x: 62, y: 57, title: "I will close the distance", text: "Every late-night call, every countdown, every saved-up hug is a step toward the day the miles stop mattering." },
  { x: 81, y: 76, title: "Always, completely yours", text: "Today, tomorrow, and every boring, beautiful day in between. This is the surest one." }
];

/* ---------------- gallery ---------------- */
/* A frame with src:null shows as an empty "add photo" slot (no broken request).
   To fill one permanently, drop the file into assets/photos/ and set its src. */
DATA.gallery = [
  { src: "assets/photos/photo-1.jpg", caption: "the first picture i saved of you" },
  { src: "assets/photos/photo-2.jpg", caption: "that day i couldn't stop smiling" },
  { src: "assets/photos/photo-3.jpg", caption: "my favourite kind of ordinary" },
  { src: "assets/photos/photo-4.jpg", caption: "you, being completely you", wide: true },
  { src: null, caption: "the light was good - you were better" },
  { src: null, caption: "a moment i kept" },
  { src: null, caption: "you, in your own little world", tall: true },
  { src: null, caption: "and this one is my favourite" }
];

/* ---------------- songs ---------------- */
/* startAt = the second where the song begins (the part that reminds me of you) */
DATA.tracks = [
  { file: "you-pryme.mp3", title: "you.", artist: "pryme!", startAt: 19, from: "#ff6f9c", to: "#7b2ff7" },
  { file: "stranger-pryme.mp3", title: "stranger", artist: "pryme!", startAt: 9, from: "#b18cff", to: "#4b1d8f" },
  { file: "something-about-you-eyedress.mp3", title: "something about you", artist: "eyedress, dent may", startAt: 50, from: "#ff9a62", to: "#c2185b" },
  { file: "her-jvke.mp3", title: "her", artist: "jvke", startAt: 30, from: "#f3c98b", to: "#b45309" },
  { file: "just-us-coraliwave.mp3", title: "just us", artist: "coraliwave", startAt: 139, from: "#62d4ff", to: "#1d4ed8" },
  { file: "reflections-the-neighbourhood.mp3", title: "reflections", artist: "the neighbourhood", startAt: 42, from: "#6ee7c8", to: "#0f766e" },
  { file: "time-lapse-junny.mp3", title: "time lapse", artist: "junny", startAt: 40, from: "#ffb36b", to: "#c2410c" },
  { file: "senorita-shawn-camila.mp3", title: "senorita", artist: "shawn mendes & camila cabello", startAt: 71, from: "#ff7a7a", to: "#9f1239" },
  { youtube: "0v5eHPfy5Lk", title: "barbaad", artist: "jubin nautiyal, the rish", startAt: 0, from: "#ff9fb2", to: "#5b21b6" }
];
