// let lineChart;

window.addEventListener("load", function() {
  // var helloModal = document.getElementById("helloModal");
  // openModal();
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
    isConnected = true;
  });
  socket.on("disconnect", () => {
    isConnected = false;
  });

  document.getElementById("bmi_button").onclick = function() {
    let height = document.getElementById("height").value;
    console.log(height);

    let weight = socket.emit("get_weight_please", (weight) => {
      console.log("weight = " + weight);
      let bmi = weight / ((height) * (height));
      console.log("bmi is = " + bmi);
      document.getElementById("bmi").innerHTML = Math.round(bmi*10)/10;
      openModal();
      setTimeout(() => { closeModal() }, 10000)
    });
  }
  // Get the modal
  var helloModal = document.getElementById("helloModal");

  function openModal() {
    helloModal.style.display = "block";
  }
  function closeModal() {
    helloModal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it 
  window.onclick = function(event) {
    if (event.target == helloModal) {
      console.log("clicked on");
      helloModal.style.display = "none";
    }
  }
})