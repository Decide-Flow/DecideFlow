document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(3, 11, 26, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(3, 11, 26, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 2. Premium 3D Tilt Effect (for elements with 'tilt-element' class)
    const tiltElements = document.querySelectorAll('.tilt-element, .glass-card');
    
    // Only apply on non-touch devices for performance and UX
    if(window.matchMedia("(pointer: fine)").matches) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
                const rotateY = ((x - centerX) / centerX) * 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                el.style.transition = 'none';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                el.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });
        });
    }

    // 3. Simple Search Simulation (Placeholder for future backend/JSON integration)
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.smart-search');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if(query) {
            // In a real implementation, this redirects to a search results page
            console.log(`Searching for: ${query}`);
            searchInput.value = '';
            searchInput.placeholder = 'Fetching data...';
            setTimeout(() => {
                searchInput.placeholder = 'e.g., Best CRM for startups...';
            }, 1500);
        }
    });
});

