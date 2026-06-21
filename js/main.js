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

  // ==========================================
  // TAB VISIBILITY TITLE CHANGER (NEUROMARKETING)
  // ==========================================
  const originalTitle = document.title;
  let titleAlertInterval;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Alternate tab title when the user switches tabs
      let toggle = false;
      titleAlertInterval = setInterval(() => {
        document.title = toggle ? "💬 Mensaje sin leer" : "⚠️ Tu consulta está pendiente";
        toggle = !toggle;
      }, 2000);
    } else {
      // Restore original title immediately when they come back
      clearInterval(titleAlertInterval);
      document.title = originalTitle;
    }
  });

  // ==========================================
  // DYNAMIC WHATSAPP FLOATING BUTTON (NEUROMARKETING)
  // ==========================================
  const createWhatsAppFloatBtn = () => {
    const container = document.createElement('div');
    container.className = 'whatsapp-flow-container';
    
    const bubble = document.createElement('div');
    bubble.className = 'whatsapp-bubble-tip';
    bubble.innerHTML = '<span class="dot">●</span> Jessica Lorena te atenderá';
    
    const link = document.createElement('a');
    link.className = 'whatsapp-float-btn';
    link.target = '_blank';
    link.href = 'https://wa.me/573144414870?text=' + encodeURIComponent('Hola Jessica Lorena. Estoy interesado en una Asesoría y Representación Jurídica. Por favor dame más información. Vengo de tujusticia.org');
    link.setAttribute('aria-label', 'Asesoría gratis por WhatsApp');
    
    link.innerHTML = `<span class="whatsapp-btn-text">Asesoría Gratis por WhatsApp</span>
    <svg class="whatsapp-icon-svg" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.883-6.963C16.588 1.928 14.12 1.9 11.517 1.9c-5.44 0-9.866 4.418-9.87 9.85-.001 1.77.464 3.5 1.346 5.048L1.93 21.848l5.228-1.37a9.832 9.832 0 0 0 4.877 1.282c-.004-.002-.004-.002 0 0zm11.286-6.4c-.3-.149-1.772-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.777.975-.951 1.174-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.792-1.492-1.77-1.667-2.07-.175-.3-.018-.463.13-.612.134-.133.3-.349.45-.523.15-.174.2-.3.3-.5.1-.2.05-.375-.025-.524-.075-.15-.676-1.63-.926-2.233-.244-.588-.493-.508-.676-.517-.175-.008-.375-.01-.575-.01-.2 0-.526.075-.801.374-.275.3-1.05 1.024-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.224 5.116 4.525.715.31 1.273.496 1.71.635.717.227 1.37.195 1.885.118.574-.085 1.772-.724 2.022-1.424.25-.7.25-1.3 1.175-1.425c.075.05.075.05 0 0z"/>
    </svg>`;
    
    container.appendChild(bubble);
    container.appendChild(link);
    document.body.appendChild(container);
  };
  
  createWhatsAppFloatBtn();
});


