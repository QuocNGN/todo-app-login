// Lấy ra elements của trang Home (index)
const userLoginEle = document.getElementById('userLogin') || {};
const logoutButton = document.getElementById('logout');
const loginRegisterLinks = document.querySelectorAll('.login-register');
const userInfo = document.querySelectorAll('.user-info');

// Lấy dữ liệu trên Session Local về
const userLogin = JSON.parse(
  localStorage.getItem('userLogin') || sessionStorage.getItem('userLogin')
);

if (!userLogin) {
  window.location.href = '/pages/login.html';
} else {
  // Hiển thị tên user đang đăng nhập lên header
  userLoginEle.innerHTML = `Hello <b>${userLogin.username}</b>`;

  // Hiển thị thông tin người dùng và nút đăng xuất; Cho ẩn liên kết đăng ký/đăng nhập
  userInfo.forEach((ele) => (ele.style.display = 'block'));
  loginRegisterLinks.forEach((ele) => (ele.style.display = 'none'));
  // // Ẩn thông tin người dùng và nút đăng xuất; Cho hiện liên kết đăng nhập/đăng ký
  // userInfo.forEach((ele) => (ele.style.display = 'none'));
  // loginRegisterLinks.forEach((ele) => (ele.style.display = 'block'));
}

// Chức năng đăng xuất
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    // Remove user data from both storages
    localStorage.removeItem('userLogin');
    sessionStorage.removeItem('userLogin');

    // Chuyển hướng về trang đăng nhập
    setTimeout(() => {
      // Chuyển hướng về trang đăng nhập sau 1.5s
      window.location.href = 'pages/login.html';
    }, 1500);
  });
}

// Todo list
const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const selectFilters = document.querySelector('.filter select');
const addButton = document.querySelector('.add-button');
const resetButton = document.querySelector('.reset-button');

let editId;
let isEditedTask = false;
let todos = [];
let currentFilter = 'all';

selectFilters.addEventListener('change', (event) => {
  const selected = event.target.value;
  currentFilter = selected;
  showTodo();
});

function showTodo() {
  // Sắp xếp todos: 'pending' lên trước, 'completed' xuống dưới
  todos.sort((a, b) => (a.status === 'completed' ? 1 : -1));

  let li = '';
  if (todos.length > 0) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == 'completed' ? 'checked' : '';
      if (currentFilter == todo.status || currentFilter == 'all') {
        li += `<li class="task">
                  <label for="${id}">
                      <input type="checkbox" id="${id}" onclick="updateStatus(this)" ${isCompleted}>
                      <span class=${isCompleted}>${todo.name}</span>
                      <button onclick="editTask(${id}, '${todo.name}')">Edit</button>
                      <button onclick="deleteTask(${id})">Delete</button>
                  </label>
                </li>`;
      }
    });
  }

  taskBox.innerHTML =
    li ||
    `<img src="/asset/no-task.png" alt="" class="empty-image" width="150">`;
}

showTodo();

function updateStatus(selectedTask) {
  let taskName = selectedTask.nextElementSibling;
  if (selectedTask.checked) {
    taskName.classList.add('checked');
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    todos[selectedTask.id].status = 'pending';
  }
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
  showTodo();
}

function handleAddTask() {
  let userTask = taskInput.value.trim();
  if (userTask) {
    if (!isEditedTask) {
      let taskInfo = { name: userTask, status: 'pending' };
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
      addButton.textContent = 'Add';
    }
    taskInput.value = '';
    showTodo();
  }
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
