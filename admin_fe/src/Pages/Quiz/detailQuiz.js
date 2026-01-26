// Icons
import { FaRegImages } from 'react-icons/fa';
import { TbCancel } from 'react-icons/tb';
import { IoTrashBin } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// API
import { fetchDataFromApi, editData, postData } from '../../utils/api';

import { MyContext } from '../../App';

const DetailQuiz = () => {
    const context = useContext(MyContext);
    let { quizId } = useParams();
    const navigate = useNavigate();

    const [isLoad, setIsLoad] = useState(false);
    const [isLoadDeny, setIsLoadDeny] = useState(false);
    const [loadImg, setLoadImg] = useState(false);
    const [loadQImg, setLoadQImg] = useState(false);

    const [fieldData, setFieldData] = useState([]);
    const [fieldVal, setFieldVal] = useState('');
    const [levelVal, setLevelVal] = useState('');
    const [selectedImg, setSelectedImg] = useState(null);

    const [formField, setFormField] = useState({
        title: '',
        description: '',
        field: '',
        level: '',
        duration: '',
        password: '',
        status: '',
        image: '',
        quiz: [
            {
                questionImage: '',
                questionText: '',
                options: [{ text: '' }, { text: '' }],
                correctAnswers: [],
            },
        ],
    });

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/field/all').then((res) => {
            setFieldData(res.fieldList);
        });

        fetchDataFromApi(`/api/quiz/getQuizDetail/${quizId}`)
            .then((res) => {
                console.log(res);

                setFormField({
                    title: res.title || '',
                    description: res.description || '',
                    field: res.field || '',
                    level: res.level || '',
                    duration: Number(res.duration) || 0,
                    password: res.password || '',
                    status: res.status || '',
                    image: res.image || '',
                    quiz: res.quiz
                        ? res.quiz.map((q) => ({
                              questionImage: q.questionImage || '',
                              questionText: q.questionText || '',
                              options: q.options
                                  ? q.options.map((opt) => ({ text: opt }))
                                  : [{ text: '' }, { text: '' }],
                              correctAnswers: q.correctAnswers || [],
                          }))
                        : [{ questionText: '', options: [{ text: '' }, { text: '' }], correctAnswers: [] }],
                });
                setFieldVal(res.field || '');
                setLevelVal(res.level || '');
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.msg) {
                    context.handleClickVariant(err.response.data.msg, 'error');
                } else {
                    context.handleClickVariant('Server error', 'error');
                }
            });
    }, []);

    const acceptQuiz = (e) => {
        e.preventDefault();

        setIsLoad(true);

        try {
            const adminData = JSON.parse(localStorage.getItem('adminInfo')) || '';

            const adminId = adminData._id || '';

            if (!adminId) {
                context.handleClickVariant('Admin not found. Please login again.', 'warning');
                setIsLoad(false);
                return;
            }

            const adminFormData = {
                status: formField.password ? '1' : '2',
                adminId: adminId,
            };

            editData(`/api/quiz/approveQuiz/${quizId}`, adminFormData)
                .then((res) => {
                    context.handleClickVariant('Quiz updated successfully', 'success');
                    setIsLoad(false);

                    setTimeout(() => {
                        navigate('/quiz/list');
                    }, 1500);
                })
                .catch((err) => {
                    setIsLoad(false);
                    if (err.response && err.response.data && err.response.data.msg) {
                        context.handleClickVariant(err.response.data.msg, 'error');
                    } else {
                        context.handleClickVariant('Server error', 'error');
                    }
                });
        } catch (err) {
            context.handleClickVariant(err, 'warning');
            return;
        }
    };

    const denyQuiz = (e) => {
        e.preventDefault();

        setIsLoadDeny(true);

        try {
            const adminData = JSON.parse(localStorage.getItem('adminInfo')) || '';
            const adminId = adminData._id || '';

            if (!adminId) {
                context.handleClickVariant('Admin not found. Please login again.', 'warning');
                setIsLoadDeny(false);
                return;
            }

            const adminFormData = {
                status: '-1',
                adminId: adminId,
            };

            editData(`/api/quiz/approveQuiz/${quizId}`, adminFormData)
                .then((res) => {
                    context.handleClickVariant('Quiz denied successfully', 'success');
                    setIsLoadDeny(false);
                    setTimeout(() => {
                        navigate('/quiz/list');
                    }, 1500);
                })
                .catch((err) => {
                    setIsLoadDeny(false);
                    if (err.response && err.response.data && err.response.data.msg) {
                        context.handleClickVariant(err.response.data.msg, 'error');
                    } else {
                        context.handleClickVariant('Server error', 'error');
                    }
                });
        } catch (err) {
            context.handleClickVariant(err, 'warning');
            return;
        }
    };
    return (
        <section className="right-content w-100 createQuiz">
            <form onSubmit={acceptQuiz} className="form">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <div className="dFlexAli-center">
                                <h5>Basic Information</h5>
                                <Button className="btn-blue btn-small text-capitalize ms-auto">
                                    <Link to={`/quiz/list`}>Quiz List</Link>
                                </Button>
                            </div>

                            <div className="form-group">
                                <h6>Title*</h6>
                                <input value={formField.title} name="title" type="text" readOnly />
                            </div>

                            <div className="form-group">
                                <h6>Description*</h6>
                                <textarea
                                    readOnly
                                    value={formField.description || ''}
                                    name="description"
                                    rows={5}
                                    cols={20}
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Field</h6>
                                        <select className="form-select" value={fieldVal} disabled>
                                            <option value="">None</option>
                                            {fieldData?.map((field) => (
                                                <option key={field.id} value={field.id}>
                                                    {field.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Level</h6>
                                        <select className="form-select" value={levelVal} disabled>
                                            <option value="">None</option>
                                            <option value="1">Primary</option>
                                            <option value="2">Secondary</option>
                                            <option value="3">High</option>
                                            <option value="4">University</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Duration of Time ( minutes )*</h6>
                                        <input
                                            readOnly
                                            value={formField.duration}
                                            name="duration"
                                            type="text"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Password for private</h6>
                                        <input
                                            readOnly
                                            value={formField.password}
                                            name="password"
                                            type="text"
                                            placeholder="abc123..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="dFlexAliJus-center mt-3">
                                <Button className="btn-red w-100 btn-big text-capitalize">
                                    <Link to="">
                                        <IoTrashBin className="me-2" /> Delete
                                    </Link>
                                </Button>

                                <Button
                                    onClick={denyQuiz}
                                    disabled={isLoadDeny === true ? true : false}
                                    className="btn-yellow w-100 btn-big text-capitalize ms-2"
                                >
                                    <span className="dFlexAli-center me-2">
                                        <TbCancel className="me-2" /> Deny
                                    </span>
                                    {isLoadDeny === true && (
                                        <CircularProgress
                                            className="loader"
                                            color="inherit"
                                            style={{ width: 20, height: 20 }}
                                        />
                                    )}
                                </Button>
                            </div>

                            {formField.status === '1' || formField.status === '2' ? (
                                ''
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoad === true ? true : false}
                                    className="mt-3 btn-green w-100 btn-big text-capitalize"
                                >
                                    <span className="dFlexAli-center me-2">
                                        <FaCheckCircle className="me-2" /> Accept
                                    </span>
                                    {isLoad === true && (
                                        <CircularProgress
                                            className="loader"
                                            color="inherit"
                                            style={{ width: 20, height: 20 }}
                                        />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="col-sm-5">
                        <div className="card p-4">
                            <h5 className="mb-4">Additional Information</h5>

                            <div className="form-group">
                                <h6>Image</h6>
                                <div className="imgUploadBox dFlexAliJus-center">
                                    <div className="uploadBox">
                                        <input className="fileInput" type="file" accept="image/*" />
                                        <div className="previewArea">
                                            {formField.image ? (
                                                <img src={formField.image} alt="Selected" className="imageArea w-100" />
                                            ) : (
                                                <div className="info">
                                                    <FaRegImages />
                                                    <h5>Image Upload</h5>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <h6>Quiz</h6>

                                <div className="wrapQuiz">
                                    <div className="quizList mt-3">
                                        {formField.quiz.map((_, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveQuestionIndex(idx)}
                                                className={`quizItem ${activeQuestionIndex === idx ? 'active' : ''}`}
                                            >
                                                {idx + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeQuestionIndex !== null && formField.quiz[activeQuestionIndex] && (
                    <div className="card p-4 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-4">Question {activeQuestionIndex + 1} Configuration</h5>
                        </div>

                        <div className="form-group">
                            <h5>Question Image</h5>
                            <div className="imgUploadBox dFlexAli-center">
                                <div className="uploadBox">
                                    <input className="fileInput" type="file" accept="image/*" />
                                    <div className="previewArea">
                                        {formField.quiz[activeQuestionIndex].questionImage ? (
                                            <img
                                                src={formField.quiz[activeQuestionIndex].questionImage}
                                                alt="Selected"
                                                className="imageArea"
                                            />
                                        ) : (
                                            <div className="info">
                                                <FaRegImages />
                                                <h5>Image Upload</h5>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <h5>Question Text</h5>
                            <textarea readOnly rows={5} value={formField.quiz[activeQuestionIndex].questionText} />
                        </div>

                        <div className="form-group mb-1">
                            <h5>Answers</h5>
                            <h6>One or more correct answers can be selected.</h6>
                        </div>

                        {formField.quiz[activeQuestionIndex].options.map((option, optionIdx) => (
                            <div key={optionIdx} className="d-flex align-items-center mt-2">
                                <input
                                    readOnly
                                    className="checkboxAnswer"
                                    type="checkbox"
                                    checked={formField.quiz[activeQuestionIndex].correctAnswers.includes(option.text)}
                                />
                                <input
                                    readOnly
                                    className="inputAnswer"
                                    type="text"
                                    placeholder={`Answer ${optionIdx + 1}`}
                                    value={option.text}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </section>
    );
};

export default DetailQuiz;
