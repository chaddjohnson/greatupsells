import React, { useRef, useState, useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import Slider from 'react-slick';
import { StateContext } from '../../components';

const Slide = styled.div({
  position: 'relative',
  zIndex: 10
});

const Dots = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: ({ theme }) => (theme.enableBundling ? '2rem' : '2.25rem'),
  marginBottom: ({ theme }) => (theme.enableBundling ? '2rem' : '0.5rem')
});

const DotContainer = styled.div({
  width: '1.75rem',
  textAlign: 'center',
  position: 'relative'
});

const Dot = styled.div({
  borderRadius: '100%',
  margin: 0,
  padding: 0,
  appearance: 'none',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#000000',
  position: 'absolute',
  top: 0,
  transform: 'translateX(-50%) translateY(-50%)',
  cursor: 'pointer'
});

const OfferedProducts = styled(({ className, children }) => {
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { forceDisplayType } = useContext(StateContext);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: forceDisplayType === 'mobile' ? 1 : 3,
    slidesToScroll: 1,
    centerMode: forceDisplayType === 'mobile',
    centerPadding: '40px',
    arrows: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          centerMode: true
        }
      }
    ],
    beforeChange: (prev, next) => {
      setCurrentSlide(next);
    },
    appendDots: (dots) => (
      <Dots>
        {dots.map((item, index) => (
          <DotContainer key={index}>
            <Dot
              index={index}
              as="button"
              aria-label={`Slide ${index + 1}`}
              tabIndex={0}
              onClick={() => sliderRef.current.slickGoTo(index)}
              style={{
                width: index === currentSlide ? '0.75rem' : '0.5rem',
                height: index === currentSlide ? '0.75rem' : '0.5rem',
                backgroundColor: index === currentSlide ? '#000000' : 'transparent'
              }}
            />
          </DotContainer>
        ))}
      </Dots>
    )
  };

  return (
    <Slider ref={sliderRef} className={className} {...settings}>
      {React.Children.map(children, (child) => (
        <Slide>{child}</Slide>
      ))}
    </Slider>
  );
})({
  marginTop: ['1rem', '1.75rem', '1.75rem', '1.75rem'],

  '& .slick-track': {
    display: 'flex'
  },
  '& .slick-arrow': {
    border: 'none',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    display: 'block',
    width: '32px',
    height: '32px',
    padding: 0,
    transform: 'translateY(-50%)',
    fontSize: 0,
    lineHeight: 0,

    '&::before': {
      color: '#FFFFFF',
      backgroundColor: 'rgba(100, 100, 100, 0.9)',
      borderRadius: '50%',
      fontFamily: 'Material Icons',
      fontSize: '2rem',
      cursor: 'pointer'
    },
    '&:not(.slick-disabled):hover::before': {
      backgroundColor: 'rgba(100, 100, 100, 1)'
    },
    '&:not(.slick-disabled):active::before': {
      backgroundColor: 'rgba(100, 100, 100, 1)'
    }
  },
  '& .slick-prev': {
    left: '16px',
    right: 'auto',

    '&::before': {
      content: '"chevron_left"'
    }
  },
  '& .slick-next': {
    left: 'auto',
    right: '17px',

    '&::before': {
      content: '"chevron_right"'
    }
  },
  '& .slick-disabled:before': {
    opacity: 0.4,
    display: ['inline', 'none', 'none', 'none']
  }
});

export default OfferedProducts;
