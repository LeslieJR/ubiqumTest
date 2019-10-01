fetchData();

function fetchData() {
  fetch("https://api.myjson.com/bins/adpvt")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then(json => {
      people = json.people;
      console.log(people);
      arrayRoles(people);
      filteredByRole(people);
      // filteredPerson(people);
      document.getElementById("loader").style.display = "none";
      document.getElementById("pageContent").style.display = "block";
    })
    .catch(error => {
      console.log(error);
    });
}

// function init() {
//   document.getElementById("search").onclick = function() {
//     console.log("filter by name");
//     filteredPerson(people);
//   };
//   document.getElementById("order").onchange = function() {
//     console.log("ordering members");
//     orderByAge;
//   };
// }

function fillTable(array) {
  let table = document.getElementById("tabl");
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  if (array.length !== 0) {
    document.getElementById("nomatch").style.display = "none";
    console.log("enter fillTable", array);
    for (var i = 0; i < array.length; i++) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.innerHTML = array[i].name;
      let td2 = document.createElement("td");
      td2.innerHTML = array[i].age;
      let td3 = document.createElement("td");
      td3.innerHTML = array[i].role;
      let td4 = document.createElement("td");
      td4.innerHTML = array[i].team;
      let td5 = document.createElement("td");
      td5.innerHTML = array[i].seniority;
      let td6 = document.createElement("td");
      let btnInfo = document.createElement("button");
      btnInfo.innerHTML = "+ Info";
      btnInfo.setAttribute("data-toggle", "modal");
      btnInfo.setAttribute("data-target", "#contactInfo");
      btnInfo.setAttribute("data-id", array[i].name);
      btnInfo.setAttribute("data-photo", array[i].contact_info.photo);
      if (array[i].contact_info.email != null) {
        btnInfo.setAttribute("data-email", array[i].contact_info.email);
      } else {
        btnInfo.setAttribute("data-email", "we do not have any contact info");
      }
      btnInfo.setAttribute("data-site", array[i].contact_info.site);
      btnInfo.setAttribute("data-phone", array[i].contact_info.phone);
      btnInfo.setAttribute("data-nick", array[i].contact_info.nickName);
      btnInfo.setAttribute("data-color", array[i].team);
      getBtnId(btnInfo);
      td6.append(btnInfo);
      tr.append(td1, td2, td3, td4, td5, td6);
      tbody.append(tr);
    }
  } else {
    console.log("no match found");
    table.innerHTML = ""
    tbody.innerHTML = "";
    document.getElementById("nomatch").style.display = "inline-block";
  }
  // orderByAge(array);
}

function getBtnId(btn) {
  btn.addEventListener("click", function () {
    document.getElementById("modal-body").innerHTML = "";
    document.getElementById("personName").innerText = this.dataset.id;
    let info = document.createElement("div");
    let photo = document.createElement("img");
    photo.src = this.dataset.photo;
    let nick = document.createElement("p");
    nick.innerText = this.dataset.nick;
    let phone = document.createElement("p");
    phone.innerText = this.dataset.phone;
    let site = document.createElement("a");
    site.setAttribute("href", this.dataset.site);
    site.innerText = this.dataset.site;
    info.append(nick, phone, site);
    if (this.dataset.email == "we do not have any contact info") {
      let message = document.createElement("p");
      message.innerText = this.dataset.email;
      document.getElementById("modal-body").append(photo, info, message);
    } else {
      let btnEmail = document.createElement("button");
      let email = document.createElement("a");
      btnEmail.append(email);
      email.setAttribute("href", `mailto:${this.dataset.email}`);
      email.innerHTML = "send me an email";
      document.getElementById("modal-body").append(photo, info, btnEmail);
    }

    document.getElementById(
      "modal-body"
    ).style.backgroundColor = this.dataset.color;
  });
}

function arrayRoles(people) {
  let filterRole = document.getElementById("roles");

  const roleSet = new Set();
  for (let i = 0; i < people.length; i++) {
    roleSet.add(people[i].role);
  }
  let uniqueItems = Array.from(new Set(roleSet));
  for (let j = 0; j < uniqueItems.length; j++) {
    let role = document.createElement("div");
    let inputRole = document.createElement("input");
    inputRole.setAttribute("type", "checkbox");
    inputRole.setAttribute("id", uniqueItems[j]);
    inputRole.setAttribute("value", uniqueItems[j]);

    inputRole.onchange = function () {
      console.log("works");
      filteredByRole(people);
    };

    let labelRole = document.createElement("label");
    labelRole.setAttribute("for", uniqueItems[j]);
    labelRole.innerText = uniqueItems[j];
    role.append(inputRole, labelRole);
    filterRole.append(role);
  }
}

function filteredPerson(array) {
  console.log("enters person function");
  document.getElementById("order").value = "Select";
  // document.getElementsByTagName("input[type=checkbox]");
  let filtered = [];
  if (document.getElementById("filter_users").value !== "") {
    for (var i = 0; i < array.length; i++) {
      if (
        array[i].name
        .toLowerCase()
        .trim()
        .includes(
          document
          .getElementById("filter_users")
          .value.toLowerCase()
          .trim()
        ) ||
        array[i].contact_info.nickName
        .toLowerCase()
        .trim()
        .includes(
          document
          .getElementById("filter_users")
          .value.toLowerCase()
          .trim()
        )
      ) {
        filtered.push(array[i]);
      }
    }
    fillTable(filtered);
    document.getElementById("order").onchange = function () {
      orderByAge(filtered);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(filtered);
    };
  } else {
    console.log("no input");
    fillTable(array);
    document.getElementById("order").onchange = function () {
      orderByAge(array);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(array);
    };
  }
}

function filteredByRole(array) {
  console.log("enters de filterbyrole function");
  let inputs = document.getElementsByTagName("input");
  let arrChecked = [];
  let roleChecked = [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "checkbox" && inputs[i].checked) {
      arrChecked.push(inputs[i].value);
    }
  }
  // console.log(arrChecked);

  if (arrChecked.length !== 0) {
    for (let k = 0; k < array.length; k++) {
      for (let j = 0; j < arrChecked.length; j++) {
        if (array[k].role === arrChecked[j]) {
          roleChecked.push(array[k]);
        }
      }
    }
    console.log(roleChecked);
    fillTable(roleChecked);
    document.getElementById("order").onchange = function () {
      orderByAge(roleChecked);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(roleChecked);
    };
  } else {
    console.log(array);
    fillTable(array);
    document.getElementById("order").onchange = function () {
      orderByAge(array);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(array);
    };
  }
}

function orderByAge(array) {
  console.log("enters order function");
  let selected = document.getElementById("order");
  if (selected.value == "Descending") {
    array.sort(function (a, b) {
      return b.age - a.age;
    });
    console.log("descending", array);
    fillTable(array);
    document.getElementById("order").onchange = function () {
      orderByAge(array);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(array);
    };
  } else if (selected.value == "Ascending") {
    array.sort(function (a, b) {
      return a.age - b.age;
    });
    console.log("ascending", array);
    fillTable(array);
    document.getElementById("order").onchange = function () {
      orderByAge(array);
    };
    document.getElementById("search").onclick = function () {
      filteredPerson(array);
    };
  }
}