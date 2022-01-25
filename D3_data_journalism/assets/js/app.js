function makeResponsive() {

    // select div id.
    var svgArea = d3.select("#scatter")
                    .select("svg");

    // clear out svg.
    if (!svgArea.empty()) {
         svgArea.remove();
    }

    // set up svg parameters to window size.
    var svgHeight = window.innerHeight / 1.5;
    var svgWidth = window.innerWidth / 1.5;

    // set up margins 
    var margin = {

        top: 50,
        right: 50,
        bottom: 100,
        left: 80

    };

    // set up the chart height and width according to svg size and margin size.
    var chartHeight = svgHeight - margin.top  - margin.bottom;
    var chartWidth  = svgWidth  - margin.left - margin.right;

    // select the wrapper
    // append a SVG group that will hold the chart
    // then shift the latter by left and top margins.
    var svg = d3.select("#scatter")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

    // append a SVG in the group div "g"
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // load data from data.csv
    d3.csv("assets/data/data.csv")
      .then(function (data) {

        // check if the data successfully loaded.
        console.log(data);

        // log a list of states using .map() function
        var states = data.map(state => state.state);
        console.log("states", states);

        // put each values that will be placed in the chart as integers using the unary + operator
        data.forEach(function (data) {

            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            data.income = +data.income;
            data.state = data.state;
            data.abbr = data.abbr;

            // check each values succesfully converted into integers.
            console.log("States: ", data.state);
            console.log("States Abbr: ", data.abbr)
            console.log("Healthcare: ", data.healthcare);
            console.log("Poverty Level: ", data.poverty);
            console.log("Age (Median): ", data.age);
            console.log("Smokes: ", data.smokes);
            console.log("Obesity Level: ", data.obesity);
            console.log("Income Level: ", data.income);

        })

        // create x and y linear scales 
        var xLinearScale = xScale(data, chosenXAxis, chartWidth);
        var yLinearScale = yScale(data, chosenYAxis, chartHeight);

        // create initial axis functions for each x and y linear scale
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis   = d3.axisLeft(yLinearScale);

        // append it to x-axis
        var xAxis = chartGroup.append("g")
                              .attr("transform", `translate(0, ${chartHeight})`)
                              .call(bottomAxis);

         // append it to y-axis
        var yAxis = chartGroup.append("g")
                              .call(leftAxis);

        
        // set up the data that will be used for circles
        var circlesGroup = chartGroup.selectAll("circle")
                                     .data(data);

        // bind data all together.
        // save it to the variable name 'elementInput'
        var elementInput = circlesGroup.enter();

        // create the circle element 
        var circle = elementInput.append("circle")
                                 .attr("cx", d => xLinearScale(d[chosenXAxis]))
                                 .attr("cy", d => yLinearScale(d[chosenYAxis]))
                                 .attr("r", 20)
                                 .classed("stateCircle", true);

        // create the states' abbr for each circles
        var circleInfo = elementInput.append("text")            
                                     .attr("x", d => xLinearScale(d[chosenXAxis]))
                                     .attr("y", d => yLinearScale(d[chosenYAxis]))
                                     .attr("dy", ".35em") 
                                     .text(d => d.abbr)
                                     .classed("stateText", true);

        // update each tooltip in the csv data using functions created above
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleInfo);
        
        // append the x-axis labels group
        var xLabelsGroup = chartGroup.append("g")
                                     .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        
        // add the x-axis labels
        var povertyLabel = xLabelsGroup.append("text")
                                       .attr("x", 0)
                                       .attr("y", 20)
                                       .attr("value", "poverty") // this is a value to grab for each event listener
                                       .classed("active", true)
                                       .text("In Poverty (%)");

        var ageLabel = xLabelsGroup.append("text")
                                   .attr("x", 0)
                                   .attr("y", 40)
                                   .attr("value", "age") // this is a value to grab for each event listener
                                   .classed("inactive", true)
                                   .text("Age (Median)");

        var incomeLabel = xLabelsGroup.append("text")
                                      .attr("x", 0)
                                      .attr("y", 60)
                                      .attr("value", "income") // this is a value to grab for each event listener
                                      .classed("inactive", true)
                                      .text("Household Income (Median)");

        // append y-axis label group
        var yLabelsGroup = chartGroup.append("g")
                                     .attr("transform", "rotate(-90)");

        // add the y-axis labels
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

        var obeseLabel = yLabelsGroup.append("text")
                                     .attr("x", 0 - (chartHeight / 2))
                                     .attr("y", 0 - margin.left)
                                     .attr("dy", "1em")
                                     .attr("value", "obesity")
                                     .classed("inactive", true)
                                     .text("Obese (%)");

        // create an event listener for x labels group
        xLabelsGroup.selectAll("text")
                    .on("click", function() {

                // first grab the x-axis label
                chosenXAxis = d3.select(this).attr("value");

                // update the xlinearscale
                xLinearScale = xScale(data, chosenXAxis, chartWidth);

                // render it out xAxis
                xAxis = renderXAxes(xLinearScale, xAxis);

                // create an if statement for each labels on every time when it clicks 
                // specific labels on the chart.
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
                } else if (chosenXAxis === "age") {
                    povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                } else {
                    povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    ageLabel
                            .classed("active", false)
                            .classed("inactive", true)
                    incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                }

                // update circles with new x-values when it clicked through each labels
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                
                // also, update the tooltips with the new popup descriptions
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleInfo);
                
                // update each circle info with new values when it clicked through each labels
                circleInfo = renderText(circleInfo, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            });

        // create an event listener for y labels group
        yLabelsGroup.selectAll("text")
                    .on("click", function() {

                // first grab the y-axis label
                chosenYAxis = d3.select(this).attr("value");

                // update the ylinearscale
                yLinearScale = yScale(data, chosenYAxis, chartHeight);

                // render it out yAxis
                yAxis = renderYAxes(yLinearScale, yAxis);

                // create an if statement for each labels on every time when it clicks 
                // specific labels on the chart.
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                } else if (chosenYAxis === "smokes"){
                    healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                } else {
                    healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    obeseLabel
                            .classed("active", true)
                            .classed("inactive", false);
                }

                // update circles with new y-values when it clicked through each labels
                circle = renderCircles(
                                       circlesGroup, 
                                       xLinearScale, 
                                       yLinearScale, 
                                       chosenXAxis, 
                                       chosenYAxis
                                       );

                // also, update the tooltips with the new popup descriptions
                circleInfo = renderText(
                                        circleInfo, 
                                        xLinearScale, 
                                        yLinearScale, 
                                        chosenXAxis, 
                                        chosenYAxis
                                        );

                // update each circle info with new values when it clicked through each labels
                circlesGroup = updateToolTip(
                                             chosenXAxis, 
                                             chosenYAxis, 
                                             circle, 
                                             circleInfo
                                             );
            });
    // this will catch any error during running the code.      
    }).catch(function(err) {
        console.log(err);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// Event listener for resizing content to the window size. 
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);