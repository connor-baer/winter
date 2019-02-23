/* global SmoothScroll */

// eslint-disable-next-line no-unused-vars
const scroll = new SmoothScroll('a[href*="#"]', {
  // Easing pattern to use
  easing: 'easeInOutCubic',
  // How far to offset the scrolling anchor location in pixels
  offset: 80
});
