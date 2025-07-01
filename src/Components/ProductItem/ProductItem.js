// Icons, Button
import { RiNumbersFill } from 'react-icons/ri';
import { MdQuiz } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import Button from '@mui/material/Button';

// Img
import AvatarImg from '../../assets/images/avatar.jpg';

// Rating
import Rating from '@mui/material/Rating';

// CSS
import styles from './ProductItem.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ProductItem = ({ className }) => {
    return (
        <div className={`item ${cx('productItem', className)}`}>
            <div className={cx('imgWrapper')}>
                <img
                    className="w-100"
                    src="https://s3.eduquiz.io.vn/eduquiz/workspace/bi-mat-3/exam/IMG_1749609982.jpg"
                    alt="Product"
                />
            </div>

            <div className={cx('actions')}>
                <Button>
                    <FaHeart />
                </Button>
                <Button>
                    <MdNoteAdd />
                </Button>
            </div>

            <div className={cx('info')}>
                <h4 className={cx('nameQuiz')}>Internet of Things - IOT (HUBT 2025)</h4>
                <span className="d-flex align-items-center">
                    <FaClock />
                    <span className="ms-1">30/06/2025</span>
                </span>
                <div className="d-flex align-items-center">
                    <Rating className="mt-2 mb-2" name="read-only" value={4.5} readOnly size="small" precision={0.5} />
                    <div className="ms-2 d-flex align-items-center">
                        <div className="me-1">245</div>
                        <RiNumbersFill />
                    </div>
                </div>

                <div className="d-flex">
                    <div className={`${cx('numberOfQuiz')} d-flex align-items-center`}>
                        <MdQuiz />
                        <span className="text ms-1">23</span>
                    </div>
                    <span className={`${cx('numberOfUser')} ms-3 d-flex align-items-center`}>
                        <FaUserEdit />
                        <span className="text ms-1">456</span>
                    </span>
                </div>

                <div className="d-flex align-items-center">
                    <img className={cx('imgAvatar')} src={AvatarImg} alt="Avatar" />
                    <span className="textOne_line">Dream</span>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
