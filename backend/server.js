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


  const JDoodle_Client_Id = '5e990b43d1a6375ba0fe5a96d2b9ac23';
const JDoodle_Client_Secret = 'c12fb6d51570b441433d60434546a6d8953f2d7a30eafed6d8725d99968c4b5d';

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

app.listen(5000, () => {
  console.log(`Server is listening on port ${5000}`);
});


