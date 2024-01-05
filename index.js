// You can import API functions like this from D3.js.
import { 
  select, 
  csv, 
  scaleLinear, 
  max, 
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  pie,
  arc,
  scaleOrdinal,
  schemeCategory10,
} from 'd3';
import { dropdownMenu } from './dropdownMenu';
import { scatterPlot } from './scatterPlot';
import { scatterPlot2 } from './scatterPlot2';
const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let win_own = []
let agent_all = []
let player_all = []
let map_all = []

let bar_col = "KD";
let yColumn = "KD";
let xColumn = "pick";
let total_col = "Agent";

let bar_col2 = "map_rate"

let yColumn2 = "win_own_rate";
let xColumn2 = "map_rate";

let yColumn3 = "acs";
let xColumn3 = "hs";
let bar_col3 = "acs"

const sortRule = (former, latter) => {
  return latter[bar_col] - former[bar_col]
}
const sortRule2 = (former, latter) => {
  return latter[bar_col2] - former[bar_col2]
}
const sortRule3 = (former, latter) => {
  return latter[bar_col3] - former[bar_col3]
}

const onTotalColumnClicked = column => {
  total_col = column;
  if(total_col == "Agent")
    render(agent_all);
  else if(total_col == "Map")
    render(map_all);
  else if(total_col == "Player")
    render(player_all);
}
const onBarColumnClicked = column => {
  bar_col = column;
  agent_all.sort(sortRule)
  render(agent_all);
}
const onBarColumnClicked2 = column => {
  bar_col2 = column;
  map_all.sort(sortRule2)
  render(map_all);
}
const onBarColumnClicked3 = column => {
  bar_col3 = column;
  player_all.sort(sortRule3)
  render(player_all);
}

const onXColumnClicked = column => {
  xColumn = column;
  render(agent_all);
}

const onYColumnClicked = column => {
  yColumn = column;
  render(agent_all);
}

const onXColumnClicked2 = column => {
  xColumn2 = column;
  render(map_all);
}

const onYColumnClicked2 = column => {
  yColumn2 = column;
  render(map_all);
}

const onXColumnClicked3 = column => {
  xColumn3 = column;
  render(player_all);
}

const onYColumnClicked3 = column => {
  yColumn3 = column;
  render(player_all);
}
let total_option = ['Agent', 'Map', 'Player']
const render = data => {
  select('#total-menu')
    .call(dropdownMenu,{
      options:total_option,
      onOptionClicked: onTotalColumnClicked,
      selectedOption: total_col,
  });
  svg.selectAll('*').remove();
  if(total_col == "Agent"){
    render_agent(data)
    render_scatter(data)
    console.log("hi")
  }
  else if(total_col == "Map"){
    svg.selectAll('*').remove();
    render_map(data)
    render_scatter_map(data)
    renderPie(win_own)
  }
  else if(total_col == "Player"){
    svg.selectAll('*').remove();
    render_scatter_player(data)
    let post = data.filter((data) => data.cnt > 5);
    post = post.slice(0, 20)
    render_player(post)
    // render_map(data)
    // render_scatter_map(data)
    // renderPie(win_own)
  }
    
    
}
const render_scatter = data => {
  let option = ["KD", "pick", "assist", "kast", "death", "kill"]
  select('#x-menu')
    .call(dropdownMenu,{
      options:option,
      onOptionClicked: onXColumnClicked,
    	selectedOption: xColumn,
  
		});
  select('#y-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onYColumnClicked,
    	selectedOption: yColumn
  });
  // const svg = select('svg');
  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,
  	yValue: d => d[yColumn],
    yAxisLabel: yColumn,
    circleRadius: 10,
    margin: { top: 50, right: 20, bottom: 60, left: 400},
    width,
    height,
    data
  });
}
const render_scatter_map = data => {
  let option = ["map_rate", "win_own_rate", "own", "win_own", "none", "none"]
  select('#x-menu')
    .call(dropdownMenu,{
      options:option,
      onOptionClicked: onXColumnClicked2,
    	selectedOption: xColumn2,
  
    });
  select('#y-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onYColumnClicked2,
    	selectedOption: yColumn2
  });
  // const svg = select('svg');
  svg.call(scatterPlot, {
    xValue: d => d[xColumn2],
    xAxisLabel: xColumn2,
  	yValue: d => d[yColumn2],
    yAxisLabel: yColumn2,
    circleRadius: 10,
    margin: { top: 50, right: 20, bottom: 60, left: 400},
    width,
    height,
    data
  });
}
const render_scatter_player = data => {
  let option = ["hs", "acs", "adr", "rating", "fk", "none"]
  select('#x-menu')
    .call(dropdownMenu,{
      options:option,
      onOptionClicked: onXColumnClicked3,
    	selectedOption: xColumn3,
  
    });
  select('#y-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onYColumnClicked3,
    	selectedOption: yColumn3
  });
  // const svg = select('svg');
  svg.call(scatterPlot2, {
    xValue: d => d[xColumn3],
    xAxisLabel: xColumn3,
  	yValue: d => d[yColumn3],
    yAxisLabel: yColumn3,
    circleRadius: 10,
    margin: { top: 50, right: 20, bottom: 60, left: 400},
    width,
    height,
    data
  });
}


const render_agent = data => {
  let option = ["KD", "pick", "assist", "kast", "death", "kill"]
  select('#bar-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onBarColumnClicked,
      selectedOption: bar_col,
  
    });
  const xValue = d => d[bar_col]; 
  const yValue = d => d["agent"];
  const margin = { top: 50, right:640, bottom:40, left: 70}
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
  	.domain([0,max(data, xValue)])
  	.range([0,innerWidth]);
  
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0,innerHeight])
  	.padding(0.1);
  
  const xAxisTickFormat = number =>
  	format('.1f')(number)
  		// .replace('G', 'B');
  const xAxis = axisBottom(xScale).ticks(5)
  	.tickFormat(xAxisTickFormat)
  	.tickSize(-innerHeight);
  	
  //const yAxis = axisLeft(yScale);
  // console.log(data.columns)
  
  
  //console.log(yScale.domain())
  //console.log(xScale.range());
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  g.append('g')
    .call(axisLeft(yScale))
  	.selectAll('.domain, .tick line')
  		.remove();
  const xAxisg = g.append('g').call(xAxis)
  	.attr('transform', `translate(0,${innerHeight})`)
  	
  xAxisg.select('.domain').remove();
  
  xAxisg.append('text')
  	.attr('class', 'xAxis-label')
  	.attr('y', 60)
  	.attr('x', innerWidth/2)
  	.attr('fill', 'black')
  	.text('Population');

  g.selectAll('rect').data(data)
  .enter().append('rect')
      .attr('class', 'bar-rect')
      .attr('y', d=> yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
  g.append('text')
    .attr('class', 'title')
  	.attr('y', -10)
  	.text('Agent comparison');
};
const render_player = data => {
  let option = ["hs", "acs", "adr", "rating", "fk", "none"]
  select('#bar-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onBarColumnClicked3,
      selectedOption: bar_col3,
  
    });
  const xValue = d => d[bar_col3]; 
  const yValue = d => d["player"];
  const margin = { top: 50, right:640, bottom:40, left: 70}
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
  	.domain([0,max(data, xValue)])
  	.range([0,innerWidth]);
  
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0,innerHeight])
  	.padding(0.1);
  
  const xAxisTickFormat = number =>
  	format('.1f')(number)
  		// .replace('G', 'B');
  const xAxis = axisBottom(xScale).ticks(5)
  	.tickFormat(xAxisTickFormat)
  	.tickSize(-innerHeight);
  	
  //const yAxis = axisLeft(yScale);
  // console.log(data.columns)
  
  
  //console.log(yScale.domain())
  //console.log(xScale.range());
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  g.append('g')
    .call(axisLeft(yScale))
  	.selectAll('.domain, .tick line')
  		.remove();
  const xAxisg = g.append('g').call(xAxis)
  	.attr('transform', `translate(0,${innerHeight})`)
  	
  xAxisg.select('.domain').remove();
  
  xAxisg.append('text')
  	.attr('class', 'xAxis-label')
  	.attr('y', 60)
  	.attr('x', innerWidth/2)
  	.attr('fill', 'black')
  	.text('Population');

  g.selectAll('rect').data(data)
  .enter().append('rect')
      .attr('class', 'bar-rect')
      .attr('y', d=> yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
  g.append('text')
    .attr('class', 'title2')
  	.attr('y', -10)
  	.text('Top 20 player with game>5');
};

const renderPie = data => {
  const pieData = pie().sort(null).value(d=>d.rate)(data);
  const colors = scaleOrdinal(schemeCategory10);
	const segments = arc()
  	.innerRadius(0)
  	.outerRadius(90)
  	.padAngle(0)
  	.padRadius(0);
  
  const sections = svg.append("g")
  	.attr("transform", `translate(170,320)`)
  	.selectAll("path").data(pieData);
  sections.enter().append("path").attr("d", segments)
  	.attr("fill", d => colors(d.data.type))
  	// .on("mouseover", d => console.log(d.data.rate));
  //piechart is created 
  const legends = svg.append("g")
  	.attr("transform", "translate(170,400)")
    .selectAll(".legends").data(pieData);
  const legend = legends.enter().append("g").classed(".legends",true)
  	.attr("transform", (d,i)=>{
      return `translate(0,${(i+1)*30-10})`;
    });
  
  // list of each country as labels and its styles

  legend.append("rect").attr("width",22).attr("height",25)
  	.attr("fill", d => colors(d.data.type));
  legend.append("text")
  	.attr("x", 28)
  	.attr("y", 18)
  	.attr("class","legend_text")
  	.text(d => d.data.type);
  legend.append("text")
  	.attr("x", 60)
  	.attr("y", 18)
  	.attr("class","legend_value")
  	.text(d =>(d.data.rate)); //d=>numberFormat
  // const tmp = svg.append('g')
  // tmp.append("text")
  //   .attr('transform', `rotate(-90)`)
  //   .text("win on own map")
}

const render_map = data => {
  let option = ["map_rate", "win_own_rate", "own", "win_own"]
  
  select('#bar-menu')
    .call(dropdownMenu,{
      options: option,
      onOptionClicked: onBarColumnClicked2,
      selectedOption: bar_col2,
  
    });
  const xValue = d => d[bar_col2]; 
  const yValue = d => d["map"];
  const margin = { top: 50, right:640, bottom:300, left: 70}
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
  	.domain([0,max(data, xValue)])
  	.range([0,innerWidth]);
  
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0,innerHeight])
  	.padding(0.1);
  
  const xAxisTickFormat = number =>
  	format('.2f')(number)
  		// .replace('G', 'B');
  const xAxis = axisBottom(xScale).ticks(5)
  	.tickFormat(xAxisTickFormat)
  	.tickSize(-innerHeight);
  	
  //const yAxis = axisLeft(yScale);
  // console.log(data.columns)
  
  
  //console.log(yScale.domain())
  //console.log(xScale.range());
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  g.append('g')
    .call(axisLeft(yScale))
  	.selectAll('.domain, .tick line')
  		.remove();
  const xAxisg = g.append('g').call(xAxis)
  	.attr('transform', `translate(0,${innerHeight})`)
  	
  xAxisg.select('.domain').remove();
  
  // xAxisg.append('text')
  // 	.attr('class', 'xAxis-label')
  // 	.attr('y', 60)
  // 	.attr('x', innerWidth/2)
  // 	.attr('fill', 'black')
  // 	.text('Population');

  g.selectAll('rect').data(data)
  .enter().append('rect')
      .attr('class', 'bar-rect')
      .attr('y', d=> yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
  g.append('text')
    .attr('class', 'title')
  	.attr('y', -10)
  	.text('Map comparison');
  g.append('text')
    .attr('class', 'sub-title')
    // .attr('transform', `rotate(-90)`)
  	// .attr('x', -300)
    // .attr('transform', `rotate(-90)`)
    .attr('y', 400)
    .attr('x', -30)
  	.text('win on own map');
};

// ).then(
// csv('data.csv', function(d) {
//   	d.population = + d.population * 1000;
// },function(data){console.log("hello")});
csv('agent.csv',function(data){
    data.forEach(d=>{
      d['assist'] = +d['assist']
      d['kill'] = +d['kill']
      d['death'] = +d['death']
      d['KD'] = +d['KD']
      d['pick'] = +d['pick']
      d['kast'] = +d['kast']
      d['cnt'] = +d['cnt']
    })
    console.log(data)
    data.sort(sortRule)
    agent_all = data
    render(data)
});
csv('map.csv',function(data){
  data.forEach( d => {
    d['map_rate'] = +d['map_rate']
    d['win_own'] = +d['win_own']
    d['own'] = +d['own']
    d['win_own_rate'] = +d['win_own_rate']
  })
  // console.log(data)
  data.sort(sortRule2)
  map_all = data;
  // render(data)
});

csv('win_own.csv',function(data){
  data.forEach( d => {
    d['rate'] = +d['rate']
  })
  // console.log(data)
  win_own = data;
  // render(data)
});
csv('player.csv',function(data){
  data.forEach( d => {
    d['cnt'] = +d['cnt']
    d['hs'] = +d['hs']
    d['acs'] = +d['acs']
    d['adr'] = +d['adr']
    d['rating'] = +d['rating']
    d['fk'] = +d['fk']
  })
  // console.log(data)
  data.sort(sortRule3);
  player_all = data;
  
  // render(data)
});
