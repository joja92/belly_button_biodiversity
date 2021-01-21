function init() {
  // grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function buildMetadata(sample) {
  
  var meta_url = `/metadata/`+sample;
  // use `d3.json` to fetch the metadata for a sample
  // select the panel with id of `#sample-metadata`
  d3.json(meta_url).then(function(response) {
    console.log(response.WFREQ);
    var selector = d3.select("#sample-metadata");
    // clear any existing metadata
    selector.html("");
    // add each key and value pair to the panel
    Object.entries(response).forEach(function([key, value]) {
      //console.log(key, value);
      selector.append("div").html(`${key}: ${value}`);
    })
    // gauge build
    var trace3 = {
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: response.WFREQ,
      title: {
        text: "Belly Button Washing Frequency"
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 9]
        },
        steps: [
          { range: [0, 1], color: "#f2fbff" },
          { range: [1, 2], color: "#d6f1ff" },
          { range: [2, 3], color: "#b8e7ff" },
          { range: [3, 4], color: "#99ddff" },
          { range: [4, 5], color: "#7ad3ff" },
          { range: [5, 6], color: "#63ccff" },
          { range: [6, 7], color: "#4dc5ff" },
          { range: [7, 8], color: "#33bdff" },
          { range: [8, 9], color: "#14b3ff" }
        ],
      }
    }
    var data3 = [trace3];
    var layout3 = {
      width: 600,
      height: 500,
      margin: {
        t: 0,
        b: 0
      }
    }
    Plotly.newPlot('gauge', data3, layout3);

  })
}

function buildCharts(sample) {
  var sample_url = `/samples/`+sample;
  // use `d3.json` to fetch the sample data for the plots
  d3.json(sample_url).then(function(response) {
    console.log(response);
    var topIds = response.otu_ids.slice(0, 10);
    var topValues = response.sample_values.slice(0, 10);
    var topLabels = response.otu_labels.slice(0, 10);
    // Bubble Chart using the sample data
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
    // Pie Chart
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
  });
}

function optionChanged(newSample) {
  // fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// initialize the dashboard
init();
