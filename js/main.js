document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // SIDEBAR DRAWER INTERACTiVITY
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (hamburgerBtn && sidebar && overlay) {
    const toggleSidebar = () => {
      hamburgerBtn.classList.toggle('active');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      
      if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    hamburgerBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        toggleSidebar();
      }
    });
  }

  // ==========================================
  // DYNAMIC BLOG RENDERING SYSTEM
  // ==========================================
  // Render function for blog cards
  const createBlogCard = (post) => {
    return `
      <article class="article-card">
        <div class="article-meta">${post.date} | ${post.category}</div>
        <div style="width:100%; border-radius:8px; overflow:hidden; border:1px solid var(--border-color); margin-bottom:15px;">
          <img src="${post.image}" alt="${post.title}" style="width:100%; height:180px; object-fit:cover; display:block;">
        </div>
        <h2 class="article-title" style="font-size:1.3rem; margin-bottom:10px;">${post.title}</h2>
        <p class="article-text" style="font-size:0.9rem; margin-bottom:15px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
          ${post.snippet}
        </p>
        <a href="${post.url}" class="btn-gold" style="padding: 8px 20px; font-size: 0.75rem;">Leer Artículo</a>
      </article>
    `;
  };

  // Render on Homepage Blog Grid
  const homeBlogContainer = document.getElementById('blog-posts-container-home');
  const homeBlogSection = document.getElementById('home-blog-section');
  if (homeBlogContainer) {
    // If we have blog data, render it. Otherwise, hide the section
    if (typeof BLOG_POSTS !== 'undefined' && BLOG_POSTS.length > 0) {
      if (homeBlogSection) homeBlogSection.style.display = 'block';
      homeBlogContainer.innerHTML = BLOG_POSTS.map(createBlogCard).join('');
    } else {
      if (homeBlogSection) homeBlogSection.style.display = 'none'; // Keep it blank/hidden
    }
  }

  // Render on Main Blog Pages
  const mainBlogContainer = document.getElementById('blog-posts-container');
  if (mainBlogContainer) {
    if (typeof BLOG_POSTS !== 'undefined' && BLOG_POSTS.length > 0) {
      mainBlogContainer.innerHTML = `
        <div class="blog-grid-home">
          ${BLOG_POSTS.map(createBlogCard).join('')}
        </div>
      `;
    } else {
      mainBlogContainer.innerHTML = `
        <div style="text-align:center; padding:50px; color:var(--text-gray);">
          <p>Próximamente publicaremos artículos de interés legal.</p>
        </div>
      `;
    }
  }

  // ==========================================
  // WAITING LIST POPUP & COUNTDOWN TIMER
  // ==========================================
  const waitlistModal = document.getElementById('waitlist-modal');
  const waitlistClose = document.getElementById('waitlist-close');
  const waitlistForm = document.getElementById('waitlist-form');
  const timerClock = document.getElementById('timer-clock');
  const timerLabel = document.getElementById('timer-label');
  const formSubmitBtn = document.getElementById('waitlist-submit-btn');

  if (waitlistModal && timerClock) {
    let countdownInterval;
    let secondsLeft = 180; // 3 minutes

    const startCountdown = () => {
      countdownInterval = setInterval(() => {
        secondsLeft--;
        
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        
        // Format time as MM:SS
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        timerClock.textContent = `${minutesStr}:${secondsStr}`;

        // When time expires
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          timerLabel.textContent = "¡BENEFICIO EXPIRADO!";
          timerClock.style.color = "#ff3333";
          
          // Disable form inputs
          const inputs = waitlistForm.querySelectorAll('input, textarea, button');
          inputs.forEach(input => input.disabled = true);
          if (formSubmitBtn) {
            formSubmitBtn.textContent = "Tiempo Expirado";
            formSubmitBtn.style.background = "#555";
            formSubmitBtn.style.cursor = "not-allowed";
          }
        }
      }, 1000);
    };

    const showModal = () => {
      // Check if user has already seen or closed it this session
      if (!sessionStorage.getItem('waitlist_seen')) {
        waitlistModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        startCountdown();
      }
    };

    const closeModal = () => {
      waitlistModal.classList.remove('active');
      document.body.style.overflow = '';
      clearInterval(countdownInterval);
      sessionStorage.setItem('waitlist_seen', 'true');
    };

    // Trigger popup after 30 seconds
    setTimeout(showModal, 30000);

    // Event listeners
    if (waitlistClose) {
      waitlistClose.addEventListener('click', closeModal);
    }

    // Backdrop click closes modal
    const backdrop = waitlistModal.querySelector('.waitlist-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // Submit handler
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Te has registrado con éxito! Un abogado experto se comunicará contigo a la brevedad.');
        closeModal();
      });
    }
  }
});
