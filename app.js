const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
let activeJob = null;

function save() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function showJobs() {
  document.getElementById("viewJobs").classList.remove("hidden");
  document.getElementById("viewJob").classList.add("hidden");

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  jobs.forEach((job, i) => {
    const div = document.createElement("div");
    div.textContent = job.name || "Untitled Job";
    div.onclick = () => openJob(i);
    list.appendChild(div);
  });

  document.getElementById("jobsEmpty").style.display = jobs.length ? "none" : "block";
}

function openJob(i) {
  activeJob = i;
  const job = jobs[i];

  document.getElementById("viewJobs").classList.add("hidden");
  document.getElementById("viewJob").classList.remove("hidden");

  job.materials ||= [];
  job.workers ||= [];

  document.getElementById("jobName").value = job.name || "";
  document.getElementById("jobTimelineNotes").value = job.timeline || "";
  document.getElementById("laborHours").value = job.laborHours || 0;
  document.getElementById("laborRate").value = job.laborRate || 0;
  document.getElementById("customerPrice").value = job.price || 0;

  render();
}

function newJob() {
  jobs.push({ materials: [], workers: [] });
  save();
  openJob(jobs.length - 1);
}

function render() {
  const job = jobs[activeJob];

  job.name = document.getElementById("jobName").value;
  job.timeline = document.getElementById("jobTimelineNotes").value;
  job.laborHours = Number(document.getElementById("laborHours").value);
  job.laborRate = Number(document.getElementById("laborRate").value);
  job.price = Number(document.getElementById("customerPrice").value);

  const matDiv = document.getElementById("materialsBody");
  matDiv.innerHTML = "";
  let matTotal = 0;

  job.materials.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "material-row";
    row.innerHTML = `
      <input placeholder="Item" value="${m.name || ""}">
      <input type="number" placeholder="Qty" value="${m.qty || 0}">
      <input type="number" placeholder="$" value="${m.cost || 0}">
      <button onclick="removeMaterial(${i})">✕</button>
    `;
    const [n, q, c] = row.querySelectorAll("input");
    n.oninput = () => m.name = n.value;
    q.oninput = () => m.qty = Number(q.value);
    c.oninput = () => m.cost = Number(c.value);
    matTotal += (m.qty || 0) * (m.cost || 0);
    matDiv.appendChild(row);
  });

  document.getElementById("materialsTotal").textContent = money(matTotal);

  const laborTotal = job.laborHours * job.laborRate;
  const totalCost = matTotal + laborTotal;
  const profit = job.price - totalCost;

  document.getElementById("sumCost").textContent = money(totalCost);
  document.getElementById("sumProfit").textContent = money(profit);

  save();
}

function removeMaterial(i) {
  jobs[activeJob].materials.splice(i, 1);
  render();
}

document.getElementById("btnNewJob").onclick = newJob;
document.getElementById("btnBack").onclick = showJobs;
document.getElementById("btnAddMaterial").onclick = () => {
  jobs[activeJob].materials.push({});
  render();
};

document.querySelectorAll("input").forEach(i => i.oninput = render);

showJobs();
