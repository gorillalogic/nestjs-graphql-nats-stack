/**
 * Creates an event handler to be used with KeyboardEvents 
 * Example:
 *   const enterDown = keyHandlerBuilder((_) => { setEnterKeyPressed(true) }, "Enter")
 *   const enterUp = keyHandlerBuilder((_) => { setEnterKeyPressed(false) }, "Enter")
 *   document.addEventListener('keydown', enterDown);
 *   document.addEventListener('keyup', enterUp);
 */
export const keyHandlerBuilder = (callback: (keyCode: string) => void, keyCode: string) : ((event: KeyboardEvent) => void) => {
  return ((event: KeyboardEvent) => {
    if (event.key === keyCode) {
      event.preventDefault();
      callback(keyCode);
    } 
  })
};

/**
 * Subscribe two functions to Down and Up Keyboard events
 * Returns cleanup function to be called for example in the return of useEffects;
 */
export const subscribeKey = (keyCode: string, onDown: ((keyCode: string) => void), onUp: ((keyCode: string) => void)) : (() => void) => {
    const downHandler = keyHandlerBuilder((_) => { onDown(keyCode) }, "Enter")
    const upHandler = keyHandlerBuilder((_) => { onUp(keyCode) }, "Enter")
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);
    return () => {
      document.removeEventListener('keydown', downHandler)
      document.removeEventListener('keyup', upHandler)
    };

}
