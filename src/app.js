import axios from "axios";
import form from "./form";
import result from "./result";
import "./app.css";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get('/api/users');
  console.log(res);
  document.body.innerHTML = (res.data || []).map(user => {
    return `<div>${user.id}: ${user.name}</div>`
  }).join('')

  const formEl = document.createElement("div");
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  const resultEl = document.createElement("div");
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl);

})
