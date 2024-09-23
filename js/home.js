// Lấy ra elements của trang Home (index)
const userLoginEle = document.getElementById('userLogin') || {};
const logoutButton = document.getElementById('logout');
const loginRegisterLinks = document.querySelectorAll('.login-register');
const userInfo = document.querySelectorAll('.user-info');

// Khởi tạo các biến liên quan đến todo list
const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box'); // Đảm bảo taskBox được khởi tạo trước khi sử dụng
const selectFilters = document.querySelector('.filter select');
const addButton = document.querySelector('.add-button');
const resetButton = document.querySelector('.reset-button');

let todos = [];
let editId;
let isEditedTask = false;
let currentFilter = 'all';

// Lấy dữ liệu người dùng đã đăng nhập
const loggedInUser = JSON.parse(
  localStorage.getItem('userLogin') || sessionStorage.getItem('userLogin')
);

if (!loggedInUser) {
  window.location.href = '/pages/login.html';
} else {
  // Hiển thị tên user đang đăng nhập lên header
  userLoginEle.innerHTML = `Hello <b>${loggedInUser.username}</b>`;

  // Hiển thị thông tin người dùng và nút đăng xuất; Cho ẩn liên kết đăng ký/đăng nhập
  userInfo.forEach((ele) => (ele.style.display = 'block'));
  loginRegisterLinks.forEach((ele) => (ele.style.display = 'none'));

  // Lấy danh sách todo từ localStorage của người dùng hiện tại
  todos =
    JSON.parse(localStorage.getItem(`todos_${loggedInUser.userId}`)) || [];
  showTodo();
}

// Chức năng đăng xuất
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    // Xóa thông tin người dùng từ cả localStorage và sessionStorage
    localStorage.removeItem('userLogin');
    sessionStorage.removeItem('userLogin');

    // Chuyển hướng về trang đăng nhập sau 1.5 giây
    setTimeout(() => {
      window.location.href = 'pages/login.html';
    }, 1500);
  });
}

// Các hàm liên quan đến todo list
selectFilters.addEventListener('change', (event) => {
  const selected = event.target.value;
  currentFilter = selected;
  showTodo();
});

function renderTodo(todo, id) {
  const isCompleted = todo.status === 'completed' ? 'checked' : '';
  return `<li class="task">
            <label for="${id}">
                <input type="checkbox" id="${id}" onclick="updateStatus(this)" ${isCompleted}>
                <span class=${isCompleted}>${todo.name}</span>
                <button onclick="editTask(${id}, '${todo.name}')">Edit</button>
                <button onclick="deleteTask(${id})">Delete</button>
            </label>
          </li>`;
}

function showTodo() {
  // Sắp xếp todos: 'pending' lên trước, 'completed' xuống dưới
  todos.sort((a, b) => (a.status === 'completed' ? 1 : -1));

  let li = '';
  if (todos.length > 0) {
    todos.forEach((todo, id) => {
      if (currentFilter === todo.status || currentFilter === 'all') {
        li += renderTodo(todo, id);
      }
    });
  }

  taskBox.innerHTML =
    li ||
    `<img src="/assets/noTask.png" alt="" class="empty-image" width="150">`;
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.nextElementSibling;
  if (selectedTask.checked) {
    taskName.classList.add('checked');
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    todos[selectedTask.id].status = 'pending';
  }
  saveTodos(); // Lưu todos sau khi thay đổi trạng thái
  showTodo(); // Cập nhật giao diện sau khi thay đổi trạng thái
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  addButton.textContent = 'Save';
}

function deleteTask(deleteId) {
  isEditedTask = false;
  todos.splice(deleteId, 1);
  saveTodos(); // Lưu todos sau khi xóa
  showTodo();
}

function handleAddTask() {
  const userTask = taskInput.value.trim();

  if (!userTask) {
    return; // Nếu không có giá trị hợp lệ thì thoát hàm
  }

  if (isEditedTask) {
    todos[editId].name = userTask;
    isEditedTask = false;
    addButton.textContent = 'Add';
  } else {
    const taskInfo = { name: userTask, status: 'pending' };
    todos.push(taskInfo);
  }

  taskInput.value = '';
  saveTodos(); // Lưu todos sau khi thêm hoặc chỉnh sửa
  showTodo();
}

function saveTodos() {
  // Lưu danh sách todo vào localStorage theo userId
  localStorage.setItem(`todos_${loggedInUser.userId}`, JSON.stringify(todos));
}

addButton.addEventListener('click', handleAddTask);

taskInput.addEventListener('keyup', (e) => {
  if (e.key == 'Enter') {
    handleAddTask();
  }
});

resetButton.addEventListener('click', () => {
  taskInput.value = '';
  isEditedTask = false;
  addButton.textContent = 'Add';
});
