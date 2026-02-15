// React Icons
import { IoCloseCircleOutline, IoCopyOutline } from 'react-icons/io5';
import { MdNoteAdd } from 'react-icons/md';
import { SiLibreofficemath } from 'react-icons/si';

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';

// React
import { useState } from 'react';

// Format
import MathText from '../../Format/MathText';

// CSS
import styles from './SymbolMath.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SymbolMath = ({ isOpen, closeModal, onInsert }) => {
    const mathArr = [
        {
            name: 'Fraction',
            latex: '$\\frac{a}{b}$',
            example: '$\\frac{4}{5}$',
        },

        {
            name: 'Square Root',
            latex: '$\\sqrt{x}$',
            example: '$\\sqrt{9}$',
        },

        {
            name: 'Nth Root',
            latex: '$\\sqrt[n]{x}$',
            example: '$\\sqrt[3]{8}$',
        },

        {
            name: 'Power',
            latex: '$x^{n}$',
            example: '$2^{3}$',
        },

        {
            name: 'Subscript',
            latex: '$x_{n}$',
            example: '$a_{1}$',
        },

        {
            name: 'Integral',
            latex: '$\\int f(x) dx$',
            example: '$\\int x dx$',
        },

        {
            name: 'Definite Integral',
            latex: '$\\int_{a}^{b} f(x) dx$',
            example: '$\\int_{0}^{1} x dx$',
        },

        {
            name: 'Sum',
            latex: '$\\sum_{i=1}^{n}$',
            example: '$\\sum_{i=1}^{5}$',
        },

        {
            name: 'Product',
            latex: '$\\prod_{i=1}^{n}$',
            example: '$\\prod_{i=1}^{4}$',
        },

        {
            name: 'Limit',
            latex: '$\\lim_{x \\to a}$',
            example: '$\\lim_{x \\to 0}$',
        },

        {
            name: 'Infinity',
            latex: '$\\infty$',
            example: '$\\infty$',
        },

        {
            name: 'Plus Minus',
            latex: '$\\pm$',
            example: '$\\pm$',
        },

        {
            name: 'Degree',
            latex: '$^{\\circ}$',
            example: '$90^{\\circ}$',
        },

        {
            name: 'Vector',
            latex: '$\\vec{v}$',
            example: '$\\vec{AB}$',
        },

        {
            name: 'Hat',
            latex: '$\\hat{x}$',
            example: '$\\hat{y}$',
        },

        {
            name: 'Bar',
            latex: '$\\bar{x}$',
            example: '$\\bar{a}$',
        },

        {
            name: 'Parentheses',
            latex: '$\\left( x \\right)$',
            example: '$\\left( \\frac{1}{2} \\right)$',
        },

        {
            name: 'Binomial',
            latex: '$\\binom{n}{k}$',
            example: '$\\binom{5}{2}$',
        },

        {
            name: 'Log',
            latex: '$\\log(x)$',
            example: '$\\log(10)$',
        },

        {
            name: 'Log base',
            latex: '$\\log_{a}(x)$',
            example: '$\\log_{2}(8)$',
        },

        {
            name: 'Arrow',
            latex: '$\\rightarrow$',
            example: '$A \\rightarrow B$',
        },

        {
            name: 'Greater Equal',
            latex: '$\\geq$',
            example: '$x \\geq 5$',
        },

        {
            name: 'Less Equal',
            latex: '$\\leq$',
            example: '$x \\leq 10$',
        },

        {
            name: 'Matrix 2x2',
            latex: '$\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$',
            example: '$\\begin{bmatrix}1 & 2 \\\\ 3 & 4\\end{bmatrix}$',
        },
    ];

    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = async (latex, index) => {
        await navigator.clipboard.writeText(latex);
        setCopiedIndex(index);

        setTimeout(() => {
            setCopiedIndex(null);
        }, 1500);
    };

    return (
        <Dialog className={cx('quizModal')} open={isOpen} fullWidth maxWidth="md">
            <Button className={cx('closeBtn')} onClick={closeModal}>
                <IoCloseCircleOutline size={28} />
            </Button>

            <h2 className={cx('title')}>
                <SiLibreofficemath /> <span className="mb-0">Math Symbols Latex</span>
            </h2>

            <div className={cx('grid')}>
                {mathArr.map((math, index) => (
                    <div key={index} className={cx('card')}>
                        <div className={cx('name')}>{math.name}</div>

                        <div className={cx('preview')}>
                            <MathText text={math.example} />
                        </div>

                        <div className={cx('latex')}>{math.latex}</div>

                        <div className={cx('actions')}>
                            <Tooltip title="Copy">
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<IoCopyOutline />}
                                    onClick={() => handleCopy(math.latex, index)}
                                >
                                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
        </Dialog>
    );
};

export default SymbolMath;
