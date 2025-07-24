// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';

// Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Quiz from './Pages/Quiz';
import QuizDetail from './Pages/QuizDetail';
import SignIn from './Pages/Account/SignIn';
import SignUp from './Pages/Account/SignUp';
import TakeQuiz from './Pages/TakeQuiz';

const MyContext = createContext();

function App() {
    const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
    const [isUserLogin, setIsUserLogin] = useState(false);

    const values = {
        isHeaderFooterShow,
        setIsHeaderFooterShow,
        isUserLogin,
        setIsUserLogin,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                {isHeaderFooterShow && <Header />}
                <Routes>
                    <Route path="/" exact={true} element={<Home />} />
                    <Route path="/quiz" exact={true} element={<Quiz />} />
                    <Route path="/quiz/:id" exact={true} element={<QuizDetail />} />
                    <Route path="/signIn" exact={true} element={<SignIn />} />
                    <Route path="/signUp" exact={true} element={<SignUp />} />
                    <Route path="/takeQuiz/:id" exact={true} element={<TakeQuiz />} />
                </Routes>
                {isHeaderFooterShow && <Footer />}
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };
