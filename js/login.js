// Lấy ra elements của trang Login
const formLogin = document.getElementById('form-login');
const usernameEle = document.getElementById('username');
const passwordEle = document.getElementById('password');
const notifications = document.querySelector('.notifications');
const rememberCheck = document.getElementById('rememberCheck');

// Lắng nghe sự kiện submit form đăng nhập tài khoản
formLogin.addEventListener('submit', function (e) {
  // Ngăn chặn sự kiện load lại trang
  e.preventDefault();

  // Validate dữ liệu đầu vào
  validateInputs();

  // Lấy dữ liệu từ Local về
  const userLocal = JSON.parse(localStorage.getItem('users')) || [];

  // Tìm kiếm email và mật khẩu người dùng nhập vào có tồn tại trên local?
  const findUser = userLocal.find(
    (user) =>
      user.username === usernameEle.value && user.password === passwordEle.value
  );

  if (!findUser) {
    // Nếu khôn thì thông báo cho người dùng nhập lại dữ liệu
    handleCreateToast('error');
  } else {
    handleCreateToast('success');

    // Nếu có thì đăng nhập thành công và chuyển về trang chủ
    setTimeout(() => {
      // Chuyển hướng về trang đăng nhập sau 1s
      window.location.href = '../index.html';
    }, 2000);
    // Remember me functionality
    if (rememberCheck.checked) {
      // Lưu thông tin của user đăng nhập lên local
      localStorage.setItem('userLogin', JSON.stringify(findUser));
    } else {
      sessionStorage.setItem('userLogin', JSON.stringify(findUser));
    }
  }
});

// Set error message
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success');
};

// Set success message
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();

  if (usernameValue === '') {
    setError(username, 'Username is required');
  } else {
    setSuccess(username);
  }

  if (passwordValue === '') {
    setError(password, 'Password is required');
  } else if (passwordValue.length < 8) {
    setError(password, 'Password must be at least 8 character.');
  } else {
    setSuccess(password);
  }
};

// Toast details
const toastDetails = {
  success: {
    icon: 'fa-check-circle',
    message: 'You have logged in successfully!',
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
