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
  { ctrl: true, alt: false, shift: false, key: 187 },
  { ctrl: true, alt: false, shift: false, key: 189 },
  { ctrl: true, alt: false, shift: false, key: 85 },
  { ctrl: true, alt: false, shift: false, key: 71 },
];
/**
 * Keyboard key combination to be prevented by default action for keyPress event
 * Only ctrl or cmd or alt or shift are disabled by default.
 * @type {[{ctrl: boolean, shift: boolean, alt: boolean, key: number}]}
 */
export const PreventOnKeyPress = [];
