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
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import request from 'request';



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

  // Get a specific course by course_id
app.get('/api/courses_list/:course_id', (req, res) => {
  const courseId = req.params.course_id;
  const query = 'SELECT * FROM courses_list WHERE course_id = ?';
  
  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching the course:', err);
      res.status(500).send('Error fetching the course');
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Course not found');
    }
  });
});

app.get('/api/courses_modules/:course_id', (req, res) => {
  const courseId = req.params.course_id;
  const query = 'SELECT * FROM course_modules WHERE course_id = ?';
  
  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching the course:', err);
      res.status(500).send('Error fetching the course');
      return;
    }
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).send('Course not found');
    }
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
  function queryAsync(query, params) {
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
  
  app.get('/api/get-courses', async (req, res) => {
    const { userId } = req.query;
  
    try {
      const courses = await queryAsync(
        `SELECT c.course_name, c.course_description, c.image_url 
         FROM enrollments e 
         JOIN courses_list c ON e.course_id = c.course_id 
         WHERE e.user_id = ?`,
        [userId]
      );
  
      res.status(200).json(courses);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      res.status(500).json({ message: 'Error fetching enrolled courses' });
    }
  });
  

  app.get('/enrolled_courses/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Use queryAsync to execute the SQL query
      const enrolledCourses = await queryAsync('SELECT course_id FROM enrollments WHERE user_id = ?', [userId]);
      res.status(200).json(enrolledCourses);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      res.status(500).json({ message: 'Error fetching enrolled courses' });
    }
  });
  

  app.get('/enrollment/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Fetch enrollment details based on userId and courseId
    const enrollment = await queryAsync(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    // Check if enrollment exists
    if (enrollment.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json(enrollment[0]); // Return the first (and only) matching enrollment
  } catch (err) {
    console.error("Error fetching enrollment:", err);
    res.status(500).json({ message: 'Error fetching enrollment' });
  }
});

  
app.put('/enrollment/increment_module/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Increment the module count by 1 for the specified enrollment
    const result = await queryAsync(
      'UPDATE enrollments SET module_count = module_count + 1 WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    // Check if the update was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json({ message: 'Module count incremented successfully' });
  } catch (err) {
    console.error("Error incrementing module count:", err);
    res.status(500).json({ message: 'Error incrementing module count' });
  }
});


  
  app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;
  
    try {
      // Check if the user already exists
      const rows = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
      
      if (rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Get the current count of users
      const countResults = await queryAsync('SELECT COUNT(*) as count FROM users');
      const count = countResults[0].count;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the user into the database
      const query = 'INSERT INTO users (user_id, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
      const userId = `U${count + 1}`; // Generate user ID based on count
  
      await queryAsync(query, [userId, username, email, hashedPassword, role]);
  
      // Generate JWT token
      const token = jwt.sign({ email, role }, 'learnGlobs', { expiresIn: '1h' });
  
      // Send the response after all operations are done
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { username, role }
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user by email
        const rows = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Compare the hashed password with the user's input
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email, role: user.role }, 'learnGlobs', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { username: user.username, role: user.role, user_id: user.user_id }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
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


// API to handle course enrollment
app.post('/enroll', async (req, res) => {
  const { userId, course_id } = req.body; // Get user_id from req if required

  try {
    // Insert into enrollment table (or any logic to handle enrollment)
    await db.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [userId, course_id]);
    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// app.get('/proxy/pdf', (req, res) => {
//   const url = 'https://www.rgmcet.edu.in/assets/img/departments/CSE/materials/R15/3-2/Web%20Technologies.pdf';
//   request({ url, encoding: null }, (err, response, body) => {
//       if (!err && response.statusCode === 200) {
//           res.setHeader('Content-Type', 'application/pdf');
//           res.send(body);
//       } else {
//           res.status(500).send('Error fetching the PDF');
//       }
//   });
// });



app.listen(5000, () => {
  console.log(`Server is listening on port ${5000}`);
});


