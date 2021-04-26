<meta charset="utf-8">
<head>
<style>
	h2 {
	font-size: 28px;
	color: #009E73;
	font-weight: normal;
	line-height: 1;
	text-align: left;
	margin: 10px 20px 20px;
	transform: translate(+10%, 0%);
	}

	div.toolTip {
		position: absolute;
		display: none;
       		text-align: left;
		min-width: 80px;
		height: auto;
		background: #ffffff;
		border: 1px solid #6F257F;
		padding: 14px;
	}

</style>
<div id='first_page'></div>

<svg width="960" height="500"></svg>
<script src="https://d3js.org/d3.v6.min.js"></script>
</head>
<body>
<main>
    <svg class="container"></svg>
</main>
<script>
    var svg = d3.select("svg"),
        margin = {top: 20, right: 80, bottom: 50, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let padding = 8;

    let bar = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    d3.csv("EstimatesOfBusiness2019VS2020.csv", function(data) {
        return {
            year_2019: data['2019'],
            year_2020: data['2020'],
            change: +data['Percentage of Change'] * 100,
            estimates: data['Estimates of Business']
        };
        // return data;
    }).then(function(data) {
        console.log(data);
        // let columns = ['Building mat. and garden equip. and supplies dealers', 'Shoe stores','Gasoline stations', 'Food and beverage stores', 'Automobile and other motor vehicle dealers',  'Women\'s clothing stores', 'Grocery stores', 'Electronic shopping and mail-order houses' ,'Full service restaurants'];
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
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
            .domain([-80, 80])
            .range([height, 0])
        bar.append("g")
            .call(d3.axisLeft(y));

        // Add rects
        bar.append('g')
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .sort(function(a, b) {
                return d3.ascending(a.change, b.change);
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
                    return  - height / 2 + y(d.change);
                }
            })
            .attr("width",  bar_width - padding)
            .attr('transform', function (d, i) {
                let position = [bar_width * i + padding, 0];
                return 'translate(' + position + ')';
            })
            .attr("fill", function (d) {
                if (d.estimates === 'Building mat. and garden equip. and supplies dealers'){
                    return '#1E5631';
                } else if(d.change >0 ){
                    return '#6D8700';
                }
                return '#D1193E';
            })
            .on("mousemove", function(event, d){
            tooltip
                .style("left",event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html("Retail:" + (d.estimates) + "<br/>" + "Rise: " +  (d3.format(".2f"))(d.change) + "%");})
            .on("mouseout", function(d){ tooltip.style("display", "none");});

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", (margin.bottom + margin.top))
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            .text("Retail Sales Rise During Covid-19");

        //Y axis text
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2 - margin.top - margin.bottom)
            .attr("y", 0 )
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Rise Percentage");
    })
</script>
</body>
