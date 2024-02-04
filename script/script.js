'use strict';

const animate = ({timing, draw, duration}) => {
   const start = performance.now();

   requestAnimationFrame(function animate(time) {
      let steps = (time - start) / duration;

      if (steps > 1) steps = 1;

      let progress = timing(steps);

      draw(progress);

      if (progress < 1) requestAnimationFrame(animate);
   })
}

const scrollDown = () => {
   const headDown = document.querySelector('.head__down');
   const about = document.getElementById('about');

   headDown.addEventListener('click', () => {
      about.scrollIntoView({behavior: "smooth", block: "start"})
   })
};

const slider = (slider) => {
   const sliderBody = document.getElementById(slider);
   const slides = sliderBody.querySelectorAll('.slider__slide');
   const arrowPrev = sliderBody.querySelector('.slider__arrow_prev');
   const arrowNext = sliderBody.querySelector('.slider__arrow_next');
   const rowButtons = sliderBody.querySelector('.slider__buttons');

   let buttons = null;

   let index = 0;
   let interval = null;

   const addButtons = () => {
      for (let i = 0; i < slides.length; i++) {
         const button = document.createElement('li');
         button.classList.add('slider__button');
         button.setAttribute('data-index', i);

         if (i === 0) button.classList.add('active');

         rowButtons.append(button);
      }

      buttons = rowButtons.querySelectorAll('.slider__button');
   }

   const start = () => {
      slides[index].classList.remove('active');
      buttons[index].classList.remove('active');

      index === slides.length - 1 ? index = 0 : index++;

      slides[index].classList.add('active');
      buttons[index].classList.add('active');
   }

   const changeSlide = (currentSlide) => {
      slides[index].classList.remove('active');
      buttons[index].classList.remove('active');

      index = currentSlide;

      slides[index].classList.add('active');
      buttons[index].classList.add('active');
   }

   const prevSlider = () => {
      slides[index].classList.remove('active');
      buttons[index].classList.remove('active');

      index === 0 ? index = slides.length - 1 : index--;

      slides[index].classList.add('active');
      buttons[index].classList.add('active');

   }

   const nextSlider = () => {
      slides[index].classList.remove('active');
      buttons[index].classList.remove('active');

      index === slides.length - 1 ? index = 0 : index++;

      slides[index].classList.add('active');
      buttons[index].classList.add('active');
   }

   arrowPrev.addEventListener('click', prevSlider);
   arrowNext.addEventListener('click', nextSlider);

   rowButtons.addEventListener('click', (e) => {
      if (e.target.classList.contains('slider__button')) {
         changeSlide(+e.target.getAttribute('data-index'));
      }
   });

   sliderBody.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('slider__arrow') || e.target.classList.contains('slider__button')) {
         clearInterval(interval)
         interval = null;
      } else {
         if(!interval) interval = setInterval(start, 3000)
      }
   })

   addButtons();
   if (buttons) interval = setInterval(start, 3000)
};

document.getElementById('up').addEventListener('click', () => {
   window.scrollTo({
      top: 0,
      behavior: "smooth",
   })
});

scrollDown();
slider('adler');
slider('bar');

const scrollAnimate = (progress, action, elem) => {

   if (action === 'top-to-bottom') {
      elem.style.top = -(1-progress) * 100 + 'px';
   }

   elem.style.opacity = progress;
}

const options = {
   root: null,
   rootMargin: '0px',
   threshold: 0
}

const observer = new IntersectionObserver((entries, observer) => {
   entries.forEach(entry => {
       if (entry.isIntersecting) {
           const hidedElem = entry.target;
           const params = hidedElem.getAttribute('data-animate').split(',');
           const duration = +params[0];
           const action = params[1];
           const delay = params[2];
           console.log(delay)
           setTimeout(() => {
            animate({
               duration: duration,
               timing(timeFraction) {
                 return timeFraction;
               },
               draw(progress) {
                  scrollAnimate(progress, action, hidedElem);
               }
             });
           }, delay)
           
           observer.unobserve(hidedElem);
       }
   })
}, options)

const elems = document.querySelectorAll('.scroll-animate');
elems.forEach(elem => {
   const params = elem.getAttribute('data-animate').split(',');
   const action = params[1];

   scrollAnimate(0, action, elem)
   observer.observe(elem)
})