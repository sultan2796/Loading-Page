function showToast(message, duration = 3000) {
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

function openModal(tab) {
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal");
  
  if (overlay) overlay.classList.add("show");
  if (modal) modal.classList.add("show");
  document.body.style.overflow = "hidden";
  switchTab(tab);
}

function closeModal() {
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal");
  
  if (overlay) overlay.classList.remove("show");
  if (modal) modal.classList.remove("show");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function switchTab(tab) {
  const loginForm = document.getElementById("formLogin");
  const registerForm = document.getElementById("formRegister");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const slider = document.getElementById("tabSlider");

  if (!loginForm || !registerForm) return;

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    if (tabLogin) tabLogin.classList.add("active");
    if (tabRegister) tabRegister.classList.remove("active");
    if (slider) slider.style.transform = "translateX(0)";
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    if (tabLogin) tabLogin.classList.remove("active");
    if (tabRegister) tabRegister.classList.add("active");
    if (slider) slider.style.transform = "translateX(100%)";
  }
}

function registerUser() {
  const adInput = document.querySelector("#formRegister input[placeholder='Adın']").value.trim();
  const soyadInput = document.querySelector("#formRegister input[placeholder='Soyadın']").value.trim();
  const emailInput = document.querySelector("#formRegister input[type='email']").value.trim();
  const passwordInput = document.querySelector("#formRegister input[placeholder='En az 8 karakter']").value;
  const passwordConfirm = document.querySelector("#formRegister input[placeholder='••••••••']").value;

  if (!adInput || !soyadInput || !emailInput || !passwordInput || !passwordConfirm) {
    showToast("Zəhmət olmasa, bütün xanaları doldurun!");
    return;
  }

  if (passwordInput !== passwordConfirm) {
    showToast("Daxil etdiyiniz şifrələr bir-biri ilə uyğun gəlmir!");
    return;
  }

  if (passwordInput.length < 8) {
    showToast("Şifrə ən azı 8 simvoldan ibarət olmalıdır!");
    return;
  }

  const userJsonData = {
    ad: adInput,
    soyad: soyadInput,
    eposta: emailInput,
    sifre: passwordInput
  };

  localStorage.setItem("kayitliUser", JSON.stringify(userJsonData));
  showToast("Qeydiyyatınız uğurla tamamlandı! İndi hesabınıza giriş edə bilərsiniz.");
  
  setTimeout(() => {
    switchTab("login");
  }, 1200);
}

function loginUser() {
  const emailLogin = document.querySelector("#formLogin input[type='email']").value.trim();
  const passwordLogin = document.querySelector("#formLogin input[type='password']").value;

  if (!emailLogin || !passwordLogin) {
    showToast("Zəhmət olmasa, e-poçt və şifrənizi daxil edin!");
    return;
  }

  const localData = localStorage.getItem("kayitliUser");
  const savedUser = JSON.parse(localData);

  const correctEmail = savedUser ? savedUser.eposta : (typeof initialUsers !== 'undefined' ? initialUsers[0].eposta : null);
  const correctPassword = savedUser ? savedUser.sifre : (typeof initialUsers !== 'undefined' ? initialUsers[0].sifre : null);

  if (emailLogin === correctEmail && passwordLogin === correctPassword) {
    showToast("Giriş uğurludur! Şəxsi kabinetinizə yönləndirilirsiniz.");
    localStorage.setItem("activeSession", "true");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);
  } else {
    window.location.href = "unknown-user.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("openRegisterModal") === "true") {
    localStorage.removeItem("openRegisterModal");
    openModal("register");
  }

  const loginForm = document.getElementById("formLogin");
  if (loginForm) {
    loginForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        loginUser();
      }
    });
  }

  const registerForm = document.getElementById("formRegister");
  if (registerForm) {
    registerForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        registerUser();
      }
    });
  }
});