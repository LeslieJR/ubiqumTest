fetchData();

function fetchData() {
  fetch("https://fakerapi.it/api/v1/persons?_quantity=10&_birthday_end=1998-01-01")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then(json => {
      data = json.data;
      console.log(data);
      fillTable(data);
      document.getElementById("loader").style.display = "none";
      document.getElementById("pageContent").style.display = "block";
      arrayCountries(data);
      document
        .getElementById("filter_users")
        .addEventListener("keyup", function() {
          filteredByCountry(data);
        });
      document.getElementById("order").addEventListener("change", function() {
        filteredByCountry(data);
      });

     filteredByCountry(data);
     filteredPerson(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function fillTable(array) {
  let table = document.getElementById("tabl");
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  if (array.length !== 0) {
    document.getElementById("nomatch").style.display = "none";
    console.log("enter fillTable", array);
    var today = new Date();
    var year = today.getFullYear();
    for (var i = 0; i < array.length; i++) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.innerHTML = array[i].firstname +" "+ array[i].lastname;
      let td2 = document.createElement("td");
      td2.innerHTML = year - array[i].birthday.slice(0,4);

      let td3 = document.createElement("td");
      td3.innerHTML = array[i].email;
      let td4 = document.createElement("td");
      td4.innerHTML = array[i].address.country;
      // let td5 = document.createElement("td");
      // td5.innerHTML = array[i].;
      let td6 = document.createElement("td");
      let btnInfo = document.createElement("button");
      btnInfo.innerHTML = "+ Info";
      btnInfo.setAttribute("data-toggle", "modal");
      btnInfo.setAttribute("data-target", "#contactInfo");
      btnInfo.setAttribute("data-id", array[i].firstname);
      btnInfo.setAttribute("data-photo", array[i].image);
      if (array[i].email != null) {
        btnInfo.setAttribute("data-email", array[i].email);
      } else {
        btnInfo.setAttribute("data-email", "we do not have any contact info");
      }
       btnInfo.setAttribute("data-site", array[i].website);
       btnInfo.setAttribute("data-phone", array[i].phone);
       btnInfo.setAttribute("data-nick", array[i].address.city);
      // btnInfo.setAttribute("data-color", array[i].);
      getBtnId(btnInfo);
      td6.append(btnInfo);
      tr.append(td1, td2, td3, td4, td6);
      tbody.append(tr);
    }
  } else {
    console.log("no match found");
    document.getElementById("nomatch").style.display = "block";
    // table.innerHTML = "";
    // tbody.innerHTML = "";
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

function arrayCountries(data) {
  let filterCountry = document.getElementById("country");

  const countrySet = new Set();
  for (let i = 0; i < data.length; i++) {
    countrySet.add(data[i].address.country);
  }
  let uniqueItems = Array.from(new Set(countrySet));
  for (let j = 0; j < uniqueItems.length; j++) {
    let country = document.createElement("div");
    let inputCountry = document.createElement("input");
    inputCountry.setAttribute("type", "checkbox");
    inputCountry.setAttribute("id", uniqueItems[j]);
    inputCountry.setAttribute("value", uniqueItems[j]);

    // here a function that is called onchange is attached to each input of type checkbox
    inputCountry.onchange = function() {
      console.log("works");
      filteredByCountry(data);
    };

    let labelCountry = document.createElement("label");
    labelCountry.setAttribute("for", uniqueItems[j]);
    labelCountry.innerText = uniqueItems[j];
    country.append(inputCountry, labelCountry);
    filterCountry.append(country);
  }
}

function filteredPerson(array) {
  console.log("enters person function");

  // document.getElementsByTagName("input[type=checkbox]");
  let filtered = [];
  if (document.getElementById("filter_users").value !== "") {
    for (var i = 0; i < array.length; i++) {
      if (
        array[i].firstname
          .toLowerCase()
          .trim()
          .includes(
            document
              .getElementById("filter_users")
              .value.toLowerCase()
              .trim())
        //   ) ||
        // array[i].contact_info.nickName
        //   .toLowerCase()
        //   .trim()
        //   .includes(
        //     document
        //       .getElementById("filter_users")
        //       .value.toLowerCase()
        //       .trim()
        //   )
      ) {
        filtered.push(array[i]);
      }
    }

    orderByAge(filtered);
  } else {
    console.log("no input");
    orderByAge(array);
  }
}

function filteredByCountry(array) {
  console.log("enters de filterbycountry function");
  let inputs = document.getElementsByTagName("input");
  let arrChecked = [];
  let countryChecked = [];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "checkbox" && inputs[i].checked) {
      arrChecked.push(inputs[i].value);
    }
  }
  // console.log(arrChecked);

  if (arrChecked.length !== 0) {
    for (let k = 0; k < array.length; k++) {
      for (let j = 0; j < arrChecked.length; j++) {
        if (array[k].address.country === arrChecked[j]) {
          countryChecked.push(array[k]);
        }
      }
    }
    console.log(countryChecked);
    filteredPerson(countryChecked);
  } else {
    console.log(array);
    filteredPerson(array);
  }
}

function orderByAge(array) {
  console.log("enters order function");
  let selected = document.getElementById("order");
  if (selected.value == "Ascending") {
    array.sort(function(a, b) {
      return b.birthday.slice(0,4) - a.birthday.slice(0,4);
    });
    
    fillTable(array);
  } else if (selected.value == "Descending") {
    array.sort(function(a, b) {
      return a.birthday.slice(0,4) - b.birthday.slice(0,4);
    });
    fillTable(array);
  } else {
    fillTable(array);
  }
}

document.getElementById("reset").onclick = function() {
  document.getElementById("filter_users").value = "";
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == "checkbox") {
      inputs[i].checked = false;
    }
  }

  document.getElementById("order").value = "Select";
  fillTable(people);
};
