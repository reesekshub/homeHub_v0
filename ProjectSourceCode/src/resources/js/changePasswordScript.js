const formEl = document.getElementById("passForm")
const buttonEl = document.getElementById("passButton")
const newPasswordEl = document.getElementById("newPassword")
const confirmPasswordEl = document.getElementById("confirmPassword")
const toolTipEl = document.getElementById("tooltip")
buttonEl.setAttribute("disabled", true)
confirmPasswordEl.addEventListener("keyup", checkPassword)


function checkPassword() {
    var newPassword = newPasswordEl.value
    var confirmPassword = confirmPasswordEl.value
    console.log(newPassword, confirmPassword)
    if (newPassword === confirmPassword) {
        buttonEl.removeAttribute("disabled")
        toolTipEl.innerText = ""
    } else {
        toolTipEl.innerText = "Passwords don't match"
    }





}