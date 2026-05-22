function showDashboardToast(message, duration = 3000) {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
}

document.addEventListener("DOMContentLoaded", () => {
  const isAuthorized = localStorage.getItem("activeSession");
  
  if (!isAuthorized || isAuthorized !== "true") {
    window.location.href = "index.html"; 
    return;
  }

  const userData = localStorage.getItem("kayitliUser");
  const userNameElement = document.getElementById("userName");
  const sidebarUserName = document.getElementById("sidebarUserName");
  const lockScreenUser = document.getElementById("lockScreenUser");

  if (userData) {
    const savedUser = JSON.parse(userData);
    const capitalizedName = savedUser.ad.charAt(0).toUpperCase() + savedUser.ad.slice(1);
    const fullName = capitalizedName + " " + (savedUser.soyad ? savedUser.soyad.charAt(0).toUpperCase() + savedUser.soyad.slice(1) : "");
    
    if (userNameElement) userNameElement.textContent = capitalizedName;
    if (sidebarUserName) sidebarUserName.textContent = fullName;
    if (lockScreenUser) lockScreenUser.textContent = fullName;

    const initial = savedUser.ad.charAt(0).toUpperCase();
    document.getElementById("sidebarAvatar").textContent = initial;
    document.getElementById("currentAvatar").textContent = initial;
    document.getElementById("lockScreenAvatar").textContent = initial;

    loadAvatarGradient(savedUser.avatar || "g-purple");
  }

  loadDashboardTheme();
  
  const activities = localStorage.getItem("dashActivities");
  if (!activities || JSON.parse(activities).length === 0) {
    addActivity("Sessiyaya uğurla giriş edildi");
  } else {
    renderActivities();
  }

  const lockPassInput = document.getElementById("lockScreenPass");
  if (lockPassInput) {
    lockPassInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        unlockSession();
      }
    });
  }
});

function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  sidebar.classList.toggle("active");
  backdrop.classList.toggle("active");
}

function closeMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  sidebar.classList.remove("active");
  backdrop.classList.remove("active");
}

function switchDashboardTab(tabName, element) {
  closeMobileMenu();

  const contents = document.querySelectorAll(".tab-content");
  contents.forEach(content => {
    content.classList.add("hidden");
  });

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) {
    activeContent.classList.remove("hidden");
  }

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => {
    item.classList.remove("active");
  });

  element.classList.add("active");

  if (tabName === "profil") {
    const userData = localStorage.getItem("kayitliUser");
    if (userData) {
      const savedUser = JSON.parse(userData);
      document.getElementById("profileAd").value = savedUser.ad || "";
      document.getElementById("profileSoyad").value = savedUser.soyad || "";
      document.getElementById("profileEposta").value = savedUser.eposta || "";
      
      const activeGrad = savedUser.avatar || "g-purple";
      const opts = document.querySelectorAll(".avatar-option");
      opts.forEach(opt => {
        opt.classList.remove("active");
        if (opt.classList.contains(activeGrad)) {
          opt.classList.add("active");
        }
      });
    }
  }
}

function updateProfile() {
  const adVal = document.getElementById("profileAd").value.trim();
  const soyadVal = document.getElementById("profileSoyad").value.trim();
  const epostaVal = document.getElementById("profileEposta").value.trim();

  if (!adVal || !soyadVal || !epostaVal) {
    showDashboardToast("Zəhmət olmasa bütün sahələri doldurun!");
    return;
  }

  const userData = localStorage.getItem("kayitliUser");
  if (userData) {
    const savedUser = JSON.parse(userData);
    savedUser.ad = adVal;
    savedUser.soyad = soyadVal;
    savedUser.eposta = epostaVal;

    localStorage.setItem("kayitliUser", JSON.stringify(savedUser));
    
    const userNameElement = document.getElementById("userName");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const lockScreenUser = document.getElementById("lockScreenUser");
    
    const capitalizedName = adVal.charAt(0).toUpperCase() + adVal.slice(1);
    const fullName = capitalizedName + " " + soyadVal.charAt(0).toUpperCase() + soyadVal.slice(1);

    if (userNameElement) userNameElement.textContent = capitalizedName;
    if (sidebarUserName) sidebarUserName.textContent = fullName;
    if (lockScreenUser) lockScreenUser.textContent = fullName;

    const initial = adVal.charAt(0).toUpperCase();
    document.getElementById("sidebarAvatar").textContent = initial;
    document.getElementById("currentAvatar").textContent = initial;
    document.getElementById("lockScreenAvatar").textContent = initial;

    addActivity("Profil məlumatları yeniləndi");
    showDashboardToast("Profil məlumatları uğurla yeniləndi!");
  }
}

function changePassword() {
  const currentPass = document.getElementById("settingsCurrentPass").value;
  const newPass = document.getElementById("settingsNewPass").value;
  const confirmPass = document.getElementById("settingsConfirmPass").value;

  if (!currentPass || !newPass || !confirmPass) {
    showDashboardToast("Zəhmət olmasa bütün sahələri doldurun!");
    return;
  }

  const userData = localStorage.getItem("kayitliUser");
  if (userData) {
    const savedUser = JSON.parse(userData);

    if (currentPass !== savedUser.sifre) {
      showDashboardToast("Cari şifrə yanlışdır!");
      return;
    }

    if (newPass !== confirmPass) {
      showDashboardToast("Yeni şifrələr uyğun gəlmir!");
      return;
    }

    if (newPass.length < 8) {
      showDashboardToast("Şifrə ən azı 8 simvoldan ibarət olmalıdır!");
      return;
    }

    savedUser.sifre = newPass;
    localStorage.setItem("kayitliUser", JSON.stringify(savedUser));

    document.getElementById("settingsCurrentPass").value = "";
    document.getElementById("settingsNewPass").value = "";
    document.getElementById("settingsConfirmPass").value = "";

    addActivity("İstifadəçi şifrəsi dəyişdirildi");
    showDashboardToast("Şifrə uğurla yeniləndi!");
  }
}

function logoutUser() {
  localStorage.removeItem("activeSession");
  showDashboardToast("Hesabınızdan təhlükəsiz çıxış edildi! Yönləndirilirsiniz...");
  
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function addActivity(text) {
  let activities = [];
  const stored = localStorage.getItem("dashActivities");
  if (stored) {
    activities = JSON.parse(stored);
  }

  activities.unshift({
    text: text,
    time: getCurrentTime()
  });

  if (activities.length > 5) {
    activities.pop();
  }

  localStorage.setItem("dashActivities", JSON.stringify(activities));
  renderActivities();
}

function renderActivities() {
  const container = document.getElementById("activity-log-container");
  if (!container) return;

  const stored = localStorage.getItem("dashActivities");
  if (!stored) {
    container.innerHTML = `<p style="font-size: 13px; color: var(--dash-muted);">Fəaliyyət yoxdur</p>`;
    return;
  }

  const activities = JSON.parse(stored);
  container.innerHTML = "";

  activities.forEach(act => {
    const item = document.createElement("div");
    item.className = "activity-item";
    item.innerHTML = `
      <div class="activity-icon">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--dash-text)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="activity-meta">
        <span class="activity-text">${act.text}</span>
        <span class="activity-time">${act.time}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

function setAvatarGradient(gradientClass) {
  const userData = localStorage.getItem("kayitliUser");
  if (userData) {
    const savedUser = JSON.parse(userData);
    savedUser.avatar = gradientClass;
    localStorage.setItem("kayitliUser", JSON.stringify(savedUser));
    
    loadAvatarGradient(gradientClass);

    const opts = document.querySelectorAll(".avatar-option");
    opts.forEach(opt => {
      opt.classList.remove("active");
      if (opt.classList.contains(gradientClass)) {
        opt.classList.add("active");
      }
    });

    addActivity("Avatar stili dəyişdirildi");
  }
}

function loadAvatarGradient(gradientClass) {
  const list = ["g-purple", "g-sunset", "g-ocean", "g-neon"];
  const sa = document.getElementById("sidebarAvatar");
  const ca = document.getElementById("currentAvatar");
  const la = document.getElementById("lockScreenAvatar");

  list.forEach(g => {
    if (sa) sa.classList.remove(g);
    if (ca) ca.classList.remove(g);
    if (la) la.classList.remove(g);
  });

  if (sa) sa.classList.add(gradientClass);
  if (ca) ca.classList.add(gradientClass);
  if (la) la.classList.add(gradientClass);
}

function setDashboardTheme(themeName) {
  const body = document.body;
  const darkBtn = document.getElementById("theme-btn-dark");
  const lightBtn = document.getElementById("theme-btn-light");

  if (themeName === "light") {
    body.classList.add("light-theme");
    if (lightBtn) lightBtn.classList.add("active");
    if (darkBtn) darkBtn.classList.remove("active");
  } else {
    body.classList.remove("light-theme");
    if (darkBtn) darkBtn.classList.add("active");
    if (lightBtn) lightBtn.classList.remove("active");
  }

  localStorage.setItem("dashTheme", themeName);
  addActivity(`Sistem mövzusu dəyişdirildi (${themeName === "light" ? "Açıq" : "Tünd"})`);
}

function loadDashboardTheme() {
  const savedTheme = localStorage.getItem("dashTheme") || "dark";
  setDashboardTheme(savedTheme);
}

function lockSession() {
  document.body.classList.add("session-locked");
  document.getElementById("lockScreenPass").value = "";
  document.getElementById("lockScreenPass").focus();
  addActivity("Sessiya kilidləndi");
}

function unlockSession() {
  const enteredPass = document.getElementById("lockScreenPass").value;
  const userData = localStorage.getItem("kayitliUser");
  
  if (userData) {
    const savedUser = JSON.parse(userData);
    if (enteredPass === savedUser.sifre) {
      document.body.classList.remove("session-locked");
      document.getElementById("lockScreenPass").value = "";
      addActivity("Sessiyanın kilidi açıldı");
      showDashboardToast("Sessiya uğurla açıldı!");
    } else {
      showDashboardToast("Daxil etdiyiniz şifrə yanlışdır!");
    }
  }
}