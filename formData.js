let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let formData = new FormData(form);

  //добавление в formData
  formData.append("example", "blablabla");

  // 3 базовых get/has/delete

  console.log(Object.fromEntries(formData));
});
