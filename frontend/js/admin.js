const http = new XMLHttpRequest();
http.open("GET", "https://assignment.richardisa.com/questions", true);
http.responseType = "json"
let existingIDs = [];
http.onload = function () {
    if (http.readyState === http.DONE && http.status === 200) {
        document.querySelector('#noQuizRow').style.visibility = "hidden";
        console.log(http.response);
        http.response.questions.forEach(element => {
            existingIDs.push(element.questionID);
            createQuestionFromExisting(element);
        });

        populateOptions(http.response.options);
    } else {
        document.querySelector('#noQuizRow').style.visibility = "visible";
    }
}
http.send();

function createQuestionFromExisting(jsonElement){
    document.querySelector("#questionsList").insertAdjacentHTML(
        'beforeend',
        '<li class="list-group-item" id="question' + jsonElement.questionID + '"><div><div class="row"><div class="col-12"><h3>Question ' + jsonElement.questionID + ': </h3><div class="input-group my-4" id="question' + jsonElement.questionID + 'InputGroup"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Question Prompt</span></div><div class="w-75"><input type="text" class="form-control" id="question' + jsonElement.questionID + 'prompt" aria-label="Default"></div><div class="w-75 my-4" id="optionContainer' + jsonElement.questionID + '"><div class="checkbox my-b w-90"><label><input type="radio" value="" name="question' + jsonElement.questionID + '"></label><input type="text" name="question' + jsonElement.questionID + '" style="width: 50%;"></div><div class="checkbox my-3 w-90"><label><input type="radio" value="" name="question' + jsonElement.questionID + '"></label><input type="text" name="question' + jsonElement.questionID + '" style="width: 50%;"></div></div><div class="w-75"><button type="button" class="btn btn-secondary" id="addOption' + jsonElement.questionID + '" onclick="addOption(' + jsonElement.questionID + ')">Add Option</button><button type="button" class="btn btn-secondary" id="deleteOption' + jsonElement.questionID + '" onclick="deleteOption(' + jsonElement.questionID + ')">Delete Option</button><button type="button" class="btn btn-danger ml-auto" onclick="deleteQuestion(' + jsonElement.questionID + ')">Delete Question</button></div><div class="w-75"><button type="button" class="btn btn-success" onclick = "submitQuestion(' + jsonElement.questionID + ')">Submit / Update Question</button></div></div></div></div></div></li>' 
    )
    document.querySelector("#question" + jsonElement.questionID + "prompt").value = jsonElement.questionPrompt;
}

function populateOptions(options){
    existingIDs.forEach(element => {
        let questionOptions = options.filter(opt => opt.questionID == element);
        let optionElements = document.querySelectorAll("#optionContainer" + element + " div > input");
        while (optionElements.length < questionOptions.length){
            addOption(element);
            optionElements = document.querySelectorAll("#optionContainer" + element + " div > input");
        }
        
        if (questionOptions.length == optionElements.length){
            for (let i = 0; i < optionElements.length; i++) {
                let currOption = optionElements[i];
                currOption.value = questionOptions[i].optionPrompt;
                if (questionOptions[i].is_correct){
                    let checks = document.querySelectorAll("#optionContainer" + element + " div > label > input");
                    checks[i].checked = true;
                }
            }
        }
    })
}

function addOption(questionNum) {
    let numOptions = document.querySelectorAll("#optionContainer" + questionNum + " .checkbox").length;
    if (numOptions < 4) {
        document.querySelector("#optionContainer" + questionNum).insertAdjacentHTML(
            'beforeend',
            '<div class="checkbox my-3 w-90"><label><input type="radio" value="" name="question' + questionNum + '"></label><input type="text" name="question' + questionNum + '" style="width: 50%;"></div>'
        )
    }
}

function deleteOption(questionNum) {
    let options = document.querySelectorAll("#optionContainer" + questionNum + " .checkbox");
    if (options.length >= 3) {
        options[options.length - 1].remove();
    }
}

function addQuestion() {
    let qNum = document.querySelectorAll("#questionsList > li").length + 1;
    document.querySelector("#questionsList").insertAdjacentHTML(
        'beforeend',
        '<li class="list-group-item" id="question' + qNum + '"><div><div class="row"><div class="col-12"><h3>Question ' + qNum + ': </h3><div class="input-group my-4" id="question' + qNum + 'InputGroup"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Question Prompt</span></div><div class="w-75"><input type="text" class="form-control" id="question' + qNum + 'prompt" aria-label="Default"></div><div class="w-75 my-4" id="optionContainer' + qNum + '"><div class="checkbox my-b w-90"><label><input type="radio" value="" name="question' + qNum + '"></label><input type="text" name="question' + qNum + '" style="width: 50%;"></div><div class="checkbox my-3 w-90"><label><input type="radio" value="" name="question' + qNum + '"></label><input type="text" name="question' + qNum + '" style="width: 50%;"></div></div><div class="w-75"><button type="button" class="btn btn-secondary" id="addOption' + qNum + '" onclick="addOption(' + qNum + ')">Add Option</button><button type="button" class="btn btn-secondary" id="deleteOption' + qNum + '" onclick="deleteOption(' + qNum + ')">Delete Option</button><button type="button" class="btn btn-danger ml-auto" onclick="deleteQuestion(' + qNum + ')">Delete Question</button></div><div class="w-75"><button type="button" class="btn btn-success" onclick = "submitQuestion(' + qNum + ')">Submit / Update Question</button></div></div></div></div></div></li>'
    )
}

function deleteQuestion(questionNum) {
    document.querySelector("#question" + questionNum).remove();
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/questions", true);
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.onload = function () {
        if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
            console.log(xhttp.response);
            alert("Question Updated in Database")
        }
    }
    xhttp.send(JSON.stringify({questionID: questionNum}));
}

function getQuestionOptionPrompts(questionNum) {
   let options = document.querySelectorAll("#optionContainer" + questionNum + " div > input");
   let resultPrompts = [];
   options.forEach(element => {
       resultPrompts.push({optionPrompt: element.value, is_correct: 0});
   });

   return resultPrompts;
}

function getQuestionPrompt(questionNum){
    return document.querySelector("#question" + questionNum + "prompt").value;
}

function getQuestionRightAnswerIndex(questionNum){
    let options = document.querySelectorAll("#optionContainer" + questionNum + " div > label > input");
    for (let i = 0; i < options.length; i++) {
        const element = options[i];
        if (element.checked == true){
            return i;
        }
    }

    return -1;
}


function submitQuestion(questionNum) {
    let questionData = {
        questionID: questionNum,
        questionPrompt: getQuestionPrompt(questionNum),
        options: getQuestionOptionPrompts(questionNum),
    }

    if (questionData.questionPrompt.length <= 0){
        alert("You need to have a question prompt.")
        return;
    }

    if (getQuestionRightAnswerIndex(questionNum) == -1){
        alert("You need to set something to be the correct answer")
        return;
    }
    questionData.options[getQuestionRightAnswerIndex(questionNum)].is_correct = 1;

    if (questionData.options.length < 2 || questionData.options.length > 4){
        alert("You need to have between 2 and 4 options for your question.")
        return;
    } else {
        let isEmpty = false;
        console.log(questionData.options)
        questionData.options.forEach(element => {
            if (element.optionPrompt.length <= 0){
                isEmpty = true;
            }
        });

        if (isEmpty){
            alert("You need to have all option prompts filled out.")
            return;
        }
    }

    if (existingIDs.includes(questionNum)){
        updateQuestion(questionNum, questionData);
        return;
    }


    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://assignment.richardisa.com/questions", true);
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.onload = function () {
        if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
            console.log(xhttp.response);
            alert("Question Submitted to Database")
        }
    }
    xhttp.send(JSON.stringify(questionData));
}

function updateQuestion(questionNum, questionData) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "https://assignment.richardisa.com/questions", true);
    xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.onload = function () {
        if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
            console.log(xhttp.response);
            alert("Question Updated in Database")
        }
    }
    console.log(questionData)
    xhttp.send(JSON.stringify(questionData));
}
