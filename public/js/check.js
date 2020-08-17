function check() {
  var a = document.getElementById("e").value;
  if (a < 18) {
    alert("Age must be greater than 18");
  } else {
    goContactPage();
  }
}
