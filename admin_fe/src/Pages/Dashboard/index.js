// Icons
import { FaUserCircle } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';

// Material UI
import { BarChart } from '@mui/x-charts/BarChart';

// React
import { useState, useEffect } from 'react';

// Components
import DashboardBox from './components/dashboardBox';

// API
import { fetchDataFromApi } from '../../utils/api';

const Dashboard = () => {
    const [totalData, setTotalData] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        totalReviews: 0,
    });

    const [monthRange, setMonthRange] = useState(3);
    const [chartData, setChartData] = useState({
        users: [],
        quizzes: [],
        reviews: [],
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/admin/getTotalData').then((res) => {
            setTotalData(res);
        });
    }, []);

    useEffect(() => {
        fetchDataFromApi(`/api/admin/getDashboardChart/?months=${monthRange}`)
            .then((res) => {
                setChartData(res);
            })
            .catch(() => {
                setChartData({
                    users: [],
                    quizzes: [],
                    reviews: [],
                });
            });
    }, [monthRange]);

    const getLastMonths = (numMonths) => {
        const now = new Date();
        const labels = [];

        for (let i = numMonths - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

            const label = d.toLocaleString('en-US', {
                month: 'short',
                year: 'numeric',
            });

            labels.push(label);
        }

        return labels;
    };

    const monthLabels = getLastMonths(monthRange);

    return (
        <>
            <section className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12 list">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                color={['rgb(28, 94, 56)', 'rgb(72, 212, 131)']}
                                title="Total Users"
                                data={totalData.totalUsers}
                                icon={<FaUserCircle />}
                                chart={true}
                            />
                            <DashboardBox
                                color={['rgb(115, 33, 131)', 'rgb(235, 100, 254)']}
                                title="Total Quizzes"
                                data={totalData.totalQuizzes}
                                icon={<MdQuiz />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(32, 79, 145)', 'rgb(96, 175, 245)']}
                                title="Total Reviews"
                                data={totalData.totalReviews}
                                icon={<MdRateReview />}
                                chart={false}
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="dFlexAli-center">
                        <h3 className="hd">Chart</h3>

                        <select
                            className="form-select form-select-sm w-auto ms-auto"
                            value={monthRange}
                            onChange={(e) => setMonthRange(Number(e.target.value))}
                        >
                            <option value="3">3 months</option>
                            <option value="6">6 months</option>
                            <option value="12">12 months</option>
                        </select>
                    </div>
                    <BarChart
                        height={300}
                        xAxis={[{ data: monthLabels }]}
                        yAxis={[{ width: 50 }]}
                        series={[
                            {
                                data: chartData.users?.length ? chartData.users : new Array(monthRange).fill(0),
                                label: 'users label',
                            },
                            {
                                data: chartData.quizzes?.length ? chartData.quizzes : new Array(monthRange).fill(0),
                                label: 'quizzes label',
                            },
                            {
                                data: chartData.reviews?.length ? chartData.reviews : new Array(monthRange).fill(0),
                                label: 'reviews label',
                            },
                        ]}
                    />
                </div>
            </section>
        </>
    );
};

export default Dashboard;
