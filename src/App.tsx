import { Route, Routes } from 'react-router-dom';
import MovieSeeker from './features/MovieSeeker';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieSeeker />} />
    </Routes>
  );
}

export default App;
