// Icons
import { FaUserCircle } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';

// Material UI
import { BarChart } from '@mui/x-charts/BarChart';

// React
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import DashboardBox from './components/dashboardBox';

// API
import { fetchDataFromApi } from '../../utils/api';

const Dashboard = () => {
    let { userId } = useParams();
    const [totalData, setTotalData] = useState({
        totalQuiz: 0,
        totalAttempts: 0,
        totalRates: 0,
    });

    const [monthRange, setMonthRange] = useState(3);
    const [chartData, setChartData] = useState({
        quizzes: [],
        attempts: [],
        rates: [],
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/user/getTotalData/${userId}`).then((res) => {
            setTotalData(res);
        });
    }, [userId]);

    useEffect(() => {
        fetchDataFromApi(`/api/user/getDashboardChart/${userId}?months=${monthRange}`)
            .then((res) => {
                setChartData(res);
            })
            .catch(() => {
                setChartData({
                    quizzes: [],
                    attempts: [],
                    rates: [],
                });
            });
    }, [userId, monthRange]);

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
                                title="Total Quizzes"
                                data={totalData.totalQuiz}
                                icon={<MdQuiz />}
                                chart={true}
                            />
                            <DashboardBox
                                color={['rgb(115, 33, 131)', 'rgb(235, 100, 254)']}
                                title="Total Attempts"
                                data={totalData.totalAttempts}
                                icon={<FaUserCircle />}
                                chart={false}
                            />
                            <DashboardBox
                                color={['rgb(32, 79, 145)', 'rgb(96, 175, 245)']}
                                title="Total Rates"
                                data={totalData.totalRates}
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
                                data: chartData.quizzes?.length ? chartData.quizzes : new Array(monthRange).fill(0),
                                label: 'quizzes label',
                            },
                            {
                                data: chartData.attempts?.length ? chartData.attempts : new Array(monthRange).fill(0),
                                label: 'attempts label',
                            },
                            {
                                data: chartData.rates?.length ? chartData.rates : new Array(monthRange).fill(0),
                                label: 'rates label',
                            },
                        ]}
                    />
                </div>
            </section>
        </>
    );
};

export default Dashboard;
