document.querySelectorAll('.answer-trigger').forEach((elem) => {
  elem.addEventListener('click', toggleAnswer);
});

function toggleAnswer(e: Event) {
  const target = e.target as HTMLElement;
  const id = `answer-${target.dataset.answerId}`;
  const $answer = document.getElementById(id) as Element;

  if ($answer.classList.contains('show')) {
    $answer.classList.remove('show');
    target.innerHTML = 'Show answer';
  } else {
    $answer.classList.add('show');
    target.innerHTML = 'Hide answer';
  }
}
