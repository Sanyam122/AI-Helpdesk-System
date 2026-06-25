const notification = ({ title, message, type = 'info', duration = 1500 }) => {
    let container = document.getElementById('toaster');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toaster';
      container.className = 'toastContainer';
      document.body.appendChild(container);
    }
  
    const iconMap = {
      success: '✓', error: '✕', warning: '⚠', info: 'i'
    };
  
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type]}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <div class="toast-progress" style="width:100%;transition-duration:${duration}ms"></div>
    `;
  
    container.appendChild(toast);
  
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = toast.querySelector('.toast-progress');
      if (bar) bar.style.width = '0';
    }));
  
    setTimeout(() => dismissToast(toast), duration);
  };

module.exports= notification;