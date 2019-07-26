
import { select, event } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { schemePastel1 } from 'd3-scale-chromatic';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { json } from 'd3-fetch';
import { drag } from 'd3-drag';
import { attrs } from 'd3-selection-multi';
import { zoom } from 'd3-zoom';
// import { statementType } from 'neo4j-driver/types/v1/result-summary';



const initGraph = (pass_width, pass_height, pass_data, pass_progress) => {
   
    var colors = scaleOrdinal(schemePastel1);

    var svg = select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node,
        link;

    var width = pass_width
    var height = pass_height


    svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':13,
            'refY':0,
            'orient':'auto',
            'markerWidth':13,
            'markerHeight':13,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
    

    var simulation = forceSimulation()
        .force("link", forceLink().id(function (d) {return d.id;}).distance(100).strength(.5))
        .force("charge", forceManyBody())
        .force("center", forceCenter(width / 2, height / 2))
        .velocityDecay(.99)
        .alphaDecay(1);


    var graph = pass_data
      
    update(graph.links, graph.nodes);

    // const links = graph.links
    // const nodes = graph.nodes


    // const links = graph.links
    // const nodes = graph.nodes

    function waitForLinks(){
        return new Promise((resolve, reject) => {
            resolve(graph.links)
            // nodes = graph.nodes
        }).catch((error) => {
            throw error
        })
    }

    // async function getNeighbors(){
    //     await printString("A")
    //     await printString("B")
    //     await printString("C")
    // }


    // console.log('WTFFFFFFF', links)

    const nodeElements = svg.selectAll(".node")
    const edgePaths = svg.selectAll(".edgepath")


    // json("../assets/data/test_graph.json", function (error, graph) {
    //     if (error) throw error;
    //     update(graph.links, graph.nodes);
    // })

    async function getNeighbors(node) {
        const links = await waitForLinks().catch((error)=> {
            console.log('waiting')
            throw error;
        })
        // console.log('WTFFFFFFF', links)
        return links.reduce((neighbors, link) => {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
            }
            // console.log('WHAT UPPSIETNRIESTNREISTNRISE', neighbors)
            return neighbors
        }, [node.id])
    }

    // async function neighbors() {
    //     await waitForConsts()
    //     await getNeighbors(node)
    // }

    
    function isNeighborLink(node, link) {
        // console.log('checks: ', link.target.id, node.id, link.source.id, node.id)
        return link.target.id == node.id || link.source.id == node.id
    }

    function getNodeColor1(node) {
        return node.label === 'ID' ? '#7ec0ee' : '#eecbad'
    }


    function updateNode(node, neighbors) {    
        // console.log('WHAT UPPSI   1', node.id)
        // console.log('WHAT UPPSI  2', neighbors)
        // update_properties = {"color": null,
        //                     ""
        //                     }
        if (neighbors.includes(node.id)) {
            return node.label === 'ID' ? 'green' : 'green'

        }
        return node.label === 'ID' ? 'blue' : 'silver'
    }

    function isNeighborNode(node, neighbors) {
        return neighbors.includes(node.id)
    }

    function getTextColor(node, neighbors) {
        return neighbors.indexOf(node.id) ? 'green' : 'black'
    }

    // function updateEdge(node, edge) {
    //     let update_properties = {"stroke-color": null,
    //                         "stroke-opacity": null
    //                         }
    //     if (isNeighborLink(node, edge)) {
    //         update_properties['stroke-color'] = 'green' 
    //         update_properties['stroke-opacity'] = 1
    //     } else {
    //         update_properties['stroke-color'] = 'silver'
    //         update_properties['stroke-opacity'] = .4
    //     }
    //     return update_properties
            
        
    // }

    async function selectNode(selectedNode) {
        let neighbors = await getNeighbors(selectedNode).catch((error)=> {
            throw error
        })
        
        
        // can make this more efficient by doing one isNeighborNode check per node. Currently,
        // have to call isNeighborNode multiple times for each node...
        // question to answer later: how does .attr.text.select.attr work? In what way does order matter?
        // question to answer later: fill green doesn't work. my guess being overriden by fill in update method.
        nodeElements
            // .append("text")
            // .attr("dy", -3)
            // .select('text')
                // .text((node => isNeighborNode(node, neighbors) ? node.name+":"+node.label : '' ))
            .select('circle')
            // .attr('fill', 'green')
            .attr('r', ((node) => isNeighborNode(node, neighbors) ? 10 : 5 ))
            .attr('stroke', ((node) => isNeighborNode(node, neighbors) ? 'green' : 'transparent' ))
        
        
        // edgelabels 
        //     .attr('fill', node => getTextColor(node, neighbors))
        
        edgePaths
            .attr('stroke', (edge => isNeighborLink(selectedNode, edge) ? 'green' : '#D3D3D3' ))
            .attr('opacity', (edge => isNeighborLink(selectedNode, edge) ? 1 : 0.5 ))
            // .attr('fill-opacity', (edge => isNeighborLink(selectedNode, edge)) ? 1 : 0 )

        // find a way to merge both nodeElements searches
        nodeElements
            .select('text')
            // .each((d, i) => {
            //     d.text((node => isNeighborNode(node, neighbors) ? node.name+":"+node.label : '' ))
            //     d.style.zIndex = "2"
            // })
            .text((node => isNeighborNode(node, neighbors) ? node.name+":"+node.label : '' ))
            // .each((d, i) => {
            //     this.style.zIndex = "2"
            // })
        

        // why is nodeElements.each(...) this keyword undefined??
        // nodeElements.each(node => {
        //     console.log('205', this)
        //     if (this !== undefined) {
        //         console.log('207 made it', this)
        //         this.node().style.zIndex = "2"
        //     }
        // })

    }
    


    // nodeElements.on('click', selectNode)
    nodeElements.on("click", function(node) {
        selectNode(node)
        
        // console.log('154 ', this)
        // let circles = this.getElementsByTagName('circle')
        // circles[0].setAttribute("r", 10)
    });

    // nodeElements.on("hover", function(node) {
    //     node.select('text')
    //     .text(function (d) {return d.name+":"+d.label;})
    // });

    


    var edgepaths;
    var edgelabels;

    function update(links, nodes) {
        // code from __ above
        

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                // 'fill-opacity': .5,
                // 'stroke-opacity': 50,
                // 'fill': 'gray',
                'stroke': 'gray',
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});


        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')
            .attr('fill', 'red')
            .attr('stroke-width', '.5px')
            .attr('markerWidth', .01)
            .attr('markerHeight', .01)

        link.append("title")
            .text(function (d) {return d.type;});


        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            // .call(zoom().on("zoom", function () {
            //     svg.attr("transform", event.transform)
            //  }))
            .attr("class", "node")
            // .attr("cx", width / 2)
            // .attr("cy", height / 2)
            .call(drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    //.on("end", dragended)
            );
        
        
        // var node_neighbors = 

        node.append("circle")
            .attr("r", 5)
            .style("fill", function (d, i) {return getNodeColor1(d);})

        

        // function selectNode(selectedNode) {
        //     console.log('HAHAHAHAH', selectedNode)
        //     const neighbors = getNeighbors(selectedNode)
        //     node
        //         .attr('fill', node => getNodeColor(node, neighbors)) 
        //     // edgelabels
        //     //     .attr('fill', node => getTextColor(node, neighbors))
        //     link
        //         .attr('stroke', link => getLinkColor(selectedNode, link))
        // }
    
        node.append("title")
            .text(function (d) {return d.name+":"+d.label;});


        // interesting note: you can't select transparent things in d3... or not???
        // maybe it doesn't work for text. swear it works for shapes though
        node.append("text")
            .attr("dx", 15)
            .attr("dy", 5)
            // .text(function (d) {return d.name+":"+d.label;})
            // .style('fill', 'transparent')
            // .style('fill-opacity', 0)

            
        // var nodelabels = svg.append("g")
        //     .attr("class", "nodelabel")
        //     .selectAll("text").data(nodes)
        //     .enter().append('text')
        //     .attr("dx", 110)
        //     .attr("dy", 110)
        //     .text(function(d) { return d.name });
        
        // selectAll(".node")
        //     .data(nodes)
        //     .enter().append("g")
            
        
        // nodelabels.append('text')
        //     .attr("dx", 12)
        //     .attr("dy", 12)
        //     .text(function(d) { return d.name });
        

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

    }

    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x -1.2;})
            .attr("y2", function (d) {return d.target.y -1.2;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                let rx = bbox.x + bbox.width / 2;
                let ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }

    function dragstarted(d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    return true;
}

export default initGraph;





// give arrow heads a different color, lower opacity to better see how many arrow heads are stickin
// into a node

// click a selected node to deselect it (restore to og size and stroke color)

// when you click on node and it gets bigger, have arrow heads adjust accordingly

// have each node display a number that tells users how many edge connections it has 
// i.e. it's connectiveness

// incease dynamism of the graph (but don't sacrifice usability)

// implement more natural feeling zoom and pan

// make table and tag names appear ABOVE all other things....
// why does d3 not support Zindex?????

// fix responsivity issue... when resize window, x should happen. figure out
// what x is.

// implement a new view, where nodes are sorted by connectivity

// add a search bar, that allows users to query the database and return a new view

// allow user to save a configuration, and relod it on a different session

// figure out what pinning/sticky feature would
// make the app more usable (for e.g.: double click a node to pin it... but this is not
// thought out enough).

// find the shortest path between two nodes

// click on a TableName node, have option to see all column names that it contains

