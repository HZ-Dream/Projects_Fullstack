import { InlineMath, BlockMath } from 'react-katex';

function MathText({ text }) {
    if (!text) return null;

    const parts = text.split(/(\$[^$]+\$)/g);

    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

export default MathText;
