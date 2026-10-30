// What the command line asked this instance to open.
//
// NL_ARGS includes the executable and Neutralino flags. The explicit --open=
// option takes priority. Otherwise, use the first path after the executable.

const FLAG = "--open=";

/**
 * The path this instance was asked to open, or null for none.
 *
 * @param {string[]} argv typically NL_ARGS
 * @returns {string|null} the requested path
 */
export function openTarget(argv) {
  if (Array.isArray(argv) === false) {
    // NL_ARGS is always defined in a Neutralino window, and this file is also
    // imported by tests that hand it whatever they like.
    return null;
  }

  // Last wins. Two --open flags is not a thing the script produces, but a
  // person typing the binary's name directly might, and answering with the last
  // one is what every shell tool does.
  let found = null;
  for (const argument of argv) {
    if (typeof argument === "string" && argument.startsWith(FLAG)) {
      found = argument.slice(FLAG.length);
    }
  }

  // `--open=` with nothing after it is not a request to open the current
  // directory - it is a script bug, and treating it as a path would open
  // whatever the working directory happens to be.
  if (found === "") {
    return null;
  }
  if (found !== null) {
    return found;
  }

  let optionsEnded = false;
  for (const argument of argv.slice(1)) {
    if (typeof argument !== "string" || argument === "") {
      continue;
    }
    if (!optionsEnded && argument === "--") {
      optionsEnded = true;
      continue;
    }
    if (optionsEnded || !argument.startsWith("-")) {
      return argument;
    }
  }
  return null;
}
