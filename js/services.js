angular.module('services',[])
.service('appServices',function(){
	return {
		getTrackList : function(){
			return this.trackList;
		},
		setTrackList : function(value){
			this.trackList = value;
		},
		getGenerList : function(){
			return this.generList;
		},
		setGenerList : function(value){
			this.generList = value;
		}
	}
})