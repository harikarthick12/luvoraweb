document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3D Carousel Logic ---
    const track = document.getElementById('carouselTrack');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Position items in 3D space
    function updateCarousel() {
        items.forEach((item, index) => {
            // Calculate relative index considering loop
            let diff = index - currentIndex;
            
            // Adjust for smooth infinite-like wrapping in visual layout
            if (diff < -Math.floor(totalItems/2)) diff += totalItems;
            if (diff > Math.floor(totalItems/2)) diff -= totalItems;
            
            let zIndex = totalItems - Math.abs(diff);
            let translateZ = -Math.abs(diff) * 150;
            let translateX = diff * 180; // Distance between cards
            let rotateY = diff * -15; // Rotate facing inward
            let opacity = Math.abs(diff) > 2 ? 0 : 1; // Hide cards far away
            
            if (diff === 0) {
                // Center active card
                item.style.transform = `translateX(0) translateZ(0) rotateY(0)`;
                item.style.zIndex = 100;
                item.style.opacity = 1;
                item.style.boxShadow = "0 30px 60px rgba(0,0,0,0.2)";
            } else {
                item.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
                item.style.zIndex = zIndex;
                item.style.opacity = opacity;
                item.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }
        });
    }

    // Initialize
    updateCarousel();

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    // Auto rotate optional
    // setInterval(() => { currentIndex = (currentIndex + 1) % totalItems; updateCarousel(); }, 4000);

    // --- Mouse Glow Effect on Feature Cards ---
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 3D Parallax on Hero Player ---
    const heroVisual = document.querySelector('.hero-visual');
    const glassCard = document.querySelector('.main-player-card');
    
    if (heroVisual && glassCard) {
        heroVisual.addEventListener('mousemove', (e) => {
            // Disable native CSS floating animation when hovering for interactive tilt
            glassCard.style.animation = 'none';
            
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            glassCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px)`;
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            // Restore animation
            glassCard.style.transform = `rotateX(10deg) rotateY(-5deg) translateY(0)`;
            glassCard.style.animation = 'float 6s ease-in-out infinite';
        });
    }
});
