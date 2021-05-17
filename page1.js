d3.csv("EstimatesOfBusiness2019VS2020.csv", types, function (error, data) {
    if (error) throw error;

    data.sort(function (a, b) {
        return b.change - a.change;
    });

    let margin = {top: 20, right: 80, bottom: 20, left: 80},
        width = 1200 - margin.left - margin.right,
        height = 850 - margin.top - margin.bottom;

    var svg = d3.select("#first_page").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.2);

    var tooltip = d3.select("#first_page")
        .append("div")
        .attr("class", "tooltip")
        .style('opacity', 0);


    x.domain(d3.extent(data, function (d) {
        return d.change;
    }));
    y.domain(data.map(function (d) {
        return d.estimates;
    }));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return d.change < 0 ? x(d.change) : x(0);
        })
        .attr("width", function (d) {
            return d.change < 0 ? x(d.change * -1) - x(0) : x(d.change) - x(0);
        })
        .attr("y", function (d) {
            return y(d.estimates);
        })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) {
            if (d.estimates === 'Building mat. and garden equip. and supplies dealers') {
                return "#3D550C";
            }
            return d.change < 0 ? "#d7191c" : "#1a9641";
        })
        .on("mousemove", function (d) {
            tooltip.transition().duration(200).style('opacity', 0.8);
            tooltip.html(`<span>${d.estimates}\n: ${(d3.format(".2f"))(d.change)}%</span>`)
                .style('left', `${d3.event.layerX }px`)
                .style('top', `${(d3.event.layerY + 150)}px`);
        })
        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

    svg.selectAll(".value")
        .data(data)
        .enter().append("text")
        .attr("class", "value")
        .attr("x", function (d) {
            if (d.change < 0) {
                return (x(d.change * -1) - x(0)) > 20 ? x(d.change) + 2 : x(d.change) - 1;
            } else {
                return (x(d.change) - x(0)) > 20 ? x(d.change) - 2 : x(d.change) + 1;
            }
        })
        .attr("y", function (d) {
            return y(d.estimates);
        })
        .attr("dy", y.bandwidth() - 2.55)
        .attr("text-anchor", function (d) {
            if (d.change < 0) {
                return (x(d.change * -1) - x(0)) > 20 ? "start" : "end";
            } else {
                return (x(d.change) - x(0)) > 20 ? "end" : "start";
            }
        })
        .style("fill", function (d) {
            if (d.change < 0) {
                return (x(d.change * -1) - x(0)) > 20 ? "#fff" : "#3a403d";
            } else {
                return (x(d.change) - x(0)) > 20 ? "#fff" : "#3a403d";
            }
        })
        .text(function (d) {
            return (d3.format(".2f"))(d.change) + "%";
        });

    svg.selectAll(".name")
        .data(data)
        .enter().append("text")
        .attr("class", "name")
        .attr("x", function (d) {
            return d.change < 0 ? x(0) + 2.55 : x(0) - 2.55
        })
        .attr("y", function (d) {
            return y(d.estimates);
        })
        .attr("dy", y.bandwidth() - 2.55)
        .attr("text-anchor", function (d) {
            return d.change < 0 ? "start" : "end";
        })
        .text(function (d) {
            return d.estimates;
        });

    svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", margin.top)
        .attr("y2", height - margin.top)
        .attr("stroke", "#3a403d")
        .attr("stroke-width", "1px");


    var Change = ['Retail Fall', 'Retail Rise', 'Garden Sale']
    var color = d3.scaleOrdinal()
        .domain(Change)
        .range(["#d7191c", "#3D550C", "#1a9641"])

    var legend = svg.selectAll(".legend")
        .data(Change)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", 10)
        .attr("y", 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 35)
        .attr("y", 108)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
            return d;
        });

    // main chart label
    svg.append("text")
        .attr("transform", `translate(${width / 2},${0})`)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Retail Sales Percentage Change During Covid-19(2020 vs 2019)")

});

function types(d) {
    d.change = +d.change;
    return d;
}
