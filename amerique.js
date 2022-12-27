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
      text: "Quel est le plus gros succès du box-office ?",
      answers: [
        {
          text: "Avengers : End Game",
          isCorrect: false
        },
        {
          text: "Avatar",
          isCorrect: true
        },
        {
          text: "Star Wars : Le réveil de la Force",
          isCorrect: false
        },
        {
            text: "Titanic",
            isCorrect: false
          }

      ]
    },
    {
      text: "Quel surnom entendons nous pour parler des USA?",
      answers: [
        {
          text: "Le pays de l'Oncle Sam",
          isCorrect: true
        },
        {
          text: "Le pays de l'Oncle Daniel",
          isCorrect: false
        },
        {
          text: "Le pays des Burgers",
          isCorrect: false
        },
        {
          text: "Le pays de la minceur",
          isCorrect: false
        }
      ]
    },
    {
      text: "Les mots de Martin Luther King sont ?",
      answers: [
        {
          text: "The peace are the sword and the shield of this world",
          isCorrect: false
        },
        {
          text: 'If you crying, after, stand up and smile"',
          isCorrect: false
        },
        {
          text: "I have a dream",
          isCorrect: true
        },

        {
            text: "A world without discrimination is a heaven",
            isCorrect: false
          }

      ]
    },
    {
      text: "Année du premier Star Trek ?",
      answers: [
        {
          text: "1966",
          isCorrect: true
        },
        {
          text: "1964",
          isCorrect: false
        },
        {
          text: "1967",
          isCorrect: false
        },
        {
          text: "1969",
          isCorrect: false
        }
      ]
    },
    {
      text: "Pourquoi dans certains dessin animé, les perso ont 4 doigts ?",
      answers: [
        {
          text: " Pour qu'une main garde un aspect naturel et fonctionnel, quatre doigts suffisent à rendre les mouvements réalistes",
         
          isCorrect: true
        },
        {
          text: "Pour réduire le budget de l'animation qui était cher. Il était possible de faire des économies 5000 dollards en réduisant un doigt.",
          isCorrect: false
        },
        {
          text: "Une vieille légende disait qu'un animateur s'est coupé un doigt pour rembourser les dettes d'un de ses échecs. En hommage à son désespoir, les animateurs font 4 doigts.",
          isCorrect: true
        },
        {
          text: "Parce que c'est ainsi que l'espèce humaine va évoluer. C'est précurseur !",
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
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [arr[i], arr[j]] = [arr[j], arr[i]];
  //   }
  // }  Cette fonction permet de base de "mélanger" les réponses 
  
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