/* ===========================================================================
 * ASCON CBT — front-end configuration
 * ---------------------------------------------------------------------------
 * Paste your Google Apps Script Web App URL below (the one ending in /exec),
 * then save. That's the only thing you must change to go live.
 * =========================================================================== */
window.ASCON_CONFIG = {
  // e.g. "https://script.google.com/macros/s/AKfycb....../exec"
  API_URL: "https://script.google.com/macros/s/AKfycbyiOMnhWdhCaI-Qn3WyYiGdf_HTCaNcimeoAcQj81LcX7yjrqEUn28VYR7ODQlc-yim/exec",

  // How often the browser quietly saves progress to the backend (seconds).
  // Answers are ALSO saved instantly in the browser, so this is just the
  // backup sync. Higher = less server load. 60 is a good default for 300+ users.
  SYNC_SECONDS: 20
};
