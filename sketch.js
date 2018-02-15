var nodes = [];
var bestPath = []
var _NODES = 7;
var _RAD = 20;
var bestDistance;
var _SOLUTIONS = factorial(_NODES);
var COMPLETE = false;

//GA
var population = [];
var newPopulation = [];
var _POPSIZE = 10;
var matingPool = [];
var bestPop = null;
var bestPathPop = null;
var _MUTATIONRATE = 0.1;
var _TOURSIZE = 2;

//Extra
var nodes2 = [];
var bestPath2 = [];
var bestDis2 = null;

//Algorithm 2
var nodes3 = [];
var bestDis3;
var bestPath3 = [];
var nextI = 0;


function resetPage(){
	_NODES = document.getElementById("nodes").value || 10;
	_POPSIZE = document.getElementById("popsize").value || 10;
	_SOLUTIONS = factorial(_NODES);
	_MUTATIONRATE = document.getElementById("mutation").value || 0.1;
	_TOURSIZE = document.getElementById("tour").value || 2;
	population = [];
	newPopulation = [];
	matingPool = [];
	nodes = [];
	nodes2 =[];
	nodes3 = [];
	COMPLETE = false;
	setup();
}


function setup(){
	createCanvas(1800,600);
	background(0);

	//initialise cities
	for( var i = 0; i < _NODES; i++)
		nodes.push(new city(random(width/2),random(height/2), i));
	nodes2 = nodes.slice();
	nodes3 = nodes.slice();


	//initialise population GA
	for( var i = 0; i < _POPSIZE; i++ ){
		population[i] = nodes.slice();
		shuffleME(population[i],30);
	}

	//best distance GA
	for(var i =0; i < _POPSIZE; i++){
		var temp = calcDistance(population[i]);
		if(bestPop == null || bestPop < temp ){
			bestPop = temp;
			bestPathPop = population[i].slice();
		}
	}



	bestDistance = bestPop;
	bestPath = bestPathPop;
	bestDis2 = calcDistance(nodes2);
	bestDis3 = bestDis2;
	bestPath2 = nodes2.slice();
	bestPath3 = nodes3.slice();

	//set HTML inputs to current.
	document.getElementById("nodes").value = _NODES;
	document.getElementById("popsize").value = _POPSIZE;
	document.getElementById("mutation").value = _MUTATIONRATE;
	document.getElementById("tour").value = _TOURSIZE;


}

function drawCities(xOff, yOff, nodes, r,g,b ){

	fill(255);
	stroke(0);

	//draw cities (circles) GENETIC
	for( var i =0; i < _NODES; i++ )
		ellipse(nodes[i].x + xOff , nodes[i].y + yOff, _RAD, _RAD);

	//draw lines between nodes.
	if(!COMPLETE){
		noFill();
		stroke(r,g,b);
		beginShape();
		for(var i = 0; i < _NODES ; i++ )
			vertex(nodes[i].x + xOff, nodes[i].y + yOff);
		endShape();
	}
}


function draw(){
	background(0);
	//frameRate(1);
	//Draw nodes
	drawCities(0,0,nodes,0,0,255);
	drawCities(0,height/2,nodes2,0,0,255);
	drawCities(width/2, 0, nodes3,0,0,255);


	//draw best
	drawCities(0,height/2, bestPath2, 0, 255, 0);
	drawCities(0,0, bestPath, 0, 255, 0);
	drawCities(width/2, 0, bestPath3, 0,255,0);

	//new algorithm --nextI++%_NODES
	doShortestPath(nodes3);

	var temp = calcDistance(nodes3);
	if( temp < bestDis3 ){
		bestDis3 = temp;
		bestPath3 = nodes3.slice();
	}

	//Get next order.
	//RANDOM SOLUTIONS --
	//swap(nodes,floor(random(_NODES-1)),floor(random(_NODES-1)));
	//LEXOGRAPHIC SOLUTIONS
	if(!nextPermutation(nodes2))
		COMPLETE = true;

	//Genetic Algorithm Solutions
	for(var i = 0; i < _POPSIZE; i++ )
		newPopulation.push(mutate(PMcrossover(tournament(_TOURSIZE),tournament(_TOURSIZE)),_MUTATIONRATE));
	population = newPopulation;
	newPopulation = [];

	//best distance from population

	for(var i = 0; i < _POPSIZE; i++){
		var temp = calcDistance(population[i]);
		if(bestPop == null || bestPop > temp ){
			bestPop = temp;
			bestPathPop = population[i].slice();
		}
	}
	//set best from population
	nodes = bestPathPop.slice();
	bestPop = null;

	//See if an improvement was made from the population GA
	var dist = calcDistance(nodes)
	if( dist < bestDistance ){
		bestDistance = dist;
		bestPath = nodes.slice();
		_MUTATIONRATE = 0.01;
	}else{
		_MUTATIONRATE += 0.000001;
	}

	//If better update best.
	var dist = calcDistance(nodes2);
	if( dist < bestDis2 ){
		bestDis2 = dist;
		bestPath2 = nodes2.slice();
	}



	document.getElementById("solutions").innerHTML = "Framerate: " + Math.round(frameRate());
	if(_SOLUTIONS > 0)
		document.getElementById("bests").innerHTML = "Best Solutions:<br>Genetic Algorithm: " +
										Math.round(bestDistance) + "<br>Brute Force: " + Math.round(bestDis2)
										+ " Solutions left : " + --_SOLUTIONS + "<br>Nearest Neighbour: " + Math.round(bestDis3);
}

function swap(a,i,j){	var temp = a[i];a[i]=a[j];a[j]=temp; }

function shuffleME(a,num){
	for( var i = 0; i < num; i++ )
	{
		var i1 = floor(random(a.length-1));
		var i2 = floor(random(a.length-1));
		swap(a,i1,i2);
	}
}

function calcDistance(a){
	var sum = 0;
	for( var i = 0; i < _NODES-1; i++ )
		sum += dist(a[i].x, a[i].y, a[i+1].x, a[i+1].y);
	return sum;
}

function factorial(x){
	if(x==0)
		return 1;
	else
		return x * factorial(x-1);
}

function nextPermutation(array) {
    // Find non-increasing suffix
    var i = array.length - 1;
    while (i > 0 && array[i - 1].id >= array[i].id)
        i--;
    if (i <= 0)
        return false;

    // Find successor to pivot
    var j = array.length - 1;
    while (array[j].id <= array[i - 1].id)
        j--;

    var temp = array[i - 1];
    array[i - 1] = array[j];
    array[j] = temp;

    // Reverse suffix
    j = array.length - 1;
    while (i < j) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
    }
    return true;
}
