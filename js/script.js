[[10.5,1677431920],[64,1677431920],[54,1677431920],[45,1677431920],[95,1677431920],[67,1677431920]]


//   var yValues = [67,68,67,69,69,70,70,70,71,70,72,73,73,71,72,73,74,74,75,75,74,76,75,76,77,77,77,77,78,79, 80];
// var xValues = ["27/01","28/01","29/01","30/01","31/01","01/02","02/02","03/02","04/02","05/02","06/02","07/02","08/02","09/02","10/02","11/02","12/02","13/02","14/02","15/02","16/02","17/02","18/02","19/02","20/02","21/02","22/02","23/02","24/02","25/02","26/02"];

//formats them to give the most recent 7 (week)
try{
  var xGiven = xValues.slice(-7);
  var yGiven = yValues.slice(-7);
}
catch(err){ //if array is less than a week just use the whole array
  var xGiven = xValues;
  var yGiven = yValues;
}

//gets the average and creates an array of just it
var avg = yGiven.reduce((a, b) => a + b, 0) / xGiven.length;
var avgArr = new Array(yGiven.length).fill(Math.round(avg*10)/10);

//creating the chart (ctx gets the myChart part in weight.html)
var myChart = new Chart(document.getElementById('myChart').getContext('2d'), { //possible issue with chart meaning myChart points to null
  type: "line",
  data: {
    labels: xGiven,
    datasets: [{
      fill: false,
      borderColor: "red",
      data: yGiven
    }, {
           label: 'Average',
           fill: false,
           data: avgArr,
           type: 'line',
           // this dataset is drawn on top
           order: 1
       }]
  },
  options: {
    scales: {
      yAxes: [{
        scaleLabel: {
        display: true,
        labelString: 'weight / Kg'
      }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'date'
        }
      }]
    },
    legend: {display: false},
    title: {
      display: true,
      text: "Weight Graph"
    } 
  }
});




var yValues = [67,68,67,69,69,70,70,70,71,70,72,73,73,71,72,73,74,74,75,75,74,76,75,76,77,77,77,77,78,79];
var xValues = ["28/01","29/01","30/01","31/01","01/02","02/02","03/02","04/02","05/02","06/02","07/02","08/02","09/02","10/02","11/02","12/02","13/02","14/02","15/02","16/02","17/02","18/02","19/02","20/02","21/02","22/02","23/02","24/02","25/02","26/02"];

//function changes the graph for the timeframe
function timing(myChart){ //change this sections when you have dates to go off date
  var range = document.getElementById("timeRange").value;
  if(range == "week"){
    try{
      var xGiven = xValues.slice(-7);
      var yGiven = yValues.slice(-7);
    }
    catch(err){
      var xGiven = xValues;
      var yGiven = yValues;
    }
  }
  else if(range == "month"){ 
    try{
      var xGiven = xValues.slice(-30);
      var yGiven = yValues.slice(-30);
    }
    catch(err){
      var xGiven = xValues;
      var yGiven = yValues;
    }
  }
  else if(range == "sixMonth"){
    try{
      var xGiven = xValues.slice(-180);
      var yGiven = yValues.slice(-180);
    }
    catch(err){
      var xGiven = xValues;
      var yGiven = yValues;
    }
  }
  console.log(range);
  var avg = yGiven.reduce((a, b) => a + b, 0) / xGiven.length;
  var avgArr = new Array(yGiven.length).fill(Math.round(avg*10)/10);
  myChart.config.data.labels = xGiven;
  myChart.data.datasets[0].data = yGiven;
  myChart.data.datasets[1].data = avgArr;
  myChart.update();
}