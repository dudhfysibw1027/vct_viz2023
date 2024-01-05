import { 
  select, 
  csv, 
  scaleLinear, 
  extent, 
  scalePoint,
	axisLeft,
  axisBottom,
  format,
  scaleOrdinal
} from 'd3';

export const scatterPlot = (selection, props) => {
	const {
    xValue,
    xAxisLabel,
    yValue,
    yAxisLabel,
    circleRadius,
   	margin,
    width,
    height,
    data
  } = props;
  // const title = 'hello everyone';
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
  	.domain(extent(data, xValue))
  	.range([0,innerWidth])
  	.nice();
  
  const yScale = scaleLinear()
  	.domain(extent(data, yValue))
  	.range([innerHeight,0])
  	.nice();
  
  const colorValue = d => d.class;
  const colorScale = scaleOrdinal()
  	.domain(data.map(colorValue))
  	.range(['#F2DA57','#42A5B3','#B396AD']);
  
  //console.log(colorScale.range());
  
  const xAxisTickFormat = number =>
  	format('.3s')(number)
  		.replace('G', 'B');
  const xAxis = axisBottom(xScale)
  	.tickSize(-innerHeight)
  	.tickPadding(15);
  	
  const yAxis = axisLeft(yScale)
  	.tickSize(-innerWidth)
  	.tickPadding(10);
  
  //console.log(yScale.domain())
  //console.log(xScale.range());
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
  	.enter().append('g')
  		.attr('class', 'container');
  gEnter
    .merge(g)
  		.attr('transform', 
      	`translate(${margin.left},${margin.top})`
      );
  const yAxisg = g.select('.y-axis');
  const yAxisgEnter = gEnter
  	.append('g')
  		.attr('class', 'y-axis')
  yAxisg
    .merge(yAxisgEnter)
  		.call(yAxis)
  		.selectAll('.domain').remove();
  
  const yAxisLabelText = yAxisgEnter
		.append('text')
      .attr('class', 'axis-label')
      .attr('y', -50)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
  	.merge(yAxisg.select('.axis-label'))
  		.attr('x', -innerHeight/2)
      .text(yAxisLabel);
  
  const xAxisg = g.select('.x-axis');
  const xAxisgEnter = gEnter
  	.append('g')
  		.attr('class', 'x-axis')
  xAxisg
    .merge(xAxisgEnter)
  		.attr('transform', `translate(0,${innerHeight})`)
  		.call(xAxis)
  		.selectAll('.domain').remove();
  const xAxisLabelText = xAxisgEnter
		.append('text')
      .attr('class', 'axis-label')
      .attr('y', 50)
      .attr('fill', 'black')
  	.merge(xAxisg.select('.axis-label'))
  		.attr('x', innerWidth/2)
      .text(xAxisLabel);

  const circles = g.merge(gEnter)
  	.selectAll('circle').data(data);
  circles.enter().append('circle')
    .attr('cy', 0)
    .attr('cx', 0)
    .attr('r', 0)
  	.merge(circles)
  	.transition().duration(1000)
  	.delay((d,i) => i*5)
  		.attr('cy', d=> yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('fill', d => colorScale(colorValue(d)))
  		.attr('r', circleRadius);
    // .append('text')
    //   .text("hello")
  // console.log(data)
  if(data[0]["agent"]){
    // console.log(data[0]["agent"])
    circles.enter().append('text')
      .attr('class', 'agent-circle')
      .attr('y', d=> yScale(yValue(d)))
      .attr('x', d=> xScale(xValue(d)))
      .text(d=>d.agent)
  }
  else{
    circles.enter().append('text')
      .attr('class', 'agent-circle')
      .attr('y', d=> yScale(yValue(d)))
      .attr('x', d=> xScale(xValue(d)))
      .text(d=>d.map)
  }
    
}