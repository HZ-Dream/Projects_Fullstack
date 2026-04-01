// Icons
import { RiDraftFill } from 'react-icons/ri';
import { FaRegImages } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';
import { RiResetRightLine } from 'react-icons/ri';
import { IoIosCreate } from 'react-icons/io';
import { FaPlusCircle } from 'react-icons/fa';
import { FaCircleMinus } from 'react-icons/fa6';
import { IoTrashBin } from 'react-icons/io5';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Slider from 'react-slick';

// API
import { fetchDataFromApi, postData } from '../../../utils/api';

import { MyContext } from '../../../App';
import SymbolMath from '../../../Components/SymbolMath';
import SurveyAI from '../../../Components/SurveyAI';

// Images
var TempImg1 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1774107744/exam-01_iyni3v.webp';
var TempImg2 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1771985605/exam-02_xiyynw.avif';
var TempImg3 = 'https://res.cloudinary.com/davhux6lg/image/upload/v1774107743/exam-03_ys0lsk.webp';

const CreateQuiz = () => {
    const context = useContext(MyContext);
    const location = useLocation();
    const { formGenerate, dataAI } = location.state || {};
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [surveyModal, setSurveyModal] = useState(false);
    const [quizId, setQuizId] = useState(null);

    const [isLoad, setIsLoad] = useState(false);
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
        image: '',
        userId: '',
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

        if (formGenerate || dataAI) {
            setFormField({
                title: dataAI?.title || '',
                description: dataAI?.description || '',
                field: formGenerate?.fieldId || '',
                level: formGenerate?.levelId || '',
                duration: '',
                password: '',
                image: '',
                userId: '',
                quiz: dataAI
                    ? dataAI.quiz.map((q) => ({
                          questionImage: q.questionImage || '',
                          questionText: q.questionText || '',
                          options: q.options ? q.options.map((opt) => ({ text: opt })) : [{ text: '' }, { text: '' }],
                          correctAnswers: q.correctAnswers || [],
                      }))
                    : [{ questionText: '', options: [{ text: '' }, { text: '' }], correctAnswers: [] }],
            });

            if (formGenerate) {
                setFieldVal(formGenerate.fieldId || '');
                setLevelVal(formGenerate.levelId || '');
            }
        }
    }, []);

    const openModal = () => {
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    const closeSurveyModal = () => {
        setSurveyModal(false);
    };

    // Image Quiz
    const onChangeImage = async (e, index) => {
        setSelectedImg(null);
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            context.handleClickVariant('Only JPEG, PNG, and WEBP files are allowed!', 'warning');
            return;
        }

        console.log(file);

        try {
            index !== null ? setLoadQImg(true) : setLoadImg(true);

            const formData = new FormData();

            formData.append('imageQuiz', file);

            postData('/api/quiz/uploadImage', formData)
                .then((data) => {
                    if (index === null) {
                        setFormField((prev) => ({
                            ...prev,
                            image: data.secure_url,
                        }));
                    } else {
                        setFormField((prev) => ({
                            ...prev,
                            quiz: prev.quiz.map((q, idx) =>
                                idx === index ? { ...q, questionImage: data.secure_url } : q,
                            ),
                        }));
                    }

                    index !== null ? setLoadQImg(false) : setLoadImg(false);
                    context.handleClickVariant('File uploaded successfully!', 'success');
                })
                .catch((err) => {
                    context.handleClickVariant(err, 'error');
                });
        } catch (err) {
            console.error('Error uploading file:', err);
            context.handleClickVariant('File upload failed!', 'error');
            index !== null ? setLoadQImg(false) : setLoadImg(false);
        }
    };

    const handleSelectDefault = (img) => {
        setFormField((prev) => ({
            ...prev,
            image: img,
        }));
        setSelectedImg(img);
    };

    const handleReset = () => {
        setFormField((prev) => ({
            ...prev,
            image: '',
        }));
        setSelectedImg(null);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
    };

    const defaultImgs = [TempImg1, TempImg2, TempImg3];
    const randomIndex = Math.floor(Math.random() * defaultImgs.length);

    // Handle Quiz
    const onChangeInput = (e) => {
        setFormField(() => ({
            ...formField,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            questionText: '',
            options: [{ text: '' }, { text: '' }],
            correctAnswers: [],
        };
        setFormField((prev) => ({
            ...prev,
            quiz: [...prev.quiz, newQuestion],
        }));

        setActiveQuestionIndex(formField.quiz.length);
    };

    const handleResetQuestion = (indexToReset) => {
        const defaultQuestion = {
            questionText: '',
            options: [{ text: '' }, { text: '' }],
            correctAnswers: [],
        };

        setFormField((prev) => ({
            ...prev,
            quiz: prev.quiz.map((q, index) => (index === indexToReset ? defaultQuestion : q)),
        }));
    };

    const handleRemoveQuestion = (indexToRemove) => {
        if (formField.quiz.length <= 1) {
            context.handleClickVariant('A quiz must have at least one question!', 'warning');
            return;
        }
        setFormField((prev) => ({
            ...prev,
            quiz: prev.quiz.filter((_, index) => index !== indexToRemove),
        }));

        setActiveQuestionIndex(0);
    };

    const handleQuestionTextChange = (e, index) => {
        const newQuizState = [...formField.quiz];
        newQuizState[index].questionText = e.target.value;
        setFormField((prev) => ({ ...prev, quiz: newQuizState }));
    };

    const handleOptionTextChange = (e, questionIndex, optionIndex) => {
        const newQuizState = [...formField.quiz];
        const question = newQuizState[questionIndex];
        const oldText = question.options[optionIndex].text;
        const newText = e.target.value;

        question.options[optionIndex].text = newText;

        const correctIndex = question.correctAnswers.indexOf(oldText);
        if (correctIndex > -1) {
            question.correctAnswers[correctIndex] = newText;
        }

        setFormField((prev) => ({ ...prev, quiz: newQuizState }));
    };

    const handleCorrectAnswerChange = (optionText, questionIndex) => {
        const newQuizState = [...formField.quiz];
        const question = newQuizState[questionIndex];
        const correctAnswers = question.correctAnswers;

        if (correctAnswers.includes(optionText)) {
            question.correctAnswers = correctAnswers.filter((ans) => ans !== optionText);
        } else {
            question.correctAnswers.push(optionText);
        }

        setFormField((prev) => ({ ...prev, quiz: newQuizState }));
    };

    const handleAddOption = (questionIndex) => {
        const newQuizState = [...formField.quiz];
        newQuizState[questionIndex].options.push({ text: '' });
        setFormField((prev) => ({ ...prev, quiz: newQuizState }));
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const newQuizState = [...formField.quiz];
        const question = newQuizState[questionIndex];

        if (question.options.length <= 2) {
            context.handleClickVariant('A question must have at least two options!', 'warning');
            return;
        }

        const removedOptionText = question.options[optionIndex].text;

        question.options.splice(optionIndex, 1);

        question.correctAnswers = question.correctAnswers.filter((ans) => ans !== removedOptionText);

        setFormField((prev) => ({ ...prev, quiz: newQuizState }));
    };

    const validateSubmit = () => {
        if (
            formField.title.trim() === '' ||
            formField.description.trim() === '' ||
            !formField.duration ||
            Number(formField.duration) <= 0
        ) {
            context.handleClickVariant('Please fill in all information', 'warning');
            return false;
        }

        const { quiz } = formField;

        for (let i = 0; i < quiz.length; i++) {
            const q = quiz[i];

            if (!q.questionText || q.questionText.trim() === '') {
                context.handleClickVariant(`Question ${i + 1} must have text!`, 'warning');
                return false;
            }

            if (!Array.isArray(q.options) || q.options.length === 0) {
                context.handleClickVariant(`Question ${i + 1} must have at least one answer!`, 'warning');
                return false;
            }

            const emptyAnswers = q.options.some((opt) => !opt.text || opt.text.trim() === '');
            if (emptyAnswers) {
                context.handleClickVariant(`Question ${i + 1} has an empty answer option!`, 'warning');
                return false;
            }

            if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
                context.handleClickVariant(`Question ${i + 1} must have at least one correct answer!`, 'warning');
                return false;
            }
        }

        return true;
    };

    const createQuiz = (e) => {
        e.preventDefault();

        if (!validateSubmit()) return;
        setIsLoad(true);

        try {
            const finalFormField = {
                ...formField,
                userId: context.userData.userId,
                field: fieldVal,
                level: levelVal,
                image: formField.image === '' ? defaultImgs[randomIndex] : formField.image,
                quiz: formField.quiz.map((q) => ({
                    questionImage: q.questionImage,
                    questionText: q.questionText,
                    options: q.options.map((opt) => opt.text),
                    correctAnswers: q.correctAnswers,
                })),
            };

            postData('/api/quiz/createQuiz', finalFormField)
                .then((res) => {
                    context.handleClickVariant('Create quiz success!', 'success');
                    setIsLoad(false);

                    if (dataAI || formGenerate) {
                        setSurveyModal(true);
                        setQuizId(res.quizId);
                    }

                    setFormField({
                        title: '',
                        description: '',
                        field: '',
                        level: '',
                        duration: '',
                        password: '',
                        image: '',
                        userId: '',
                        quiz: [
                            {
                                questionImage: '',
                                questionText: '',
                                options: [{ text: '' }, { text: '' }],
                                correctAnswers: [],
                            },
                        ],
                    });

                    setFieldVal('');
                    setLevelVal('');
                    setSelectedImg(null);
                    setActiveQuestionIndex(0);
                })
                .catch((err) => {
                    setIsLoad(false);
                    if (err.response.data.msg) {
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
            <form onSubmit={createQuiz} className="form">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <div className="dFlexAli-center">
                                <h5>Basic Information</h5>
                                <Button className="btn-blue btn-small text-capitalize ms-auto">
                                    <Link to={`/dashboard/quizList/${context.userData.userId}`}>Quiz List</Link>
                                </Button>
                            </div>

                            <div className="form-group">
                                <h6>Title*</h6>
                                <input value={formField.title} onChange={onChangeInput} name="title" type="text" />
                            </div>

                            <Button className="btn-primary btn-small text-capitalize me-auto mb-3" onClick={openModal}>
                                Open Math
                            </Button>

                            <div className="form-group">
                                <h6>Description*</h6>
                                <textarea
                                    onChange={onChangeInput}
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
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Level</h6>
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
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <h6>Duration of Time ( minutes )*</h6>
                                        <input
                                            value={formField.duration}
                                            onChange={onChangeInput}
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
                                            value={formField.password}
                                            onChange={onChangeInput}
                                            name="password"
                                            type="text"
                                            placeholder="abc123..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="dFlexAliJus-center mt-3">
                                <Button className="btn-red w-100 btn-big text-capitalize">
                                    <Link to={`/dashboard/quizList/${context.userData.userId}`}>
                                        <IoTrashBin className="me-2" /> Cancel
                                    </Link>
                                </Button>

                                <Button className="btn-yellow w-100 btn-big text-capitalize ms-2">
                                    <RiDraftFill className="me-2" /> Draft
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoad === true ? true : false}
                                className="mt-3 btn-green w-100 btn-big text-capitalize"
                            >
                                <span className="dFlexAli-center me-2">
                                    <MdCloudUpload className="me-2" /> Create
                                </span>
                                {isLoad === true && (
                                    <CircularProgress
                                        className="loader"
                                        color="inherit"
                                        style={{ width: 20, height: 20 }}
                                    />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="col-sm-5">
                        <div className="card p-4">
                            <h5 className="mb-4">Additional information</h5>

                            <div className="form-group">
                                <h6>Image</h6>
                                <div className="imgUploadBox dFlexAliJus-center">
                                    <div className="uploadBox">
                                        {loadImg ? (
                                            <div className="load dFlexAliJus-center">
                                                <CircularProgress className="loader" color="inherit" />
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    className="fileInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => onChangeImage(e, null)}
                                                />
                                                <div className="previewArea">
                                                    {formField.image ? (
                                                        <img
                                                            src={formField.image}
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
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Slider {...settings} className="mt-2">
                                    {defaultImgs.map((img, idx) => (
                                        <div key={idx} className="thumbnail" onClick={() => handleSelectDefault(img)}>
                                            <img
                                                src={img}
                                                alt={`thumb-${idx}`}
                                                className={`thumbnailImage ${selectedImg === img ? 'active' : ''}`}
                                            />
                                        </div>
                                    ))}
                                    <div className="thumbnail" onClick={handleReset}>
                                        <div className="thumbnailReset">Reset</div>
                                    </div>
                                </Slider>
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
                                        <div onClick={handleAddQuestion} className="quizItem next">
                                            +
                                        </div>
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
                            <Button className="btn-red mb-3" onClick={() => handleRemoveQuestion(activeQuestionIndex)}>
                                <IoTrashBin />
                            </Button>
                        </div>

                        <div className="form-group">
                            <h5>Question Image</h5>
                            <div className="imgUploadBox dFlexAli-center">
                                <div className="uploadBox">
                                    {loadQImg ? (
                                        <div className="load dFlexAliJus-center">
                                            <CircularProgress className="loader" color="inherit" />
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                className="fileInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => onChangeImage(e, activeQuestionIndex)}
                                            />
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button className="btn-primary btn-small text-capitalize me-auto mb-3" onClick={openModal}>
                            Open Math
                        </Button>

                        <div className="form-group">
                            <h5>Question Text</h5>
                            <textarea
                                rows={5}
                                value={formField.quiz[activeQuestionIndex].questionText}
                                onChange={(e) => handleQuestionTextChange(e, activeQuestionIndex)}
                            />
                        </div>

                        <div className="form-group mb-1">
                            <h5>Answers</h5>
                            <h6>One or more correct answers can be selected.</h6>
                        </div>

                        {formField.quiz[activeQuestionIndex].options.map((option, optionIdx) => (
                            <div key={optionIdx} className="d-flex align-items-center mt-2">
                                <input
                                    className="checkboxAnswer"
                                    type="checkbox"
                                    checked={formField.quiz[activeQuestionIndex].correctAnswers.includes(option.text)}
                                    onChange={() => handleCorrectAnswerChange(option.text, activeQuestionIndex)}
                                />
                                <input
                                    className="inputAnswer"
                                    type="text"
                                    placeholder={`Answer ${optionIdx + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionTextChange(e, activeQuestionIndex, optionIdx)}
                                />
                                <Button
                                    className="btn-red btn-small ms-2"
                                    onClick={() => handleRemoveOption(activeQuestionIndex, optionIdx)}
                                >
                                    <FaCircleMinus />
                                </Button>
                            </div>
                        ))}

                        <div className="d-flex justify-content-end mt-2">
                            <Button className="btn-primary btn-small text-capitalize me-2" onClick={openModal}>
                                Open Math
                            </Button>
                            <Button
                                className="btn-green btn-small"
                                onClick={() => handleAddOption(activeQuestionIndex)}
                            >
                                <span>
                                    <div className="dFlexAli-center">
                                        <FaPlusCircle className="me-2" /> Add Answer
                                    </div>
                                </span>
                            </Button>
                        </div>

                        <div className="dFlexAliJus-center mt-4">
                            <Button
                                onClick={() => handleResetQuestion(activeQuestionIndex)}
                                className="btn-blue w-100 btn-big text-capitalize mx-2"
                            >
                                <RiResetRightLine className="me-2" /> Reset
                            </Button>

                            <Button onClick={handleAddQuestion} className="btn-green w-100 btn-big text-capitalize">
                                <IoIosCreate className="me-2" /> New Question
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {isOpenModal && <SymbolMath isOpen={isOpenModal} closeModal={closeModal} />}
            {surveyModal && <SurveyAI isOpenSurvey={surveyModal} closeSurvey={closeSurveyModal} quizId={quizId} />}
        </section>
    );
};

export default CreateQuiz;
