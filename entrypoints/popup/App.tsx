import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [showInsertButton, setShowInsertButton] = useState(false);

  const handleGenerate = () => {
    setGeneratedText("Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.");
    setShowInsertButton(true);
  };

  const handleInsert = () => {
    const inputField = document.querySelector('div[role="textbox"]') as HTMLDivElement;
    if (inputField) {
      inputField.innerText = generatedText;
    }
  };

  return (
    <div className="modal">
      <h2>AI Reply Generator</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your command..."
      />
      <button onClick={handleGenerate}>Generate</button>
      {showInsertButton && <button onClick={handleInsert}>Insert</button>}
      {generatedText && <p>{generatedText}</p>}
    </div>
  );
};

export default App;
