const express = require('express')
const cors = require('cors')
const path = require('path');
const mysql = require("mysql2")
const fs = require('fs')
const https = require('https')

const app = express()
app.use(cors());
app.use(express.json());
const port = 3000

let questionQuery = "";
let optionsQuery = "";

dbCon.connect(err => {
  if (err) throw err;
  console.log("DB connection successful");
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
})

app.get('/student.html', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/student.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/index.html'));
})


app.get('/js/admin.js', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/js/admin.js'));
})

app.get('/js/student.js', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/js/student.js'));
})


app.get('/questions', (req, res) => {
  dbCon.query("SELECT * FROM question;", (err, result, fields) => {
    if (err){
      throw err;
    }
    questionQuery = result;
  });


  dbCon.query("SELECT * FROM option;", (err, result, fields) => {
    if (err){
      throw err;
    }
    optionsQuery = result;
  });

  res.send({ 
    questions: questionQuery,
    options: optionsQuery
  });
})

app.post('/questions', function (req, res) {
  let prompt = req.body.questionPrompt;
  let qID = req.body.questionID;
  let options = req.body.options;
  dbCon.query(`INSERT INTO question VALUES(${qID}, "${prompt}")`, (err, result, fields) => {
    if (err){
      throw err;
    }
  });
  
  dbCon.query('DELETE FROM option WHERE questionID =' + qID + ";", (err, result, fields) =>{
    if (err){
      throw err;
    }
  });
  console.log(options);
  options.forEach(element => {
    dbCon.query(`INSERT INTO option (optionPrompt, questionID, is_correct) VALUES ("${element.optionPrompt}", ${qID}, ${element.is_correct});`, (err, result, fields) => {
      if (err){
        throw err;
      }
    });
  });

  res.send('Submitted Question')
})

app.put('/questions', function(req, res) {
  let prompt = req.body.questionPrompt;
  let qID = req.body.questionID;
  let options = req.body.options;
  console.log(req.body);
  dbCon.query('UPDATE question SET questionPrompt ="' + prompt + '" WHERE questionID = ' + qID + ";", (err, result, fields) => {
    if (err){
      throw err;
    }
  });
  
  dbCon.query('DELETE FROM option WHERE questionID =' + qID + ";", (err, result, fields) =>{
    if (err){
      throw err;
    }
  });
  console.log(options);
  options.forEach(element => {
    dbCon.query(`INSERT INTO option (optionPrompt, questionID, is_correct) VALUES ("${element.optionPrompt}", ${qID}, ${element.is_correct});`, (err, result, fields) => {
      if (err){
        throw err;
      }
    });
  });
  res.send("Updated Database");
})

app.delete('/questions', function(req, res) {
  dbCon.query(`DELETE FROM option WHERE questionID = ${req.body.questionID}`, (err, result, fields) => {
    if (err){
      throw err;
    }
  });

  dbCon.query(`DELETE FROM question WHERE questionID = ${req.body.questionID}`, (err, result, fields) => {
    if (err){
      throw err;
    }
  });
  res.send("Deleted question");
});

app.listen(port, () => console.log(`Example app listening on port ` + port))
https.createServer({
  key: fs.readFileSync('/opt/bitnami/apache2/conf/bitnami/certs/server.key'),
  cert: fs.readFileSync('/opt/bitnami/apache2/conf/bitnami/certs/server.crt'),
},app).listen(443);