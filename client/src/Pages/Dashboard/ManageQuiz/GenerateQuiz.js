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

const GenerateQuiz = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    // Set load
    const [load, isLoad] = useState(false);
    const [fieldData, setFieldData] = useState([]);

    const levelOptions = [
        { id: '1', name: 'Primary' },
        { id: '2', name: 'Secondary' },
        { id: '3', name: 'High' },
        { id: '4', name: 'University' },
    ];

    const [formFields, setFormFields] = useState({
        fieldId: '',
        fieldName: '',
        levelId: '',
        levelName: '',
        numberOfQuestions: '',
        multipleCorrect: 'false',
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/field/all').then((res) => {
            setFieldData(res.fieldList);
        });
    }, []);

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value,
        }));
    };

    const generateQuiz = (e) => {
        e.preventDefault();
        if (!formFields.fieldId.trim() || !formFields.fieldName.trim()) {
            context.handleClickVariant('Please fill all fields!', 'warning');
            return;
        } else if (!formFields.levelId.trim() || !formFields.levelName.trim()) {
            context.handleClickVariant('Please select a valid level!', 'warning');
            return;
        } else if (!formFields.numberOfQuestions.trim() || isNaN(formFields.numberOfQuestions)) {
            context.handleClickVariant('Please enter a valid number of questions!', 'warning');
            return;
        }
        isLoad(true);
        console.log(formFields);

        postData('/api/gemini/generate', formFields)
            .then((res) => {
                isLoad(false);
                context.handleClickVariant('Generate successful!', 'success');
                console.log(res);

                setTimeout(() => {
                    navigate('/dashboard/quizCreate', { state: { formGenerate: formFields, dataAI: res } });
                }, 1500);
            })
            .catch((err) => {
                isLoad(false);
                context.handleClickVariant(err.response.data.msg, 'error');
            });
    };

    return (
        <>
            <section className="right-content w-100">
                <form className="form" onSubmit={generateQuiz}>
                    <div className="row">
                        <div className="col-sm-7 mx-auto">
                            <div className="card p-4">
                                <div className="dFlexAliJus-center mb-3">
                                    <h5>Generate Quiz by AI</h5>
                                </div>

                                <div className="form-group">
                                    <h6>Field</h6>
                                    <select
                                        className="form-select"
                                        value={formFields.fieldId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const selectedField = fieldData.find((f) => f.id === val);
                                            setFormFields({
                                                ...formFields,
                                                fieldId: val,
                                                fieldName: selectedField ? selectedField.name : '',
                                            });
                                        }}
                                    >
                                        <option value="">None</option>
                                        {fieldData?.map((field) => (
                                            <option key={field.id} value={field.id}>
                                                {field.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <h6>Level</h6>
                                    <select
                                        className="form-select"
                                        value={formFields.levelId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const selectedLevel = levelOptions.find((l) => l.id === val);
                                            setFormFields({
                                                ...formFields,
                                                levelId: val,
                                                levelName: selectedLevel ? selectedLevel.name : '',
                                            });
                                        }}
                                    >
                                        <option value="">None</option>
                                        <option value="1">Primary</option>
                                        <option value="2">Secondary</option>
                                        <option value="3">High</option>
                                        <option value="4">University</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <h6>Number of Questions</h6>
                                    <input
                                        value={formFields.numberOfQuestions}
                                        type="text"
                                        name="numberOfQuestions"
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <h6 className="mb-0">Multiple Correct Answers</h6>
                                    <div className="dFlexAli-center">
                                        <div className="dFlexAli-center me-3">
                                            <input
                                                type="radio"
                                                name="multipleCorrect"
                                                value="true"
                                                checked={formFields.multipleCorrect === 'true'}
                                                onChange={changeInput}
                                            />
                                            <h6 className="mb-0 ms-2">Yes</h6>
                                        </div>
                                        <div className="dFlexAli-center">
                                            <input
                                                type="radio"
                                                name="multipleCorrect"
                                                value="false"
                                                checked={formFields.multipleCorrect === 'false'}
                                                onChange={changeInput}
                                            />
                                            <h6 className="mb-0 ms-2">No</h6>
                                        </div>
                                    </div>
                                </div>

                                <Button disabled={load} type="submit" className="mt-2 btn-blue w-100 btn-big">
                                    <SiGooglegemini className="me-2" />
                                    <span className="me-2">Generate</span>
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

export default GenerateQuiz;
