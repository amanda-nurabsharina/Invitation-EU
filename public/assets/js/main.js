// Main JavaScript for Wedding Invitation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initMusic();
  initCountdown();
  initScrollReveal();
  initCopyToClipboard();
});

// ===== Music Control =====
function initMusic() {
  const musicControl = document.getElementById('music-control');
  const audioElement = document.getElementById('background-music');
  
  if (!musicControl || !audioElement) return;
  
  let isPlaying = false;
  
  // Start playing on first interaction
  document.addEventListener('click', function playOnce() {
    if (!isPlaying && audioElement.src) {
      audioElement.play().then(() => {
        isPlaying = true;
        musicControl.classList.add('playing');
      }).catch(console.log);
    }
    document.removeEventListener('click', playOnce);
  }, { once: true });
  
  musicControl.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      musicControl.classList.remove('playing');
    } else {
      audioElement.play();
      isPlaying = true;
      musicControl.classList.add('playing');
    }
  });
}

// ===== Countdown Timer =====
function initCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  const targetDate = new Date(countdownElement.dataset.date).getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      countdownElement.innerHTML = '<p>Acara telah berlangsung</p>';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-days').textContent = days;
    document.getElementById('countdown-hours').textContent = hours;
    document.getElementById('countdown-minutes').textContent = minutes;
    document.getElementById('countdown-seconds').textContent = seconds;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// ===== Copy to Clipboard (for bank accounts) =====
function initCopyToClipboard() {
  document.querySelectorAll('[data-copy]').forEach(element => {
    element.addEventListener('click', function() {
      const text = this.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor rekening disalin!', 'success');
      }).catch(() => {
        showToast('Gagal menyalin', 'error');
      });
    });
  });
}

// ===== Toast Notification =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ===== htmx Event Handlers =====

// After RSVP form submission
document.body.addEventListener('htmx:afterSwap', function(event) {
  if (event.detail.target.id === 'rsvp-result') {
    // Show success animation
    const result = event.detail.target;
    result.classList.add('fade-in');
  }
});

// Before sending request - show loading state
document.body.addEventListener('htmx:beforeRequest', function(event) {
  const form = event.detail.elt;
  if (form.tagName === 'FORM') {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span> Mengirim...';
    }
  }
});

// After request complete - restore button state
document.body.addEventListener('htmx:afterRequest', function(event) {
  const form = event.detail.elt;
  if (form.tagName === 'FORM') {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && submitBtn.dataset.originalText) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText;
    }
  }
});

// Handle request errors
document.body.addEventListener('htmx:responseError', function(event) {
  showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
});
