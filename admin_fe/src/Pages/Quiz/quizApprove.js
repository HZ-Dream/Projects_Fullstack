// Icons
import { FaEye } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext, use } from 'react';
import { Link } from 'react-router-dom';

// Others
import { fetchDataFromApi, editData, deleteData } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const QuizApprove = () => {
    const context = useContext(MyContext);
    const [quizData, setQuizData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    var levelQuiz = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard',
        4: 'University',
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);

        fetchDataFromApi(`/api/quiz/getQuizListApprove?page=${value}`).then((res) => {
            setQuizData(res.quizzes);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/quiz/getQuizListApprove?page=1').then((res) => {
            setQuizData(res.quizzes);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
        });
    }, []);

    return (
        <>
            <section className="right-content w-100">
                <div className="card shadow border-0 p-3">
                    <div className="dFlexAli-center">
                        <h3 className="hd">Quiz List Approve</h3>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Field</th>
                                    <th>Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {quizData?.length !== 0 &&
                                    quizData?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.title}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.field?.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2" title="Rate / Total Rate">
                                                        <h6>{levelQuiz[item.level]}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="detail me-2">
                                                        <Link to={`/quiz/detail/${item.id}`}>
                                                            <FaEye />
                                                        </Link>
                                                    </Button>
                                                    <Button className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <Pagination
                                className="ms-auto"
                                page={currentPage}
                                count={totalPages}
                                color="primary"
                                showFirstButton
                                showLastButton
                                onChange={handleChangePage}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default QuizApprove;
