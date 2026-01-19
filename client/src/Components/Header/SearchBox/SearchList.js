import styles from './SearchBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SearchList = ({ data, onSelect }) => {
    return (
        <div className={cx('searchList')}>
            {data.map((quiz) => (
                <div key={quiz._id} className={cx('item')} onClick={() => onSelect(quiz._id)}>
                    <div className={cx('title')}>{quiz.title}</div>
                    <div className={cx('date')}>{new Date(quiz.updatedAt).toLocaleDateString()}</div>
                </div>
            ))}
        </div>
    );
};

export default SearchList;
