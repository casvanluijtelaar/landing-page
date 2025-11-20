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


/**
 * Simulates typing the initial content.
 */
async function printInitialContent() {
  if (!typingDiv || !hintDiv) return;
  hintDiv.textContent = 'press [enter] to skip';
  let isSkipped = false;

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

/**
 * Enables the unified typing interface.
 */
function enableUserTyping() {
  if (!typingDiv || !hintDiv || !terminalInput) return;
  hintDiv.textContent = 'press [enter] to send';
  
  // Helper to force cursor to the end of the input
  const forceCursorToEnd = () => {
    const len = terminalInput.value.length;
    terminalInput.setSelectionRange(len, len);
  };

  // Focus logic: Ensure we are focused and at the end
  const focusInput = () => {
    terminalInput.focus();
    forceCursorToEnd();
  };

  // Initialize focus
  focusInput();
  terminalInput.value = '';

  // Maintain focus if user clicks anywhere on the page
  document.addEventListener('click', focusInput);

  let bufferedContent = ''; 
  let tempMessage = ''; 
  let isWaitingForConfirmation = false;

  const sanitize = (str: string) => {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  };

  const updateDisplay = () => {
    const currentTyping = isWaitingForConfirmation ? '' : sanitize(terminalInput.value);
    typingDiv.innerHTML = initialContent + bufferedContent + currentTyping + TYPING_CURSOR_HTML;
    window.scrollTo(0, document.body.scrollHeight);
  };

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

  // LISTENER 2: Keydown Event (Control Keys)
  terminalInput.addEventListener('keydown', (e) => {
    // 1. Block Navigation Keys to prevent moving cursor
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // 2. Handle Enter
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!isWaitingForConfirmation) {
        const message = terminalInput.value;
        if (message.trim().length > 0) {
          tempMessage = message;
          bufferedContent += sanitize(message) + CONFIRMATION_MESSAGE_HTML;
          isWaitingForConfirmation = true;
          
          terminalInput.value = ''; 
          hintDiv.textContent = 'press y or n';
          updateDisplay();
        }
      }
    }
  });

  const resetTypingState = () => {
    isWaitingForConfirmation = false;
    tempMessage = '';
    terminalInput.value = '';
    hintDiv.textContent = 'press [enter] to send';
    updateDisplay();
    forceCursorToEnd();
  }
}

window.addEventListener('DOMContentLoaded', printInitialContent);