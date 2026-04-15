// Icons
import { FaEye, FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// React
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

// API
import { fetchDataFromApi, deleteData } from '../../utils/api';

// CSS
import styles from './Report.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const ReportList = () => {
    const context = useContext(MyContext);
    const { userId } = useParams();

    const [reportData, setReportData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteReportId, setDeleteReportId] = useState('');

    const [detailData, setDetailData] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/report/getByUser/${userId}?page=1`).then((res) => {
            setReportData(res.reportList || []);
            setTotalPages(res.totalPages || 1);
        });
    }, [userId]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', page);
        if (sort) params.append('sort', sort);

        fetchDataFromApi(`/api/report/reportByUser/${userId}?${params.toString()}`).then((res) => {
            setReportData(res.reportList || []);
            setTotalPages(res.totalPages || 1);
        });
    }, [page, sort, userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const handleClose = () => setDetailData({});

    // Delete modal handlers
    const deleteReportModal = (id) => {
        setDeleteReportId(id);
        setDeleteModal(true);
    };

    const handleCloseDel = () => {
        setDeleteModal(false);
    };

    const deleteReport = async (e) => {
        e.preventDefault();

        try {
            await deleteData('/api/report/delete/', deleteReportId);

            context.handleClickVariant('Delete report successful!', 'success');
            setDeleteModal(false);

            setReportData((prev) => prev.filter((r) => r._id !== deleteReportId));

            if (reportData.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
            }
        } catch (err) {
            context.handleClickVariant('Something went wrong!', 'error');
            console.error(err);
        }
    };

    return (
        <section className="right-content w-100">
            <div className="card shadow border-0 p-3">
                <h3 className="hd">Your Reports</h3>

                <div className="row cardFilters mt-3">
                    <div className="col-md-3">
                        <h4>Sort</h4>
                        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="">None</option>
                            <option value="oldest">Oldest</option>
                            <option value="latest">Latest</option>
                            <option value="pending">Pending</option>
                            <option value="approve">Approve</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive mt-3">
                    <table className="table table-bordered v-align">
                        <thead className="theadDesign">
                            <tr>
                                <th>No.</th>
                                <th>Title</th>
                                <th>Quiz</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((report, index) => (
                                    <tr key={report._id}>
                                        <td>#{index + 1}</td>
                                        <td>{report.title}</td>
                                        <td>
                                            <Link to={`/quiz/${report.quizId?.id}`}>{report.quizId?.title}</Link>
                                        </td>
                                        <td>{report.status}</td>
                                        <td className="text-center">{formatDate(report.createdAt)}</td>
                                        <td>
                                            <div className="actions dFlexAli-center justify-content-around">
                                                <Button onClick={() => setDetailData(report)} className="detail">
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    onClick={() => deleteReportModal(report._id)}
                                                    className="delete"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {detailData.id && (
                        <div className={cx('reportOverlay')}>
                            <div className={cx('reportModal')}>
                                {/* Header */}
                                <div className={cx('reportHeader')}>
                                    <h5>Report Quiz</h5>
                                    <span onClick={handleClose}>×</span>
                                </div>

                                {/* Body */}
                                <div className={cx('reportBody')}>
                                    <h6>Title</h6>
                                    <input type="text" value={detailData.title} readOnly />

                                    <h6>Description</h6>
                                    <textarea value={detailData.description} readOnly />

                                    <h6>Approve by</h6>
                                    <input type="text" value={detailData.approveReportBy?.name || 'Pending'} readOnly />
                                </div>
                            </div>
                        </div>
                    )}

                    <Dialog className="editCategoryModal" open={deleteModal} onClose={handleCloseDel}>
                        <DialogTitle className="dFlexAli-center">
                            <span className="me-2 text-danger fw-bold">Delete Report</span>
                        </DialogTitle>
                        <form onSubmit={deleteReport}>
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
                        <Pagination
                            className="ms-auto"
                            count={totalPages}
                            page={page}
                            color="primary"
                            showFirstButton
                            showLastButton
                            onChange={(e, value) => setPage(value)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReportList;
