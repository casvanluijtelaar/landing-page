import './style.css';
import initialContent from './content.html?raw';

const typingDiv = document.querySelector<HTMLDivElement>('#app');
const hintDiv = document.querySelector<HTMLDivElement>('#interaction-hint');
const terminalInput = document.querySelector<HTMLInputElement>('#terminal-input');

const typingSpeed = 10000 / initialContent.length;

const TYPING_CURSOR_HTML = '<span class="typing-cursor"></span>';
const CONFIRMATION_MESSAGE_HTML = '<br>Are you sure you want to send this (y/n): ';
const CONFIRMATION_MESSAGE_SUCCESS_HTML = 'y<br>Message sent!<br><br>';
const CONFIRMATION_MESSAGE_CANCELED_HTML = 'n<br>Cancelled.<br><br>';
const MAILTO_DEEPLINK = 'mailto:casvanluijtelaar@hotmail.com';

const HINT_SKIP_TEXT = 'press [enter] to skip';
const HINT_SEND_TEXT = 'press [enter] to send';
const HINT_CONFIRM_TEXT = 'press y or n';

async function printInitialContent() {
  if (!typingDiv || !hintDiv) return;
  hintDiv.textContent = HINT_SKIP_TEXT;
  let isSkipped = false;

  // typing might get annoying for returning visitors, This will
  // allow then to skip the rendering and see the full page content immediately.
  const skipHandler = (e: Event) => {
    if (e.type === 'click' || (e as KeyboardEvent).key === 'Enter') {
      e.preventDefault();
      isSkipped = true;
    }
  };

  hintDiv.addEventListener('click', skipHandler);
  document.addEventListener('keydown', skipHandler);

  for (let i = 0; i <= initialContent.length; i++) {
    if (isSkipped) break;
    typingDiv.innerHTML = initialContent.substring(0, i) + TYPING_CURSOR_HTML;
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
  }

  hintDiv.removeEventListener('click', skipHandler);
  document.removeEventListener('keydown', skipHandler);

  typingDiv.innerHTML = initialContent + TYPING_CURSOR_HTML;
  enableUserTyping();
}


function enableUserTyping() {
  if (!typingDiv || !hintDiv || !terminalInput) return;
  hintDiv.textContent = HINT_SEND_TEXT;

  // since the actual input field is hidden, if the user were to move around
  // the input field text with the arrow keys, it would not be reflected by my
  // fake cursor, I could try and make it work, or just disable arrow key movement :)
  const forceCursorToEnd = () => {
    const len = terminalInput.value.length;
    terminalInput.setSelectionRange(len, len);
  };

  // for mobile, focus the user on the hidden input so, they can start typing as well
  // doesn't work very well right now, so I also make the whole page clickable to focus the input.
  const focusInput = () => {
    terminalInput.focus();
    forceCursorToEnd();
    window.scrollTo(0, document.body.scrollHeight);
  };

  focusInput();
  terminalInput.value = '';
  document.addEventListener('click', focusInput);

  let bufferedContent = '';
  let tempMessage = '';
  let isWaitingForConfirmation = false;

  // I'm sure there will be a 100 more edgecases that don't work well with this setup,
  // this filters out the basics.
  const sanitize = (str: string) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // To make the whole page act as one big terminal, I always take the basic content
  // that I added, and append any new user generated content behind it (unless we are in the confirmation state)
  const updateDisplay = () => {
    const currentTyping = isWaitingForConfirmation ? '' : sanitize(terminalInput.value);
    typingDiv.innerHTML = initialContent + bufferedContent + currentTyping + TYPING_CURSOR_HTML;
    window.scrollTo(0, document.body.scrollHeight);
  };

  // confirmation done, reset everything to allow for new input
  const resetTypingState = () => {
    isWaitingForConfirmation = false;
    tempMessage = '';
    terminalInput.value = '';
    hintDiv.textContent = HINT_SEND_TEXT;
    updateDisplay();
    forceCursorToEnd();
  }

  // basic logic: When the user adds text to the hidden input field, add it to the displayed content
  // After pressing enter, we block all input except for "y" or "no", and handle those accordingly.
  terminalInput.addEventListener('input', () => {
    if (isWaitingForConfirmation) {
      const val = terminalInput.value.toLowerCase();
      const lastChar = val.slice(-1);

      if (lastChar === 'y') {
        bufferedContent += CONFIRMATION_MESSAGE_SUCCESS_HTML;
        window.location.href = `${MAILTO_DEEPLINK}?subject=${encodeURIComponent(tempMessage)}`;
        resetTypingState();
      } else if (lastChar === 'n') {
        bufferedContent += CONFIRMATION_MESSAGE_CANCELED_HTML;
        resetTypingState();
      } else {
        terminalInput.value = '';
      }
    } else {
      updateDisplay();
    }
  });

  // does a couple thing:
  // - block not allowed keys in the input field (prob wont work great for mobile)
  // - when enter key is pressed, switch to confirmation state, store the typed text temporarily
  terminalInput.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if(isWaitingForConfirmation) return;
      const message = terminalInput.value;

      if (message.trim().length > 0) {
        tempMessage = message;
        bufferedContent += sanitize(message) + CONFIRMATION_MESSAGE_HTML;
        isWaitingForConfirmation = true;

        terminalInput.value = '';
        hintDiv.textContent = HINT_CONFIRM_TEXT;
        updateDisplay();
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', printInitialContent);