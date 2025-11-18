const typedContentDiv = document.querySelector<HTMLDivElement>('#app');
const content = `
    <h2>Software development consultant focussing on helping teams and clients scale software not people. Mainly been deep diving into building and scaling modern mobile solutions.</h2>

    <h3>I enjoy sharing learnings from big projects and clients</h3>
    <ul>
      <li><a href="https://www.youtube.com/watch?v=zDRlEp7r5i0" target="_blank">Building a 45 million MOA app from scratch</a></li>      
      <li><a href=" https://evolutionjobs.com/exchange/evo-nordics-419-kotlin-multi-platform-discussion/" target="_blank">The power of the cross platform domain layer</a></li>      
      <li><a href="https://www.youtube.com/watch?v=HSIhkB5bGJs" target="_blank">Cross platform navigation patterns and system</a></li>
    </ul>

    <h3>Complex solutions for a specific project should ideally be abstracted and shareable</h3>
    <ul>
       <li><a href="https://github.com/apegroup/revolver" target="_blank">Cross platform state management</a></li>	
       <li><a href="https://github.com/casvanluijtelaar/reorderable_grid" target="_blank">Scaleable, reorderable, animated grid framework</a></li>	
       <li><a href="https://github.com/casvanluijtelaar/faker.dart" target="_blank">Generate massive amounts of mock data</a>, pre-LLMs 😉</li>	
       <li><a href="https://github.com/casvanluijtelaar/paged_vertical_calendar" target="_blank">Let me solve the headache of calendar infrastructure for you</a></li>
    </ul>

    <h3>If you want to see more of me, I'm usually hanging out here</h3>
    <ul>
       <li><a href="https://www.linkedin.com/in/cas-van-luijtelaar/" target="_blank">Linkedin</a></li>	
       <li><a href="https://github.com/casvanluijtelaar" target="_blank">Github</a></li>
    </ul>

    <h2>But ideally, shoot me a <a href="mailto:casvanluijtelaar@hotmail.com">message</a>. so we can hop on a call, or even better, grab a coffee.</h2>

    <p>
      Cas van Luijtelaar<br>
      <small>Tech lead @ <a href="https://umain.com/" target="_blank">Umain</a></small><br>
      <small>Stockholm</small>
    </p>
`;

function typeWriter() {
  if (!typedContentDiv) return;

  let i = 0;
  const typingSpeed = 10000 / content.length;

  const type = () => {
    if (i < content.length) {
      typedContentDiv.innerHTML = content.substring(0, i + 1) + '<span class="typing-cursor"></span>';
      i++;
      setTimeout(type, typingSpeed);
    } else {
      typedContentDiv.innerHTML = content + '<span class="typing-cursor"></span>';
    }
  };

  type();
}

window.addEventListener('DOMContentLoaded', typeWriter);