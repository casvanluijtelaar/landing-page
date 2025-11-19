import './style.css';
import initialContent from './content.html?raw';

const typingDiv = document.querySelector<HTMLDivElement>('#app');
const typingSpeed = 10000 / initialContent.length;

const TYPING_CURSOR_HTML = '<span class="typing-cursor"></span>'
const CONFIRMATION_MESSAGE_HTML = '<br>Are you sure you want to send this (y/n): ';
const CONFIRMATION_MESSAGE_SUCCESS_HTML = 'y<br>Message sent!<br><br>';
const CONFIRMATION_MESSAGE_CANCELED_HTML = 'n<br>Cancelled.<br><br>';

/**
 * Takes the content from content.html and prints it character by character
 * to the typingDiv element, simulating a typing effect. when it completes,
 * it enables user typing functionality through [enableUserTyping].
 * @returns void
 */
async function printInitialContent() {
  if (!typingDiv) return;

  for (let i = 0; i <= initialContent.length; i++) {
    typingDiv.innerHTML = initialContent.substring(0, i) + TYPING_CURSOR_HTML;
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
  }

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

  let bufferedContent = ''; // content that cant be errased
  let userContent = ''; // actively typed content, that can be modified
  let isWaitingForConfirmation = false; // whether we are waiting for y/n input

  const sanitize = (str: string) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const handleConfirmationInput = (e: KeyboardEvent) => {
    e.preventDefault();

    const key = e.key.toLowerCase();
    const actions: Record<string, string> = {
      'y': CONFIRMATION_MESSAGE_SUCCESS_HTML,
      'n': CONFIRMATION_MESSAGE_CANCELED_HTML
    };

    if (actions[key]) {
      const suffix = actions[key];
      console.log(userContent.replaceAll(CONFIRMATION_MESSAGE_HTML, ''));

      bufferedContent += userContent + suffix;
      userContent = '';
      isWaitingForConfirmation = false;
    }
  };

  const handleStandardInput = (e: KeyboardEvent) => {
    // 1. Handle Enter (Trigger Confirmation)
    if (e.key === 'Enter' && userContent.trim().length > 0) {
      e.preventDefault();
      userContent += CONFIRMATION_MESSAGE_HTML;
      isWaitingForConfirmation = true;
      return;
    }

    // 2. Handle Backspace
    if (e.key === 'Backspace') {
      userContent = userContent.slice(0, -1);
      return;
    }

    // 3. Handle Standard Typing (Single char, no modifiers)
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      userContent += sanitize(e.key);
    }
  };

  document.addEventListener('keydown', (e) => {
    if (isWaitingForConfirmation) {
      handleConfirmationInput(e);
    } else {
      handleStandardInput(e);
    }

    typingDiv.innerHTML = initialContent + bufferedContent + userContent + TYPING_CURSOR_HTML;
    window.scrollTo(0, document.body.scrollHeight);
  });
}

window.addEventListener('DOMContentLoaded', printInitialContent);
