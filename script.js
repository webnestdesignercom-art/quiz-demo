const quizData = [
  { question:"Which is used for styling?", options:["HTML","CSS","Python"], correct:1 },
  { question:"Which is used for interactivity?", options:["JavaScript","SQL","PHP"], correct:0 },
  { question:"What does DOM stand for?", options:["Document Object Model","Data Object Mode","Digital Order Model"], correct:0 }
];

const quizContainer = document.getElementById("quizContainer");
const submitBtn = document.getElementById("submitBtn");
const pdfBtn = document.getElementById("pdfBtn");
const resultDiv = document.getElementById("result");
const progressBar = document.getElementById("progressBar");

function renderQuiz(){
  quizData.forEach((q,index)=>{
    const card=document.createElement("div");
    card.className="card";

    card.innerHTML=`
      <div class="question-title">${index+1}. ${q.question}</div>
      ${q.options.map((opt,i)=>`
        <label class="option">
          <input type="radio" name="question${index}" value="${i}" onchange="updateProgress()">
          ${opt}
        </label>
      `).join("")}
    `;

    quizContainer.appendChild(card);
  });
}

function updateProgress(){
  let answered=0;
  quizData.forEach((_,i)=>{
    if(document.querySelector(`input[name="question${i}"]:checked`)) answered++;
  });

  progressBar.style.width=(answered/quizData.length)*100+"%";
  submitBtn.disabled = answered !== quizData.length;
}

function validateQuiz(){
  let valid=true;

  quizData.forEach((_,i)=>{
    const selected=document.querySelector(`input[name="question${i}"]:checked`);
    const options=document.querySelectorAll(`input[name="question${i}"]`);

    if(!selected){
      valid=false;
      options.forEach(opt=>opt.parentElement.classList.add("invalid"));
    } else {
      options.forEach(opt=>opt.parentElement.classList.remove("invalid"));
    }
  });

  return valid;
}

function calculateScore(){
  let score=0;
  quizData.forEach((q,i)=>{
    const selected=document.querySelector(`input[name="question${i}"]:checked`);
    if(parseInt(selected.value)===q.correct) score++;
  });
  return score;
}

submitBtn.addEventListener("click",()=>{
  if(!validateQuiz()) return;

  submitBtn.textContent="Checking...";
  submitBtn.disabled=true;

  setTimeout(()=>{
    const score=calculateScore();
    const percentage=Math.round((score/quizData.length)*100);

    resultDiv.className="result success";
    resultDiv.textContent=`🎉 You scored ${score}/${quizData.length} (${percentage}%)`;

    submitBtn.textContent="Submitted";
    pdfBtn.style.display="inline-block";
  },800);
});

pdfBtn.addEventListener("click",()=>{
  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();
  const score=calculateScore();
  const percentage=Math.round((score/quizData.length)*100);

  doc.text("Developer Quiz Results",20,20);
  doc.text(`Score: ${score}/${quizData.length}`,20,30);
  doc.text(`Percentage: ${percentage}%`,20,40);
  doc.save("quiz-result.pdf");
});

document.getElementById("waitlistForm").addEventListener("submit",function(e){
  e.preventDefault();

  const emailInput=document.getElementById("emailInput");
  const btn=document.getElementById("waitlistBtn");
  const message=document.getElementById("waitlistMessage");

  if(!emailInput.value || !emailInput.checkValidity()){
    message.innerHTML="<div class='error'>Please enter a valid email.</div>";
    return;
  }

  btn.textContent="Joining...";
  btn.disabled=true;

  setTimeout(()=>{
    message.innerHTML="<div class='success-box'>✅ Successfully added to the developer waitlist!</div>";
    emailInput.value="";
    btn.textContent="Joined";
  },800);
});

renderQuiz();