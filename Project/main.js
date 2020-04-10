var margin = 30, width = 1000, height = 500, rValues = [2, 15];
var circles, xScale, yScale;

var svg = d3.select('#chart')
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px');

// svg.append('rect')
// .attr('x', 100)
// .attr('y', 100)
// .attr('width', 10)
// .attr('height', 10);

// svg.append('circle')
// .attr('cx', 200)
// .attr('cy', 100)
// .attr('r', 5);

// svg.append('line')
// .attr('x1', 300)
// .attr('y1', 100)
// .attr('x2', 400)
// .attr('y2', 200)
// .attr('stroke', '#000');


d3.csv('boston-housing.csv').then(function (data) {
  // console.log(data);

  data = data.sort(function (a, b) {
    return a.charles - b.charles;
  });

  xMinMax = d3.extent(data, function (d) {
    return parseFloat(d.poor);
  });
  // console.log(xMinMax);

  yMinMax = d3.extent(data, function (d) {
    return parseFloat(d.rooms);
  });
  // console.log(yMinMax);

  rMinMax = d3.extent(data, function (d) {
    return parseFloat(d.value);
  });
  // console.log(rMinMax);

  xScale = d3.scaleLinear()
    .domain([xMinMax[1], xMinMax[0]])
    .range([margin + rValues[1], width - margin - rValues[1]]);

  yScale = d3.scaleLinear()
    .domain([yMinMax[1], yMinMax[0]])
    .range([margin + rValues[1], height - margin - rValues[1]]);

  rScale = d3.scaleLinear()
    .domain([rMinMax[0], rMinMax[1]])
    .range([rValues[0], rValues[1]]);


  cScale = d3.scaleOrdinal()
    .domain([0, 1])
    .range(['#333', '#FF6600']);


  circles = svg.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return xScale(d.poor);

    })
    .attr('cy', function (d) {
      return yScale(d.rooms);
    })
    .attr('r', 0)
    .attr('fill', function (d) {
      return cScale(d.charles);
    })
    .style('opacity', function (d) {
      return d.charles == 1 ? 1 : 0.3;
    })
    .on('mouseover', function (d) {
      html = 'X | poor:' + d.poor + '<br />';
      html += 'Y | rooms:' + d.rooms + '<br />';
      html += 'R | value:' + d.value + '<br />';
      html += 'C | charles:' + d.charles + '<br />';
      d3.select('#tooltip')
        .html(html)
        .style('left', d3.event.pageX - 100)
        .style('top', d3.event.pageY - 100)
        .style('opacity', 0.85)
    })
    .on('mouseout', function () {
      d3.select('#tooltip')
        .style('left', -1000)
        .style('opacity', 0);
    });



  xAxis = d3.axisBottom(xScale).tickValues(0);
  yAxis = d3.axisLeft(yScale).tickValues([yMinMax[0], yMinMax[1]]);

  xAxisG = svg.append('g')
    .attr('id', 'xAxis')
    .attr('class', 'axis');

  yAxisG = svg.append('g')
    .attr('id', 'yAxis')
    .attr('class', 'axis');

  xAxisG.call(xAxis)
    .attr('transform', 'translate(0,' + (height - margin) + ')');

  yAxisG.call(yAxis)
    .attr('transform', 'translate(' + margin + ',0)');

  svg.append('text')
    .attr('x', xScale(xMinMax[0]))
    .attr('y', yScale(yMinMax[0]) + margin)
    .attr('text-anchor', 'middle')
    .attr('class', 'axisLabel')
    .text('more wealthy');

  svg.append('text')
    .attr('x', xScale(xMinMax[1]))
    .attr('y', yScale(yMinMax[0]) + margin)
    .attr('text-anchor', 'middle')
    .attr('class', 'axisLabel')
    .text('less wealthy');

  update();

});

function update() {
  circles.transition()
    .delay(function (d, i) {
      return i * 10;
    })
    .attr('r', function (d) {
      return rScale(d.value);
    });
}