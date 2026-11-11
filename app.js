/**
 * Glowérive Natural Skincare - Exact Replica Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Product Database with high-resolution direct image URLs
  const products = {
    'hydra-glow': {
      id: 'hydra-glow',
      name: 'Hydra Glow Gel Cream',
      price: 34.00,
      image: 'https://images.unsplash.com/photo-1608248597359-5b7782b3a985?auto=format&fit=crop&w=500&q=80'
    },
    'radiance-serum': {
      id: 'radiance-serum',
      name: 'Radiance Boost Serum',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80'
    },
    'night-cream': {
      id: 'night-cream',
      name: 'Nourishing Night Restorative Cream',
      price: 38.00,
      image: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=500&q=80'
    },
    'uv-sunscreen': {
      id: 'uv-sunscreen',
      name: 'Daily UV Defense Sunscreen SPF 50',
      price: 24.00,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=500&q=80'
    }
  };

  // Initial cart matching screenshot badge (2 items: Hydra Glow & Radiance Serum)
  let cart = [
    { id: 'hydra-glow', qty: 1 },
    { id: 'radiance-serum', qty: 1 }
  ];

  let wishlist = new Set();

  // DOM Elements
  const cartTrigger = document.getElementById('cart-trigger');
  const cartCounter = document.getElementById('cart-counter');
  const cartDrawer = document.getElementById('flyout-cart');
  const cartShade = document.getElementById('cart-shade');
  const cartClose = document.getElementById('cart-close');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalVal = document.getElementById('cart-total-val');
  const cartQtyNum = document.getElementById('cart-qty-num');
  const cartCheckoutBtn = document.getElementById('cart-checkout');

  // Video popup
  const videoBtn = document.getElementById('hero-video-btn');
  const videoPopup = document.getElementById('video-popup');
  const closeVideoPopup = document.getElementById('close-video-popup');

  // Offer Form
  const offerForm = document.getElementById('offer-signup-form');
  const offerEmail = document.getElementById('offer-email-input');

  // Toast Container
  const toastWrapper = document.getElementById('toast-wrapper');

  // Cart Functions
  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartShade) cartShade.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartShade) cartShade.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartTrigger) cartTrigger.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartShade) cartShade.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let totalQty = 0;
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 10px; color: #5e7e74;">
          <p style="font-weight: 700; color: #0d473d; font-size: 1rem; margin-bottom: 6px;">Your bag is empty</p>
          <p style="font-size: 0.82rem;">Add items from Featured Products.</p>
        </div>
      `;
    } else {
      cart.forEach((item) => {
        const prod = products[item.id];
        if (!prod) return;
        totalQty += item.qty;
        subtotal += prod.price * item.qty;

        const row = document.createElement('div');
        row.className = 'flyout-cart-item';
        row.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}" class="flyout-cart-img" />
          <div class="flyout-cart-info">
            <h4 class="flyout-item-name">${prod.name}</h4>
            <div class="flyout-item-price">$${prod.price.toFixed(2)} &times; ${item.qty}</div>
          </div>
          <button class="remove-cart-btn" data-id="${item.id}" style="color:#94a3b8; font-size:1.1rem; padding:4px;" title="Remove">&times;</button>
        `;
        cartItemsContainer.appendChild(row);
      });
    }

    if (cartCounter) cartCounter.innerText = totalQty;
    if (cartQtyNum) cartQtyNum.innerText = totalQty;
    if (cartTotalVal) cartTotalVal.innerText = `$${subtotal.toFixed(2)}`;

    document.querySelectorAll('.remove-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  function addToCart(productId) {
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    renderCart();
    const prod = products[productId];
    showToast(`Added "${prod ? prod.name : 'Product'}" to your bag!`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    renderCart();
    showToast('Item removed from bag.');
  }

  // Add to cart buttons
  document.querySelectorAll('.btn-card-add').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      addToCart(id);
      openCart();
    });
  });

  // Wishlist buttons
  document.querySelectorAll('.btn-card-wishlist').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const prod = products[id];
      if (wishlist.has(id)) {
        wishlist.delete(id);
        btn.classList.remove('active');
        showToast('Removed from wishlist.');
      } else {
        wishlist.add(id);
        btn.classList.add('active');
        showToast(`Saved "${prod ? prod.name : 'Product'}" to wishlist!`);
      }
    });
  });

  // Checkout
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is empty.');
        return;
      }
      showToast('Proceeding to checkout...');
    });
  }

  // ==========================================
  // Interactive Ritual Video Suite System (Website Articles)
  // ==========================================

  const ritualStepsData = [
    {
      stepTag: 'STEP 1 OF 4: RADIANCE PREPARATION',
      title: 'Botanical Radiance Serum ($46)',
      desc: 'Infused with cold-pressed Kakadu Vitamin C and botanical hyaluronic acid for an instant radiant dewy glow.',
      img: 'images/prod_radiance_serum_clean.jpg'
    },
    {
      stepTag: 'STEP 2 OF 4: LUMINOUS HYDRATION',
      title: 'Luminous Hydration Teal Cream ($58)',
      desc: 'Powered by botanical eucalyptus infusion and ocean bio-actives to lock in 72 hours of moisture bounce.',
      img: 'images/hero-luminous-clean.jpg'
    },
    {
      stepTag: 'STEP 3 OF 4: DEEP NOURISHMENT',
      title: 'Hydra-Glow Daily Moisturizer ($38)',
      desc: 'Bio-fermented sea kelp and glacier hydration fortify the natural lipid barrier against dry environmental fatigue.',
      img: 'images/prod_hydra_glow_clean.jpg'
    },
    {
      stepTag: 'STEP 4 OF 4: MINERAL DEFENSE',
      title: 'Daily UV Defense SPF 50 ($34)',
      desc: 'Ultra-weightless invisible micronized zinc shields skin from UVA/UVB rays with zero white cast or stickiness.',
      img: 'images/prod_daily_sunscreen_clean.jpg'
    }
  ];

  let currentRitualStep = 1; // start on Luminous Hydration Cream
  let ritualTimer = null;
  let isRitualPlaying = true;

  const activeImgEl = document.getElementById('ritual-active-image');
  const stepIndicatorEl = document.getElementById('ritual-step-indicator');
  const stepTitleEl = document.getElementById('ritual-step-title');
  const stepDescEl = document.getElementById('ritual-step-desc');
  const playBtnEl = document.getElementById('ritual-play-btn');
  const playIconEl = document.getElementById('ritual-play-icon');
  const timelineBtns = document.querySelectorAll('.ritual-timeline-btn');
  const trayCards = document.querySelectorAll('.ritual-prod-item');

  function setRitualStep(index) {
    if (index < 0) index = ritualStepsData.length - 1;
    if (index >= ritualStepsData.length) index = 0;
    currentRitualStep = index;
    const data = ritualStepsData[currentRitualStep];

    if (activeImgEl) {
      activeImgEl.style.opacity = '0.3';
      setTimeout(() => {
        activeImgEl.src = data.img;
        activeImgEl.style.opacity = '1';
      }, 150);
    }
    if (stepIndicatorEl) stepIndicatorEl.textContent = data.stepTag;
    if (stepTitleEl) stepTitleEl.textContent = data.title;
    if (stepDescEl) stepDescEl.textContent = data.desc;

    timelineBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentRitualStep);
    });

    trayCards.forEach((card, i) => {
      card.classList.toggle('active', i === currentRitualStep);
    });
  }

  function startRitualTour() {
    stopRitualTour();
    isRitualPlaying = true;
    if (playIconEl) playIconEl.textContent = '⏸';
    ritualTimer = setInterval(() => {
      setRitualStep(currentRitualStep + 1);
    }, 4200);
  }

  function stopRitualTour() {
    isRitualPlaying = false;
    if (playIconEl) playIconEl.textContent = '▶';
    if (ritualTimer) {
      clearInterval(ritualTimer);
      ritualTimer = null;
    }
  }

  if (playBtnEl) {
    playBtnEl.addEventListener('click', () => {
      if (isRitualPlaying) {
        stopRitualTour();
      } else {
        startRitualTour();
      }
    });
  }

  timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIdx = parseInt(btn.getAttribute('data-step'), 10);
      setRitualStep(stepIdx);
      startRitualTour();
    });
  });

  trayCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-ritual-add-bag')) return; // handled by add button
      const stepIdx = parseInt(card.getAttribute('data-step'), 10);
      setRitualStep(stepIdx);
      startRitualTour();
    });
  });

  // Ritual direct Add to Bag buttons
  document.querySelectorAll('.btn-ritual-add-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');

      // Add to cart
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name: title, price, qty: 1, image: img });
      }

      renderCart();
      showToast('Added ' + title + ' to your bag!');
      btn.textContent = 'ADDED ✓';
      setTimeout(() => btn.textContent = '+ ADD', 1400);
    });
  });

  function openVideoModal() {
    if (!videoPopup) return;
    videoPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    setRitualStep(1); // focus on Luminous Hydration
    startRitualTour();
  }

  function closeVideoModal() {
    if (!videoPopup) return;
    videoPopup.classList.remove('active');
    document.body.style.overflow = '';
    stopRitualTour();
  }

  if (videoBtn) {
    videoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal();
    });
  }

  if (closeVideoPopup) {
    closeVideoPopup.addEventListener('click', closeVideoModal);
  }

  if (videoPopup) {
    videoPopup.addEventListener('click', (e) => {
      if (e.target === videoPopup) closeVideoModal();
    });
  }

  // Footer Newsletter form
  const footerNewsletterForm = document.getElementById('footer-newsletter-form');
  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footer-newsletter-email').value;
      showToast('Welcome to Glow Club! 15% discount code INNER15 sent to ' + email);
      footerNewsletterForm.reset();
    });
  }

  // ==========================================
  // Interactive Search Modal System
  // ==========================================
  const searchBtn = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const closeSearchBtn = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results-list');
  const quickTagPills = document.querySelectorAll('.quick-tag-pill');

  const catalogItems = [
    { name: 'Hydra-Glow Moisturizer', cat: 'Moisturizers', price: '$38.00', img: 'images/prod_hydra_glow_clean.jpg', id: 'hydra-glow' },
    { name: 'Botanical Radiance Serum', cat: 'Serums', price: '$46.00', img: 'images/prod_radiance_serum_clean.jpg', id: 'radiance-serum' },
    { name: 'Overnight Recovery Cream', cat: 'Moisturizers', price: '$52.00', img: 'images/prod_nourishing_cream_clean.jpg', id: 'night-cream' },
    { name: 'Daily UV Defense SPF 50', cat: 'Sun Care', price: '$34.00', img: 'images/prod_daily_sunscreen_clean.jpg', id: 'uv-sunscreen' },
    { name: 'Gentle Purifying Cleanser', cat: 'Cleansers', price: '$28.00', img: 'images/cat_cleansers.jpg', id: 'collections' },
    { name: 'Hydrating Botanical Toner', cat: 'Toners', price: '$32.00', img: 'images/cat_toners.jpg', id: 'collections' },
    { name: 'Awakening Eye Contour Cream', cat: 'Eye Care', price: '$42.00', img: 'images/cat_eyecare.jpg', id: 'collections' },
    { name: 'Luminous Hydration Teal Cream', cat: 'Moisturizers', price: '$58.00', img: 'images/hero-luminous-clean.jpg', id: 'hero-banner' }
  ];

  let currentSearchFilter = 'all';

  function renderSearchResults(query = '') {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    
    let filtered = catalogItems.filter(item => {
      const matchesFilter = currentSearchFilter === 'all' || item.cat.toLowerCase() === currentSearchFilter.toLowerCase();
      const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div style="text-align:center; padding:30px 10px; color:#64748b; font-size:0.92rem;">No products found matching "' + query + '". Try another keyword or filter.</div>';
      return;
    }

    searchResults.innerHTML = filtered.map(item => `
      <div class="search-item-row" data-target="${item.id}">
        <img src="${item.img}" alt="${item.name}" class="search-item-thumb" onerror="this.src='images/hero-clean-bg.png'">
        <div class="search-item-details">
          <div class="search-item-name">${item.name}</div>
          <div class="search-item-cat">${item.cat} • Clean Botanical</div>
        </div>
        <div class="search-item-price">${item.price}</div>
      </div>
    `).join('');

    searchResults.querySelectorAll('.search-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const targetId = row.getAttribute('data-target');
        closeSearchModal();
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderSearchResults('');
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearchModal();
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearchModal);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  quickTagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      quickTagPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSearchFilter = pill.getAttribute('data-filter');
      renderSearchResults(searchInput ? searchInput.value : '');
    });
  });

  // ==========================================
  // Interactive Account Modal System
  // ==========================================
  const accountBtn = document.getElementById('account-trigger');
  const accountModal = document.getElementById('account-modal');
  const closeAccountBtn = document.getElementById('close-account-modal');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginPanel = document.getElementById('login-form-panel');
  const registerPanel = document.getElementById('register-form-panel');
  const loginForm = document.getElementById('account-login-form');
  const registerForm = document.getElementById('account-register-form');

  function openAccountModal() {
    if (!accountModal) return;
    accountModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAccountModal() {
    if (!accountModal) return;
    accountModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccountModal();
    });
  }

  if (closeAccountBtn) {
    closeAccountBtn.addEventListener('click', closeAccountModal);
  }

  if (accountModal) {
    accountModal.addEventListener('click', (e) => {
      if (e.target === accountModal) closeAccountModal();
    });
  }

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      if (loginPanel) loginPanel.style.display = 'block';
      if (registerPanel) registerPanel.style.display = 'none';
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      if (loginPanel) loginPanel.style.display = 'none';
      if (registerPanel) registerPanel.style.display = 'block';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      closeAccountModal();
      showToast('Welcome back! Signed in as ' + (email || 'Member') + '.');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      closeAccountModal();
      showToast('Welcome to Glow Club, ' + (name || 'Friend') + '! 20% discount code GLOW20 activated.');
    });
  }

  // ==========================================
  // Global Navigation Smooth Scrolling & Active State
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-menu a.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const targetEl = document.querySelector(href);
        if (targetEl) {
          const headerHeight = 70;
          const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Global ESC Key Handler for all open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeSearchModal();
      closeAccountModal();
      if (typeof closeFlyoutCart === 'function') closeFlyoutCart();
    }
  });

  // Toast Function
  function showToast(msg) {
    if (!toastWrapper) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      <span>${msg}</span>
    `;
    toastWrapper.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = '0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // Hero Multi-Slide Banner Logic
  // ==========================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.getElementById('hero-arrow-prev');
  const heroNext = document.getElementById('hero-arrow-next');

  if (heroSlides.length > 1) {
    let currentSlide = 1;
    heroSlides.forEach((slide, i) => {
      if (slide.classList.contains('active')) currentSlide = i;
    });
    let slideTimer = null;
    const slideIntervalMs = 6000;

    function goToSlide(index) {
      if (index < 0) {
        currentSlide = heroSlides.length - 1;
      } else if (index >= heroSlides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      heroSlides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add('active');
          if (typeof window.animateHeroSlide === 'function') {
            window.animateHeroSlide(slide);
          }
        } else {
          slide.classList.remove('active');
        }
      });

      heroDots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, slideIntervalMs);
    }

    function stopAutoSlide() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    if (heroPrev) {
      heroPrev.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide - 1);
        startAutoSlide();
      });
    }

    if (heroNext) {
      heroNext.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide + 1);
        startAutoSlide();
      });
    }

    heroDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
        if (!isNaN(target)) {
          goToSlide(target);
          startAutoSlide();
        }
      });
    });

    const heroWrapper = document.getElementById('hero-banner');
    if (heroWrapper) {
      heroWrapper.addEventListener('mouseenter', stopAutoSlide);
      heroWrapper.addEventListener('mouseleave', startAutoSlide);

      // Mobile Touch Swipe
      let touchStartX = 0;
      heroWrapper.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchStartX = e.changedTouches[0].screenX;
        }
      }, { passive: true });

      heroWrapper.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 40) {
            if (diff < 0) {
              goToSlide(currentSlide + 1);
            } else {
              goToSlide(currentSlide - 1);
            }
            startAutoSlide();
          }
        }
      }, { passive: true });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        startAutoSlide();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        startAutoSlide();
      }
    });

    startAutoSlide();
  }


  // ==========================================
  // Sticky Scroll-to-Top Circular Progress System
  // ==========================================
  const scrollProgressBtn = document.getElementById('scroll-progress-btn');
  const progressCircleBar = document.getElementById('progress-circle-bar');
  const circumference = 2 * Math.PI * 44; // ~276.46

  if (scrollProgressBtn && progressCircleBar) {
    progressCircleBar.style.strokeDasharray = circumference;
    progressCircleBar.style.strokeDashoffset = circumference;

    function updateScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollTop > 220) {
        scrollProgressBtn.classList.add('visible');
      } else {
        scrollProgressBtn.classList.remove('visible');
      }

      if (docHeight > 0) {
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        const offset = circumference - (progress * circumference);
        progressCircleBar.style.strokeDashoffset = offset;
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    scrollProgressBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================
  // Mobile Navigation Drawer
  // ==========================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function openMobileNav() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.add('open');
      mobileNavBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.remove('open');
      mobileNavBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileNav);
  }
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
  }
  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileNav);
  });

  // Initial render
  renderCart();
  initDermalSlider();
  initCustomCursor();
  initScrollAnimations();
});


/* ==========================================================================
   DERMAL SERVICES CAROUSEL CONTROLLER (Seamless Infinite Forward Loop + 7 Dots)
   ========================================================================== */
function initDermalSlider() {
  const track = document.getElementById('dermalSliderTrack');
  const wrap = document.querySelector('.dermal-slider-wrap');
  const dots = document.querySelectorAll('.dermal-dot');
  if (!track || !wrap) return;

  const originalCards = Array.from(track.querySelectorAll('.dermal-card:not(.dermal-clone)'));
  if (originalCards.length < 3) return;

  // Remove any previously appended clones
  track.querySelectorAll('.dermal-clone').forEach(el => el.remove());

  // Clone first 3 cards to allow seamless forward infinite loop
  originalCards.slice(0, 3).forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('dermal-clone');
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const totalPositions = originalCards.length; // 6 unique cards
  let currentIndex = 0;
  let autoSlideTimer = null;
  let isDown = false;
  let startX = 0;
  let isTransitioning = false;

  function getCardWidthAndGap() {
    const firstCard = track.querySelector('.dermal-card');
    const width = firstCard ? firstCard.getBoundingClientRect().width : 360;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 28;
    return { width, gap: computedGap };
  }

  function updateDots(activeIdx) {
    const normIdx = ((activeIdx % totalPositions) + totalPositions) % totalPositions;
    dots.forEach((dot, idx) => {
      // With 7 dots, dot 0-5 map to cards 0-5, and dot 6 corresponds to loop cycle
      if (idx === activeIdx || (activeIdx === totalPositions && idx === 6)) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index, animate = true) {
    const { width, gap } = getCardWidthAndGap();
    const moveAmount = index * (width + gap);

    if (animate) {
      isTransitioning = true;
      track.style.transition = 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${moveAmount}px)`;
    updateDots(index);
  }

  // Handle transition end for seamless loop
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    isTransitioning = false;

    // If reached the cloned section at the end (index >= 6), silently snap to 0!
    if (currentIndex >= totalPositions) {
      track.style.transition = 'none';
      currentIndex = 0;
      const { width, gap } = getCardWidthAndGap();
      track.style.transform = 'translateX(0px)';
      void track.offsetHeight; // Force reflow
      updateDots(0);
    }
  });

  function nextSlide() {
    if (isTransitioning) return;
    currentIndex++;
    goToSlide(currentIndex, true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    if (currentIndex === 0) {
      // Silently snap to cloned end, then slide backward
      track.style.transition = 'none';
      currentIndex = totalPositions;
      const { width, gap } = getCardWidthAndGap();
      track.style.transform = `translateX(-${currentIndex * (width + gap)}px)`;
      void track.offsetHeight;
      currentIndex--;
      goToSlide(currentIndex, true);
    } else {
      currentIndex--;
      goToSlide(currentIndex, true);
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      nextSlide();
    }, 4500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Dots navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx)) {
        currentIndex = targetIdx;
        goToSlide(currentIndex, true);
        startAutoSlide();
      }
    });
  });

  // Pause on hover
  wrap.addEventListener('mouseenter', stopAutoSlide);
  wrap.addEventListener('mouseleave', startAutoSlide);

  // Touch Swipe Support
  wrap.addEventListener('touchstart', (e) => {
    stopAutoSlide();
    isDown = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -40) {
      nextSlide();
    } else if (diff > 40) {
      prevSlide();
    }
    startAutoSlide();
  });

  // Mouse Drag Support
  wrap.addEventListener('mousedown', (e) => {
    stopAutoSlide();
    isDown = true;
    startX = e.clientX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = e.clientX - startX;
    if (diff < -50) {
      nextSlide();
    } else if (diff > 50) {
      prevSlide();
    }
    startAutoSlide();
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    goToSlide(currentIndex, false);
  });

  // Initial setup
  goToSlide(0, false);
  startAutoSlide();
}




/* ==========================================================================
   CUSTOM MAGIC CURSOR CONTROLLER (Follower dot + Outer trailing circle)
   ========================================================================== */
function initCustomCursor() {
  const outer = document.querySelector('.cursor-outer');
  const inner = document.querySelector('.cursor-inner');
  if (!outer || !inner) return;

  // Touch screen check
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    outer.style.display = 'none';
    inner.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let outerX = -100, outerY = -100;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    outerX += (mouseX - outerX) * 0.16;
    outerY += (mouseY - outerY) * 0.16;
    outer.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection on links, buttons, cards, etc.
  const hoverables = document.querySelectorAll('a, button, input, select, textarea, .dermal-card, .dermal-icon-box, .dermal-benefit-item, .single-product-card, .product-card, .category-round-frame, .special-offer-club-col, .dermal-dot, .btn-shop-now, .btn-watch-video, .btn-view-all-outline, .btn-card-add, .btn-card-wishlist, .compact-social-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Dark sections
  const darkSections = document.querySelectorAll('.dermal-benefits-card, .special-offer-section, .hero-wrapper, .site-footer');
  darkSections.forEach(sec => {
    sec.addEventListener('mouseenter', () => document.body.classList.add('cursor-dark-mode'));
    sec.addEventListener('mouseleave', () => document.body.classList.remove('cursor-dark-mode'));
  });
}

/* ==========================================================================
   TEXT SPLIT & SCROLL REVEAL ANIMATIONS (Matched to demo.awaikenthemes.com/dermal)
   ========================================================================== */
function splitHeadingChars(headingEl) {
  if (!headingEl || headingEl.dataset.splitDone === 'true') return;
  headingEl.dataset.splitDone = 'true';

  let charIndex = 0;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const normalized = node.nodeValue.replace(/\s+/g, ' ');
      if (!normalized.trim()) {
        // Keep single space only if there was whitespace between inline parts
        return normalized.length ? document.createTextNode(' ') : document.createDocumentFragment();
      }

      const frag = document.createDocumentFragment();
      const parts = normalized.split(' ');
      parts.forEach((word, idx) => {
        if (word.length > 0) {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'at-word';
          for (const ch of Array.from(word)) {
            const charSpan = document.createElement('span');
            charSpan.className = 'at-char';
            charSpan.textContent = ch;
            charSpan.style.transitionDelay = Math.min(charIndex * 18, 900) + 'ms';
            charIndex++;
            wordSpan.appendChild(charSpan);
          }
          frag.appendChild(wordSpan);
        }
        if (idx < parts.length - 1) {
          frag.appendChild(document.createTextNode(' '));
        }
      });
      return frag;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        return node.cloneNode(false);
      }
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach(child => {
        clone.appendChild(processNode(child));
      });
      return clone;
    }

    return document.createDocumentFragment();
  }

  const processedChildren = Array.from(headingEl.childNodes).map(child => processNode(child));
  headingEl.innerHTML = '';
  processedChildren.forEach(chunk => headingEl.appendChild(chunk));
  headingEl.classList.add('at-split-heading');
}

function initScrollAnimations() {
  // 1. Replace section-header-level fade-up with granular child animations
  document.querySelectorAll('.dermal-benefits-header.at-fade-up, .dermal-services-header.at-fade-up').forEach(hdr => {
    hdr.classList.remove('at-fade-up');
  });

  // 2. Split all major headings into animated words & characters
  const headingSelectors = [
    '.hero-title',
    '.category-headline',
    '.featured-title-text',
    '.dermal-benefits-title',
    '.dermal-services-title',
    '.offer-big-title'
  ];
  document.querySelectorAll(headingSelectors.join(', ')).forEach(h => splitHeadingChars(h));

  // 3. Configure hero slide entrance triggers
  document.querySelectorAll('.hero-slide').forEach(slide => {
    const els = [
      { sel: '.hero-kicker', delay: 0 },
      { sel: '.hero-leaf-divider', delay: 110 },
      { sel: '.hero-subtext', delay: 170 },
      { sel: '.hero-btn-row', delay: 250 }
    ];
    els.forEach(({ sel, delay }) => {
      const target = slide.querySelector(sel);
      if (target) {
        target.classList.add('at-fade-up');
        target.style.transitionDelay = delay + 'ms';
      }
    });
  });

  window.animateHeroSlide = function (slideEl) {
    if (!slideEl) return;
    const animNodes = slideEl.querySelectorAll('.at-split-heading, .at-fade-up');
    animNodes.forEach(n => n.classList.remove('is-visible'));
    void slideEl.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animNodes.forEach(n => n.classList.add('is-visible'));
      });
    });
  };

  // Trigger initial active hero slide immediately
  const activeHeroSlide = document.querySelector('.hero-slide.active');
  if (activeHeroSlide) {
    window.animateHeroSlide(activeHeroSlide);
  }

  // 4. Tag & stagger-reveal elements across sections
  function applyStaggerFade(selector, stepMs = 85, baseMs = 0) {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('at-fade-up');
      el.style.transitionDelay = (baseMs + idx * stepMs) + 'ms';
    });
  }

  applyStaggerFade('.trust-pillar', 90, 0);
  applyStaggerFade('.category-ornament-header', 0, 0);
  applyStaggerFade('.category-item-link', 70, 60);
  applyStaggerFade('.featured-top-bar', 0, 0);
  applyStaggerFade('.single-product-card', 95, 60);
  applyStaggerFade('.dermal-benefits-kicker', 0, 0);
  applyStaggerFade('.dermal-benefits-sub', 0, 140);
  applyStaggerFade('.dermal-benefits-left .dermal-benefit-item', 100, 60);
  applyStaggerFade('.dermal-benefits-center', 0, 120);
  applyStaggerFade('.dermal-benefits-right .dermal-benefit-item', 100, 60);
  applyStaggerFade('.dermal-services-kicker', 0, 0);
  applyStaggerFade('.dermal-services-sub', 0, 140);
  applyStaggerFade('.offer-label-kicker', 0, 0);
  applyStaggerFade('.offer-sub-paragraph', 0, 140);
  applyStaggerFade('.special-offer-club-col', 0, 180);
  applyStaggerFade('.bottom-ribbon-col', 90, 0);

  // Horizontal carousel cards: mark & reveal together when slider wrap enters viewport
  const sliderWrap = document.querySelector('.dermal-slider-wrap');
  const sliderCards = document.querySelectorAll('.dermal-card:not(.dermal-clone)');
  sliderCards.forEach((card, idx) => {
    card.classList.add('at-fade-up');
    card.style.transitionDelay = (Math.min(idx, 2) * 110) + 'ms';
  });

  // Collect all scroll-observed elements (excluding hero elements which are slider-managed)
  const observedTargets = Array.from(
    document.querySelectorAll('.at-split-heading, .at-fade-up')
  ).filter(el => !el.closest('.hero-slide') && !el.closest('.dermal-slider-wrap'));

  if (!('IntersectionObserver' in window)) {
    observedTargets.forEach(el => el.classList.add('is-visible'));
    sliderCards.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === sliderWrap) {
          sliderCards.forEach(c => c.classList.add('is-visible'));
          // Clones stay visible in infinite loop
          sliderWrap.querySelectorAll('.dermal-clone').forEach(c => c.classList.add('is-visible'));
        } else {
          entry.target.classList.add('is-visible');
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });

  observedTargets.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  if (sliderWrap) {
    const sRect = sliderWrap.getBoundingClientRect();
    if (sRect.top < window.innerHeight * 0.95) {
      sliderCards.forEach(c => c.classList.add('is-visible'));
    } else {
      observer.observe(sliderWrap);
    }
  }
}
