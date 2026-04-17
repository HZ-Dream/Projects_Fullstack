// Icons
import { FaExternalLinkAlt } from 'react-icons/fa';

// React
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Material UI
import CircularProgress from '@mui/material/CircularProgress';

// API
import { fetchDataFromApi, postData } from '../../utils/api';

// Styles
import styles from './checkQuiz.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CheckQuiz = () => {
    const [inputText, setInputText] = useState('');
    const [textResult, setTextResult] = useState(null);
    const [quizResult, setQuizResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check Quiz by Text
    const handleCheckText = async () => {
        if (!inputText) return;

        setLoading(true);
        console.log(inputText);

        postData('/api/key/checkText', { text: inputText }).then((res) => {
            setTextResult(res);
            setQuizResult(null);
            setLoading(false);
        });
    };

    // Check All Quiz
    const handleCheckQuiz = async () => {
        setLoading(true);

        fetchDataFromApi('/api/key/checkContent').then((res) => {
            setQuizResult(res);
            setTextResult(null);
            setLoading(false);
        });
    };

    return (
        <section className="right-content w-100">
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>Quiz Content Checker</h2>

                {/* SEARCH */}
                <div className={cx('card')}>
                    <h3>Search Keyword in Quizzes</h3>

                    <div className={cx('row')}>
                        <input
                            type="text"
                            placeholder="Enter keyword..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />

                        <button className={cx('btn-search')} onClick={handleCheckText}>
                            Search
                        </button>
                    </div>
                </div>

                {/* CHECK ALL */}
                <div className={cx('card')}>
                    <div className="dFlexAli-center">
                        <h3 className="mb-0">Scan All Quizzes (Bad Words)</h3>

                        <button className={`ms-auto me-2 ${cx('btn-scan')}`} onClick={handleCheckQuiz}>
                            Scan Now
                        </button>
                        <button className={cx('btn-list')}>
                            <Link to={'/key/list'}>List Keys</Link>
                        </button>
                    </div>
                </div>

                {/* RESULT */}
                <div className={cx('card')}>
                    <h3>Result</h3>

                    {loading && (
                        <div className={cx('loading')}>
                            <CircularProgress />
                        </div>
                    )}

                    {!loading && (
                        <>
                            {/* TEXT RESULT TABLE */}
                            {textResult?.data &&
                                (textResult.data.length === 0 ? (
                                    <p className={cx('success')}>No matches found</p>
                                ) : (
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Quiz Title</th>
                                                <th>Matched Keyword</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {textResult.data.map((q, index) => (
                                                <tr key={q.quizId}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link to={`/quiz/detail/${q.quizId}`}>
                                                            {q.title} <FaExternalLinkAlt />
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <span className={cx('tag')}>{q.matchedText}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}

                            {/* QUIZ RESULT TABLE */}
                            {quizResult?.data &&
                                (quizResult.data.length === 0 ? (
                                    <p className={cx('success')}>All quizzes are clean</p>
                                ) : (
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Quiz Title</th>
                                                <th>Violations</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quizResult.data.map((q, index) => (
                                                <tr key={q.quizId}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link to={`/quiz/detail/${q.quizId}`}>
                                                            {q.title} <FaExternalLinkAlt className="ms-2 mb-0" />
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <div className={cx('violationBox')}>
                                                            {q.violations?.map((v, i) => (
                                                                <span key={i}>{v}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CheckQuiz;
