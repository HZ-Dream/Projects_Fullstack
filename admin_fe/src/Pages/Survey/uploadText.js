// Icons
import { FaEye } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FcSurvey } from 'react-icons/fc';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Others
import { fetchDataFromApi } from '../../utils/api';

// Context
import { MyContext } from '../../App';

const UploadText = () => {
    const context = useContext(MyContext);
    const [openDetail, setOpenDetail] = useState(false);
    const [detailItem, setDetailItem] = useState('');
    const [listData, setListData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const [sort, setSort] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/surveyAI/getList?page=1').then((res) => {
            setListData(res.list);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
        });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();

        params.append('page', page);

        if (sort || sort !== '') {
            params.append('sort', sort);
        }

        fetchDataFromApi(`/api/surveyAI/getList?${params.toString()}`).then((res) => {
            setListData(res.list);
            setTotalPages(res.totalPages);
        });
    }, [page, sort]);

    return (
        <>
            <section className="right-content w-100">
                <div className="card shadow border-0 p-3">
                    <div className="dFlexAli-center">
                        <h3 className="hd">Survey List</h3>
                    </div>

                    <div className="col-md-3 mt-4">
                        <h6>Sort</h6>
                        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="">None</option>
                            <option value="oldest">Oldest</option>
                            <option value="latest">Latest</option>
                            <option value="high">Rate High to Low</option>
                            <option value="low">Rate Low to High</option>
                        </select>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Rates</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listData?.length !== 0 &&
                                    listData?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.userId.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{item.rate}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit">
                                                        <Link to={`/quiz/detail/${item.quizId._id}`}>
                                                            <MdEdit />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        className="detail mx-2"
                                                        onClick={() => {
                                                            setDetailItem(item);
                                                            setOpenDetail(true);
                                                        }}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                    {/* <Button className="delete">
                                                        <FaTrash />
                                                    </Button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <div className="dFlexAli-center tableFooter pt-1">
                            <Pagination
                                className="ms-auto"
                                count={totalPages}
                                color="primary"
                                showFirstButton
                                showLastButton
                                onChange={(e, value) => setPage(value)}
                            />
                        </div>
                    </div>
                </div>

                <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
                    <div className="survey-detail-wrapper">
                        <div className="survey-detail-header">
                            <FcSurvey />
                            <span>Survey Detail</span>
                        </div>

                        <div className="survey-detail-body">
                            <div className="survey-detail-block">
                                <div className="survey-detail-label">Created by</div>
                                <h6>{detailItem?.userId?.name}</h6>
                            </div>

                            <div className="survey-detail-block">
                                <div className="survey-detail-label">Rating</div>
                                <Rating value={Number(detailItem?.rate || 0)} readOnly precision={0.5} />
                            </div>

                            <div className="survey-detail-block">
                                <div className="survey-detail-label">File</div>
                                {detailItem?.linkFile ? (
                                    <a
                                        href={detailItem.linkFile}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="survey-detail-link"
                                    >
                                        View uploaded file
                                    </a>
                                ) : (
                                    <span>No file</span>
                                )}
                            </div>

                            <div className="survey-detail-block">
                                <div className="survey-detail-label">Description</div>
                                <div className="survey-detail-desc">{detailItem?.description || 'No description'}</div>
                            </div>
                        </div>

                        <div className="survey-detail-footer">
                            <Button variant="contained" onClick={() => setOpenDetail(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </section>
        </>
    );
};

export default UploadText;
