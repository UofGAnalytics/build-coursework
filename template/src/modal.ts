const $modal = document.getElementById('modal') as Element;
const $close = document.getElementById('modal-close') as Element;
const $bg = document.getElementById('modal-bg') as Element;
const $content = document.getElementById('modal-content') as Element;

$close.addEventListener('click', closeModal);
$bg.addEventListener('click', closeModal);

export function closeModal() {
  $modal.classList.remove('show');
  setTimeout(() => {
    $content.innerHTML = '';
  }, 500);
}

export function openModal(content: string) {
  $content.innerHTML = content;
  $modal.classList.add('show');
}
