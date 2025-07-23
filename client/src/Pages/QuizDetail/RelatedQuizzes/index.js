// React
import Slider from 'react-slick';

// Components
import QuizItem from '../../../Components/QuizItem';

// CSS
import styles from './RelatedQuizzes.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const RelatedQuizzes = () => {
    var quizItemSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };
    return (
        <>
            <div className="d-flex align-items-center">
                <div className="w-75">
                    <h3 className={`{cx('hd')} text-capitalize mt-4`}>Related Quizzes</h3>
                </div>
            </div>

            <div className={`${cx('product_row')} w-100 mt-2`}>
                <Slider {...quizItemSettings}>
                    <QuizItem />
                    <QuizItem />
                    <QuizItem />
                    <QuizItem />
                    <QuizItem />
                    <QuizItem />
                </Slider>
            </div>
        </>
    );
};

export default RelatedQuizzes;
