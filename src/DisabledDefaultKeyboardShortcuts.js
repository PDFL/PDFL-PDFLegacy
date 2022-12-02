/**
 * Keyboard key combination to be prevented by default action for keyUp event
 * @type {[{ctrl: boolean, shift: boolean, alt: boolean, key: number}]}
 */
export const PreventOnKeyUp = [];
/**
 * Keyboard key combination to be prevented by default action for keyDown event
 * @type {[{ctrl: boolean, shift: boolean, alt: boolean, key: number}]}
 */
export const PreventOnKeyDown = [
  { ctrl: true, alt: false, shift: false, key: "+" },
  { ctrl: true, alt: false, shift: false, key: "-" },
  { ctrl: true, alt: false, shift: false, key: "u" },
  { ctrl: true, alt: false, shift: false, key: "g" },
];
/**
 * Keyboard key combination to be prevented by default action for keyPress event
 * Only ctrl or cmd or alt or shift are disabled by default.
 * @type {[{ctrl: boolean, shift: boolean, alt: boolean, key: number}]}
 */
export const PreventOnKeyPress = [];
