document.addEventListener('DOMContentLoaded', () => {
    // Page Title
    document.title = invitationData.pageTitle;

    // TV Frame Animation
    initTVAnimation();
});

function initTVAnimation() {
    const section = document.querySelector(".tv-scroll-section");
    const slides = document.querySelectorAll('.tv-slide');
    const menuBtns = document.querySelectorAll('.tv-menu-btn');
    const tvWrapper = document.querySelector('.tv');
    const tvMenu = document.querySelector('.tv-menu');
    const tvMaskedScreen = document.querySelector('.tv__masked-screen');
    const tvContentSafeArea = document.querySelector('.tv__content-safe-area');
    const pageDecors = document.querySelectorAll('.page-decor:not(.title-decor)');
    const titleDecors = document.querySelectorAll('.title-decor');
    const titleSection = document.querySelector('.title-section');

    if (!section || slides.length === 0) return;

    let currentActiveIndex = -1;

    // Observer for title decorations
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                titleDecors.forEach(decor => decor.classList.add('visible'));
            } else {
                titleDecors.forEach(decor => decor.classList.remove('visible'));
            }
        });
    }, {
        threshold: 0.1
    });
    if (titleSection) titleObserver.observe(titleSection);

    // Observer for appearance animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (tvWrapper) tvWrapper.classList.add('visible');
                if (tvMenu) tvMenu.classList.add('visible');
                if (tvMaskedScreen) tvMaskedScreen.classList.add('visible');
                if (tvContentSafeArea) tvContentSafeArea.classList.add('visible');
                pageDecors.forEach(decor => decor.classList.add('visible'));
            } else {
                const rect = entry.boundingClientRect;
                const isAbove = rect.top > 0;
                
                if (tvMenu) tvMenu.classList.remove('visible');
                
                if (isAbove) {
                    pageDecors.forEach(decor => decor.classList.remove('visible'));
                } else {
                    pageDecors.forEach(decor => decor.classList.remove('visible'));
                }
            }
        });
    }, {
        threshold: 0.1
    });
    observer.observe(section);

    function updateActiveSlide(index) {
        if (index === currentActiveIndex) return;
        currentActiveIndex = index;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update menu buttons
        menuBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    function updateTvScroll() {
        const rect = section.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const sectionHeight = section.offsetHeight;
        
        // Progress from 0 to 1
        // We start when the section's top hits 0 and end when the section's bottom hits viewHeight
        const scrollableDistance = sectionHeight - viewHeight;
        const passedDistance = -rect.top;
        const rawProgress = passedDistance / scrollableDistance;
        const progress = Math.min(1, Math.max(0, rawProgress));
        
        const slideCount = slides.length;
        // Divide progress into segments for each slide
        const segment = 1 / slideCount;
        let activeIndex = Math.floor(progress / segment);
        if (activeIndex >= slideCount) activeIndex = slideCount - 1;
        
        // Ensure slides update correctly even at boundaries
        updateActiveSlide(activeIndex);
    }

    // Menu button click handling
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const slideIndex = parseInt(btn.getAttribute('data-slide'));
            scrollToSlide(slideIndex);
        });
    });

    function scrollToSlide(slideIndex) {
        // Calculate where to scroll the page to show this slide
        const sectionTop = section.offsetTop;
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        const slideProgress = (slideIndex + 0.5) / slides.length; // aim for middle of slide's scroll segment
        const targetScroll = sectionTop + (slideProgress * scrollableDistance);
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }

    window.addEventListener("scroll", updateTvScroll, { passive: true });
    window.addEventListener("resize", updateTvScroll);
    updateTvScroll();
}

