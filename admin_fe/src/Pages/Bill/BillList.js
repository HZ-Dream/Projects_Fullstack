// Icons
import { FaEye } from 'react-icons/fa';
import { RiBillFill } from 'react-icons/ri';
import { FaCheckSquare } from 'react-icons/fa';
import { FaMoneyBillWave } from 'react-icons/fa';

// Material UI
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// React
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import DashboardBox from '../Dashboard/components/dashboardBox';

// API
import { fetchDataFromApi } from '../../utils/api';

const BillList = () => {
    let { userId } = useParams();
    const [billData, setBillData] = useState();
    const [tokenData, setTokenData] = useState(0);
    // Set Page
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Sort
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    // Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const handleOpenDialog = (bill) => {
        setSelectedBill(bill);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/bill/list?page=1`).then((res) => {
            setBillData(res);
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

        fetchDataFromApi(`/api/bill/list?${params.toString()}`).then((res) => {
            setBillData(res);
            setTotalPages(res.totalPages);
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

    return (
        <>
            <section className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12 list">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                color={['rgb(109, 109, 109)', 'rgb(194, 194, 194)']}
                                title="Total Bills"
                                data={billData?.totalBills || 0}
                                icon={<RiBillFill />}
                                chart={true}
                            />
                            <DashboardBox
                                color={['rgb(15, 175, 0)', 'rgb(43, 255, 0)']}
                                title="Total Success"
                                data={billData?.totalSuccess || 0}
                                icon={<FaCheckSquare />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(125, 128, 0)', 'rgb(200, 255, 0)']}
                                title="Total Profits"
                                data={billData?.totalProfit || 0}
                                icon={<FaMoneyBillWave />}
                                chart={false}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Bills</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Sort</h4>
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="">None</option>
                                <option value="oldest">Oldest</option>
                                <option value="latest">Latest</option>
                                <option value="expensive">Expensive to Cheap</option>
                                <option value="cheap">Cheap to Expensive</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>No.</th>
                                    <th>User Name</th>
                                    <th>Name Pack</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Token</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {billData && billData?.billList?.length > 0 ? (
                                    billData.billList.map((bill, index) => (
                                        <tr key={bill.id}>
                                            <td>#{index + 1}</td>
                                            <td>{bill.userId.name}</td>
                                            <td>{bill.namePack}</td>
                                            <td>{bill.pricePack}</td>
                                            <td>{bill.status}</td>
                                            <td>{bill.tokenPack}</td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button
                                                        className="detail me-2"
                                                        onClick={() => handleOpenDialog(bill)}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center">
                                            No bills found.
                                        </td>
                                    </tr>
                                )}
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

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Bill Details</DialogTitle>

                    <DialogContent dividers>
                        {selectedBill && (
                            <div className="billDetail">
                                <p>
                                    <b>User:</b> {selectedBill.userId?.name}
                                </p>
                                <p>
                                    <b>Email:</b> {selectedBill.userId?.email}
                                </p>
                                <p>
                                    <b>Pack:</b> {selectedBill.namePack}
                                </p>
                                <p>
                                    <b>Price:</b> {selectedBill.pricePack}
                                </p>
                                <p>
                                    <b>Token:</b> {selectedBill.tokenPack}
                                </p>
                                <p>
                                    <b>Status:</b> {selectedBill.status}
                                </p>
                                <p>
                                    <b>Created:</b> {formatDate(selectedBill.createdAt)}
                                </p>
                                <p>
                                    <b>Bill ID:</b> {selectedBill._id}
                                </p>
                            </div>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            </section>
        </>
    );
};

export default BillList;
