// Icons
import { SiGooglegemini } from 'react-icons/si';

// Material UI
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// React
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Other
import { fetchDataFromApi, postData } from '../../../utils/api';

// Context
import { MyContext } from '../../../App';

const UploadText = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    // Set load
    const [load, isLoad] = useState(false);
    const [loadFile, isLoadFile] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const generateQuiz = async (e) => {
        e.preventDefault();
        const fileInput = e.target.file;
        const file = fileInput.files[0];

        if (!file) {
            context.handleClickVariant('Vui lòng chọn file!', 'warning');
            return;
        }

        if (
            !['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(
                file.type,
            )
        ) {
            context.handleClickVariant('Chỉ chấp nhận file Word!', 'warning');
            return;
        }

        isLoad(true);

        const userId = context.userData.userId;

        if (userId) {
            // Check token
            fetchDataFromApi(`/api/user/getUser/${userId}`).then((res) => {
                if (res.token < 50) {
                    context.handleClickVariant('Not enough tokens! Please top up.', 'warning');
                    isLoad(false);
                    return;
                }
            });
        } else {
            context.handleClickVariant('User not found. Please log in again.', 'warning');
        }

        const formData = new FormData();
        formData.append('wordFile', file);

        try {
            const res = await postData(`/api/gemini/convertText/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            context.handleClickVariant('Generate successful!', 'success');

            console.log(res);

            setTimeout(() => {
                navigate('/dashboard/quizCreate', { state: { dataAI: res } });
            }, 1500);
        } catch (err) {
            context.handleClickVariant(err.response?.data?.msg || 'Lỗi generate quiz', 'error');
        } finally {
            isLoad(false);
        }
    };

    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={generateQuiz}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAliJus-center mb-3">
                                    <h5>Generate Quiz by Upload Text</h5>
                                </div>

                                <div className="dFlexAli-center mb-2">
                                    {loadFile === true && <CircularProgress className="loader me-2" color="inherit" />}
                                    <h6 className="mb-0">Upload a file</h6>
                                </div>
                                <input
                                    disabled={load}
                                    className="mb-3 inputUpload"
                                    type="file"
                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    name="file"
                                />

                                <Button disabled={load} type="submit" className="mt-2 btn-blue w-100 btn-big">
                                    <SiGooglegemini className="me-2" />
                                    <span className="me-2">Generate ( fee: 50 Tokens )</span>
                                    {load === true && <CircularProgress className="loader" color="inherit" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default UploadText;
