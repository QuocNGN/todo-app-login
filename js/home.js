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

let todos = JSON.parse(localStorage.getItem('todos')) || []; // Lấy todos từ localStorage
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

  // // Lưu trữ danh sách todos của người dùng hiện tại
  // const todos = JSON.parse(localStorage.getItem(`todos`)) || [];

  // // Lọc ra các task dựa vào ownerId của người dùng hiện tại
  // const userTodos = todos.filter(
  //   (todo) => todo.ownerId === loggedInUser.userId
  // );

  // // Lưu lại danh sách todos đã lọc
  // localStorage.setItem(`todos`, JSON.stringify(userTodos));

  // // Bây giờ bạn có thể sử dụng userTodos để hiển thị danh sách các task
  // showTodo();
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
  const isCompleted = todo.isDone ? 'checked' : '';
  return `<li class="task">
            <label for="${todo.id}">
                <input type="checkbox" id="task_${todo.id}" data-id="${todo.id}" onclick="updateStatus(this)" ${isCompleted}>
                <span class="${isCompleted}">${todo.name}</span>
                <button onclick="editTask('${todo.id}', '${todo.name}')">Edit</button>
                <button onclick="deleteTask('${todo.id}')">Delete</button>
            </label>
          </li>`;
}

function showTodo() {
  // Lọc todos theo ownerId của người dùng đang đăng nhập
  const userTodos = todos.filter(
    (todo) => todo.ownerId === loggedInUser.userId
  );

  // Sắp xếp todos: 'pending' lên trước, 'completed' xuống dưới
  userTodos.sort((a, b) => (a.isDone ? 1 : -1));

  let li = '';
  if (userTodos.length > 0) {
    userTodos.forEach((todo, id) => {
      if (
        currentFilter === (todo.isDone ? 'completed' : 'pending') ||
        currentFilter === 'all'
      ) {
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

  // Lấy ID của task từ thuộc tính 'data-id'
  const taskId = selectedTask.getAttribute('data-id');

  // Tìm task theo id trong mảng todos
  const todoIndex = todos.findIndex((todo) => todo.id === taskId);

  // Kiểm tra nếu tìm thấy task
  if (todoIndex !== -1) {
    if (selectedTask.checked) {
      taskName.classList.add('checked');
      todos[todoIndex].isDone = true;
    } else {
      taskName.classList.remove('checked');
      todos[todoIndex].isDone = false;
    }

    saveTodos(); // Lưu todos sau khi thay đổi trạng thái
    showTodo(); // Cập nhật giao diện sau khi thay đổi trạng thái
  } else {
    console.error(`Task với id ${taskId} không tìm thấy.`);
  }
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
    const taskInfo = {
      id: `task_${Date.now()}`, // Tạo ID cho task dựa trên thời gian
      name: userTask,
      isDone: false,
      ownerId: loggedInUser.userId, // Gán ownerId cho task
    };
    todos.push(taskInfo);
  }

  taskInput.value = '';
  saveTodos(); // Lưu todos sau khi thêm hoặc chỉnh sửa
  showTodo();
}

function saveTodos() {
  // Lưu danh sách todo vào localStorage theo userId
  localStorage.setItem('todos', JSON.stringify(todos));
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

// Gọi hàm để hiển thị todo khi trang được tải
showTodo();
