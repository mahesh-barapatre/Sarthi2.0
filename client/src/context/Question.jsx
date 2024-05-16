// QuestionContext.js
import React, { createContext, useState, useContext } from 'react';

const QuestionContext = createContext();

const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (question) => {
    setQuestions(prevQuestions => [...prevQuestions, question]);
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};

const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestionContext must be used within a QuestionProvider');
  }
  return context;
};

export { QuestionProvider, useQuestionContext };
