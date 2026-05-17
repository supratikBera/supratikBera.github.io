// ==========================================
// 1. Mobile Menu Toggle
// ==========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// ==========================================
// 2. Navbar Scroll Effect & Active Links
// ==========================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Navbar background effect
    if (navbar) {
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Active Nav Link effect
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (currentScroll > sectionTop && currentScroll <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });

    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll);

// ==========================================
// 3. Typing Animation
// ==========================================
const typingText = document.getElementById('typingText');
const texts = ["I dont know", "after 3 years", "what i will be", "I will update later"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    if (!typingText) return; // Safety check

    const currentText = texts[textIndex];
    if(isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++; 
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(typeText, typeSpeed);
}

// FIX: Actually start the typing animation
typeText(); 

// ==========================================
// 4. Recommendation Carousel
// ==========================================
const track = document.getElementById('all_recommendations');
// FIX: Changed from const to let so we can update it when adding a new card
let cards = document.querySelectorAll('.recommendation'); 

let currentIndex = 0;
let autoSlideInterval;

function updateSlide() {
    if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
}

function slideNext() {
    if (cards.length === 0) return;
    currentIndex++;
    if (currentIndex >= cards.length) {
        currentIndex = 0; // Loop back to start
    }
    updateSlide();
    resetTimer();
}

function slidePrev() {
    if (cards.length === 0) return;
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = cards.length - 1; // Loop to the end
    }
    updateSlide();
    resetTimer();
}

function startTimer() {
    autoSlideInterval = setInterval(slideNext, 10000);
}

function resetTimer() {
    clearInterval(autoSlideInterval);
    startTimer();
}

// Start auto-sliding
startTimer();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') {
        slidePrev();
    } else if (e.key === 'ArrowRight') {
        slideNext();
    }
});

// Touch screen navigation
let startX = 0;
let endX = 0;
const container = document.querySelector('.carousel-container');

if (container) {
    // FIX: Changed 'touchStart' to 'touchstart'
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    container.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', () => {
        const swipeThreshold = 50;
        const swipeDistance = startX - endX;
        
        if(swipeDistance > swipeThreshold) {
            slideNext(); // swiped left
        } else if (swipeDistance < -swipeThreshold) {
            slidePrev(); // swiped right
        }
    });
}

// ==========================================
// 5. Add Recommendation & Popup
// ==========================================
function addRecommendation() {
    let recommendation = document.getElementById("new_recommendation");
    
    if (recommendation.value != null && recommendation.value.trim() != "") {
        showPopup(true);
        
        var element = document.createElement("div");
        element.setAttribute("class", "recommendation");
        element.innerHTML = "<span>&#8220;</span>" + recommendation.value + "<span>&#8221;</span>";
        
        document.getElementById("all_recommendations").appendChild(element); 
        
        // FIX: Update the cards array so the carousel knows the new item exists
        cards = document.querySelectorAll('.recommendation');
        
        recommendation.value = "";
    }
}

function showPopup(bool) {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.visibility = bool ? 'visible' : 'hidden';
    }
}

// ==========================================
// 6. Contact Form Handling
// ==========================================
const contactForm = document.getElementById('contactForm');
const popup = document.getElementById('popup');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Get the string values directly
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // 2. Check if the strings are not empty (using .trim() with parentheses)
        if (name.trim() !== "" && email.trim() !== "") {
            
            // 3. Safely target the <h3> tag inside the popup to change the text
            const popupMessage = popup.querySelector('h3');
            
            if (popupMessage) {
                popupMessage.innerHTML = `Thank you for your message, ${name}! I'll get back to you soon at ${email}.`;
            }
            
            // 4. Show the popup and reset the form
            showPopup(true);
            contactForm.reset(); 
        }
    });
}

// ==========================================
// 7. Fade in Animation on Scroll
// ==========================================
const fadeElements = document.querySelectorAll('.project-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});  

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// ==========================================
// 8. Prevent Form Resubmission
// ==========================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}