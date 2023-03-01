window.addEventListener("load", function() {
  // show return output in console
  const ack = function(message) {
    console.log(message);
  };

  // global variable to keep track of connection status
  let isConnected;
  let socket;
  // create socket connection at 4000 port on same host
  let address = window.location.host.split(":")[0] + ":4000";
  console.log(address);
  socket = io(address);

  // maintain the isConnected Global variable
  isConnected = false;
  socket.on("connect", () => {
    ack("connected to server");
    isConnected = true;
  });
  socket.on("disconnect", () => {
    isConnected = false;
    ack("disconnected from server");
  });

  document.getElementById("set_button").onclick = function(e) {
    if (isConnected) {
      let time = document.getElementById("set_alarm_time");
      socket.emit("set_alarm_time", time.value, ack);
      document.getElementById("set_alarm_time").value = '';
    }
  }
  setInterval(() => {
    socket.emit("check_alarm_time");
  }, 1000);
});

