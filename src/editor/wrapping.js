import { getSetting } from "../store.js";

export const WORD_WRAP_KEY = "wordWrap";

export function wordWrapEnabled() {
  return getSetting(WORD_WRAP_KEY, false) === true;
}
