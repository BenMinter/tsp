//tournament
function tournament(toursize){
	for(var i=0; i<toursize; i++)
		matingPool.push(population[floor(random(_POPSIZE-1))]);
	var best = calcDistance(matingPool[0]);
	var index = 0;
	for( var i = 0; i < toursize; i++ ){
		var trythis = calcDistance(matingPool[i]);
		if( trythis < best ){
			best = trythis;
			index = i;
		}
	}
	var returnthis = matingPool[index]
	matingPool = [];
	return returnthis;
}

//crossover
function PMcrossover(p1,p2){
	var crossPoint1 = floor(random(p1.length));
	var crossPoint2 = floor(random(crossPoint1,p1.length));
	
	var a = p1.slice(crossPoint1,crossPoint2);
	var b = p2.slice(crossPoint1,crossPoint2);

	
	//get all symbols from B in order shown
	var tempadd = [];
	tempadd = tempadd.concat(p2.slice(crossPoint2));
	tempadd = tempadd.concat(p2.slice(0,crossPoint1));
	var add = tempadd.concat(b);
	
	//remove dups
	for(var i = _NODES-1; i >= 0; i--){
		for(var j = 0; j < a.length; j++ )
		{
			if(a[j].id == add[i].id){
				add.splice(i,1);
				break;
			}
		}
	}
	
	var index = add.length-1;
	for( var i = crossPoint2+1; i < p1.length; i++ )
	{
		a.push(add[index]);
		add.splice(index,1);
		index--;
	}
	
	return add.concat(a);
}

//Mutation
function mutate(order, mRate){
	if(random(1) < mRate){
		var swaphere = floor(random(_NODES));
		swap(order,swaphere,(swaphere+1)%_NODES);
	}
	return order;
}
