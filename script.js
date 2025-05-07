document.addEventListener("DOMContentLoaded", function() {
  // ========== Main Initialization ==========
  initBasicCarousel();
  initHeroCarousel();
  initLazyLoading();
  initAccordion();
  initMobileMenu();
  initStickyHeader();
  
  // Only initialize if jQuery is loaded
  if (window.jQuery) {
    initOwlCarousels();
  }
});

// ========== Carousel Component ==========
function initBasicCarousel() {
  const carousel = document.querySelector('.basic-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-image');
  const prevBtn = carousel.querySelector('.carousel-button.prev');
  const nextBtn = carousel.querySelector('.carousel-button.next');
  
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let isDragging = false;
  let startPosX = 0;
  let currentTranslate = 0;

  // Set up carousel
  function setupCarousel() {
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease-in-out';
    updateCarousel();
    addEventListeners();
    startAutoPlay();
  }

  // Update carousel position
  function updateCarousel() {
    track.style.transform = `translateX(${-currentIndex * 100}%)`;
  }

  // Navigation functions
  function goToPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  // Autoplay control
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(goToNext, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Touch/swipe handling
  function handleTouchStart(e) {
    isDragging = true;
    startPosX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    currentTranslate = -currentIndex * 100;
    track.style.transition = 'none';
    stopAutoPlay();
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    const currentPosX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diffX = currentPosX - startPosX;
    track.style.transform = `translateX(calc(${currentTranslate}% + ${diffX}px))`;
  }

  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s ease-in-out';
    
    const endPosX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
    const diffX = endPosX - startPosX;
    
    if (diffX > 50) {
      goToPrev();
    } else if (diffX < -50) {
      goToNext();
    } else {
      updateCarousel();
    }
    
    startAutoPlay();
  }

  // Event listeners
  function addEventListeners() {
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    });
    
    // Touch events
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events
    track.addEventListener('mousedown', handleTouchStart);
    track.addEventListener('mousemove', handleTouchMove);
    track.addEventListener('mouseup', handleTouchEnd);
    track.addEventListener('mouseleave', handleTouchEnd);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  // Initialize
  setupCarousel();
}

// ========== Hero Carousel ==========
function initHeroCarousel() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const slides = hero.querySelectorAll('.slide');
  const dots = hero.querySelectorAll('.dot');
  
  if (slides.length === 0 || dots.length !== slides.length) return;

  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function goToNext() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(goToNext, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Add event listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Pause on hover
  hero.addEventListener('mouseenter', stopAutoPlay);
  hero.addEventListener('mouseleave', startAutoPlay);

  // Initialize
  showSlide(0);
  startAutoPlay();
}

// ========== Lazy Loading ==========
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  if (lazyImages.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px'
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// ========== Accordion ==========
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion-item');
  if (accordions.length === 0) return;

  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');
    
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = header.classList.toggle('active');
      
      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });
}

// ========== Sticky Header ==========
function initStickyHeader() {
  const header = document.querySelector('.sticky-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ========== Owl Carousels (jQuery) ==========
function initOwlCarousels() {
  // Brand carousel
  $('.owl-carousel.brands').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 2 },
      600: { items: 3 },
      1000: { items: 5 }
    }
  });

  // Single item carousel
  $('.owl-carousel.single-item').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
  });
}

 // Mobile menu toggle
 document.getElementById('mobile-menu-button').addEventListener('click', function() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
      backToTopButton.classList.remove('opacity-0', 'invisible');
      backToTopButton.classList.add('opacity-100', 'visible');
  } else {
      backToTopButton.classList.remove('opacity-100', 'visible');
      backToTopButton.classList.add('opacity-0', 'invisible');
  }
});

backToTopButton.addEventListener('click', function() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (!mobileMenu.classList.contains('hidden')) {
              mobileMenu.classList.add('hidden');
          }
      }
  });
});

// Animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in');
  
  elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
      }
  });
}

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
// Check if carousel exists on page
const carousel = document.querySelector('.carousel-container');
if (!carousel) return; // Exit if no carousel found

const slides = carousel.querySelector('.carousel-slides');
const slideItems = carousel.querySelectorAll('.carousel-slide');
const prevBtn = carousel.querySelector('.carousel-prev');
const nextBtn = carousel.querySelector('.carousel-next');
const indicators = carousel.querySelectorAll('.carousel-indicator');

// Verify all required elements exist
if (!slides || slideItems.length === 0 || !prevBtn || !nextBtn || indicators.length === 0) {
console.error('Carousel elements missing');
return;
}

let currentIndex = 0;
const slideCount = slideItems.length;
let autoSlideInterval;

// Set initial positions
function updateCarousel() {
slides.style.transform = `translateX(-${currentIndex * 100}%)`;

// Update indicators
indicators.forEach((indicator, index) => {
  indicator.classList.toggle('bg-opacity-100', index === currentIndex);
  indicator.classList.toggle('bg-opacity-50', index !== currentIndex);
});
}

// Next slide
function nextSlide() {
currentIndex = (currentIndex + 1) % slideCount;
updateCarousel();
resetAutoSlide();
}

// Previous slide
function prevSlide() {
currentIndex = (currentIndex - 1 + slideCount) % slideCount;
updateCarousel();
resetAutoSlide();
}

// Go to specific slide
function goToSlide(index) {
if (index >= 0 && index < slideCount) {
  currentIndex = index;
  updateCarousel();
  resetAutoSlide();
}
}

// Reset autoslide timer
function resetAutoSlide() {
clearInterval(autoSlideInterval);
autoSlideInterval = setInterval(nextSlide, 5000);
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
indicator.addEventListener('click', () => goToSlide(index));
});

// Pause on hover
carousel.addEventListener('mouseenter', () => {
clearInterval(autoSlideInterval);
});

carousel.addEventListener('mouseleave', () => {
resetAutoSlide();
});

// Initialize
updateCarousel();
resetAutoSlide(); // Start auto-advance
});