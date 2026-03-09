// React
import { useEffect, useState } from 'react';

// Components
import TokenCard from './TokenCard';
import TokenDialog from './TokenDialog';

// API
import { fetchDataFromApi } from '../../utils/api';

// Styles
import classNames from 'classnames/bind';
import styles from './Token.module.scss';

const cx = classNames.bind(styles);

const Token = () => {
    const [tokens, setTokens] = useState([]);
    const [filter, setFilter] = useState('default');

    const [selectedToken, setSelectedToken] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = async () => {
        try {
            fetchDataFromApi('/api/token/all').then((res) => {
                setTokens(res.tokenList);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpen = (token) => {
        setSelectedToken(token);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sortedTokens = [...tokens].sort((a, b) => {
        if (filter === 'high') return b.priceInit - a.priceInit;
        if (filter === 'low') return a.priceInit - b.priceInit;
        return 0;
    });

    return (
        <div className={cx('token-shop')}>
            <div className={cx('token-header')}>
                <h1>Token Shop</h1>

                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="high">Price High → Low</option>
                    <option value="low">Price Low → High</option>
                </select>
            </div>

            <div className={cx('token-grid')}>
                {sortedTokens.map((token) => (
                    <TokenCard key={token.id} token={token} onClick={() => handleOpen(token)} />
                ))}
            </div>

            <TokenDialog open={open} handleClose={handleClose} token={selectedToken} />
        </div>
    );
};

export default Token;
