let submitForm = $("#login-form");
let username = $("#username");
let password = $("#password");

let baseUrl = `https://fakestoreapi.com`;

// ----------------- Login action ------------------

async function authorization() {
  const user = {
    username: username.value,
    password: password.value,
  };
  console.log(username.value);

  try {
    if (
      user.password.trim().length === 0 ||
      user.username.trim().length === 0
    ) {
      alert("Please fill all the fields");
    } else {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await response.json();

      localStorage.setItem("token", result.token);
      if (localStorage.getItem("token")) {
        window.location.href = "../main.html";
      }
    }
  } catch (err) {
    alert(err.message)
    console.log("this is problem:", err);
  }
}

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  authorization();
});
