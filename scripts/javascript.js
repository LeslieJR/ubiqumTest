var people;

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
      fillTable(people);
      arrayRoles(people);
    })
    .catch(error => {
      console.log(error);
    });
}

function fillTable(people) {
  let tbody = document.getElementById("tbody");
  for (var i = 0; i < people.length; i++) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerHTML = people[i].name;
    let td2 = document.createElement("td");
    td2.innerHTML = people[i].age;
    let td3 = document.createElement("td");
    td3.innerHTML = people[i].role;
    let td4 = document.createElement("td");
    td4.innerHTML = people[i].team;
    let td5 = document.createElement("td");
    td5.innerHTML = people[i].seniority;
    let td6 = document.createElement("td");
    let btnInfo = document.createElement("button");
    btnInfo.innerHTML = "+ Info";
    btnInfo.setAttribute("data-toggle", "modal");
    btnInfo.setAttribute("data-target", "#contactInfo");
    btnInfo.setAttribute("data-id", people[i].name);
    btnInfo.setAttribute("data-photo", people[i].contact_info.photo);
    if (people[i].contact_info.email != null) {
      btnInfo.setAttribute("data-email", people[i].contact_info.email);
    } else {
      btnInfo.setAttribute("data-email", "we do not have any contact info");
    }
    btnInfo.setAttribute("data-site", people[i].contact_info.site);
    btnInfo.setAttribute("data-phone", people[i].contact_info.phone);
    btnInfo.setAttribute("data-nick", people[i].contact_info.nickName);
    btnInfo.setAttribute("data-color", people[i].team);
    getBtnId(btnInfo);
    td6.append(btnInfo);
    tr.append(td1, td2, td3, td4, td5, td6);
    tbody.append(tr);
  }
}

function getBtnId(btn) {
  btn.addEventListener("click", function() {
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
  var filterRole = document.getElementById("roles");
  for (var i = 0; i < people.length; i++) {
    var role = document.createElement("div");
    var inputRole = document.createElement("input");
    inputRole.setAttribute("type", "checkbox");
    inputRole.setAttribute("id", people[i].role);
    inputRole.setAttribute("value", people[i].role);

    inputRole.onchange = function() {
      console.log("works");
      filteredByRole(people);
    };

    var labelRole = document.createElement("label");
    labelRole.setAttribute("for", people[i].role);
    labelRole.innerText = people[i].role;
    role.append(inputRole, labelRole);
    filterRole.append(role);
  }
}
document.getElementById("filter_users").onkeyup = function() {
  console.log("filter by name");
  filteredPerson(people);
};
function filteredPerson(people) {
  let filtered;
  for (var i = 0; i < people.length; i++) {
    if (
      people[i].name
        .toLowerCase()
        .trim()
        .includes(
          document
            .getElementById("filter_users")
            .value.toLowerCase()
            .trim()
        ) ||
      people[i].contact_info.nickName
        .toLowerCase()
        .trim()
        .includes(
          document
            .getElementById("filter_users")
            .value.toLowerCase()
            .trim()
        )
    ) {
      filtered = people[i];
      console.log(people[i]);
    }
  }
}

function filteredByRole(people) {
  console.log("enters function");
  let inputs = document.getElementsByTagName("input");
  let arrChecked = [];
  let roleChecked = [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "checkbox" && inputs[i].checked == true) {
      arrChecked.push(inputs[i].value);
    }
  }
  console.log(arrChecked);

  if (arrChecked.length !== 0) {
    for (let k = 0; k < people.length; k++) {
      for (let j = 0; j < arrChecked.length; j++) {
        if (people[k].role === arrChecked[j]) {
          roleChecked.push(people[k]);
        }
      }
    }
    console.log(roleChecked);
  }
}

document.getElementById("order").onchange = function() {
  orderByAge(people);
};
function orderByAge(people) {
  if (document.getElementById("order").value == "Descending") {
    people.sort(function(a, b) {
      return b.age - a.age;
    });
    console.log(people);
  } else if (document.getElementById("order").value == "Ascending") {
    people.sort(function(a, b) {
      return a.age - b.age;
    });
    console.log(people);
  }
}
