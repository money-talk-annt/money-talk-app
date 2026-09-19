/**
 * Helper to coordinate scroll-to-top behavior across navigation events.
 * When returning from child screens (such as TransactionDetail),
 * parent list screens (Dashboard, History) skip their focus scroll-to-top,
 * preserving user scroll position.
 */

let skipNextScrollToTop = false;
let resetTimer: ReturnType<typeof setTimeout> | null = null;

export const setSkipScrollToTop = (skip: boolean = true) => {
  skipNextScrollToTop = skip;
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
};

export const shouldSkipScrollToTop = (): boolean => {
  return skipNextScrollToTop;
};

export const checkAndResetSkipScrollToTop = (): boolean => {
  if (skipNextScrollToTop) {
    // Schedule reset after current focus cycle finishes (e.g. 250ms)
    // so all hooks on the regaining-focus screen can consistently see that
    // this navigation event is a return from child/detail screen.
    if (!resetTimer) {
      resetTimer = setTimeout(() => {
        skipNextScrollToTop = false;
        resetTimer = null;
      }, 250);
    }
    return true;
  }
  return false;
};
