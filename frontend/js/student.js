const http = new XMLHttpRequest();
http.open("GET", "https://assignment.richardisa.com/questions", true);
http.responseType = "json"
let existingIDs = [];
let correctAnswersIDs = [];
http.onload = function () {
    if (http.readyState === http.DONE && http.status === 200) {
        document.querySelector('#noQuizRow').style.visibility = "hidden";
        console.log(http.response);
        http.response.questions.forEach(element => {
            existingIDs.push(element.questionID);
            createQuestionFromResponse(element);
        });

        populateOptions(http.response.options);
	if (http.response.questions.length <= 0){
	  document.querySelector('#noQuizRow').style.visibility = "visible";
	}
    }
}
http.send();

function createQuestionFromResponse(element){
    document.querySelector("#questionsList").insertAdjacentHTML(
        'beforeend',
        `<li class="list-group-item mb-3"><div id="question${element.questionID}"><h3>Question ${element.questionID}</h3><p>${element.questionPrompt}</p></div></li>`
    )
}

function populateOptions(options){
    existingIDs.forEach(element => {
        let questionOptions = options.filter(opt => opt.questionID == element);
        let optionContainer = document.querySelector("#question" + element);
        questionOptions.forEach(element => {
            optionContainer.insertAdjacentHTML(
                'beforeend',
                `                            
                <input type="radio" id="${element.optionID}" name="question${element.questionID}" class="answerInput" value="Large">
                <label for=${element.optionID}>${element.optionPrompt}</label><br>
                `
            )

            if (element.is_correct){
                correctAnswersIDs.push(element.optionID.toString());
            }
        })
    })
}

function submitQuiz(){
    let numRight = 0;
    console.log(correctAnswersIDs)
    document.querySelectorAll(".answerInput").forEach(element => {
        if (element.checked == true && correctAnswersIDs.includes(element.id)){
            numRight++;
        }
    });

    alert(`You got ${numRight} questions right`);
}

// `<li class="list-group-item">
//     <div id="question${element.questionID}">
//         <h3>Question ${element.questionID}</h3>
//         <p>${element.questionPrompt}</p>
//     </div>
// </li>`

// `                            
// <input type="radio" id="Large" name="gender" value="Large">
// <label for="Large">Large</label><br>
// `
