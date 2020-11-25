// set up default values for x and y axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale variable when it clicked on the x-axis label
function xScale(data, chosenXAxis, chartWidth) {

    // create xlinearscale for x-axis values
    var xLinearScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d[chosenXAxis])*0.8, 
                                d3.max(data, d => d[chosenXAxis])*1.2])
                         .range([0, chartWidth]);

    return xLinearScale;

}

// function used for updating y-scale variable when it clicked on the y-axis label
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale);

                  xAxis.transition()
                       .duration(1000)
                       .call(bottomAxis);

    return xAxis;
}

// Function used for updating y-scale var upon click on axis label.
function yScale(data, chosenYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])*0.8, 
                 d3.max(data, d => d[chosenYAxis])*1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}
// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}
// Function used for updating circles group with a transition to new circles.
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
// Function used for updating text in circles group with a transition to new text.
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return circletextGroup;
}
// Function used for updating circles group with new tooltip.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    // Conditional for X Axis.
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty (%): ";
    } else if (chosenXAxis === "income") {
        var xlabel = "Income (Median): "
    } else {
        var xlabel = "Age (Median): "
    }
    // Conditional for Y Axis.
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare (%): ";
    } else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes (%): "
    } else {
        var ylabel = "Obese (%): "
    }
    // Define tooltip.
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenXAxis === "age") {
                // All yAxis tooltip labels presented and formated as %.
                // Display Age without format for xAxis.
                return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                // Display Income in dollars for xAxis.
                return (`${d.state}<br>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } else {
                // Display Poverty as percentage for xAxis.
                return (`${d.state}<br>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                }      
        });
    circlesGroup.call(toolTip);
    // Create "mouseover" event listener to display tool tip.
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}