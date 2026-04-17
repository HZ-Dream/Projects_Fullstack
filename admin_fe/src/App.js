import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Responsive.css';
import './Dashboard.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Material UI
import { useSnackbar } from 'notistack';

// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';

// Layouts
import MainLayout from './Layouts/MainLayout';
import NoneLayout from './Layouts/NoneLayout';

// Pages
import Dashboard from './Pages/Dashboard';
import FieldList from './Pages/Field/index';
import CreateField from './Pages/Field/createField';
import QuizList from './Pages/Quiz/index';
import CheckQuiz from './Pages/Quiz/checkQuiz';
import TokenList from './Pages/Token/index';
import CreateToken from './Pages/Token/createToken';
import EditToken from './Pages/Token/editToken';
import DetailQuiz from './Pages/Quiz/detailQuiz';
import Account from './Pages/Account/index';
import CreateAccount from './Pages/Account/createAccount';
import ChangeProfile from './Pages/Setting/changeProfile';
import ChangePassword from './Pages/Setting/changePassword';
import SignIn from './Pages/SignIn';
import UploadText from './Pages/Survey/uploadText';
import BillList from './Pages/Bill/BillList';
import Message from './Pages/Message';
import ReportList from './Pages/Report';
import KeyList from './Pages/Key';
import CreateKey from './Pages/Key/createKey';

const MyContext = createContext();

function App() {
    // Notice
    const { enqueueSnackbar } = useSnackbar();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [menuBtn, setMenuBtn] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const darkModeLocal = localStorage.getItem('darkMode');
        return darkModeLocal !== null ? darkModeLocal === 'true' : true;
    });
    const [adminInfo, setAdminInfo] = useState(() => {
        return JSON.parse(localStorage.getItem('adminInfo')) || {};
    });

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
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClickVariant = (message, variant) => {
        console.log(`Message: ${message}, Variant: ${variant}`);

        enqueueSnackbar(message, { variant });
    };

    const values = {
        windowWidth,
        menuBtn,
        setMenuBtn,
        darkMode,
        setDarkMode,
        handleClickVariant,
        adminInfo,
        setAdminInfo,
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Field */}
                        <Route path="/field/list" element={<FieldList />} />
                        <Route path="/field/create" element={<CreateField />} />

                        {/* Quiz */}
                        <Route path="/quiz/list" element={<QuizList />} />
                        <Route path="/quiz/check" element={<CheckQuiz />} />
                        <Route path="/quiz/detail/:quizId" element={<DetailQuiz />} />

                        {/* Token */}
                        <Route path="/token/list" element={<TokenList />} />
                        <Route path="/token/create" element={<CreateToken />} />
                        <Route path="/token/edit/:id" element={<EditToken />} />

                        {/* Bill */}
                        <Route path="/bill/list" element={<BillList />} />

                        {/* Account */}
                        <Route path="/account/list" element={<Account />} />
                        <Route path="/account/create" element={<CreateAccount />} />

                        {/* Key */}
                        <Route path="/key/list" element={<KeyList />} />
                        <Route path="/key/create" element={<CreateKey />} />

                        {/* Survey */}
                        <Route path="/survey/uploadText" element={<UploadText />} />

                        {/* Report */}
                        <Route path="/report" element={<ReportList />} />

                        {/* Message */}
                        <Route path="/message" element={<Message />} />
                        <Route path="/message/:userId" element={<Message />} />

                        {/* Setting */}
                        <Route path="/setting/profile/:adminId" element={<ChangeProfile />} />
                        <Route path="/setting/password/:adminId" element={<ChangePassword />} />
                    </Route>

                    <Route element={<NoneLayout />}>
                        <Route path="/" element={<SignIn />} />
                    </Route>
                </Routes>
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };
