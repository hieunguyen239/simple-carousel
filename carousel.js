const init = () => {

  let index = 0;
  let direction = '';
  let canClick = true;
  const $container = document.querySelector('.container');
  const $slideContainer = document.querySelector('.slides-container');
  const $next = document.getElementById('next');
  const $prev = document.getElementById('prev');
  let numSlides = 0;
  let slideWidth = 0;
  let slideViewport = 0;

  const $children = $slideContainer.children;
  const len = $children.length;
  const arrChildren = [...$children, ...$children, ...$children];
  let n = 0;

  $slideContainer.innerHTML = '';

  arrChildren.forEach(($ele, index) => {
    $ele = $ele.cloneNode(true);
    $ele.classList.add('slide');
    if (index < len || index >= len * 2 ) {
      $ele.classList.add('slide-clone');
    }

    if (index % len === 0) {
      $ele.classList.add('active');
      n = 0;
    }
    $ele.setAttribute('data-index', n);
    $slideContainer.appendChild($ele);
    n += 1;
  });

  const $slide = $slideContainer.querySelector('.slide');

  const margin = parseInt(window.getComputedStyle($slide).getPropertyValue('margin'), 10);
  numSlides = len;
  slideWidth = $slideContainer.querySelector('.slide').offsetWidth;
  $slideContainer.style.width = `${arrChildren.length * slideWidth}px`;
  // slideViewport = slideWidth * ( numSlides - 1);
  // slideViewport = slideWidth * (numSlides - 1) + slideWidth / 2 + margin * 2;
  slideViewport = ((slideWidth + 2 * margin) * numSlides + margin) - $container.offsetWidth / 2 + slideWidth / 2;
  $slideContainer.style.transform = `translateX(-${slideViewport}px)`;

  const handleIndexChange = () => {
    $slideContainer.style.transition = 'all linear 0.4s';

    if (direction === 'next') {
      index = (index > numSlides - 2) ? 0 : index += 1;
    } else {
      index = (index <= 0) ? numSlides - 1 : index -= 1;
    }

    const operator = (direction === 'next') ? 1 : -1;
    $slideContainer.style.transform = `translateX(-${slideViewport + (slideWidth * operator)}px)`;
  }

  $next.addEventListener('click', () => {
    if (!canClick) return;
    direction = 'next';
    handleIndexChange();
  });

  $prev.addEventListener('click', () => {
    if (!canClick) return;
    direction = 'prev';
    handleIndexChange();
  });

  $slideContainer.addEventListener("transitionend", () => {
    $slideContainer.style.transition = null;
    if (direction === 'next') {
      $slideContainer.appendChild($slideContainer.children[0]);
    } else {
      $slideContainer.insertBefore($slideContainer.lastElementChild, $slideContainer.children[0]);
    }

    $slideContainer.style.transform = `translateX(-${slideViewport}px)`;

    $slideContainer.querySelectorAll('.slide').forEach(ele => {
      ele.classList.remove('active');
    });

    $slideContainer.querySelectorAll(`[data-index="${index}"]`).forEach(ele => {
      ele.classList.add('active');
    });

    canClick = true;
  });

  $slideContainer.addEventListener("transitionstart", () => {
    canClick = false;
  });
};

init();

