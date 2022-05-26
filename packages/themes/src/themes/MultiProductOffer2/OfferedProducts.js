import React, { useState, useRef } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import Slider from 'react-slick';

const Slide = styled.div({
  position: 'relative',
  zIndex: 10
});

const Dots = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2.25rem',
  marginBottom: '0.5rem'
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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px'
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
                backgroundColor:
                  index === currentSlide ? '#000000' : 'transparent'
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
  marginTop: ['1rem', '2rem', '2rem', '2rem'],

  '& .slick-track': {
    display: 'flex'
  }
});

export default OfferedProducts;
