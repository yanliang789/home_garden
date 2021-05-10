d3.csv("EstimatesOfBusiness2019VS2020.csv", function (data) {
    let margin = {top:20, right: 80, bottom: 100, left: 80},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;


    let svg =  d3.select("#first_page")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let padding = 8;

    let bar = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    console.log(data);
    //
    var tooltip = d3.select("#first_page")
        .append("div")
        .attr("class", "tooltip")
        .style('opacity', 0);

    let bar_width = width / data.length;

    // Add X axis for
    let x = d3.scaleBand()
        .range([0, width])
        .domain([0, data.length])
    bar.append("g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.axisBottom(x).tickFormat(function (d) {
            return d.estimates;
        }))
    // Add Y axis
    let y = d3.scaleLinear()
        .domain([-100, 100])
        .range([height, 0])
    bar.append("g")
        .call(d3.axisLeft(y));
    
   //color legend
    var Change = ['Retail Rise', 'Garden Sale', 'Retail Fall']
    var color = d3.scaleOrdinal()
        .domain(Change)
        .range(['#6D8700','#1E5631','#D1193E'])
     var legend = svg.selectAll(".legend")
        .data(Change)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 10)
        .attr("y", 50)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 16)
        .attr("y", 58)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    // Add rects
    bar.append('g')
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .sort(function (a, b) {
            return a.change - b.change;
        })
        .attr("class", "rects")
        .attr("y", function (d) {
            if (d.change >= 0) {
                return y(d.change);
            }
            return height / 2;
        })
        .attr("height", function (d) {
            if (d.change > 0) {
                return height / 2 - y(d.change);
            } else {
                return -height / 2 + y(d.change);
            }
        })
        .attr("width", bar_width - padding)
        .attr('transform', function (d, i) {
            let position = [bar_width * i + padding, 0];
            return 'translate(' + position + ')';
        })
        .attr("fill", function (d) {
            if (d.estimates === 'Building mat. and garden equip. and supplies dealers'){
                return '#1E5631';
            } else if(d.change > 0 ){
                return '#6D8700';
            }
            return '#D1193E';
        })
        .on("mousemove", function (d) {
            tooltip.transition().duration(200).style('opacity', 0.7);
            tooltip.html(`<span>${d.estimates}<hr> Change: ${(d3.format(".2f"))(d.change)}%</span>`)
                .style('left', `${d3.event.layerX  - 50}px`)
                .style('top', `${(d3.event.layerY + 150)}px`);
        })
        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));
    //Y axis text
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2 - margin.top - margin.bottom)
        .attr("y", 20)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Retail Sales Rise During Covid-19");

    // main chart label
    svg.append("text")
        .attr("transform", `translate(${width / 2},${50})`)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Retail Sales Percentage Change During Covid-19")
})
