import './App.css';
import Login from './pages/Login';
import Room from './pages/Room';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
function App() {
  const [id, setid] = useState("");
  return (
    <div>
      <div>
        <Toaster position='top-right'></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login id={id} setid={setid} />} />
          <Route path='/room/:id' element={<Room id={id} setid={setid} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
