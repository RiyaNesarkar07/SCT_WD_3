const quizData = [
  { question: "Which language runs in a web browser?", type: "single", options: ["Java", "C", "Python", "JavaScript"], correct: ["JavaScript"] },
  { question: "Select all JavaScript frameworks.", type: "multi", options: ["React", "Django", "Angular", "Flask"], correct: ["React", "Angular"] },
  { question: "Fill in the blank: CSS stands for ______ Style Sheets.", type: "fill", correct: ["Cascading"] },
  { question: "Which of these are programming languages?", type: "multi", options: ["HTML", "Python", "CSS", "Java"], correct: ["Python", "Java"] },
  { question: "Single choice: What does HTML stand for?", type: "single", options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"], correct: ["Hyper Text Markup Language"] }
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userAnswers = [];

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById('time').textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function buildQuestion(index) {
  quizContainer.innerHTML = '';
  const q = quizData[index];
  const answers = q.options
    ? q.options.map(opt => {
        const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
        return `<label><input type="${inputType}" name="question${index}" value="${opt}"> ${opt}</label><br>`;
      }).join('')
    : `<input type="text" name="question${index}" placeholder="Your answer">`;

  quizContainer.innerHTML = `<div class="question"><h3>${q.question}</h3><div class="answers">${answers}</div></div>`;
}

function checkAnswer() {
  const q = quizData[currentQuestionIndex];
  let correct = false;
  let userAnswer;
  
  if (q.type === 'fill') {
    userAnswer = document.querySelector(`input[name=question${currentQuestionIndex}]`).value.trim();
    correct = userAnswer.toLowerCase() === q.correct[0].toLowerCase();
  } else {
    userAnswer = Array.from(document.querySelectorAll(`input[name=question${currentQuestionIndex}]:checked`)).map(e => e.value);
    correct = userAnswer.length === q.correct.length && userAnswer.every(v => q.correct.includes(v));
  }

  if (correct) score++;
  userAnswers.push({ question: q.question, correct: q.correct, user: Array.isArray(userAnswer) ? userAnswer : [userAnswer], isCorrect: correct });
}

function nextQuestion() {
  checkAnswer();
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    buildQuestion(currentQuestionIndex);
    startTimer();
  } else {
    showResults();
  }
}

function showResults() {
  quizContainer.innerHTML = '';
  let output = `<h2>Your Score: ${score} / ${quizData.length}</h2>`;
  
  userAnswers.forEach((ans, i) => {
    output += `<p><strong>Q${i+1}:</strong> ${ans.question}<br>`;
    if (ans.isCorrect) {
      output += `<span class="correct-answer">Your Answer: ${ans.user.join(', ')}</span>`;
    } else {
      output += `<span class="wrong-answer">Your Answer: ${ans.user.join(', ') || 'No answer'}</span><br>`;
      output += `<span class="correct-answer">Correct Answer: ${ans.correct.join(', ')}</span>`;
    }
    output += `</p>`;
  });
  
  output += `<button onclick="restartQuiz()">Restart Quiz</button>`;
  resultContainer.innerHTML = output;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  resultContainer.innerHTML = '';
  buildQuestion(currentQuestionIndex);
  startTimer();
}

submitButton.addEventListener('click', () => {
  clearInterval(timer);
  nextQuestion();
});

buildQuestion(currentQuestionIndex);
startTimer();
