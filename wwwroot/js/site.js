const toggleBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

// Close FAB menu when clicking on top nav links
const topNavLinks = document.querySelectorAll('.nav-links a');
topNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        const fabMenu = document.getElementById('fabMenu');
        if (fabMenu) {
            fabMenu.classList.remove('active');
        }
    });
});

// FAB Menu Logic
const fabBtn = document.getElementById('fabBtn');
const fabMenu = document.getElementById('fabMenu');
const header = document.querySelector('.header');
const topBar = document.querySelector('.top-bar');
let lastScrollTop = 0;
let isHeaderVisible = true;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (fabBtn && fabMenu) {
    // Toggle FAB menu
    fabBtn.addEventListener('click', function(e) {
        if (!isDragging) {
            e.stopPropagation();
            fabMenu.classList.toggle('active');
        }
    });

    // Close FAB menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!fabBtn.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.classList.remove('active');
        }
    });

    // Close FAB menu and navigate when clicking on an item
    const fabItems = document.querySelectorAll('.fab-item');
    fabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            fabMenu.classList.remove('active');
            // Link navigation will work automatically
        });
    });

    // FAB Drag functionality
    fabBtn.addEventListener('mousedown', startDrag);
    fabBtn.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        isDragging = true;
        fabBtn.style.transition = 'none';
        
        const rect = fabBtn.getBoundingClientRect();
        if (e.touches) {
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
        } else {
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }

        document.addEventListener('mousemove', moveFab);
        document.addEventListener('touchmove', moveFab);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function moveFab(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        let x, y;
        
        if (e.touches) {
            x = e.touches[0].clientX - offsetX;
            y = e.touches[0].clientY - offsetY;
        } else {
            x = e.clientX - offsetX;
            y = e.clientY - offsetY;
        }

        // Keep FAB within viewport
        x = Math.max(0, Math.min(x, window.innerWidth - 60));
        y = Math.max(0, Math.min(y, window.innerHeight - 60));

        fabBtn.style.position = 'fixed';
        fabBtn.style.right = 'auto';
        fabBtn.style.bottom = 'auto';
        fabBtn.style.left = x + 'px';
        fabBtn.style.top = y + 'px';

        // Update FAB menu position
        fabMenu.style.bottom = 'auto';
        fabMenu.style.right = 'auto';
        fabMenu.style.left = (x - 130) + 'px';
        fabMenu.style.top = (y - 130) + 'px';
    }

    function stopDrag() {
        isDragging = false;
        fabBtn.style.transition = 'all 0.3s ease';
        document.removeEventListener('mousemove', moveFab);
        document.removeEventListener('touchmove', moveFab);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

// Scroll hide/show header
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        if (isHeaderVisible) {
            header.style.transform = 'translateY(-100%)';
            if (topBar) topBar.style.transform = 'translateY(-100%)';
            fabBtn.classList.add('show');
            isHeaderVisible = false;
        }
    } else {
        // Scrolling up
        if (!isHeaderVisible) {
            header.style.transform = 'translateY(0)';
            if (topBar) topBar.style.transform = 'translateY(0)';
            fabBtn.classList.remove('show');
            isHeaderVisible = true;
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// Show FAB on page load if scrolled
if (window.pageYOffset > 50) {
    fabBtn.classList.add('show');
}
