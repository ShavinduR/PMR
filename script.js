// script.js - Updated to match new HTML structure and premium features

// Modal Open/Close Logic
const modal = document.getElementById('inquiryModal');
const closeBtn = document.querySelector('.close-modal');

window.openInquiryModal = function() {
    if(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

if(closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Button Link Logic
const inquiryButtons = document.querySelectorAll('.header-btn, .btn-primary, .cta-section .btn');
inquiryButtons.forEach(btn => {
    const href = btn.getAttribute('href');
    if(href && (href.includes('#footer') || href === '#')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openInquiryModal();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // === Mobile Menu Toggle ===
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');

    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenuFunc() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFunc);
    if (overlay) overlay.addEventListener('click', closeMenuFunc);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMenuFunc();
        }
    });

    // === Smooth Scroll & Close Mobile Menu ===
    const navLinks = document.querySelectorAll('nav a, .mobile-menu a, .header-btn, .btn[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Check if it's an anchor link to an ID
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    closeMenuFunc();
                }
            }
        });
    });

    // === Scroll Animations (Intersection Observer) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .service-card, .gallery-item, .wedding-card');
    animatedElements.forEach(el => {
        // Add base styles if not present in CSS
        el.style.opacity = '0';
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // Add class to trigger animation in CSS by checking scroll position manually as fallback
    document.addEventListener('scroll', () => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.animationPlayState = 'running';
            }
        });
    });


    // === Smart Navbar (Hide/Show on Scroll) ===
    let lastScrollTop = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll Down - Hide Navbar
            header.classList.add('nav-hidden');
        } else {
            // Scroll Up - Show Navbar
            header.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop;
    });

    // === Active Nav Highlight ===
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            // 1. Check for exact page match (e.g., 'cultural.html')
            if (href === pageName || (href === 'index.html' && pageName === '')) {
                link.classList.add('active');
            }
        });

        // 2. If on Home Page, use Scroll Spy
        if (pageName === 'index.html' || pageName === '') {
            const sections = document.querySelectorAll('section');

            // Initial check on load
            updateActiveSection();

            window.addEventListener('scroll', updateActiveSection);

            function updateActiveSection() {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href.includes('#')) {
                        // Only remove active from hash links to avoid flickering page links
                        if (link.getAttribute('href').startsWith('#')) {
                            link.classList.remove('active');
                        }

                        if (href === `#${current}`) {
                            link.classList.add('active');
                        }
                        // Default to Home/Hero if at top
                        if (window.scrollY < 100 && href === '#hero') {
                            link.classList.add('active');
                        }
                    }
                });
            }
        }
    }

    // Run once on load
    setActiveNavLink();

    // === Gallery Filter Functionality ===
    function initializeGalleryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    // === Wedding Albums Configuration ===
    const weddingAlbums = {
        "christian": { folder: "images/weddings/christian weddings/", count: 5 },
        "hindu": { folder: "images/weddings/hindu weddings/", count: 8 },
        "muslim": { folder: "images/weddings/muslim weddings (nikah)/", count: 8 },
        "tamil": { folder: "images/weddings/tamil weddings/", count: 8 },
        "sinhala": { folder: "images/weddings/sinhala weddings/", count: 8 },
        "civil": { folder: "images/weddings/civil or registry weddings/", count: 8 }
    };

    // === Initialize Wedding Cards (Populate hidden galleries) ===
    function initializeWeddingCards() {
        const weddingCards = document.querySelectorAll('.wedding-card');

        weddingCards.forEach(card => {
            const albumType = card.getAttribute('data-album-type');
            const galleryGrid = card.querySelector('.gallery-grid');

            if (!albumType || !weddingAlbums[albumType] || !galleryGrid) return;

            const album = weddingAlbums[albumType];
            galleryGrid.innerHTML = ''; // Clear loading text

            // Populate with images (or placeholders if they don't exist)
            for (let i = 1; i <= album.count; i++) {
                const link = document.createElement('a');
                link.href = `${album.folder}${i}.jpg`;
                link.setAttribute('data-caption', `${albumType.charAt(0).toUpperCase() + albumType.slice(1)} Wedding - Photo ${i}`);
                link.setAttribute('data-album', albumType);

                // We only need the links for the lightbox, they are hidden in the card
                link.style.display = 'none';

                card.appendChild(link); // Append to card
            }

            // Click on card opens lightbox -> handled by click event on card
            card.addEventListener('click', (e) => {
                // Determine if we should open lightbox
                // If the user clicked the "View Gallery" overlay or the card itself
                const links = card.querySelectorAll('a[data-album="' + albumType + '"]');
                if (links.length > 0) {
                    openWeddingAlbumLightbox(links, 0);
                } else {
                    alert('Gallery images coming soon!');
                }
            });
        });
    }

    function openWeddingAlbumLightbox(linksNodeList, startIndex) {
        currentImages = Array.from(linksNodeList).map(link => ({
            src: link.getAttribute('href'),
            caption: link.getAttribute('data-caption')
        }));

        currentIndex = startIndex;
        openLightbox();
    }

    // === Lightbox ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightboxBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Lightbox for Reference Gallery (Masonry)
    function initializeReferenceGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;

        // We need to attach click events to 'view-btn' or the whole card
        // Find buttons inside gallery cards
        const viewButtons = document.querySelectorAll('.gallery-card .view-btn');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                const card = btn.closest('.gallery-item');
                const category = card.getAttribute('data-category');

                // Collect all images in this category (or all if filter is 'all')
                // For simplicity, let's just collect all visible images in masonry
                const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
                const itemsArray = Array.from(visibleItems);
                const index = itemsArray.indexOf(card);

                currentImages = itemsArray.map(item => {
                    const img = item.querySelector('img');
                    return {
                        src: img.src,
                        caption: item.querySelector('h4')?.textContent || ''
                    };
                });

                currentIndex = index !== -1 ? index : 0;
                openLightbox();
            });
        });
    }

    function openLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('active');
        updateLightbox();
    }

    function closeLightboxFunc() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        currentImages = [];
    }

    function updateLightbox() {
        if (currentImages.length === 0 || !lightboxImg) return;

        lightboxImg.style.opacity = '0.5';

        const img = new Image();
        img.src = currentImages[currentIndex].src;

        img.onload = function () {
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxImg.alt = currentImages[currentIndex].caption;
            if (lightboxCaption) lightboxCaption.textContent = currentImages[currentIndex].caption;
            lightboxImg.style.opacity = '1';
        };

        // Fallback for missing images
        img.onerror = function () {
            lightboxImg.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            if (lightboxCaption) lightboxCaption.textContent = 'Image not available - Placeholder';
            lightboxImg.style.opacity = '1';
        };
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightboxFunc);
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightboxFunc();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightbox();
        }
    });

    // === Testimonials Carousel ===
    const testimonialsCarousel = () => {
        const slider = document.getElementById('testimonials-slider');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!slider || !prevBtn || !nextBtn) return;

        // Simple scroll logic
        // We'll scroll by the width of one card + gap
        // Assuming cards are equal width

        nextBtn.addEventListener('click', () => {
            const firstCard = slider.firstElementChild;
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 20; // 20px gap approx
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });

        prevBtn.addEventListener('click', () => {
            const firstCard = slider.firstElementChild;
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 20;
                slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });
    };

    // === Initialize everything ===
    initializeGalleryFilter();
    initializeWeddingCards();
    initializeReferenceGallery();
    testimonialsCarousel();
});

