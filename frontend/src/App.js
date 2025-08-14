import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import PagesList from './PagesList';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pages" element={<PagesList />} />
      </Routes>
    </Router>
  );
}
