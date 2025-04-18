import React, { useState, useEffect } from 'react';
import { IoIosArrowDropupCircle } from 'react-icons/io';
import { makeStyles } from '@mui/styles';
import './BackToTop.css';

const useStyles = makeStyles(() => ({
    icon: {
        fontSize: '3rem',
        color: 'red',
    },
}));

function BackToTop() {
    const [visible, setVisible] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;
            setVisible(scrolled > 300);
        };

        // Add scroll event listener
        window.addEventListener('scroll', toggleVisible);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div style={{ display: visible ? 'inline' : 'none' }} className='backToTop'>
            <button onClick={scrollToTop} aria-label='Back to top'>
                <IoIosArrowDropupCircle className={classes.icon} />
            </button>
        </div>
    );
}

export default BackToTop;
