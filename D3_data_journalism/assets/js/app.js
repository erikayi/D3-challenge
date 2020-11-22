// @TODO: YOUR CODE HERE!

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function (data) {

    console.log(data);

    // log a list of states
    var states = data.map(state => state.state);
    console.log("states", states);

    // Cast each healthcare values in the data as a number using the unary + operator
    data.forEach(function (data) {
        data.healthcare = +data.healthcare;
        console.log("States:", data.state);
        console.log("Healthcare:", data.healthcare);
    });

    // Put each poverty values in the data as a number using the unary + operator
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.state = data.state;
        data.abbr = data.abbr;
        console.log("States: ", data.state);
        console.log("States Abbr: ", data.abbr)
        console.log("Healthcare: ", data.healthcare);
        console.log("Poverty Level: ", data.poverty);
        console.log("Age (Median): ", data.age);
        console.log("Smokes: ", data.smokes);
        console.log("Obesity Level: ", data.obesity);
        console.log("Income Level: ", data.income);
    })

    /////////////////////////////////////////////////////////////////////////////////
    ///////////////////// poverty vs healthcare plot goes here //////////////////////
    /////////////////////////////////////////////////////////////////////////////////

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 50, bottom: 40, left: 50 },
        width = 720 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add the grey background that makes ggplot2 famous
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", height)
        .style("fill", "EBEBEB")
        .style("opacity", 0.7)


    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.poverty)])
        .range([0, width])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(8))
        .select(".domain").remove()

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.healthcare)])
        .range([height, 0])
        .nice()
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(12))
        .select(".domain").remove()

    // Customization
    svg.selectAll(".tick line").attr("stroke", "white")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left / 2 - 150)
        .attr("y", height + margin.top + 20)
        .text("In Poverty (%)");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 - 20)
        .text("Lacks Healthcare (%)")

    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
        .domain(["virginica"])
        .range(["#619CFF"])

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.healthcare))
        .attr("r", 20)
        .style("fill", d => color(d.state))
        .style("opacity", 0.25)

    // Add State labels to the points

    // This is my code for the state abbr labels on the points, but it did not worked.
    // var circleLabels = chartGroup.selectAll("null")
    //                              .data(data)
    //                              .enter()
    //                              .append("text");

    // circleLabels.attr("x", d => d.poverty)
    //             .attr("y", d => d.healthcare)
    //             .text(d => d.abbr)
    //             .attr("font-family", "sans-serif")
    //             .attr("font-size", "5px")
    //             .attr("fill", "white");

    // We don't need these because we already created one for x and y axis label for the chart.
    // Append axes to the chart
    // chartGroup.append("g")
    //           .attr("transform", `translate(0, ${height})`)
    //           .call(x);

    // chartGroup.append("g")
    //           .call(y);

    // Create circle labels
    var circlesGroup = svg.selectAll("Circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", "0.5");

    var circleLabels = svg.selectAll(null)
        .data(data)
        .enter()
        .append("text");

    circleLabels.attr("x", d => x(d.poverty))
        .attr("y", d => y(d.healthcare))
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");


    // We do not need labels twice.

    // Append the labels for the chart
    // chartGroup.append("text")
    //           .attr("transform", `translate(${width / 2}, ${height})`)
    //           .attr("class", "axisText")
    //           .text("In Poverty (%)");

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////// poverty vs healthcare plot ends here ///////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////// age (median) vs Smokes (%) start here //////////////////////
    //////////////////////////////////////////////////////////////////////////////////
 
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.age)])
        .range([0, width])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(8))
        .select(".domain").remove()

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.smokes)])
        .range([height, 0])
        .nice()
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(12))
        .select(".domain").remove()

    // Customization
    svg.selectAll(".tick line").attr("stroke", "white")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left / 2 + 5)
        .attr("y", height + margin.top + 20)
        .text("Age (Median)");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 + 85)
        .text("Smoke (%)")

    //////////////////////////////////////////////////////////////////////////////////
    //////////////////// household income vs Obese (%) start here ////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.income)])
        .range([0, width])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(8))
        .select(".domain").remove()

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, data => data.obesity)])
        .range([height, 0])
        .nice()
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(12))
        .select(".domain").remove()

    // Customization
    svg.selectAll(".tick line").attr("stroke", "white")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left / 2 + 255)
        .attr("y", height + margin.top + 20)
        .text("Household Income (Median)");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 + 190)
        .text("Obese (%)")

    //////////////////////////////////////////////////////////////////////////////////
    //////////////////// household income vs Obese (%) ends here /////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    // x-axis label animation


})



