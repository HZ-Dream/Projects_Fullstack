import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Quiz from './Pages/Quiz';
import QuizDetail from './Pages/QuizDetail';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" exact={true} element={<Home />} />
                <Route path="/quiz" exact={true} element={<Quiz />} />
                <Route path="/quiz/:id" exact={true} element={<QuizDetail />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
