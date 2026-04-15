// Icons
import { RiBillFill } from 'react-icons/ri';
import { MdToken } from 'react-icons/md';
import { MdGeneratingTokens } from 'react-icons/md';

// Material UI
import Pagination from '@mui/material/Pagination';

// React
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import DashboardBox from '../../Pages/Dashboard/components/dashboardBox';

// API
import { fetchDataFromApi } from '../../utils/api';

const BillList = () => {
    let { userId } = useParams();
    const [billData, setBillData] = useState();
    const [tokenData, setTokenData] = useState(0);
    // Set Page
    const [totalPages, setTotalPages] = useState(1);
    // Sort
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/user/getUser/${userId}`).then((res) => {
            setTokenData(res.token);
        });

        fetchDataFromApi(`/api/bill/getByUser/${userId}?page=1`).then((res) => {
            setBillData(res);
            setTotalPages(res.totalPages);
        });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();

        params.append('page', page);

        if (sort || sort !== '') {
            params.append('sort', sort);
        }

        fetchDataFromApi(`/api/bill/getByUser/${userId}?${params.toString()}`).then((res) => {
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
                                title="Total Tokens"
                                data={billData?.totalTokens || 0}
                                icon={<MdToken />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(125, 128, 0)', 'rgb(200, 255, 0)']}
                                title="Your Tokens Current"
                                data={tokenData}
                                icon={<MdGeneratingTokens />}
                                chart={false}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Your Bills</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Sort</h4>
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="">None</option>
                                <option value="oldest">Oldest</option>
                                <option value="latest">Latest</option>
                                <option value="expensive">Price Expensive to Cheap</option>
                                <option value="cheap">Price Cheap to Expensive</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="theadDesign">
                                <tr>
                                    <th>No.</th>
                                    <th>Name Pack</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Token</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {billData && billData?.billList?.length > 0 ? (
                                    billData.billList.map((bill, index) => (
                                        <tr key={bill.id}>
                                            <td>#{index + 1}</td>
                                            <td>{bill.namePack}</td>
                                            <td>{bill.pricePack}</td>
                                            <td>{bill.status}</td>
                                            <td>{bill.tokenPack}</td>
                                            <td className="text-center">{formatDate(bill.createdAt)}</td>
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
            </section>
        </>
    );
};

export default BillList;
