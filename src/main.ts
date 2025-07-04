import './style.css';


function typeWriter() {
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

  const typedContentDiv = document.querySelector<HTMLDivElement>('#crt-content');
  if (!typedContentDiv) return;
  let typingTimeout: number;

  let i = 0;
  const typingSpeed = 10000 / contentToType.length;

  const type = () => {
    if (i < contentToType.length) {
      typedContentDiv.innerHTML = contentToType.substring(0, i + 1) + '<span class="typing-cursor"></span>';
      i++;
      typingTimeout = setTimeout(type, typingSpeed);
    } else {
      typedContentDiv.innerHTML = contentToType + '<span class="typing-cursor"></span>';
    }
  };

  type();
}


function updateBarrelMap() {
  const crt = document.querySelector('.crt-screen');
  const canvas = document.getElementById('barrel-canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = '/barrel-map.png';

  img.onload = function() {
    // Match canvas size to the element
    canvas.width = crt.offsetWidth;
    canvas.height = crt.offsetHeight;

    // Draw the image stretched to fill the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get the data URL
    const dataURL = canvas.toDataURL();

    // Set the feImage xlink:href to the data URL
    const feImage = document.getElementById('barrel-feimage');
    feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataURL);
  };
}

window.addEventListener('load', updateBarrelMap);
window.addEventListener('resize', updateBarrelMap);
window.addEventListener('DOMContentLoaded', typeWriter);
