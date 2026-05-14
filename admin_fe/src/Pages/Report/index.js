// Icons
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

// Material UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// API
import { fetchDataFromApi, editData } from '../../utils/api';

// CSS
import styles from './Report.module.scss';
import classNames from 'classnames/bind';

import { MyContext } from '../../App';

const cx = classNames.bind(styles);

const ReportList = () => {
    const context = useContext(MyContext);
    const adminData = JSON.parse(localStorage.getItem('adminInfo')) || '';
    const adminId = adminData._id || '';

    const [reportData, setReportData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    const [approveModal, setApproveModal] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');

    const [detailData, setDetailData] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/report/reportList?page=1`).then((res) => {
            setReportData(res.reportList || []);
            setTotalPages(res.totalPages || 1);
        });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', page);
        if (sort) params.append('sort', sort);

        fetchDataFromApi(`/api/report/reportList?${params.toString()}`).then((res) => {
            setReportData(res.reportList || []);
            setTotalPages(res.totalPages || 1);
        });
    }, [page, sort]);

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

    // Approve modal handlers
    const openApproveModal = (id) => {
        setSelectedReportId(id);
        setApproveModal(true);
    };

    const approveReport = async (e) => {
        e.preventDefault();

        try {
            const res = await editData(`/api/report/approve/${selectedReportId}`, {
                adminId,
            });

            context.handleClickVariant('Approve successful!', 'success');
            setApproveModal(false);

            setReportData((prev) =>
                prev.map((r) =>
                    r._id === selectedReportId
                        ? {
                              ...r,
                              status: 'approve',
                              approveReportBy: res.approveReportBy,
                          }
                        : r,
                ),
            );
        } catch (err) {
            context.handleClickVariant('Something went wrong!', 'error');
            console.error(err);
        }
    };

    return (
        <section className="right-content w-100">
            <div className="card shadow border-0 p-3">
                <h3 className="hd">Report Lists</h3>

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
                                            <Link to={`/quiz/detail/${report.quizId?.id}`}>{report.quizId?.title}</Link>
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    report.status === 'approve'
                                                        ? 'badge bg-success'
                                                        : 'badge bg-warning'
                                                }
                                            >
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="text-center">{formatDate(report.createdAt)}</td>
                                        <td>
                                            <div className="actions dFlexAli-center justify-content-around">
                                                <Button onClick={() => setDetailData(report)} className="detail">
                                                    <FaEye />
                                                </Button>
                                                {report.status !== 'approve' && (
                                                    <Button
                                                        onClick={() => openApproveModal(report._id)}
                                                        className="edit"
                                                    >
                                                        <MdEdit />
                                                    </Button>
                                                )}
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

                    <Dialog open={approveModal} onClose={() => setApproveModal(false)}>
                        <DialogTitle>
                            <span className="text-success fw-bold">Approve Report</span>
                        </DialogTitle>

                        <form onSubmit={approveReport}>
                            <DialogContent>
                                <h3>Are you sure you want to approve this report?</h3>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={() => setApproveModal(false)} variant="outlined">
                                    Cancel
                                </Button>
                                <Button variant="contained" color="success" type="submit">
                                    Approve
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
