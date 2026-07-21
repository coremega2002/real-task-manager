import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Board from './components/Board';
import Task from './components/Task';
import Tag from './components/Tag';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/tags" element={<Tag />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
