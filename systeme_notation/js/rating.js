const stars = document.querySelectorAll(".star");
const pEl = document.getElementById("res");
let saveEval = 0;

stars.forEach((star) => {
  star.addEventListener("click", (event) => {
    saveEval = selectEvaluation(event);
  });
  star.addEventListener("mouseenter", (event) => selectEvaluation(event));
  star.addEventListener("mouseleave", (event) => setStarsToConfirmEval(event));
});

/**
 *
 * @param {Event} event
 */
function selectEvaluation(event) {
  event.preventDefault();
  const el = event.target;
  const eval = el.getAttribute("data-value");
  setStarsClasses(eval);
  pEl.innerText = eval;
  return eval;
}

function setStarsToConfirmEval(event) {
  event.preventDefault();
  setStarsClasses(saveEval);
}

function setStarsClasses(eval) {
  stars.forEach((element) => {
    if (element.getAttribute("data-value") <= eval) {
      element.classList.add("star-selected");
    } else {
      element.classList.remove("star-selected");
    }
  });
  pEl.innerText = eval;
}
