// ===== TSPARTICLES INITIALIZATION =====
async function initParticles() {
    await tsParticles.load({
        id: "tsparticles",
        options: {
            background: {
                color: "transparent"
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push"
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    resize: true
                },
                modes: {
                    push: {
                        quantity: 4
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    }
                }
            },
            particles: {
                color: {
                    value: "#6C5CE7"
                },
                links: {
                    color: "#A29BFE",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: "out",
                    random: false,
                    speed: 1,
                    straight: false
                },
                number: {
                    density: {
                        enable: true,
                        value_area: 800
                    },
                    value: 60
                },
                opacity: {
                    value: 0.5
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: {min: 1, max: 3}
                }
            },
            detectRetina: true
        }
    });
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles().catch(err => console.log('Particles initialization:', err));
});

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    const pageLoader = document.getElementById('pageLoader');
    setTimeout(() => {
        pageLoader.style.display = 'none';
    }, 2500);
    
    // Trigger animations for elements already in view AFTER page loader finishes
    setTimeout(() => {
        triggerVisibleAnimations();
    }, 2600);
});

// Function to trigger animations for elements already in view
function triggerVisibleAnimations() {
    const allElements = document.querySelectorAll('.fade-in, .fade-in-up, .service-card, .project-card, .gallery-item, .about-image, .about-text, .section-title, .section-subtitle');
    
    console.log('Checking visible elements on load. Found:', allElements.length);
    
    allElements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const isInView = (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
        
        console.log(`Element ${i}: ${el.className} - In view: ${isInView}`);
        
        if (isInView && !el.hasAttribute('data-animated')) {
            // For fade-in and fade-in-up classes, make them appear immediately
            if (el.classList.contains('fade-in') || el.classList.contains('fade-in-up')) {
                el.style.animation = 'none';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                console.log(`Animating fade element: ${el.className}`);
            } else {
                // For scroll-based elements, show them immediately
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                console.log(`Showing scroll element: ${el.className}`);
            }
            el.setAttribute('data-animated', 'true');
        }
    });
}

// ===== SMOOTH SCROLLING & ACTIVE NAV LINKS =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Update active nav link on page load
function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        const section = document.getElementById(targetSection);
        
        if (section) {
            const offsetTop = section.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close hamburger menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe fade-in-up elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ===== CONTACT FORM SUBMISSION =====
var contactForm = document.getElementById("contactForm");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thanks for your submission!";
            showNotification('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
            status.innerHTML = "";
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form";
    });
}
contactForm.addEventListener("submit", handleSubmit);
    }, 1500);
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        ${type === 'success' 
            ? 'background: linear-gradient(135deg, #6C5CE7, #A29BFE);' 
            : 'background: linear-gradient(135deg, #FF6B6B, #FF8E8E);'
        }
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    notification.setAttribute('style', style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ===== SKILL BARS ANIMATION WITH COUNTER =====
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillPercentages = document.querySelectorAll('.skill-percentage');
    
    console.log('Starting skill animation with', skillBars.length, 'bars');
    
    // First pass: ensure all bars are at 0 and force reflow
    skillBars.forEach(bar => {
        bar.style.width = '0';
        void bar.offsetWidth; // Force reflow
    });
    
    // Wait a frame then animate
    requestAnimationFrame(() => {
        setTimeout(() => {
            skillBars.forEach((bar, index) => {
                const percentage = parseFloat(bar.getAttribute('data-percentage'));
                const percentageElement = skillPercentages[index];
                
                // Stagger each bar animation
                setTimeout(() => {
                    console.log(`Animating bar ${index} to ${percentage}%`);
                    
                    // Trigger animation with width change
                    bar.style.transition = 'width 3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    bar.style.width = percentage + '%';
                    
                    // Counter animation
                    if (percentageElement) {
                        let currentValue = 0;
                        const increment = percentage / 60;
                        const counter = setInterval(() => {
                            currentValue += increment;
                            if (currentValue >= percentage) {
                                currentValue = percentage;
                                clearInterval(counter);
                            }
                            percentageElement.textContent = Math.round(currentValue) + '%';
                        }, 50);
                    }
                }, index * 150);
            });
        }, 50);
    });
}

// Initialize skill bars with width 0
window.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0';
    });
    
    // Check if skills section is already visible on page load
    const skillSection = document.querySelector('.skills-content');
    if (skillSection) {
        const rect = skillSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateSkills();
        }
    }
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            console.log('Skills section in view - triggering animation');
            animateSkills();
        }
    });
}, { threshold: 0.1 }); // Lowered threshold to 0.1 for earlier trigger

window.addEventListener('load', () => {
    const skillSection = document.querySelector('.skills-content');
    if (skillSection) {
        skillObserver.observe(skillSection);
    }
});

// ===== STATS COUNTER ANIMATION =====
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    const statCounters = document.querySelectorAll('.stat-counter');
    
    statCounters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 40; // 40 steps for 2 seconds (50ms each)
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                // Add suffix based on which stat
                if (index === 2) {
                    counter.textContent = current + '%';
                } else {
                    counter.textContent = current + '+';
                }
            } else {
                counter.textContent = Math.floor(current) + (index === 2 ? '%' : '+');
            }
        }, 50);
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            console.log('About section in view - triggering stats animation');
            animateStats();
        }
    });
}, { threshold: 0.3 });

window.addEventListener('load', () => {
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        statsObserver.observe(aboutStats);
    }
});

// ===== PARALLAX EFFECT ON SCROLL =====
const heroSection = document.querySelector('.hero');
const aboutImage = document.querySelector('.about-image');

window.addEventListener('scroll', () => {
    // Hero parallax
    if (window.pageYOffset < window.innerHeight) {
        heroSection.style.backgroundPosition = `center ${window.pageYOffset * 0.5}px`;
    }
    
    // About image Z line scroll animation
    if (aboutImage) {
        const aboutSection = document.querySelector('.about');
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.clientHeight;
        const scrollPos = window.pageYOffset;
        
        if (scrollPos > sectionTop - window.innerHeight && scrollPos < sectionTop + sectionHeight) {
            // Calculate line position (0 to 100)
            const scrollRange = sectionTop + sectionHeight - (sectionTop - window.innerHeight);
            const scrollInRange = scrollPos - (sectionTop - window.innerHeight);
            const linePosition = (scrollInRange / scrollRange) * 100;
            
            // Move the Z line
            aboutImage.style.setProperty('--z-line-pos', `${linePosition}%`);
        }
    }
});

// ===== BUTTON RIPPLE EFFECT =====
const buttons = document.querySelectorAll('.btn, .project-btn, .social-icon');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== ADD RIPPLE ANIMATION TO CSS DYNAMICALLY =====
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(300px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(300px);
        }
    }
    
    .btn, .project-btn, .social-icon {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// ===== TEXT ANIMATION ON SCROLL =====
// Only add scroll animations to elements that should trigger on scroll, not page load
const scrollAnimElements = document.querySelectorAll('.service-card, .project-card, .gallery-item, .about-image, .about-text, .section-title, .section-subtitle');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Only apply if not already animated
            if (!entry.target.hasAttribute('data-animated')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.setAttribute('data-animated', 'true');
            }
        }
    });
}, { threshold: 0.1 });

scrollAnimElements.forEach((el, index) => {
    // Only apply initial styles if it doesn't have fade-in or fade-in-up class
    if (!el.classList.contains('fade-in') && !el.classList.contains('fade-in-up')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.4s ease-out ${index * 0.02}s, transform 0.4s ease-out ${index * 0.02}s`;
    }
    scrollObserver.observe(el);
});

// Testimonials section uses simple scroll behavior
// No JavaScript manipulation needed

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.setAttribute('style', `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6C5CE7, #A29BFE);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    z-index: 900;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(108, 92, 231, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
`);

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 15px 40px rgba(108, 92, 231, 0.5)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 10px 30px rgba(108, 92, 231, 0.3)';
});

// ===== WHATSAPP CHAT BUTTON =====
const whatsappBtn = document.createElement('a');
whatsappBtn.href = 'https://wa.me/237653868268';
whatsappBtn.target = '_blank';
whatsappBtn.title = 'Chat with us on WhatsApp';
whatsappBtn.className = 'whatsapp-chat-btn';
whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
whatsappBtn.setAttribute('style', `
    position: fixed;
    bottom: 90px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #25D366, #20BA5A);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    z-index: 900;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
`);

document.body.appendChild(whatsappBtn);

// Show/hide WhatsApp button with scroll-top button (with delay)
let whatsappTimeout;
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        whatsappTimeout = setTimeout(() => {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.visibility = 'visible';
        }, 300);
    } else {
        clearTimeout(whatsappTimeout);
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.visibility = 'hidden';
    }
});

// Hover effects for WhatsApp button
whatsappBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 15px 40px rgba(37, 211, 102, 0.5)';
});

whatsappBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 10px 30px rgba(37, 211, 102, 0.3)';
});

// ===== PUBLIC ADS BANNER - Optional banner that can be toggled =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any additional features here
    console.log('Portfolio loaded successfully!');
});

// ===== ADD ANIMATION TO STAT BOXES ON SCROLL =====
const statBoxes = document.querySelectorAll('.stat');

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }, index * 100);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statBoxes.forEach(box => {
    statObserver.observe(box);
});

// ===== CURSOR EFFECT (Optional) =====
const cursorDot = document.createElement('div');
cursorDot.setAttribute('style', `
    position: fixed;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #6C5CE7, #A29BFE);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.7;
    transform: translate(-50%, -50%);
    display: none;
`);;
document.body.appendChild(cursorDot);

// Mouse move effect for cursor
document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorDot.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursorDot.style.display = 'none';
});

// ===== SECTION BACKGROUND ANIMATION =====
window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition >= sectionTop - window.innerHeight / 2 && 
            scrollPosition <= sectionTop + sectionHeight) {
            section.style.opacity = '1';
        }
    });
});

// ===== INITIAL PAGE SETUP =====
window.addEventListener('load', () => {
    updateActiveNav();
    // Trigger animations for elements in view
    document.querySelectorAll('.fade-in-up').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
});
