LoadData();

//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();

  // Lọc các bài chưa xóa
  let filteredPosts = posts.filter((post) => post.isDeleted !== true);

  // Xóa nội dung cũ trước khi render mới
  let body = document.getElementById("body");
  body.innerHTML = "";

  for (const post of filteredPosts) {
    body.innerHTML += convertDataToHTML(post);
  }
}

function convertDataToHTML(post) {
  let result = "<tr>";
  result += "<td>" + post.id + "</td>";
  result += "<td>" + post.title + "</td>";
  result += "<td>" + post.views + "</td>";
  result +=
    "<td><input type='submit' value='Delete' onclick='Delete(" +
    post.id +
    ")'></input></td>";
  result += "</tr>";
  return result;
}

//POST: domain:port//posts + body
async function SaveData() {
  let title = document.getElementById("title").value;
  let view = document.getElementById("view").value;

  // Lấy danh sách posts hiện tại
  let response = await fetch("http://localhost:3000/posts");
  let posts = await response.json();

  // Tìm ID lớn nhất trong danh sách posts
  let maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);

  // Tạo ID mới
  let newId = maxId + 1;

  let dataObj = {
    id: newId,
    title: title,
    views: view,
    isDeleted: false, // thêm dòng này
  };

  // Gửi yêu cầu POST để thêm bài viết mới
  let createResponse = await fetch("http://localhost:3000/posts", {
    method: "POST",
    body: JSON.stringify(dataObj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(createResponse);
}

//PUT: domain:port//posts/id + body

//DELETE: domain:port//posts/id
async function Delete(id) {
  let response = await fetch("http://localhost:3000/posts/" + id);

  if (!response.ok) {
    console.error(`Không tìm thấy bài viết với id = ${id}`);
    return; // không tiếp tục nếu không tìm thấy
  }

  let post = await response.json();

  post.isDeleted = true;

  let updateResponse = await fetch("http://localhost:3000/posts/" + id, {
    method: "PUT",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (updateResponse.ok) {
    console.log("Xóa mềm thành công");
    document.getElementById("body").innerHTML = "";
    LoadData();
  }
}
