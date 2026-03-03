// React Icons
import { FcSurvey } from 'react-icons/fc';

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';

// React
import { useState, useContext, useEffect } from 'react';

// API
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

// CSS
import styles from './SurveyAI.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SurveyAI = ({ isOpenSurvey, closeSurvey, quizId }) => {
    const context = useContext(MyContext);

    const [isLoad, setIsLoad] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formField, setFormField] = useState({
        userId: '',
        rate: 0,
        linkFile: '',
        description: '',
        quizId: quizId,
    });

    useEffect(() => {
        if (isOpenSurvey) {
            setFormField({
                userId: '',
                rate: 0,
                linkFile: '',
                description: '',
                quizId: quizId,
            });
        }
    }, [isOpenSurvey, quizId]);

    const onChangeFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!validTypes.includes(file.type)) {
            context.handleClickVariant('Only DOC or DOCX files are allowed!', 'warning');
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('wordFile', file);

            const res = await postData('/api/surveyAI/uploadFile', formData);

            setFormField((prev) => ({
                ...prev,
                linkFile: res.secure_url,
            }));

            context.handleClickVariant('File uploaded successfully!', 'success');
        } catch (err) {
            context.handleClickVariant('File upload failed!', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormField((prev) => ({ ...prev, [name]: value }));
    };

    const submitSurvey = async (e) => {
        e.preventDefault();

        if (!formField.rate) {
            context.handleClickVariant('Please rate before submitting!', 'warning');
            return;
        }

        try {
            setIsLoad(true);

            const finalData = {
                ...formField,
                userId: context.userData.userId,
            };

            await postData('/api/surveyAI/submitSurvey', finalData);

            context.handleClickVariant('Submit survey success!', 'success');
            closeSurvey();
        } catch (err) {
            context.handleClickVariant(err?.response?.data?.msg || 'Server error', 'error');
        } finally {
            setIsLoad(false);
        }
    };

    const isDisabled = isLoad || isUploading || !formField.rate;

    return (
        <Dialog className={cx('surveyModal')} open={isOpenSurvey} fullWidth maxWidth="md">
            <div className={cx('header')}>
                <FcSurvey />
                <span>Survey AI Experience</span>
            </div>

            <div className={cx('body')}>
                <div className={cx('card')}>
                    <div className={cx('label')}>Rate AI quality *</div>

                    <div className={cx('ratingWrap')}>
                        <Rating
                            size="large"
                            precision={0.5}
                            value={Number(formField.rate)}
                            onChange={(e, newValue) =>
                                setFormField((prev) => ({
                                    ...prev,
                                    rate: newValue,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className={cx('card')}>
                    <div className={cx('label')}>Upload Word file (if you rate &lt; 3)</div>

                    <label className={cx('uploadBox')}>
                        <input className={cx('fileInput')} type="file" accept=".doc,.docx" onChange={onChangeFile} />

                        {isUploading ? (
                            <CircularProgress size={22} />
                        ) : formField.linkFile ? (
                            <span>✅ File uploaded</span>
                        ) : (
                            <span>📄 Click to upload Word file</span>
                        )}
                    </label>
                </div>

                <div className={cx('card')}>
                    <div className={cx('label')}>Your feedback</div>

                    <textarea
                        className={cx('textarea')}
                        name="description"
                        value={formField.description}
                        onChange={onChangeInput}
                        placeholder="Tell us what AI did well or poorly..."
                        rows={4}
                    />
                </div>
            </div>

            <div className={cx('actions')}>
                <Button onClick={closeSurvey} disabled={isLoad}>
                    Close
                </Button>

                <Button variant="contained" onClick={submitSurvey} disabled={isDisabled}>
                    {isLoad ? <CircularProgress size={22} /> : 'Submit'}
                </Button>
            </div>
        </Dialog>
    );
};

export default SurveyAI;
