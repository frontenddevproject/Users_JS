const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const cityInput = document.querySelector("#city");
const createButton = document.querySelector("#create");
const usersSection = document.querySelector("#users-section");
const searchInput = document.querySelector("#search");
const sortingByNameCheckbox = document.querySelector("#sort-by-name");
const sortingByAgeCheckbox = document.querySelector("#sort-by-age");
const placeholderSpan = [...document.querySelectorAll(".placeholder-span")];
const paginationSection = document.querySelector("#pagination");

let users = [
   { id: generateId(), name: "Igor", city: "Kyiv", age: 20 },
   { id: generateId(), name: "Alex", city: "Donetsk", age: 50 },
   { id: generateId(), name: "Oleg", city: "Kharkiv", age: 10 },
   { id: generateId(), name: "Vasya", city: "Poltava", age: 20 },
   { id: generateId(), name: "John", city: "New York", age: 50 },
   { id: generateId(), name: "Bob", city: "Amsterdam", age: 40 },
   { id: generateId(), name: "Iren", city: "Berlin", age: 20 },
   { id: generateId(), name: "Bler", city: "Kyiv", age: 50 },
   { id: generateId(), name: "Olga", city: "Kyiv", age: 18 },
   { id: generateId(), name: "Inna", city: "Kyiv", age: 10 },
];

function generateId (length = 10) {
   let id = "";
   const symbols = "0123456789mnbvcxzlkjhgfdsapoiuytrewq";
 
   for (let i = 0; i < length; i++) {
     id += symbols[Math.floor(Math.random() * symbols.length )]
   }
   
   return id;
 }

let changingUsersData = undefined;
let paginationPageNumber = 0;

renderUsers ();

const deleteUser = (userId) => {
   users = users.filter((user) => user.id !== userId);
   renderUsers();
}

const editUser = (userId) => {
   const userToEdit = users.find((user) => user.id === userId);
   const indexOfEditingUser = users.findIndex((user) => user.id === userId);
 
   changingUsersData = {data: userToEdit, index: indexOfEditingUser};
 
   createButton.textContent = "Save changes";
 
   nameInput.value = changingUsersData.data.name;
   ageInput.value = changingUsersData.data.age;
   cityInput.value = changingUsersData.data.city;
 };

function renderPagination (usersQuantity) {
   paginationSection.innerHTML = "";
 
   for ( let i = 0; i < usersQuantity / 3; i++ ) {
     const button = document.createElement("button");
     button.textContent = i;
     button.onclick = () => {
       paginationPageNumber = i;
       const groupedUsers = groupElementsOfArray(users, 3);
       renderUsers();
     }
     paginationSection.appendChild(button);
   }
};
const sorting = {
   names: () => {
      const usersCopy = [...users];
      usersCopy.sort((user1, user2) => user1.name.localeCompare(user2.name));
      renderUsers(usersCopy);
   },
   ages: () => {
      const usersCopy = [...users];
      usersCopy.sort((user1, user2) => {
        if (user1.age > user2.age) {
         return 1;
        } if (user1.age < user2.age) {
         return -1;
        } 
        return 0;
      });
      renderUsers(usersCopy);
   }
};

function renderUsers(usersToRender = groupElementsOfArray(users, 3)[paginationPageNumber]) {
   renderPagination(users.length);

   usersSection.innerHTML = "";

   const usersContent = usersToRender.map((user) => `<div class="user-card">
      <span>name:</span><span> ${user.name}</span>
      <span>age:</span><span> ${user.age}</span>
      <span>city:</span><span> ${user.city}</span>
      <button class="deleteButton" id="${user.id}">X</button>
      <button class="edit-user-button" id="${user.id}"><img src="img/edit-user.png"></button>
   </div>`);
   
   usersContent.forEach((userLayout) => {
      usersSection.innerHTML += userLayout;
   }); 

   const deleteButtons = [...document.querySelectorAll(".deleteButton")];
   deleteButtons.forEach((button, i) => {
      button.onclick = () => deleteUser(button.id);
   })

   const editButtons = [...document.querySelectorAll(".edit-user-button")];

   editButtons.forEach((button) => {
      button.onclick = () => {
         editUser(button.id)
         placeholderSpan.forEach((placeholderSpan) => placeholderSpan.classList.add("focused"));
      };
   })

}

   createButton.onclick = () => {
      const name = nameInput.value.at(0).toUpperCase() + nameInput.value.slice(1).toLowerCase();
      const age = +ageInput.value;
      const city = cityInput.value.at(0).toUpperCase() + cityInput.value.slice(1).toLowerCase();

      if (!name || !age || !city) {
         return alert("Please enter all required data");
        }

      if (changingUsersData) {
         users[changingUsersData.index] = {
            ...users[changingUsersData.index],
            name: name,
            age: age,
            city: city,
      };

         changingUsersData = undefined;
         placeholderSpan.forEach((placeholderSpan) => placeholderSpan.classList.remove("focused"));
         createButton.textContent = "Create User";
      }
         else {
            const user = { id: generateId(), name: name, age: age, city: city };
            users.push(user);
         }

      nameInput.value = "";
      ageInput.value = "";
      cityInput.value = "";

      renderUsers();
   
}

searchInput.oninput = (event) => {
   if (!event.target.value) return renderUsers();

   const usersToRender = users.filter(({name, age, city}) => 
      [name, age.toString(), city].some((element) => 
         element.includes(event.target.value)
      )
   );

   renderUsers(usersToRender);
};

sortingByNameCheckbox.onchange = (event) => {
   if (event.target.checked) {
      sortingByAgeCheckbox.checked = false;
      sorting.names();   
   } else {
      renderUsers();
   }
}

sortingByAgeCheckbox.onchange = (event) => {
   if (event.target.checked) {
      sortingByNameCheckbox.checked = false;
      sorting.ages();
   } else {
      renderUsers();
   }
}
function groupElementsOfArray (arr, oneSetQuantity) {
   const result = [];

   for (let i = 0; i < arr.length; i++) {
     result.push(arr.slice(i * oneSetQuantity, (i + 1) * oneSetQuantity));
   }
   return result.filter((arr) => arr.length > 0 );
 }
