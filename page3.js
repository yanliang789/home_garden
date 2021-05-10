d3.csv("top_rise_retail_sales2020and2019.csv", function (data) {
    return {
        kind: data['Kind of Business'],
        month: [+data['Apr.change'] * 100, +data['May.change'] * 100, +data['Jun.change'] * 100],
        Apr: +data['Apr.change'] * 100,
        May: +data['May.change'] * 100,
        Jun: +data['Jun.change'] * 100
    };
    // return data;
}).then(function (data) {





    let margin = {top: 20, right: 60, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    const svg = d3.select('#third_page')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let padding = 8;
    let bar = svg.append("g")
        .attr('transform', `translate(${margin.left}, ${margin.right})`);

    let bar2 = svg.append("g")
        .attr('transform', `translate(${width / 3 + margin.left}, ${margin.right})`);

    let bar3 = svg.append("g")
        .attr('transform', `translate(${2 * width / 3 + margin.left}, ${margin.right})`);

    let kinds = {
        "Building mat. and garden equip. and supplies dealers": "Garden equip Shopping",
        "Electronic shopping and mail-order houses": "E shopping",
        "Beer, wine, and liquor stores": "Beer wine shopping"
    };

    console.log(data);
    let bar_width = width / (4 * data.length);
    // Add X axis for
    let x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(item => item.kind))

    bar.append("g")
        // .attr("transform", "translate(0," +  height + ")")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(d3.axisBottom(x).tickFormat(function (d) {
            return d.kind;
        }))

    let y = d3.scaleLinear()
        .domain([-5, 40])
        .range([height, 0])

    bar.append("g")
        .style("font", "16px times")
        .call(d3.axisLeft(y));

    // Add a scale for bubble color
    let my_color = d3.scaleOrdinal()
        .domain(data.map(item => item.kind))
        .range(['#ABF1Bc', '#F89880', 'steelblue']);

    //color legend
    svg.append("g")
        .attr("class", "legendLog")
        .attr('transform', 'translate(721,20)');
    let color_legend = d3.legendColor()
        .shape('rect')
        .shapePadding(10)
        .shapeRadius(10)
        .orient('vertical')
        .cells(3)
        .scale(my_color);
    svg.select(".legendLog")
        .call(color_legend);

    let tooltip = d3.select("#third_page")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")

    // functions for tooltip
    let showTooltip = function (event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.7)
            .style('left', (event.pageX + 'px'))
            .style('top', (event.pageY - 20 + 'px'))
        tooltip.html(`
                ${kinds[d.kind]} <br/>
                ${(d3.format(".2f"))(d.month[0]) + '%'}<br/>
            `)
    }

    let moveTooltip = function (event, d) {
        tooltip.style("left", (event.pageX) + "px")
            .style("top", (event.pageY + 10) + "px")
    }
    let hideTooltip = function (d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0)
    }

    // Add rects
    bar.append('g')
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rects")
        .attr("y", function (d) {
            return y(d.month[0]);
        })
        .attr("height", function (d) {
            return height - y(d.month[0]);
        })
        .attr("width", bar_width - padding)
        .attr('transform', function (d, i) {
            let position = [bar_width * i + padding, 0];
            return 'translate(' + position + ')';
        })
        .attr("fill", function (d) {
            return my_color(d.kind);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    //X axis text
    svg.append("text")
        .attr("transform", `translate(${width / 5},${height + margin.top + margin.bottom - 20})`)
        .attr("text-anchor", "middle")
        .text("Apr 19 vs Apr 20");

    //Y axis text
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2 - 60)
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Retail Sales Rise Percentage");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${20})`)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("The top Retail Sales Rise During Covid-19(2020 VS 2019)")

    // group 2
    bar2.append("g")
        .attr("transform", `translate(${width / 3 + 10},${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(function (d) {
                return d.kind;
            }))
    bar2.append("g")
        .call(d3.axisLeft(y));
    bar2.append('g')
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rects")
        .attr("y", function (d) {
            return y(d.month[1]);
        })
        .attr("height", function (d) {
            return height - y(d.month[1]);
        })
        .attr("width", bar_width - padding)
        .attr('transform', function (d, i) {
            let position = [bar_width * i + padding, 0];
            return 'translate(' + position + ')';
        })
        .attr("fill", function (d) {
            return my_color(d.kind);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    svg.append("text")
        .attr("transform", `translate(${2.2 * width / 4},${height + margin.top + margin.bottom - 20})`)
        .attr("text-anchor", "middle")
        .text("May 19 vs May 20");

    //group 3
    bar3.append("g")
        .attr("transform", `translate(${width / 3 + 10},${height})`)
        .call(d3.axisBottom(x).tickFormat(function (d) {
            return d.kind;
        }))
    bar3.append("g")
        .call(d3.axisLeft(y));
    bar3.append('g')
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "rects")
        .attr("y", function (d) {
            return y(d.month[2]);
        })
        .attr("height", function (d) {
            return height - y(d.month[2]);
        })
        .attr("width", bar_width - padding)
        .attr('transform', function (d, i) {
            let position = [bar_width * i + padding, 0];
            return 'translate(' + position + ')';
        })
        .attr("fill", function (d) {
            return my_color(d.kind);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

    svg.append("text")
        .attr("transform", `translate(${width - 100},${height + margin.top + margin.bottom - 20})`)
        .attr("text-anchor", "middle")
        .text("Jun 19 vs Jun 20");
})