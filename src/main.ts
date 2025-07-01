import './style.css'

const contentToType = `
    <h1>Welcome to My Landing Page</h1>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

    <h2>Key Features:</h2>
    <ul>
      <li><strong>Feature 1:</strong> <a href="#">Lorem ipsum dolor sit amet</a>, consectetur adipiscing elit.</li>
      <li><strong>Feature 2:</strong> Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
      <li><strong>Feature 3:</strong> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <a href="#">Learn more</a>.</li>
    </ul>

    <h2>About Us</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Visit our <a href="#">About Page</a> for more information.</p>

    <h2>Contact</h2>
    <p>If you have any questions, feel free to <a href="mailto:info@example.com">contact us</a>.</p>
`;

const typedContentDiv = document.querySelector<HTMLDivElement>('#typed-content');
const accessibilityButton = document.querySelector<HTMLButtonElement>('#accessibility-button');

let typingTimeout: number; // To store the timeout ID for clearing

function applyAccessibleMode() {
  clearTimeout(typingTimeout); // Stop any ongoing typing animation
  if (typedContentDiv) {
    typedContentDiv.innerHTML = contentToType; // Display all content immediately
    const cursor = typedContentDiv.querySelector('.typing-cursor');
    if (cursor) {
      cursor.remove(); // Remove the cursor
    }
  }
  document.body.classList.add('accessible-mode'); // Add class for accessible styling
  if (accessibilityButton) {
    accessibilityButton.style.display = 'none'; // Hide the button once activated
  }
}

if (typedContentDiv) {
  // Initial state: hide content until typed or accessible mode is active
  typedContentDiv.innerHTML = '';

  // Check for prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyAccessibleMode();
  } else {
    // Start typing animation if not in accessible mode
    let i = 0;
    const typingSpeed = 10000 / contentToType.length; // 10 seconds for the entire content

    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('typing-cursor');

    function typeWriter() {
      if (i < contentToType.length) {
        typedContentDiv.innerHTML = contentToType.substring(0, i + 1) + '<span class="typing-cursor"></span>';
        i++;
        typingTimeout = setTimeout(typeWriter, typingSpeed);
      } else {
        // Cursor remains after typing is complete
      }
    }

    typeWriter();
  }
}

// Event listener for the accessibility button
if (accessibilityButton) {
  accessibilityButton.addEventListener('click', applyAccessibleMode);
}
