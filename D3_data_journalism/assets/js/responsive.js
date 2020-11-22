// Load data from data.csv
d3.csv("assets/data/data.csv").then(function (data) {

    // function for updating x-axis upon UX
    function xScale(data, clickedXAxis, width) {
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[clickedXAxis]) * 1.1])
            .range([0, width])
        return xLinearScale;
    }

    // function for updating axis label after clicked the axis 
    function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis)
        return xAxis;
    }


    // function for updating y-axis upon UX
    function yScale(data, clickedYAxis, width) {
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[clickedYAxis]) * 1.1])
            .range([0, width])
        return yLinearScale;
    }

    // function for updating axis label after clicked the axis 
    function renderYAxis(newYScale, yAxis) {
        var bottomAxis = d3.axisBottom(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis)
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
            .attr("x", data => newXScale(data[chosenXAxis]))
            .attr("y", data => newYScale(data[chosenYAxis]));
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
}

})