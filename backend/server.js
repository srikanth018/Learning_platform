import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


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


// Simulating __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads without saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let pythonProcess = null; // Store reference to the Python process

// Endpoint to process uploaded PDF and play audio
app.post('/play-pdf', upload.single('pdfFile'), (req, res) => {
    const pdfBuffer = req.file.buffer; // Get the uploaded PDF file as a buffer
    const { rate, voice } = req.body; // Get rate and voice from request body

    if (pythonProcess) {
        pythonProcess.kill(); // Stop any running process
    }

    // Pass rate and voice options to the Python script
    pythonProcess = spawn('python', [path.join(__dirname, 'pdf_audio_GUI.py'), rate, voice]);

    // Write the PDF buffer to the Python process
    pythonProcess.stdin.write(pdfBuffer);
    pythonProcess.stdin.end(); // Close stdin

    // Set up a flag to track if the response has been sent
    let responseSent = false;

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Output: ${data}`);
        if (!responseSent) {
            res.json({ message: data.toString() });
            responseSent = true; // Mark response as sent
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        if (!responseSent) {
            res.status(500).json({ error: data.toString() });
            responseSent = true; // Mark response as sent
        }
    });

    pythonProcess.on('exit', (code) => {
        console.log(`Python process exited with code ${code}`);
        pythonProcess = null; // Reset the reference when process ends
    });
});

// Endpoint to stop the audio playback
app.post('/stop-pdf', (req, res) => {
    if (pythonProcess) {
        pythonProcess.kill(); // Stop the Python process
        pythonProcess = null; // Reset the reference
        res.json({ message: 'Playback stopped' });
    } else {
        res.status(400).json({ error: 'No playback in progress' });
    }
});






app.listen(5000, () => {
  console.log(`Server is listening on port ${5000}`);
});


