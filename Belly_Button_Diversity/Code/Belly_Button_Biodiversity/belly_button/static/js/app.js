function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel
  var meta_url = `/metadata/`+sample;
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(meta_url).then(function(response) {
    console.log(response);
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]) {
      console.log(key, value);
      selector.append("div").html(`${key}: ${value}`);
    })
  })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var sample_url = `/samples/`+sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sample_url).then(function(response) {
    console.log(response);
    var topIds = response.otu_ids.slice(0, 10);
    var topValues = response.sample_values.slice(0, 10);
    var topLabels = response.otu_labels.slice(0, 10);
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      values: topValues,
      labels: topIds,
      type: 'pie',
      hoverinfo: topLabels
    };
    var data1 = [trace1];
    var layout1 = {
      height: 400,
      width: 500
    };
    Plotly.newPlot('pie', data1, layout1);
    // @TODO: Build a Pie Chart
    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };
    var data2 = [trace2];
    var layout2 = {
      title: 'OTU ID',
      showlegend: false,
      height: 500,
      width: 1000
    };
    Plotly.newPlot('bubble', data2, layout2);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
