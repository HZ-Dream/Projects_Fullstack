// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Material UI
import { useSnackbar } from 'notistack';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';

// Components User
import Home from './Pages/Home';
import Quiz from './Pages/Quiz';
import QuizDetail from './Pages/QuizDetail';
import SignIn from './Pages/Account/SignIn';
import SignUp from './Pages/Account/SignUp';
import TakeQuiz from './Pages/TakeQuiz';
import Profile from './Pages/Profile';

// Components Dashboard
import Dashboard from './Pages/Dashboard/index';
import QuizList from './Pages/Dashboard/ManageQuiz/QuizList';
import CreateQuiz from './Pages/Dashboard/ManageQuiz/CreateQuiz';
import EditQuiz from './Pages/Dashboard/ManageQuiz/EditQuiz';

// Layouts
import MainLayout from './Layouts/MainLayout';
import NoneLayout from './Layouts/NoneLayout';
import DashboardLayout from './Layouts/DanshboardLayout';

const MyContext = createContext();

function App() {
    // Notice
    const { enqueueSnackbar } = useSnackbar();

    // User
    const [userData, setUserData] = useState({});
    const [tokenData, setTokenData] = useState('');
    const [isUserLogin, setIsUserLogin] = useState(false);

    // Dashboard
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [menuBtn, setMenuBtn] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const darkModeLocal = localStorage.getItem('darkMode');
        return darkModeLocal !== null ? darkModeLocal === 'true' : true;
    });

    // QuizDetail
    const [activeTabs, setActiveTabs] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (token !== null && token !== '') {
            setUserData(user);
            setTokenData(token);
            setIsUserLogin(true);
        } else {
            setIsUserLogin(false);
        }

        // Dashboard
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (tokenData) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setUserData(user);
                setIsUserLogin(true);
            } else {
                setIsUserLogin(false);
            }
        } else {
            setIsUserLogin(false);
        }
    }, [tokenData]);

    const handleClickVariant = (message, variant) => {
        console.log(`Message: ${message}, Variant: ${variant}`);

        enqueueSnackbar(message, { variant });
    };

    const values = {
        userData,
        setUserData,
        tokenData,
        setTokenData,
        isUserLogin,
        setIsUserLogin,
        handleClickVariant,
        windowWidth,
        menuBtn,
        setMenuBtn,
        darkMode,
        setDarkMode,
        activeTabs,
        setActiveTabs,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/quiz/:quizId" element={<QuizDetail />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                    </Route>

                    <Route element={<NoneLayout />}>
                        <Route path="/signIn" element={<SignIn />} />
                        <Route path="/signUp" element={<SignUp />} />

                        <Route path="/takeQuiz/:quizId" element={<TakeQuiz />} />
                    </Route>

                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/quizList/:userId" element={<QuizList />} />
                        <Route path="/dashboard/quizCreate" element={<CreateQuiz />} />
                        <Route path="/dashboard/quizEdit/:quizId" element={<EditQuiz />} />
                    </Route>
                </Routes>
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };
