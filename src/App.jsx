import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Main from './Main.jsx';
import About from './About.jsx';
import NewRecipe from './NewRecipe.jsx';
import RecipePage from './RecipePage.jsx';
import { Navbarpj } from './components.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbarpj />
      <Routes>
        <Route path='/' exact element={<Main />} />
        <Route path='/:filterPar' element={<Main />} />
        <Route path='/Recipe/:id' element={<RecipePage />} />
        <Route path='/Recipe' exact element={<RecipePage />} />
        <Route path='/About' element={<About />} />
        <Route path='/uploadRecipe' element={<NewRecipe />} />
        <Route path='/test' element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

