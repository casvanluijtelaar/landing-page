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

if (typedContentDiv) {
  let i = 0;
  const typingSpeed = 10000 / contentToType.length; // 10 seconds for the entire content

  function typeWriter() {
    if (i < contentToType.length) {
      typedContentDiv.innerHTML = contentToType.substring(0, i + 1);
      i++;
      setTimeout(typeWriter, typingSpeed);
    }
  }

  typeWriter();
}
