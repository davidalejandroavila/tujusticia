document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (hamburgerBtn && sidebar && overlay) {
    // Toggle Sidebar and Hamburger animation
    const toggleSidebar = () => {
      hamburgerBtn.classList.toggle('active');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      
      // Prevent body scrolling when menu is open
      if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    // Event Listeners
    hamburgerBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Close sidebar on pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        toggleSidebar();
      }
    });
  }

  // Smooth scroll animations or dynamic additions can be added here
});
