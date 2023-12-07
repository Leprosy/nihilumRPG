export class Key {
  private static keys = {};
  private static pressed: string[] = [];

  private static listener(event: KeyboardEvent) {
    console.log("Key: KeyboardEvent", Key.keys);

    if (event.type === "keydown") {
      if (Key.pressed.indexOf(event.code) < 0) {
        Key.pressed.push(event.code);
      }

      if (
        Key.keys[event.code] &&
        typeof Key.keys[event.code].keydown === "function"
      ) {
        Key.keys[event.code].keydown(event);
      }
    }

    if (event.type === "keyup") {
      if (Key.pressed.indexOf(event.code) >= 0) {
        Key.pressed.splice(Key.pressed.indexOf(event.code), 1);
      }

      if (
        Key.keys[event.code] &&
        typeof Key.keys[event.code].keyup === "function"
      ) {
        Key.keys[event.code].keyup(event);
      }
    }
  }

  static start() {
    document.addEventListener("keydown", this.listener);
    document.addEventListener("keyup", this.listener);
    this.keys = {};
    this.pressed = [];
    console.debug("Key: Listener registered.");
  }

  static stop() {
    document.removeEventListener("keydown", this.listener);
    document.removeEventListener("keyup", this.listener);
    console.debug("Key: No more handlers, removing listener.");
  }

  static add(
    code: string,
    handlerDown: (event: KeyboardEvent) => void,
    handlerUp?: (event: KeyboardEvent) => void
  ) {
    if (typeof handlerDown !== "function") {
      throw Error(
        "Key: At least keydown handler listener function should be provided."
      );
    }

    this.keys[code] = {
      keydown: handlerDown,
      keyup: handlerUp,
    };
  }

  // Remove key handlers
  static remove(code: string) {
    if (this.keys[code]) {
      delete this.keys[code];
    } else {
      console.error("Key: Code doesn't have an event attached.", code);
    }
  }

  static removeAll() {
    for (const key in this.keys) {
      this.remove(key);
    }
  }

  static isPressed(code: string) {
    return this.pressed.indexOf(code) >= 0;
  }
}
