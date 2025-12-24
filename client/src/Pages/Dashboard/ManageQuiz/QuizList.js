// Icons
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// Components
import DashboardBox from '../../Dashboard/components/dashboardBox';

// API
import { fetchDataFromApi, deleteData } from '../../../utils/api';

import { MyContext } from '../../../App';

const QuizList = () => {
    const context = useContext(MyContext);
    let { userId } = useParams();

    const [load, isLoad] = useState(false);
    const [fieldData, setFieldData] = useState([]);
    const [fieldVal, setFieldVal] = useState('');
    const [levelVal, setLevelVal] = useState('');
    const [quizList, setQuizList] = useState([]);
    // Delete Modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        setFieldData(context.fieldData.fieldList);

        fetchDataFromApi(`/api/quiz/getQuiz/${userId}`).then((res) => {
            setQuizList(res);
        });
    }, []);

    // Delete Quiz
    const deleteQuizModal = (id) => {
        setDeleteQuizId(id);
        setDeleteModal(true);
    };

    const handleCloseDel = () => {
        setDeleteModal(false);
    };

    const deleteQuiz = (e) => {
        e.preventDefault();
        isLoad(true);

        deleteData('/api/quiz/deleteQuiz/', deleteQuizId)
            .then((res) => {
                context.handleClickVariant('Delete product successful!', 'success');
                isLoad(false);
                setDeleteModal(false);
                fetchDataFromApi(`/api/quiz/getQuiz/${userId}`).then((res) => {
                    setQuizList(res);
                });
            })
            .catch((err) => {
                isLoad(false);
                context.handleClickVariant('Something went wrong!', 'error');
                console.error(err);
            });
    };

    return (
        <>
            <section className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12 list">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                color={['rgb(29, 162, 86)', 'rgb(72, 212, 131)']}
                                icon={<FaUserCircle />}
                                chart={true}
                            />
                            <DashboardBox
                                color={['rgb(192, 18, 226)', 'rgb(235, 100, 254)']}
                                icon={<FaShoppingCart />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(44, 120, 229)', 'rgb(96, 175, 245)']}
                                icon={<FaBagShopping />}
                                chart={false}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Your Quizzes</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>FIELD</h4>
                            <select
                                className="form-select"
                                value={fieldVal}
                                onChange={(e) => setFieldVal(e.target.value)}
                                required
                            >
                                <option value="">None</option>
                                {fieldData?.map((field) => (
                                    <option key={field.id} value={field.id}>
                                        {field.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <h4>LEVEL</h4>
                            <select
                                className="form-select"
                                value={levelVal}
                                onChange={(e) => setLevelVal(e.target.value)}
                                required
                            >
                                <option value="">None</option>
                                <option value="1">Primary</option>
                                <option value="2">Secondary</option>
                                <option value="3">High</option>
                                <option value="4">University</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>No.</th>
                                    <th>Title</th>
                                    <th>Field</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                    <th>Rating</th>
                                    <th>Quantity Quiz</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {quizList && quizList.length > 0 ? (
                                    quizList.map((quiz, index) => (
                                        <tr key={quiz.id}>
                                            <td>#{index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="imgWrapper">
                                                        <div className="img card m-0">
                                                            <img className="w-100" src={quiz.image} alt={quiz.title} />
                                                        </div>
                                                    </div>

                                                    <div className="info ps-2">
                                                        <h6>{quiz.title}</h6>
                                                        <p>{quiz.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{quiz.field.name}</td>
                                            <td>{quiz.level}</td>
                                            <td>{quiz.status}</td>
                                            <td>4.9 (15)</td>
                                            <td>{quiz.quiz.length}</td>
                                            <td>{quiz.duration}'</td>
                                            <td>
                                                <div className="actions dFlexAli-center justify-content-around">
                                                    <Button className="detail">
                                                        <Link to="/product/detail/1">
                                                            <FaEye />
                                                        </Link>
                                                    </Button>
                                                    <Button className="edit">
                                                        <Link to={`/dashboard/quizEdit/${quiz.id}`}>
                                                            <MdEdit />
                                                        </Link>
                                                    </Button>
                                                    <Button onClick={() => deleteQuizModal(quiz.id)} className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center">
                                            No quizzes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <Dialog className="editCategoryModal" open={deleteModal} onClose={handleCloseDel}>
                            <DialogTitle className="dFlexAli-center">
                                <span className="me-2 text-danger fw-bold">Delete Quiz</span>
                                {load === true && <CircularProgress className="loader" color="inherit" />}
                            </DialogTitle>
                            <form onSubmit={deleteQuiz}>
                                <DialogContent>
                                    <h3>Are you sure you want to delete?</h3>
                                </DialogContent>
                                <DialogActions className="mb-2">
                                    <Button onClick={handleCloseDel} variant="outlined">
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Delete
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                showing <b>6</b> of <b>60</b> results
                            </p>

                            <Pagination count={10} color="primary" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default QuizList;
