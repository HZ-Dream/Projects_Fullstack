// Icons
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

// Material UI
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

// React
import { useEffect, useState } from 'react';

// API
import { fetchDataFromApi } from '../../utils/api';

const Account = () => {
    const [catBy, setCatBy] = useState('admin');

    const [adminData, setAdminData] = useState([]);
    const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
    const [totalPageAdmin, setTotalPageAdmin] = useState(1);
    const [userData, setUserData] = useState([]);
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [totalPageUser, setTotalPageUser] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi('/api/admin/getAccount?page=1')
            .then((res) => {
                setAdminData(res.adminList);
                setCurrentPageAdmin(res.currentPage);
                setTotalPageAdmin(res.totalPages);
            })
            .catch((err) => {
                console.error(err);
            });

        fetchDataFromApi('/api/user/getAccount?page=1')
            .then((res) => {
                setUserData(res.users);
                setCurrentPageUser(res.currentPage);
                setTotalPageUser(res.totalPages);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (catBy === 'admin') {
            fetchDataFromApi(`/api/admin/getAccount?page=${currentPageAdmin}`)
                .then((res) => {
                    setAdminData(res.adminList);
                    setCurrentPageAdmin(res.currentPage);
                    setTotalPageAdmin(res.totalPages);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (catBy === 'user') {
            fetchDataFromApi(`/api/user/getAccount?page=${currentPageUser}`)
                .then((res) => {
                    setUserData(res.users);
                    setCurrentPageUser(res.currentPage);
                    setTotalPageUser(res.totalPages);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [catBy, currentPageAdmin, currentPageUser]);

    return (
        <>
            <section className="right-content w-100">
                <div className="card shadow border-0 p-3">
                    <h3 className="hd">List Accounts</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>CATEGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    className="w-100"
                                    value={catBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value={'admin'}>Admin</MenuItem>
                                    <MenuItem value={'user'}>User</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        {catBy === 'admin' ? (
                            <table className="table table-bordered v-align">
                                <thead className="theadDesign">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {adminData.map((admin, index) => (
                                        <tr key={index}>
                                            <td># {index + 1}</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.email}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{admin.isAdmin ? 'Admin' : 'Manager'}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <MdEdit />
                                                    </Button>
                                                    <Button className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-bordered v-align">
                                <thead className="theadDesign">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Quiz Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {userData.map((user, index) => (
                                        <tr key={index}>
                                            <td>#1</td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.email}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dFlexAli-center productBox">
                                                    <div className="info ps-2">
                                                        <h6>{user.quizCreated}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions dFlexAliJus-center">
                                                    <Button className="edit me-2">
                                                        <MdEdit />
                                                    </Button>
                                                    <Button className="delete">
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* <div className="dFlexAli-center tableFooter pt-1">
                            <p className="mb-0 me-auto">
                                Totals <b>{fieldData?.totalFields}</b> fields
                            </p>

                            <Pagination
                                page={currentPage}
                                count={fieldData?.totalPages}
                                color="primary"
                                showFirstButton
                                showLastButton
                                onChange={handleChangePage}
                            />
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Account;
