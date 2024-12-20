import "./book.css";
import "./main.css";

import { createPopper } from "@popperjs/core";

class RangeRef {
  constructor() {
    this.updateRect();

    const update = (evt, hide) => {
      let selection = document.getSelection();
      this.range = selection && selection.rangeCount && selection.getRangeAt(0);
      this.updateRect(hide);
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update);
    document.scrollingElement.addEventListener("scroll", update);
  }

  updateRect(hide) {
    if (!hide && this.range) {
      this.rect = this.range.getBoundingClientRect();
    } else {
      this.rect = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
    }

    this.rectChangedCallback(this.rect);
  }

  rectChangedCallback() {
    // Abstract to be implemented
  }

  getBoundingClientRect() {
    return this.rect;
  }
}

let selectedText = null;
const tooltip = document.getElementById("tooltip");
const rangeRef = new RangeRef();
const popper = createPopper(rangeRef, tooltip, {
  placement: "bottom",
  modifiers: [{ offset: { offset: "0,5" } }],
});

function hide() {
  tooltip.removeAttribute("data-show");
}

rangeRef.rectChangedCallback = ({ width }) => {
  selectedText = getSelection().toString();
  if (width > 0 && selectedText && selectedText.length > 10) {
    tooltip.setAttribute("data-show", "");
    popper.update();
  } else {
    hide();
  }
};

const share = document.getElementById("shareBtn");
share.addEventListener("click", () => {
  if (!selectedText) {
    return;
  }
  let hash;
  if (selectedText.length > 1000) {
    selectedText = selectedText.substring(0, 1000);
    hash = encodeURIComponent(selectedText);
    selectedText += "…";
  } else {
    hash = encodeURIComponent(selectedText);
  }
  window.webxdc.sendUpdate(
    { payload: "", info: selectedText, href: `index.html#${hash}` },
    "",
  );
  hide();
  getSelection().removeAllRanges();
});

window.addEventListener("load", () => {
  const quote = decodeURIComponent(window.location.hash.substring(1));
  if (quote && window.find) {
    window.find(quote);
  } else {
    const scrollpos = localStorage.getItem("scrollpos");
    if (scrollpos) window.scrollTo(0, scrollpos);
  }
});

document.addEventListener("visibilitychange", () => {
  localStorage.setItem("scrollpos", window.scrollY);
});
