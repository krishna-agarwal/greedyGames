angular.module('musicApp',['ngResource','ui.bootstrap','directives','factory','services'])
.config(function(){

})

.filter('start', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
 
        start = +start;
        return input.slice(start);
    };
})


.run(function($resource,appServices,RestService) {
  appServices.setTrackList(RestService.track.query());
  appServices.setGenerList(RestService.genre.query());
})

.controller('mainController',function($scope,appServices,RestService,$uibModal,$log){
	$scope.appTitle = "Music App";
	$scope.tracks = appServices.getTrackList();
	$scope.genres = appServices.getGenerList();
	$scope.currentTrackPage = 1;
    $scope.currentGenrePage = 1;
	$scope.pageSize = 7;


	$scope.openTrackModal = function(size,track){
		var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modalTemplates/trackModal.html',
      controller: 'trackModalCtrl',
      size: size,
      resolve: {
        track: function () {
          return track;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
	}

  $scope.openGenreModal = function(size,genre){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'modalTemplates/genreModal.html',
      controller: 'genreModalCtrl',
      size: size,
      resolve: {
        genre: function () {
          return genre;
        }
      }
    });

    
  }
	
})

.controller('trackModalCtrl', function($scope,appServices,RestService, $uibModalInstance, $resource, track){

  $scope.modalHeader = track ? "Edit Track" : "Add New Track";
  $scope.genres = appServices.getGenerList();
  
  $scope.trackName = track ? track.title : null;
  $scope.trackRating = track ? track.rating : 1;
  $scope.genreArr = [];
  if(track){
    angular.forEach(track.genres,function(genre){
      $scope.genreArr.push(genre.id);
    });
  }
  $scope.isChecked = function(id){
    var match = false;
      for(var i=0 ; i < $scope.genreArr.length; i++) {
        if($scope.genreArr[i] == id){
          match = true;
        }
      }
      return match;
  }
  $scope.syncCheckBox = function(bool,genre){
    if(bool){
      $scope.genreArr.push(genre.id);
    }else{
      var index = $scope.genreArr.indexOf(genre.id);
      $scope.genreArr.splice(index,1);
    }
    console.log($scope.genreArr)
  }

  $scope.submit = function () {

    if(track){
      $scope.service = new RestService.track({id : track.id});
    }else{
      $scope.service = new RestService.track()
    } 
    $scope.service.title = $scope.trackName;
    $scope.service.rating = $scope.trackRating;
    $scope.service.genres = $scope.genreArr;

    $scope.service.$save(function(response){
      console.log(response);
      if(response && response.$resolved){
        if(track){
          angular.forEach(appServices.getTrackList(),function(track){
            if(track.id == response.id){
              track.title = response.title;
              track.rating = response.rating;
              track.genres = response.genres
            }
          })
        }else{
          appServices.getTrackList().push({'id':response.id,'title':response.title,'rating':response.rating,'genres':response.genres});
        }
      }
      $uibModalInstance.close();
    });
    
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})

.controller('genreModalCtrl',function($scope,appServices,RestService, $uibModalInstance, $resource, genre){
  $scope.modalHeader = genre ? "Edit Genre" : "Add New Genre";

  $scope.genreName = genre ? genre.name : null;
  
  $scope.submit = function(){
    if(genre){
      $scope.service = new RestService.genre({id : genre.id});
    }else{
      $scope.service = new RestService.genre()
    }
    $scope.service.name = $scope.genreName;

    $scope.service.$save(function(response){
      console.log(response);
      if(response && response.$resolved){
        if(genre){
          angular.forEach(appServices.getGenerList(),function(genre){
            if(genre.id == response.id){
              genre.name = response.name;
            }
          });
        }else{
          appServices.getGenreList().push({'id':response.id,'name':response.name});
        }
      }
      $uibModalInstance.close();
    });

  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})