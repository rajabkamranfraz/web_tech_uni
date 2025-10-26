let users = [];
let nextId = 11;

function displayUsers() {
  $("#usersList").html("<p>Loading users...</p>");

  $.ajax({
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    dataType: "json",
    success: function (data) {
      users = data;
      renderUsers();
    },
    error: function () {
      alert("Error fetching users. Please try again.");
    },
  });
}

function renderUsers() {
  let usersList = $("#usersList");
  usersList.empty();

  $.each(users, function (index, user) {
    usersList.append(`
      <div class="card p-3 mb-3">
        <h5 class="mb-1">${user.name}</h5>
        <div><strong>Email:</strong> ${user.email}</div>
        <div><strong>Phone:</strong> ${user.phone}</div>
        <div><strong>Website:</strong> ${user.website}</div>
        <div class="mt-2">
          <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${user.id}">Edit</button>
          <button class="btn btn-danger btn-sm btn-del" data-id="${user.id}">Delete</button>
        </div>
      </div>
    `);
  });
}

function handleFormSubmission(event) {
  event.preventDefault();

  let userId = $("#createBtn").attr("data-id");
  let name = $("#createName").val();
  let email = $("#createEmail").val();
  let phone = $("#createPhone").val();
  let website = $("#createWebsite").val();

  // Update user
  if (userId) {
    $.ajax({
      url: `https://jsonplaceholder.typicode.com/users/${userId}`,
      method: "PUT",
      data: { name, email, phone, website },
      success: function (updatedUser) {
        let userIndex = users.findIndex((u) => u.id == userId);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          renderUsers();
          resetForm();
          alert("User updated successfully!");
        }
      },
      error: function () {
        alert("Error updating user. Try again.");
      },
    });
  } 
  // Create user
  else {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "POST",
      data: { name, email, phone, website },
      success: function (newUser) {
        newUser.id = nextId++;
        users.unshift(newUser);
        renderUsers();
        resetForm();
        alert("User created successfully!");
      },
      error: function () {
        alert("Error creating user. Try again.");
      },
    });
  }
}

function editBtnClicked(event) {
  event.preventDefault();
  let userId = $(this).attr("data-id");
  let user = users.find((u) => u.id == userId);

  if (user) {
    $("#clearBtn").show();
    $("#createName").val(user.name);
    $("#createEmail").val(user.email);
    $("#createPhone").val(user.phone);
    $("#createWebsite").val(user.website);
    $("#createBtn").html("Update").attr("data-id", user.id);
  }
}

function deleteUser(event) {
  event.preventDefault();
  let userId = $(this).attr("data-id");

  if (confirm("Are you sure you want to delete this user?")) {
    $.ajax({
      url: `https://jsonplaceholder.typicode.com/users/${userId}`,
      method: "DELETE",
      success: function () {
        users = users.filter((u) => u.id != userId);
        renderUsers();
        alert("User deleted successfully!");
      },
      error: function () {
        alert("Error deleting user. Try again.");
      },
    });
  }
}

function resetForm() {
  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#createName").val("");
  $("#createEmail").val("");
  $("#createPhone").val("");
  $("#createWebsite").val("");
}

$(document).ready(function () {
  displayUsers();

  $("#usersList").on("click", ".btn-del", deleteUser);
  $("#usersList").on("click", ".btn-edit", editBtnClicked);
  $("#createForm").submit(handleFormSubmission);

  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    resetForm();
  });
});
