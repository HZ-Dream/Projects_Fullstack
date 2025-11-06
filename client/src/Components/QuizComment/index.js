// Icons
import { FaReply } from 'react-icons/fa';
import { RiDeleteBack2Fill } from 'react-icons/ri';

// Material UI
import { Button, Rating } from '@mui/material';

// React
import React, { useState, useEffect, useCallback, useContext } from 'react';
import defaultAvatar from '../assets/default-avatar.png';
import { fetchDataFromApi, postData, deleteData } from '../utils/api';
import { MyContext } from '../context/MyContext';

// CSS
import styles from '../../Pages/QuizDetail/QuizDetail.module.scss';
import classNames from 'classnames/bind';
import cx from 'classnames';

import { MyContext } from '../../App';
const cx = classNames.bind(styles);

const QuizComment = () => {
    const [reviewData, setReviewData] = useState([]);
    const [rate, setRate] = useState(0);
    const [reviews, setReviews] = useState({
        quizId: quizId,
        userId: '',
        userName: '',
        userImage: '',
        review: '',
        rating: 0,
    });

    const [replyTarget, setReplyTarget] = useState(null);
    const [openReplyForms, setOpenReplyForms] = useState([]);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyData, setReplyData] = useState([]);

    return (
        <div className="tabContent">
            <h1>1</h1>
        </div>
    );
};

export default QuizComment;
