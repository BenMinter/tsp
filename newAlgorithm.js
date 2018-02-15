

function getNext(arr, nodeIndex)
{
	var best= null;
	var index;
	for(var i = nodeIndex; i < _NODES; i++ )
	{
		if( arr[i].id != arr[nodeIndex].id ){
			var temp = abs(arr[nodeIndex].x - arr[i].x) + abs(arr[nodeIndex].y - arr[i].y);
			if( best == null || temp < best ){
				best = temp;
				index =i;
			}
		}
	}
	return index;
}

function doShortestPath(arr){
	
	
	for(var i = 0; i < _NODES-1; i++ ){
		swap( arr, i+1, getNext(arr,i));
	}
	return arr;
}