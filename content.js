let isTransitioning = false;

function showContent(section) {
    if (isTransitioning) return;
    isTransitioning = true;

    document.querySelectorAll('nav ul li a').forEach(function(link) {
        link.textContent = link.getAttribute('data-original-text');
        link.classList.remove('active');
    });

    const activeLink = document.getElementById(`${section}-link`);
    if (activeLink) {
        activeLink.textContent = '✢';
        activeLink.classList.add('active');
    }

    const allContent = document.querySelectorAll('.content');
    const targetContent = document.getElementById(section);

    allContent.forEach(content => {
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        content.classList.remove('active');
    });

    if (targetContent) {
        targetContent.style.visibility = 'visible';
        targetContent.style.opacity = '1';
        targetContent.classList.add('active');
    }

    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav ul li a').forEach(function(link) {
        link.setAttribute('data-original-text', link.textContent);
    });
    
    showContent('home');
});