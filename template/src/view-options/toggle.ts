// toggle view options
const button = document.getElementById('view-options-toggle') as Element;
button.addEventListener('click', toggleOpen);

let viewOptionsOpen = false;
function toggleOpen() {
  if (viewOptionsOpen) {
    document.documentElement.classList.remove('view-options-open');
    button.innerHTML = 'View options';
    viewOptionsOpen = false;
  } else {
    document.documentElement.classList.add('view-options-open');
    button.innerHTML = 'Table of contents';
    viewOptionsOpen = true;
  }
}
