import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// show return output in console
const ack = function(message) {
  console.log(message);
};

// global variable to keep track of connection status
let isConnected;
let socket;
// create socket connection at 4000 port on same host
let address = window.location.host.split(":")[0] + ":4000"
console.log(address)
socket = io(address);

// maintain the isConnected Global variable
isConnected = false;
socket.on("connect", () => {
  ack("connected to server");
  isConnected = true;
  socket.on("update_data", update_data);
});
socket.on("disconnect", () => {
  isConnected = false;
  ack("disconnected from server");
});

document.getElementById("add_weight").onclick = function() {
  if (isConnected) {
    socket.emit("add_weight", ack);
  }
};

document.getElementById("alarm_time").onchange = function(e) {
  if (isConnected) {
    socket.emit("set_alarm_time", e.target.value, ack);
  }
}

document.getElementById("alarm_toggle").onchange = function(e) {
  if (isConnected) {
    socket.emit("set_alarm_toggle", e.target.checked);
  }
}

document.getElementById("trigger_alarm").onclick = function(e {
  if (isConnected) {
  socket.emit("trigger_alarm");
}
}

function update_data(data) {
  let weights = []
  let labels = []
  for (let i of data) {
    weights.push(i[0]);
    labels.push(i[1])
  }
  console.log(weights)
  console.log(labels)
  lineChart.data.datasets[0].data = weights
  lineChart.data.labels = labels
  lineChart.update()
};