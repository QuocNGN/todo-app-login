import { setError, setSuccess, validateEmail } from '../utils/utils.js';
import { toastDetails } from '../utils/toastMessages.js';

// Lấy ra elements của trang Register
const formRegister = document.getElementById('form-register');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeatPassword');
const notifications = document.querySelector('.notifications');

// Lấy dữ liệu từ LocalStorage
const userLocal = JSON.parse(localStorage.getItem('users')) || [];

// Hàm tạo random UUID
function generateUuidv4() {
  const template = '10000000-1000-4000-8000-100000000000';
  return template.replace(/[018]/g, (placeholderCharacter) =>
    (
      +placeholderCharacter ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (+placeholderCharacter / 4)))
    ).toString(16)
  );
}

// Lắng nghe sự kiện submit form đăng ký tài khoản
formRegister.addEventListener('submit', function (e) {
  // Ngăn chặn sự kiện load lại trang
  e.preventDefault();

  // Validate dữ liệu đầu vào
  validateInputs();

  // Gửi dữ liệu từ form lên LocalStorage
  if (
    username.value &&
    email.value &&
    password.value &&
    repeatPassword.value &&
    password.value === repeatPassword.value &&
    validateEmail(email.value)
  ) {
    // Lấy dữ liệu từ form và gộp thành đối tượng user
    const user = {
      userId: generateUuidv4(),
      username: username.value,
      email: email.value,
      password: password.value,
    };

    // Push user vào trong mảng userLocal
    userLocal.push(user);

    // Luư trữ dữ liệu lên local
    localStorage.setItem('users', JSON.stringify(userLocal));

    handleCreateToast('success');

    // Chuyển hướng về trang đăng nhập
    setTimeout(() => {
      // Chuyển hướng về trang đăng nhập sau 1s
      window.location.href = './login.html';
    }, 2000);
  }
});

function validateInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const repeatPasswordValue = repeatPassword.value.trim();

  if (usernameValue === '') {
    setError(username, 'Username is required');
  } else {
    setSuccess(username);
  }

  if (email === '') {
    setError(email, 'Email is required');
  } else if (!validateEmail(emailValue)) {
    setError(email, 'Provide a valid email address');
  } else {
    setSuccess(email);
  }

  if (passwordValue === '') {
    setError(password, 'Password is required');
  } else if (passwordValue.length < 8) {
    setError(password, 'Password must be at least 8 character.');
  } else {
    setSuccess(password);
  }

  if (repeatPasswordValue === '') {
    setError(repeatPassword, 'Please confirm your password');
  } else if (repeatPasswordValue !== passwordValue) {
    setError(repeatPassword, "Password doesn't match");
  } else {
    setSuccess(repeatPassword);
  }
}

// Remove toast
function removeToast(toast) {
  toast.classList.add('remove');
  setTimeout(() => toast.remove(), 1000); // Adjust the timeout to remove quickly
}

// Create toast notification
function handleCreateToast(id) {
  const { icon, message } = toastDetails[id];
  const toast = document.createElement('li');
  toast.className = `toast ${id}`;
  toast.innerHTML = `
    <div class="column">
      <i class="fa ${icon}"></i>
      <span>${message}</span>
    </div>
    <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>
  `;
  notifications.appendChild(toast);
  setTimeout(() => removeToast(toast), 1500); // Automatically remove after 1.5 seconds
}
