import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { go } from '@codemirror/lang-go';
import { useCodeMirror } from '@uiw/react-codemirror';

const Compiler = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python3');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState('');

  const defaultCodes = {
    python3: `print("Hello, World!")`,
    java: `import java.util.*;
  public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`,
    cpp14: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }`,
    nodejs: `console.log("Hello, World!");`,
    go: `package main
  import "fmt"
  
  func main() {
      fmt.Println("Hello, World!")
  }`
  };

  useEffect(() => {
    setCode(defaultCodes[language]);
  }, [language]);

  const handleCompile = async () => {
    const program = {
      script: code,
      language,
      stdin,
      versionIndex: "0",
    };
  
    try {
      const response = await fetch('http://localhost:5000/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(program),
      });
  
      const data = await response.json();
      setResult(data.output || data.error || "Error in execution.");
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while compiling the code.");
    }
  };

  const getLanguageMode = () => {
    switch (language) {
      case 'python3':
        return python();
      case 'java':
        return java();
      case 'cpp14':
        return cpp();
      case 'nodejs':
        return javascript();
      case 'go':
        return go();
      default:
        return python();
    }
  };

  const { setContainer } = useCodeMirror({
    value: code,
    extensions: [basicSetup, getLanguageMode()],
    onChange: (value) => {
      setCode(value);
    },
  });
  
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  return (
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} dark={setTheme} />
        
        <div className="w-7xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">LearnGlobs Compiler</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block mb-2 text-lg font-medium text-gray-700">Select Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="python3">Python 3</option>
                  <option value="java">Java</option>
                  <option value="cpp14">C++ 14</option>
                  <option value="nodejs">Node.js (JavaScript)</option>
                  <option value="go">Go</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-gray-700">Write your code:</label>
                <div
                  ref={setContainer}
                  className="border border-gray-300 rounded-lg bg-white p-3 w-full h-64 md:h-96 resize-y overflow-auto"
                />
              </div>            
            </div>

            <div className=""> 
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-gray-700">Standard Input (Optional):</label>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  rows="5"
                  className="block w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter input data..."
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Output:</h2>
              <pre className="h-52 bg-gray-200 p-4 border border-gray-300 rounded-lg mt-2 overflow-auto max-h-96 cursor-not-allowed">{result}</pre>
            <div className="flex justify-end">              
              <button
                onClick={handleCompile}
                className="w-32 mt-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Run Code
              </button>
            </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
