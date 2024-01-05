class KeyElements {
  constructor(
    replaceMenuCloseButton,
    findInput,
    replaceInput,
    replaceAllButton
  ) {
    this.replaceMenuCloseButton = replaceMenuCloseButton;
    this.findInput = findInput;
    this.replaceInput = replaceInput;
    this.replaceAllButton = replaceAllButton;
  }
}

function clickElement(el) {
  var box = el.getBoundingClientRect(),
    coordX = box.left + (box.right - box.left) / 2,
    coordY = box.top + (box.bottom - box.top) / 2;

  simulateMouseEvent(el, "mouseover", coordX, coordY);
  simulateMouseEvent(el, "mousedown", coordX, coordY);
  simulateMouseEvent(el, "click", coordX, coordY);
  simulateMouseEvent(el, "mouseup", coordX, coordY);
}

var simulateMouseEvent = function (element, eventName, coordX, coordY) {
  element.dispatchEvent(
    new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY,
      button: 0,
    })
  );
};

function openReplaceAllMenu() {
  const openReplaceAllMenu = new KeyboardEvent("keydown", {
    key: "h",
    ctrlKey: true,
    bubbles: true,
  });
  document.body.dispatchEvent(openReplaceAllMenu);

  const openReplaceAllMenuMac = new KeyboardEvent("keydown", {
    key: "h",
    metaKey: true,
    bubbles: true,
  });
  document.body.dispatchEvent(openReplaceAllMenuMac);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
