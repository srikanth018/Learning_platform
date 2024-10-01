
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require('multer');
const xlsx = require('xlsx');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "learning_platform",
});

app.get('/api/courses_list', (req, res) => {
    const query = 'SELECT * FROM courses_list';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching uploads:', err);
        res.status(500).send('Error fetching courses_list');
        return;
      }
      res.json(results);
    });
  });

  app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM Users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching uploads:', err);
        res.status(500).send('Error fetching users');
        return;
      }
      res.json(results);
    });
  });

  app.get('/api/course_modules', (req, res) => {
    const query = 'SELECT * FROM course_modules';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching uploads:', err);
        res.status(500).send('Error fetching course_modules');
        return;
      }
      res.json(results);
    });
  });
  app.get('/api/course_outcome', (req, res) => {
    const query = 'SELECT * FROM course_outcome';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching uploads:', err);
        res.status(500).send('Error fetching course_outcome');
        return;
      }
      res.json(results);
    });
  });


  const JDoodle_Client_Id = 'c4df430ac08c4d3852ccc21c4c8a940d';
const JDoodle_Client_Secret = '673ec0904f9124a4f8f31515257af18a124f0cbedaf7466fa51e0797f17f9b07';

// Route to execute user code
app.post('/compile', async (req, res) => {
  const { script, language, versionIndex, stdin } = req.body;

  const data = {
    clientId: JDoodle_Client_Id,
    clientSecret: JDoodle_Client_Secret,
    script: script,
    stdin: stdin || '', // Optional user input
    language: language,
    versionIndex: versionIndex || '0', // Default version index
    compileOnly: false
  };

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({
      output: response.data.output,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
      error: response.data.error || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error executing code', error: error.message });
  }
});




// dotenv.config();


// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// let generatedText = { title: '', content: '' };

// app.post('/api/generate-recipe', async (req, res) => {
//     try {
//         const { title } = req.body;
//         const prompt = `${title}`;
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         let text = response.text().toString();

//         // Process and format the text
//         text = text
//         .replace(/\\(.?)/g, '<b>$1</b>') // Replace backslashes with bold
//         .replace(/\/(.?)/g, '<i>$1</i>'); // Replace forward slashes with italics


//         const [recipeTitle, ...contentParts] = text.split('\n');
//         const content = contentParts.join('<br>');

//         generatedText = {
//             title: recipeTitle,
//             content: content
//         };


//         res.json({
//             title: recipeTitle,
//             content: content.replace(/(?:\r\n|\r|\n)/g, '<br>')
//         });
//     } catch (error) {
//         console.error('Error generating recipe:', error);
//         res.status(500).json({ error: 'Failed to generate recipe' });
//     }
// });

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/chatbot', async (req, res) => {
    try {
        const { message } = req.body;
        const prompt = `You are a helpful assistant. ${message}`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().toString();

        // Process and format the text
        text = text.replace(/\\(.?)/g, '<b>$1</b>') // Replace backslashes with bold
                   .replace(/\/(.?)/g, '<i>$1</i>'); // Replace forward slashes with italics

        res.json({
            message: text.replace(/(?:\r\n|\r|\n)/g, '<br>')
        });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});




app.listen(5000, () => {
  console.log(`Server is listening on port ${5000}`);
});


