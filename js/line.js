let lineChart;

window.addEventListener("load", function() {
  lineChart = new Chart("lineChart", {
    type: "line",
    data: {
      labels: //[1677431920,1677431920,1677431920,1676067120,1677431920,1677431920,1676827100]
        [],
      datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "white",
        backgroundColor: "rgba(255, 255, 255, 0.25)", // Update background color here
        data: 
          //[10.5,64,54,45,95,67,71]
          [],
      }]
    },
    options: {
      responsive: true,
      legend: { display: false }, plugins: {
        title: {
          display: true,
          text: 'Custom Chart Title'
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontColor: 'white',
            fontSize: 25
          },
          ticks: {
            display: true,
            fontColor: "white",

          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Weight / Kg',
            fontColor: 'white',
            fontSize: 25
          },
          ticks: {
            display: true,
            fontColor: "white",
          },
        }],
      },
    }
  });
});

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

  setInterval(() => {
    socket.emit("get_data", update_data);
  }, 1000);

  function update_data(data) {
    let range = document.getElementById("selector").value;
    let weights = [];
    let weightsFiltered = [];
    let labels = [];
    let labelsFiltered = [];
    for (var i of data) {
      weights.push(i[0]);
      labels.push(i[1]);
    }
    if(range === "all"){
      weightsFiltered = weights;
      labelsFiltered = labels;
    }else if (range === "weekly"){
      let x = labels[labels.length-1] - 604800;
      for (i of data){
        if(i[1] >= x){
          weightsFiltered.push(i[0]);
          labelsFiltered.push(i[1]);
        }
      }
    }else if (range === "monthly"){
      let x = labels[labels.length-1] - 2630000;
      for (i of data){
        if(i[1] >= x){
          weightsFiltered.push(i[0]);
          labelsFiltered.push(i[1]);
        }
      }
    }
    var date = [];
    for (let i of labelsFiltered){
      date.push((new Date(i * 1000)).toLocaleDateString("en-GB"))
    }
    
    lineChart.data.datasets[0].data = weightsFiltered;
    lineChart.data.labels = date;
    lineChart.update();
  }
  
  // -- comment this out 
  document.getElementById("cars").onchange = function(e){
    console.log(e.target.value);
    // update_data(weights.csv);
    var range = "monthly";
    console.log("triggering");
    let values = [[10.5,1677431920],[64,1677431920],[54,1677431920],[45,1676067120],[95,1677431920],[67,1677431920],[71,1676827100]]
    update_data(values, range);
    
  }

  document.getElementById("trigger_alarm").onclick = function() {
    console.log("triggering");
    if (isConnected) {
      socket.emit("trigger_alarm");
    }
  };
  // -- comment this out

  setInterval(() => {
    socket.emit("check_alarm_time");
  }, 1000);


  document.getElementById("trigger_alarm").onclick = function() {
    socket.emit("trigger_alarm")
  }
});