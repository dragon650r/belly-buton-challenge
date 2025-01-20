const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to build the charts (Bar chart & Bubble chart)
function buildCharts(sample) {
  d3.json(url).then((data) => {
    const samples = data.samples;
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Bar chart
    const barData = [{
      x: result.sample_values.slice(0, 10).reverse(),
      y: result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: result.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 OTUs Found"
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart
    const bubbleData = [{
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: "Earth"
      }
    }];

    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to display the metadata (demographic info)
function displayMetadata(sample) {
  d3.json(url).then((data) => {
    const metadata = data.metadata;
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    const panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to handle changes when a new sample is selected
function optionChanged(newSample) {
  buildCharts(newSample);
  displayMetadata(newSample);
}

// Function to initialize the dashboard
function init() {
  const selector = d3.select("#selDataset");

  d3.json(url).then((data) => {
    const sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    displayMetadata(firstSample);
  });
}

// Initialize the dashboard
init();