import { useEffect, useState } from 'react';
import { FaRegCircleUp } from 'react-icons/fa6';

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const start = window.scrollY;
        const duration = 2000;
        let startTime = null;

        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = time - startTime;

            const ease = 1 - Math.pow(1 - progress / duration, 3);

            window.scrollTo(0, start * (1 - ease));

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <button onClick={scrollToTop} className={`scroll-top-btn ${visible ? 'show' : ''}`}>
            <FaRegCircleUp />
        </button>
    );
}
