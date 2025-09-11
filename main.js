LoadData();
//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();
  let body = document.getElementById("body");
  body.innerHTML = "";
  for (const post of posts) {
    if (!post.isDelete) {
      body.innerHTML += convertDataToHTML(post);
    }
  }
}

async function LoadDataA() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();
  for (const post of posts) {
    let body = document.getElementById("body");
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

  // Lấy tất cả posts để tìm id lớn nhất
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();
  let id = null;
  let isUpdate = false;

  if (id) {
    // Nếu có id, kiểm tra có tồn tại không
    let found = posts.find((p) => p.id == id);
    if (found) isUpdate = true;
  }

  if (isUpdate) {
    let dataObj = {
      title: title,
      views: view,
    };
    await fetch("http://localhost:3000/posts/" + id, {
      method: "PUT",
      body: JSON.stringify(dataObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    // Tự tăng id
    let maxId = posts.reduce((max, p) => Math.max(max, Number(p.id)), 0);
    let newId = (maxId + 1).toString();
    let dataObj = {
      id: newId,
      title: title,
      views: view,
    };
    await fetch("http://localhost:3000/posts", {
      method: "POST",
      body: JSON.stringify(dataObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  LoadData();
}

//DELETE: domain:port//posts/id
// Xoá mềm
async function Delete(id) {
  let response = await fetch("http://localhost:3000/posts/" + id);
  if (response.ok) {
    let post = await response.json();
    post.isDelete = true;
    await fetch("http://localhost:3000/posts/" + id, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    });
    LoadData();
  } else {
    console.log("Delete failed");
  }
}
