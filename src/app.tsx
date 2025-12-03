import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import EventView from './pages/eventView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:blockId" element={<EventView />} />
      </Routes>
    </BrowserRouter>
  );
}

