import styled from 'styled-components';

const Content = styled.div`
  position: fixed;
  background: none;
  border: none;
  outline: none;
  z-index: 20;
  visibility: hidden;
  left: 0;
  right: 0;
  top: 50%;
  padding: 10px;
  margin-right: 0;
  transform: translateY(0%);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;

  @media screen and (min-width: 1024px) {
    left: 50%;
    right: auto;
    top: 30%;
    padding: 0;
    transform: translate(-50%, -30%);
  }

  &.design-mode {
    position: static;
    padding: 10px;
    margin-right: 0;
    transform: none;
  }

  /* Animations. Reference: https://github.com/codrops/ModalWindowEffects */

  &.open {
    visibility: visible;
  }

  &.open ~ .overlay {
    opacity: 1;
    visibility: visible;
  }

  /* Fade in and scale up */
  &.effect-slide-in-scale > .content-container {
    -webkit-transform: scale(0.7);
    -moz-transform: scale(0.7);
    -ms-transform: scale(0.7);
    transform: scale(0.7);
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  &.open.effect-slide-in-scale > .content-container {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  /* Slide from the right */
  &.effect-slide-in-right > .content-container {
    -webkit-transform: translateX(20%);
    -moz-transform: translateX(20%);
    -ms-transform: translateX(20%);
    transform: translateX(20%);
    opacity: 0;
    -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  }

  &.open.effect-slide-in-right > .content-container {
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }

  /* Slide from the bottom */
  &.effect-slide-in-bottom > .content-container {
    -webkit-transform: translateY(20%);
    -moz-transform: translateY(20%);
    -ms-transform: translateY(20%);
    transform: translateY(20%);
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  &.open.effect-slide-in-bottom > .content-container {
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }

  /* Fall */
  &.effect-fall {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-fall > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: translateZ(600px) rotateX(20deg);
    -moz-transform: translateZ(600px) rotateX(20deg);
    -ms-transform: translateZ(600px) rotateX(20deg);
    transform: translateZ(600px) rotateX(20deg);
    opacity: 0;
  }

  &.open.effect-fall > .content-container {
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
    -webkit-transform: translateZ(0px) rotateX(0deg);
    -moz-transform: translateZ(0px) rotateX(0deg);
    -ms-transform: translateZ(0px) rotateX(0deg);
    transform: translateZ(0px) rotateX(0deg);
    opacity: 1;
  }

  /* Slide and stick to top */
  &.effect-sticky-up {
    top: 0;

    @media screen and (min-width: 1024px) {
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
    }
  }

  &.effect-sticky-up > .content-container {
    -webkit-transform: translateY(-200%);
    -moz-transform: translateY(-200%);
    -ms-transform: translateY(-200%);
    transform: translateY(-200%);
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
    opacity: 0;
  }

  &.open.effect-sticky-up > .content-container {
    border-radius: 0 0 3px 3px;
    opacity: 1;

    -webkit-transform: translateY(0%);
    -moz-transform: translateY(0%);
    -ms-transform: translateY(0%);
    transform: translateY(0%);

    @media screen and (min-width: 1024px) {
      -webkit-transform: translateY(15%);
      -moz-transform: translateY(15%);
      -ms-transform: translateY(15%);
      transform: translateY(15%);
    }
  }

  /* 3D flip horizontal */
  &.effect-3d-flip-horizontal {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-flip-horizontal > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: rotateY(-70deg);
    -moz-transform: rotateY(-70deg);
    -ms-transform: rotateY(-70deg);
    transform: rotateY(-70deg);
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
    opacity: 0;
  }

  &.open.effect-3d-flip-horizontal > .content-container {
    -webkit-transform: rotateY(0deg);
    -moz-transform: rotateY(0deg);
    -ms-transform: rotateY(0deg);
    transform: rotateY(0deg);
    opacity: 1;
  }

  /* 3D flip vertical */
  &.effect-3d-flip-vertical {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-flip-vertical > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: rotateX(-70deg);
    -moz-transform: rotateX(-70deg);
    -ms-transform: rotateX(-70deg);
    transform: rotateX(-70deg);
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
    opacity: 0;
  }

  &.open.effect-3d-flip-vertical > .content-container {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    transform: rotateX(0deg);
    opacity: 1;
  }

  /* 3D sign */
  &.effect-3d-sign {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-sign > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: rotateX(-60deg);
    -moz-transform: rotateX(-60deg);
    -ms-transform: rotateX(-60deg);
    transform: rotateX(-60deg);
    -webkit-transform-origin: 50% 0;
    -moz-transform-origin: 50% 0;
    transform-origin: 50% 0;
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  &.open.effect-3d-sign > .content-container {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    transform: rotateX(0deg);
    opacity: 1;
  }

  /* Super scaled */
  &.effect-super-scaled > .content-container {
    -webkit-transform: scale(2);
    -moz-transform: scale(2);
    -ms-transform: scale(2);
    transform: scale(2);
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  &.open.effect-super-scaled > .content-container {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  /* 3D slit */
  &.effect-3d-slit {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-slit > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: translateZ(-3000px) rotateY(90deg);
    -moz-transform: translateZ(-3000px) rotateY(90deg);
    -ms-transform: translateZ(-3000px) rotateY(90deg);
    transform: translateZ(-3000px) rotateY(90deg);
    opacity: 0;
  }

  &.open.effect-3d-slit > .content-container {
    -webkit-animation: slit 0.7s forwards ease-out;
    -moz-animation: slit 0.7s forwards ease-out;
    animation: slit 0.7s forwards ease-out;
  }

  @-webkit-keyframes slit {
    50% {
      -webkit-transform: translateZ(-250px) rotateY(89deg);
      opacity: 0.5;
      -webkit-animation-timing-function: ease-out;
    }
    100% {
      -webkit-transform: translateZ(0) rotateY(0deg);
      opacity: 1;
    }
  }

  @-moz-keyframes slit {
    50% {
      -moz-transform: translateZ(-250px) rotateY(89deg);
      opacity: 0.5;
      -moz-animation-timing-function: ease-out;
    }
    100% {
      -moz-transform: translateZ(0) rotateY(0deg);
      opacity: 1;
    }
  }

  @keyframes slit {
    50% {
      transform: translateZ(-250px) rotateY(89deg);
      opacity: 1;
      animation-timing-function: ease-in;
    }
    100% {
      transform: translateZ(0) rotateY(0deg);
      opacity: 1;
    }
  }

  /* 3D Rotate from bottom */
  &.effect-3d-rotate-bottom {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-rotate-bottom > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: translateY(100%) rotateX(90deg);
    -moz-transform: translateY(100%) rotateX(90deg);
    -ms-transform: translateY(100%) rotateX(90deg);
    transform: translateY(100%) rotateX(90deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    transform-origin: 0 100%;
    opacity: 0;
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
  }

  &.open.effect-3d-rotate-bottom > .content-container {
    -webkit-transform: translateY(0%) rotateX(0deg);
    -moz-transform: translateY(0%) rotateX(0deg);
    -ms-transform: translateY(0%) rotateX(0deg);
    transform: translateY(0%) rotateX(0deg);
    opacity: 1;
  }

  /* 3D Rotate in from left */
  &.effect-3d-rotate-in-left {
    -webkit-perspective: 1300px;
    -moz-perspective: 1300px;
    perspective: 1300px;
  }

  &.effect-3d-rotate-in-left > .content-container {
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
    -moz-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
    -ms-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
    transform: translateZ(100px) translateX(-30%) rotateY(90deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    transform-origin: 0 100%;
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  &.open.effect-3d-rotate-in-left > .content-container {
    -webkit-transform: translateZ(0px) translateX(0%) rotateY(0deg);
    -moz-transform: translateZ(0px) translateX(0%) rotateY(0deg);
    -ms-transform: translateZ(0px) translateX(0%) rotateY(0deg);
    transform: translateZ(0px) translateX(0%) rotateY(0deg);
    opacity: 1;
  }
`;

export default Content;
