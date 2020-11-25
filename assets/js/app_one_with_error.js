// Set default x/y axis variables.
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
// Function used for updating x-scale var upon click on axis label.
function xScale(data, chosenXAxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
            d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}
// Function used for updating xAxis var upon click on axis label.
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
        .domain([d3.min(data, d => d[chosenYAxis]) * .8,
            d3.max(data, d => d[chosenYAxis]) * 1.2])
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
        var xlabel = "Poverty: ";
    } else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    } else {
        var xlabel = "Age: "
    }
    // Conditional for Y Axis.
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    } else {
        var ylabel = "Obesity: "
    }
    // Define tooltip.
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenXAxis === "age") {
                // All yAxis tooltip labels presented and formated as %.
                // Display Age without format for xAxis.
                return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                // Display Income in dollars for xAxis.
                return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                } else {
                // Display Poverty as percentage for xAxis.
                return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
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

function makeResponsive() {

    // append div classed chart to the scatter element in html tag
    var svgArea = d3.select("#scatter").select("svg");

    // Clear SVG
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // set image dimensions 
    var svgHeight = window.innerHeight/1.2;
    var svgWidth = window.innerWidth/1.7;

    // set borders for the SVG
    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 80
    };

    // create the width and height using the margins and parameters
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // append an svg element to the chart with the appropriate height and width 
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // append svg group to the g element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load data from data.csv
    d3.csv("assets/data/data.csv").then(function (data) {

        console.log(data);

        // log a list of states
        var states = data.map(state => state.state);
        console.log("states", states);

        // Put each poverty values in the data as a number using the unary + operator
        data.forEach(function (data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
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

        // Create Linear scales
        var xLinearScale = xScale(data, chosenXAxis, chartWidth);
        var yLinearScale = yScale(data, chosenYAxis, chartHeight);

        // create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x-axis
        var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(data);

        // bind data.
        var elemEnter = circlesGroup.enter();

        var circle = elemEnter.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

        console.log(circle);

        // Create circle text
           var circleText = elemEnter.append("text")            
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", ".35em") 
            .text(d => d.abbr)
            .classed("stateText", true);

        // update tooltip function with the data
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);

        // create group for 3 x-axis labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

            console.log(xLabelsGroup);

        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");
        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");
        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        // create group for y-axis labels for all three
        var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

        var healthcareLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 40 - margin.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Lacks Healthcare (%)");
        var smokesLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 20 - margin.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes (%)");
        var obesityLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obese (%)");

        // create event listener for x-axis labels
        xLabelsGroup.selectAll("text")
        .on("click", function() {

                // Get the value of the selected label
                chosenXAxis = d3.select(this).attr("value");

                // Update X-Scale for the new data
                xLinearScale = xScale(data, chosenXAxis, chartWidth);

                // Update X-Axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Switch active/inactive labels.
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

                // Update circles with new x values
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);

                // Update circles info with new values.
                circleInfo = renderText(circleText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            });

        // Create Event Listener for Y-Axis
        yLabelsGroup.selectAll("text")
            .on("click", function () {

                // Get the value of the selection
                chosenYAxis = d3.select(this).attr("value");

                // Update Y-Scale for the new data
                yLinearScale = yScale(data, chosenYAxis, chartHeight);

                // Update Y-Axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Change classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

                // Update circles with new Y-Values
                circle = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update Text values with the new Y-Axis Values
                textGroup = renderText(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update ToolTips with new data
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);

            });

    }).catch(function (err) {
        console.log(err);
    });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// Event listener for resizing content to the window size. 
// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);
