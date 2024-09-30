import React, { useState } from 'react';

const Compiler = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python3');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState('');

  const handleCompile = async () => {
    const response = await fetch('http://localhost:5000/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script: code, language, stdin }),
    });

    const data = await response.json();
    setResult(data.output || data.error);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JDoodle Compiler</h1>
      <div className="mb-4">
        <label className="block mb-2">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="python3">Python 3</option>
          <option value="java">Java</option>
          <option value="cpp14">C++ 14</option>
          
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Code:</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="10"
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Standard Input (optional):</label>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          rows="5"
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <button
        onClick={handleCompile}
        className="bg-blue-500 text-white rounded p-2"
      >
        Run Code
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Output:</h2>
        <pre className="border border-gray-300 p-2">{result}</pre>
      </div>
    </div>
  );
};

export default Compiler;
