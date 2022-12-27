var Question = function (questionObj) {
    this.value = {
      text: "Question",
      answers: []
    };
  
    this.selectedAnswer = null;
    this.html = null;
    this.questionText = null;
    this.questionAnswers = null;
    this.questionFeedback = null;
  
    this.value = Object.assign(this.value, questionObj);
  
    this.onQuestionAnswered = ({ detail }) => {
      this.selectedAnswer = {
        value: detail.answer,
        html: detail.answerHtml
      };
      this.update();
  
      document.dispatchEvent(
        new CustomEvent("question-answered", {
          detail: {
            question: this,
            answer: detail.answer
          }
        })
      );
    };
  
    this.create = function () {
      this.html = document.createElement("div");
      this.html.classList.add("question");
  
      this.questionText = document.createElement("h2");
      this.questionText.textContent = this.value.text;
  
      this.questionAnswers = document.createElement("div");
      this.questionAnswers.classList.add("answers");
  
      for (let i = 0; i < this.value.answers.length; i++) {
        const ansObj = this.value.answers[i];
        let answer = createAnswer(ansObj);
  
        answer.onclick = (ev) => {
          if (this.selectedAnswer !== null) {
            this.selectedAnswer.html.classList.remove("selected");
          }
  
          answer.classList.add("selected");
  
          this.html.dispatchEvent(
            new CustomEvent("question-answered", {
              detail: {
                answer: ansObj,
                answerHtml: answer
              }
            })
          );
        };
  
        this.questionAnswers.appendChild(answer);
      }
  
      this.questionFeedback = document.createElement("div");
      this.questionFeedback.classList.add("question-feedback");
  
      this.html.appendChild(this.questionText);
      this.html.appendChild(this.questionAnswers);
      this.html.appendChild(this.questionFeedback);
  
      this.html.addEventListener("question-answered", this.onQuestionAnswered);
  
      return this.html;
    };
  
    this.disable = function () {
      this.html.classList.add("disabled");
      this.html.onclick = (ev) => {
        ev.stopPropagation();
      };
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      let answers = this.html.querySelectorAll(".answer");
      for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        answer.onclick = null;
      }
    };
  
    this.remove = function () {
      let children = this.html.querySelectorAll("*");
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        this.html.removeChild(child);
      }
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      this.html.parentNode.removeChild(this.html);
      this.html = null;
    };
  
    this.update = function () {
      let correctFeedback, incorrectFeedback;
      this.html = this.html || document.createElement("div");
  
      correctFeedback = "Quelle intelligence ! Epouses-moi !";
      incorrectFeedback = "Retournes à l'école !!";
  
      if (this.selectedAnswer !== null) {
        if (this.selectedAnswer.value.isCorrect) {
          this.html.classList.add("correct");
          this.html.classList.remove("incorrect");
          this.questionFeedback.innerHTML = correctFeedback;
        } else {
          this.html.classList.add("incorrect");
          this.html.classList.remove("correct");
          this.questionFeedback.innerHTML = incorrectFeedback;
        }
      }
    };
 
    function createAnswer(obj) {
      this.value = {
        text: "Answer",
        isCorrect: false
      };
  
      this.value = Object.assign(this.value, obj);
  
      this.html = document.createElement("button");
      this.html.classList.add("answer");
  
      this.html.textContent = this.value.text;
  
      return this.html;
    }
  };
  
  //
  // main.js
  //
  
  let questionsData = [
    {
      text: "Quel est le slogan de la marque Sodebo ?",
      answers: [
        {
          text: "On se souvient surtout du plaisir",
          isCorrect: false
        },
        {
          text: "On se souvient surtout du goût.",
          isCorrect: true
        },
        {
          text: "On se souvient de manger bien pour pas cher",
          isCorrect: false
        },
        {
            text: "On se souvient surtout de la qualité",
            isCorrect: false
          }

      ]
    },
    {
      text: "Quel est le slogan de la marque Lion ?",
      answers: [
        {
          text: "Réveillez le lion qui est en vous.",
          isCorrect: true
        },
        {
          text: "Réveillez la bête qui est en vous.",
          isCorrect: false
        },
        {
          text: "Réveillez la faim qui est en vous.",
          isCorrect: false
        },
        {
          text: "Réveillez la fureur qui est en vous.",
          isCorrect: false
        }
      ]
    },
    {
      text: "Quel est le slogan de la marque Kinder Bueno ?",
      answers: [
        {
          text: "Le plaisir pour les grandes faims.",
          isCorrect: false
        },
        {
          text: 'Le plaisir pour les moyennes faims.',
          isCorrect: false
        },
        {
          text: "Le plaisir pour les petites faims.",
          isCorrect: true
        },

        {
            text: "Le plaisir pour les toutes les faims.",
            isCorrect: false
          }

      ]
    },
    {
      text: "Quel est le slogan de la marque Danette ?",
      answers: [
        {
          text: "Tout le monde se lève pour Danette",
          isCorrect: true
        },
        {
          text: "Tout le monde adore Danette",
          isCorrect: false
        },
        {
          text: "Tout le monde mange du Danette",
          isCorrect: false
        },
        {
          text: "Tout le monde savoure Danette",
          isCorrect: false
        }
      ]
    },
    {
      text: "Quel est le slogan de la marque Carglass ?",
      answers: [
        {
          text: " Carglass répare, Carglass s'arrache",
         
          isCorrect: false
        },
        {
          text: "Carglass répare, Carglass sa race",
          isCorrect: false
        },
        {
          text: "Carglass répare, Carglass remplace",
          isCorrect: true
        },
        {
          text: "Carglass répare, Carglass ça casse !",
          isCorrect: false
        }
      ]
    }
  ];
  
  // variables initialization
  let questions = [];
  let score = 0,
    answeredQuestions = 0;
  let appContainer = document.getElementById("questions-container");
  let scoreContainer = document.getElementById("score-container");
  scoreContainer.innerHTML = `Score: ${score}/${questionsData.length}`;
  
  /**
   * Shuffles array in place. ES6 version
   * @param {Array} arr items An array containing the items.
   */
  // function shuffle(arr) {
  //   for (let i = arr.length - 1; i > 0; i--) {
  //     cons// function shuffle(arr) {
  //   for (let i = arr.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [arr[i], arr[j]] = [arr[j], arr[i]];
  //   } Cette fonction permet de base de "mélanger" les réponses 
  // }
  
  // shuffle(questionsData);
  
  // creating questions
  for (var i = 0; i < questionsData.length; i++) {
    let question = new Question({
      text: questionsData[i].text,
      answers: questionsData[i].answers
    });
  
    appContainer.appendChild(question.create());
    questions.push(question);
  }
  
  document.addEventListener("question-answered", ({ detail }) => {
    if (detail.answer.isCorrect) {
      score++;
    }
  
    answeredQuestions++;
    scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
    detail.question.disable();
  
    if (answeredQuestions == questions.length) {
      setTimeout(function () {
        alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
      }, 100);
    }
  });
  
  console.log(questions, questionsData);