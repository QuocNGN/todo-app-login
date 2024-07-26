// Lấy ra elements của trang Register
const formRegister = document.getElementById('form-register');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const notifications = document.querySelector('.notifications');

// Lấy dữ liệu từ LocalStorage
const userLocal = JSON.parse(localStorage.getItem('users')) || [];

// Hàm tạo random UUID
function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
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
    password2.value &&
    password.value === password2.value &&
    isValidEmail(email.value)
  ) {
    // Lấy dữ liệu từ form và gộp thành đối tượng user
    const user = {
      userId: uuidv4(),
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

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success');
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};

/**
 * Validate địa chỉ email
 * @param {*} email: Chuỗi email người dùng nhập vào
 * @returns: Dữ liệu nếu mail đúng định dạng, undefined nếu email không đúng định dạng
 * Author: QuocNQN(21/07/2024)
 */
const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === '') {
    setError(username, 'Username is required');
  } else {
    setSuccess(username);
  }

  if (email === '') {
    setError(email, 'Email is required');
  } else if (!isValidEmail(emailValue)) {
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

  if (password2Value === '') {
    setError(password2, 'Please confirm your password');
  } else if (password2Value !== passwordValue) {
    setError(password2, "Password doesn't match");
  } else {
    setSuccess(password2);
  }
};

// Toast details
const toastDetails = {
  success: {
    icon: 'fa-check-circle',
    message: 'You have registered successfully!',
  },
  error: {
    icon: 'fa-times-circle',
    message: 'Invalid username or password.',
  },
};

// Remove toast
const removeToast = (toast) => {
  toast.classList.add('remove');
  setTimeout(() => toast.remove(), 1000); // Adjust the timeout to remove quickly
};

// Create toast notification
const handleCreateToast = (id) => {
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
  setTimeout(() => removeToast(toast), 1500); // Automatically remove after 5 seconds
};
