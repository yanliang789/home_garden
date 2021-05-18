d3.csv("data/top_rise_retail_sales2020and2019.csv", function (data) {
    let margin = {top:80, right: 60, bottom: 50, left: 150},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#third_page')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var subgroups = data.columns.slice(1)
    const tip = d3.tip().html(function (d) {
       return d.key + '<hr/> ' +  (d3.format(".2f"))(d.value) + '%';
    })

    var months = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.kind)}).keys()

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .style("font", "16px times")
        .attr("transform", "translate(0," + height+ ")")
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 40])
        .range([ height, 0 ]);
    svg.append("g")
        .style("font", "16px times")
        .call(d3.axisLeft(y));

    svg.call(tip);
// Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e5f5f9','#99d8c9','#2ca25f'])

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.kind) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    var legend = svg.selectAll(".legend")
        .data(months)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", -35)
        .attr("text-anchor", "middle")
        .text("The rise percentage")

    // x-axis title
    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + 40})`)
        .attr("text-anchor", "middle")
        .text("Category")

    // main chart label
    svg.append("text")
        .attr("transform", `translate(${width / 2},${10})`)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("The Top Retail Sales Rise During Covid-19(2019 VS 2020)")
})