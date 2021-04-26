<!DOCTYPE html>
<html lang="">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 2</title>
  <style>
    body {
      padding: 0;
      margin: 0;
      font-family:sans-serif;
    }

    .tick line{
      stroke:lightgrey;
    }

    /* tooltip style. reference -> https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52 */
    div.tooltip {
      position: absolute;
      text-align: left;
      width: fit-content;
      padding: 10px;
      font: 12px sans-serif;
      background: lightsteelblue;
      border: 0px;
      border-radius: 5px;
      pointer-events: none;
    }

  </style>
  <script src="https://d3js.org/d3.v6.min.js"></script>
</head>

<body>
<main>
  <svg class="container"></svg>
</main>
<script>
  const height = 500;
  const width = 1000;
  const margin = {
    left:100,
    top:50,
    bottom:100,
    right:200
  }
  const loadData = async () => {
    try {
      //year,sales,rise
      return  await d3.csv("garden_equip_rise.csv");
    } catch(err) {
      return err;
    }
  }

  const render = data => {
    // svg container
    const svg = d3.select(".container")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "#f3f3f3")

    // defining xScale
    const xScale = d3.scaleTime()
            .domain([new Date(2014,0,1),new Date(2020,0,1)])
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
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y"))
                    .tickSize(-height + margin.top + margin.bottom)
            );

    // y-axis
    g.append("g")
            .call(d3.axisLeft(yScale)
                    .tickFormat(d => parseInt(d * 100))
                    .tickSize(-width + margin.left + margin.right)
            );

    // tooltip div -> refered example https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
    const div = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
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
            .attr("r", 3 )
            .style("fill", 'SteelBlue')
            .style("opacity", 0.75)
            .on("mouseover", (event, d) => {
              div.transition()
                      .duration(200)
                      .style("opacity", .9);
              div.html(`
                Year : ${d.year} <br/>
                Sale : ${d.sales} <br/>
                Rise : ${(d3.format(".2f"))(d.rise * 100 ) + '%'}<br/>
            `)

                      ///(d3.format(".2f"))(d.change) + "%")
                      .style("left", (event.pageX + 10) + "px")
                      .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", _ => {
              div.transition()
                      .duration(500)
                      .style("opacity", 0);
            })
            .on("mousemove", event => {
              div.style("left", (event.pageX + 10) + "px")
                      .style("top", (event.pageY - 20) + "px")
            })

    // y-axis title
    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2)
            .attr("y", 60)
            .attr("text-anchor", "middle")
            .text("The rise percentage")

    // x-axis title
    svg.append("text")
            .attr("transform", `translate(${width / 2},${height - 20})`)
            .attr("text-anchor", "middle")
            .text("Years")

    // main chart label
    svg.append("text")
            .attr("transform", `translate(${width / 2},${30})`)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("The annual sales growth in garden equipment from 2013-2021")
  }


  // loading data and then rendering chart
  loadData()
          .then(data => render(data))
          .catch(err => console.log(err))
</script>
</body>
</html>