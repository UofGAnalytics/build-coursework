document.querySelectorAll('.answer-trigger').forEach((elem) => {
  elem.addEventListener('click', toggleAnswer);
});

function toggleAnswer(e: Event) {
  const target = e.target as HTMLElement;
  const { answerId } = target.dataset;
  const $answer = document.getElementById(`answer-${answerId}`);
  if ($answer) {
    $answer.classList.toggle('show');
  }
}
