d3.csv("garden_equip_rise.csv", function (data) {
    let margin = {top: 80, right: 80, bottom: 100, left: 150},
        width = 1400 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;
    // svg container
    const svg = d3.select('#second_page')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        // .style("background-color", "#f3f3f3")

    // defining xScale
    const xScale = d3.scaleTime()
        .domain([new Date(2014, 0, 1), new Date(2020, 0, 1)])
        .range([0, width - margin.left - margin.right])

    // defining yScale
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data.map(item => parseFloat(item["rise"]))))
        .nice()
        .range([height - margin.top - margin.bottom, 0])

    // group element for all the main section
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x-axis
    g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom })`)
        .style("font", "16px times")
        .attr('dy', '1em')
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .tickSize(-height + margin.top + margin.bottom)
        );

    // y-axis
    g.append("g")
        .attr("class", "grid")
        .style("font", "16px times")
        .attr("class", "axisRed")
        .attr('dy', '10em')
        .call(d3.axisLeft(yScale)
            .ticks(4)
            .tickFormat(d => parseInt(d * 100))
            .tickSize(-width + margin.left + margin.right)
        );

    // tooltip div -> refered example https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
    let tooltip_2 = d3.select('#second_page')
        .append("div")
        .attr("class", "tooltip")
        .style('opacity', 0);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke-width", 2.5)
        .attr("stroke", 'green')
        .attr("d", d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(new Date(parseInt(d.year), 0, 1)))
            .y(d => yScale(d.rise))
        )

    // main dots
    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(new Date(parseInt(d.year), 0, 1)))
        .attr("cy", d => yScale(d["rise"]))
        .attr("r", 3)
        .style("fill", 'SteelBlue')
        .style("opacity", 0.9)
        .on("mousemove", function (d) {
            tooltip_2.transition().duration(200).style('opacity', 0.9);
            tooltip_2.html(`<span> Year: ${d.year} <hr> Sale $${d.sales} <hr>Rise: ${(d3.format(".2f"))(d.rise * 100) +'%'} </span>`)
                .style('left', `${d3.event.layerX - 50}px`)
                .style('top', `${(d3.event.layerY + 250)}px`);
        })
        .on('mouseout', () => tooltip_2.transition().duration(500).style('opacity', 0))
    // y-axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 120)
        .attr("text-anchor", "middle")
        .text("The rise percentage")

    // x-axis title
    svg.append("text")
        .attr("transform", `translate(${width / 2},${height - 50})`)
        .attr("text-anchor", "middle")
        .text("Years")

    // main chart label
    svg.append("text")
        .attr("transform", `translate(${width / 2},${35})`)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Annual Retail Sales Growth of Gardening Equipment(2014-2020)")
})