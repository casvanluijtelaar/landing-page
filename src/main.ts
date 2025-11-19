import './style.css';
import initialContent from './content.html?raw';

const typingDiv = document.querySelector<HTMLDivElement>('#app');
const hintDiv = document.querySelector<HTMLDivElement>('#interaction-hint');
const typingSpeed = 10000 / initialContent.length;

const TYPING_CURSOR_HTML = '<span class="typing-cursor"></span>'
const CONFIRMATION_MESSAGE_HTML = '<br>Are you sure you want to send this (y/n): ';
const CONFIRMATION_MESSAGE_SUCCESS_HTML = 'y<br>Message sent!<br><br>';
const CONFIRMATION_MESSAGE_CANCELED_HTML = 'n<br>Cancelled.<br><br>';
const MAILTO_DEEPLINK = 'mailto:casvanluijtelaar@hotmail.com';

/**
 * Takes the content from content.html and prints it character by character
 * to the typingDiv element, simulating a typing effect. when it completes,
 * it enables user typing functionality through [enableUserTyping].
 * @returns void
 */
async function printInitialContent() {
  if (!typingDiv) return;
  if (hintDiv) hintDiv.textContent = 'press [enter] to skip';
  let isSkipped = false;

  const skipHandler = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;   
    e.preventDefault();
    isSkipped = true;
  };
  document.addEventListener('keydown', skipHandler);

  for (let i = 0; i <= initialContent.length; i++) {
    if (isSkipped) break;
    typingDiv.innerHTML = initialContent.substring(0, i) + TYPING_CURSOR_HTML;
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
  }

  document.removeEventListener('keydown', skipHandler);
  typingDiv.innerHTML = initialContent + TYPING_CURSOR_HTML;

  enableUserTyping();
}

/**
 * allows the user to type their own custom content to the screen,
 * with a confirmation prompt when they press Enter that sends the typed
 * content as a message.
 * @returns void
 */
function enableUserTyping() {
  if (!typingDiv) return;
  if (hintDiv) hintDiv.textContent = 'press [enter] to send';

  let bufferedContent = ''; // content that cant be errased
  let userContent = ''; // actively typed content, that can be modified
  let isWaitingForConfirmation = false; // whether we are waiting for y/n input

  // switches between user typing, and message confirmation state
  const interceptTyping = (e: KeyboardEvent) => {
    if (isWaitingForConfirmation) {
      handleConfirmationInput(e);
    } else {
      handleStandardInput(e);
    }
    typingDiv.innerHTML = initialContent + bufferedContent + userContent + TYPING_CURSOR_HTML;
    window.scrollTo(0, document.body.scrollHeight);
  }

  // standard state, user is typing, can enter most normal characters
  // when pressing Backspace, delete those typed characters, and when
  // pressing Enter, switch to confirmation state
  const handleStandardInput = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && userContent.trim().length > 0) {
      e.preventDefault();
      userContent += CONFIRMATION_MESSAGE_HTML;
      isWaitingForConfirmation = true;
      return;
    }

    if (e.key === 'Backspace') {
      userContent = userContent.slice(0, -1);
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      userContent += e.key.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  };

  // when triggering the confermation state, we show an y/n prompt
  // here we only accept those two inputs, where 'y' sends the message
  // through a mailto deeplink, and 'n' cancels the sending
  const handleConfirmationInput = (e: KeyboardEvent) => {
    e.preventDefault();

    const key = e.key.toLowerCase();
    const actions: Record<string, string> = {
      'y': CONFIRMATION_MESSAGE_SUCCESS_HTML,
      'n': CONFIRMATION_MESSAGE_CANCELED_HTML
    };

    if (actions[key]) {
      const suffix = actions[key];

      if (key === 'y') {
        const message = userContent.replaceAll(CONFIRMATION_MESSAGE_HTML, '');
        window.location.href = `${MAILTO_DEEPLINK}?subject=${encodeURIComponent(message)}`;
      }

      bufferedContent += userContent + suffix;
      userContent = '';
      isWaitingForConfirmation = false;
    }
  };

  document.addEventListener('keydown', interceptTyping);
}

window.addEventListener('DOMContentLoaded', printInitialContent);