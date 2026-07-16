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

    // --- Floating Music Notes Animation ---
    const meshBg = document.querySelector('.mesh-bg');
    if (meshBg) {
        const createNote = () => {
            const note = document.createElement('i');
            // Use organic, music-related icons
            const icons = ['fa-music', 'fa-compact-disc', 'fa-headphones', 'fa-record-vinyl'];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            note.classList.add('fas', randomIcon, 'floating-note');
            
            // Randomize size, position, and duration for an organic human-made feel
            const size = Math.random() * 15 + 12; // 12px to 27px
            const left = Math.random() * 100; // 0vw to 100vw
            const duration = Math.random() * 20 + 15; // 15s to 35s
            
            note.style.fontSize = `${size}px`;
            note.style.left = `${left}vw`;
            note.style.animationDuration = `${duration}s`;
            
            meshBg.appendChild(note);
            
            // Cleanup after animation completes
            setTimeout(() => {
                if (note.parentNode) {
                    note.remove();
                }
            }, duration * 1000);
        };

        // Create initial notes spread out over time
        for (let i = 0; i < 15; i++) {
            setTimeout(createNote, Math.random() * 10000);
        }

        // Continually spawn new ones
        setInterval(createNote, 3000);
    }

    // --- Direct Latest APK Download ---
    const directDownloadBtn = document.getElementById('direct-download-btn');
    if (directDownloadBtn) {
        directDownloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = directDownloadBtn.innerHTML;
            directDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
            
            try {
                const response = await fetch('https://api.github.com/repos/harikarthick12/luvora/releases/latest');
                const data = await response.json();
                
                // Find the APK asset
                const apkAsset = data.assets.find(asset => asset.name.endsWith('.apk'));
                
                if (apkAsset) {
                    // Trigger download
                    window.location.href = apkAsset.browser_download_url;
                } else {
                    alert('Could not find the APK in the latest release.');
                    window.location.href = 'https://github.com/harikarthick12/luvora/releases/latest';
                }
            } catch (error) {
                console.error('Error fetching latest release:', error);
                alert('Failed to fetch the latest download link. Please check the GitHub releases page.');
                window.open('https://github.com/harikarthick12/luvora/releases/latest', '_blank');
            } finally {
                directDownloadBtn.innerHTML = originalText;
            }
        });
    }
});
