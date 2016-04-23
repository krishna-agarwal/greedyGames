angular.module('factory',[])
.factory('RestService',function($resource){
	return{
		track : $resource('https://104.197.128.152:8000/v1/tracks/:id',{id: '@id'}),
		genre : $resource('https://104.197.128.152:8000/v1/genres/:id',{id: '@id'})
	} 
})