// lib/data.js
//
// Starting point for FLOW. NOTHING in here is locked in — every value below
// can be changed from the Settings tab in the app, and Settings is where
// Aman should make changes. This file only decides what a brand-new browser
// starts with (and what "Reset everything" goes back to).
//
// What lives here:
// 1. BLOCK_TYPES / PRIORITIES — the dropdown choices used across the app.
// 2. DEFAULT_SETTINGS — name, review date, day hours, session + break rhythm.
// 3. DEFAULT_CATEGORIES — MTP-1, coursework and other work buckets, and
//    their weekly hour targets.
// 4. DEFAULT_EVENTS — the recurring weekly routine (meals, tea, lectures,
//    labs, the TA tutorial).
// 5. DEFAULT_PATTERNS — which sessions each weekday gets, in order.
// 6. DEFAULT_LOG_TAGS — starting suggestions for the Life log tab's
//    free-form entries (anything outside the structured plan).

import { WEEK_ORDER } from "./time";

export const STORAGE_KEY = "flow_aman_state_v1";

export const BLOCK_TYPES = [
  { id: "session", label: "Study session (counts toward targets)" },
  { id: "break", label: "Break / rest" },
  { id: "meal", label: "Meal" },
  { id: "fixed", label: "Fixed commitment / other" },
];

export const EVENT_KINDS = BLOCK_TYPES;

export const PRIORITIES = [
  { id: "important", label: "Important" },
  { id: "moderate", label: "Moderate" },
  { id: "regular", label: "Regular" },
];

// Starting tags for the Life log's free-form entries. Just a starting
// point — the log tab lets you type any tag you like, and whatever you've
// typed before shows up as a suggestion too.
export const DEFAULT_LOG_TAGS = [
  "Sleep",
  "Commute",
  "Phone / scrolling",
  "Exercise",
  "Family / social",
  "Chores",
  "Reading",
  "Entertainment",
  "Health",
  "Errand",
];

export const DISRUPTION_REASONS = [
  "Class / lab overran",
  "Unplanned outing or guests",
  "Tired or unwell",
  "Power or internet cut",
  "TA duty ran long",
  "Lost focus",
  "Poor planning",
  "Other",
];

export const DEFAULT_SETTINGS = {
  name: "Aman",
  examName: "MTP-1 review",
  examDate: "2026-11-30",
  timeFormat: "12h", // "12h" or "24h"

  // The window the auto-planner may fill with sessions.
  dayStart: "07:30",
  dayEnd: "23:00",

  // Session + break rhythm.
  sessionMins: 40,
  minSessionMins: 25, // a leftover gap shorter than this is not turned into a session
  shortBreak: 5,
  longBreak: 15,
  longEvery: 3, // a long break after every N sessions in a row
};

// Credit-aware weekly hour targets, carried over from the original
// session-count targets (MTP-1 = 6 credits, AML7800/MEL7419 = 4 credits
// each, Placement ≈ 2-credit equivalent, TA extra ≈ 1-credit equivalent).
// ESL7134 (Nuclear Energy) has been removed entirely — no category, no
// fixed lectures, no targets.
export const DEFAULT_CATEGORIES = [
  {
    id: "mtp",
    label: "MTP-1",
    color: "#4fd8c4",
    target: 10.5,
    hint: "Thesis/project work: literature, experiments, coding, writing. Log real progress, not just reading.",
  },
  {
    id: "placement",
    label: "Placement",
    color: "#5FA8D3",
    target: 3.5,
    hint: "Resume, aptitude, DSA practice, mock interviews.",
  },
  {
    id: "aml7800",
    label: "AML7800 (Deep Learning)",
    color: "#B98BC9",
    target: 8,
    hint: "Assignments, paper reading, coding practice beyond the lecture and lab.",
  },
  {
    id: "mel7419",
    label: "MEL7419 (Comp. Heat Transfer)",
    color: "#7FBF9E",
    target: 7.5,
    hint: "Problem sets, solver practice, review lecture notes.",
  },
  {
    id: "ta",
    label: "TA extra work",
    color: "#C9A66B",
    target: 2,
    hint: "Grading, doubt sessions, prep beyond the fixed Friday tutorial.",
  },
  {
    id: "planning",
    label: "Planning / recovery",
    color: "#9AA5B1",
    target: 1.5,
    hint: "Plan the week, review deadlines, clear the backlog.",
  },
];

// Recurring weekly routine: real fixed classes/labs/tutorial (kind "fixed",
// not counted toward targets), plus meals and a tea break. Blocks of kind
// "session" would count toward targets, but nothing here is one — extra
// MTP, placement, course study, TA overflow and recovery are added from the
// app UI, not here. Where the original timetable had a location (Hostel,
// CSC, LHC, Blocks, Mess) it's kept in the note field.
export const DEFAULT_EVENTS = [
  // -- Meals & breaks, every day ---------------------------------------
  {
    id: "ev-breakfast",
    title: "Breakfast",
    kind: "meal",
    category: "",
    days: [...WEEK_ORDER],
    start: "07:45",
    end: "08:15",
    detail: "Mess",
  },
  {
    id: "ev-tea",
    title: "Tea and rest",
    kind: "break",
    category: "",
    days: [...WEEK_ORDER],
    start: "17:00",
    end: "17:20",
    detail: "",
  },
  {
    id: "ev-dinner",
    title: "Dinner",
    kind: "meal",
    category: "",
    days: [...WEEK_ORDER],
    start: "20:30",
    end: "21:10",
    detail: "CSC → Hostel, then Mess",
  },

  // -- Lunch (Mon/Tue/Wed/Thu/Sat/Sun at 13:00, Fri earlier) -----------
  {
    id: "ev-lunch",
    title: "Lunch",
    kind: "meal",
    category: "",
    days: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"],
    start: "13:00",
    end: "13:25",
    detail: "Mess",
  },
  {
    id: "ev-lunch-fri",
    title: "Lunch",
    kind: "meal",
    category: "",
    days: ["Fri"],
    start: "12:00",
    end: "12:25",
    detail: "Mess",
  },

  // -- Monday -----------------------------------------------------------
  {
    id: "ev-mon-aml-lec",
    title: "AML7800: Deep Learning for Mechanics",
    kind: "fixed",
    category: "",
    days: ["Mon"],
    start: "09:30",
    end: "11:00",
    detail: "LHC",
  },
  {
    id: "ev-mon-aml-lab",
    title: "AML7800 Lab: Deep Learning for Mechanics",
    kind: "fixed",
    category: "",
    days: ["Mon"],
    start: "14:00",
    end: "16:00",
    detail: "Blocks",
  },

  // -- Tuesday & Wednesday ------------------------------------------------
  {
    id: "ev-tuewed-mel-lec",
    title: "MEL7419: Computational Heat Transfer",
    kind: "fixed",
    category: "",
    days: ["Tue", "Wed"],
    start: "10:00",
    end: "11:00",
    detail: "LHC",
  },

  // -- Thursday -----------------------------------------------------------
  {
    id: "ev-thu-aml-lec",
    title: "AML7800: Deep Learning for Mechanics",
    kind: "fixed",
    category: "",
    days: ["Thu"],
    start: "09:30",
    end: "11:00",
    detail: "LHC",
  },
  {
    id: "ev-thu-mel-lab",
    title: "MEL7419 Lab: Computational Heat Transfer",
    kind: "fixed",
    category: "",
    days: ["Thu"],
    start: "15:00",
    end: "17:00",
    detail: "CSC",
  },

  // -- Friday ---------------------------------------------------------------
  {
    id: "ev-fri-mel-lec",
    title: "MEL7419: Computational Heat Transfer",
    kind: "fixed",
    category: "",
    days: ["Fri"],
    start: "10:00",
    end: "11:00",
    detail: "LHC",
  },
  {
    id: "ev-fri-ta-tutorial",
    title: "TA Tutorial: MEL2012 Fluid Mechanics",
    kind: "fixed",
    category: "",
    days: ["Fri"],
    start: "13:00",
    end: "14:00",
    detail: "LHC",
  },
];

// The study sessions each weekday gets, in order through the day. The
// number of sessions IS the length of the list — add or remove slots in
// Settings to make a lighter or heavier day. Tasks added for a day replace
// matching slots first, so the day never balloons. MTP-1 leads every day
// since it carries the heaviest weekly target.
export const DEFAULT_PATTERNS = {
  Mon: ["mtp", "aml7800", "mtp", "mel7419", "mtp"],
  Tue: ["mtp", "mel7419", "mtp", "aml7800", "placement"],
  Wed: ["mtp", "mel7419", "mtp", "aml7800", "planning"],
  Thu: ["mtp", "aml7800", "mtp", "mel7419", "mtp"],
  Fri: ["mtp", "mel7419", "mtp", "ta", "placement"],
  Sat: ["mtp", "mtp", "aml7800", "mel7419", "mtp", "placement", "planning"],
  Sun: ["mtp", "mtp", "placement", "planning", "mtp"],
};

export function makeDefaultState() {
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS },
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    events: DEFAULT_EVENTS.map((e) => ({ ...e, days: [...e.days] })),
    patterns: Object.fromEntries(Object.entries(DEFAULT_PATTERNS).map(([k, v]) => [k, [...v]])),
    plans: {}, // { "2026-09-21": { blocks: [...], updatedAt } } — only days you touched
    tasks: [], // per-day to-do items
    milestones: [], // goals with due dates
    tests: [], // test/quiz/interview scores
    disruptions: [], // "something came up" log
    logs: [], // free-form Life log entries — see components/LifeLog.js
    logTags: [...DEFAULT_LOG_TAGS],
  };
}
