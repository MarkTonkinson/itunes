var app = angular.module('itunes');

app.controller('mainCtrl', function($scope, itunesService){
  //This is setting up the default behavior of our ng-grid. The important thing to note is
  //the 'data' property. The value is 'songData'. That means ng-grid is looking for songData on $scope and is putting whatever songData is into the grid.
  //this means when you make your iTunes request, you'll need to get back the information, parse it accordingly, then set it to songData on the scope -> $scope.songData = ...
  $scope.gridOptions = { 
      data: 'songData',
      height: '110px',
      sortInfo: {fields: ['Song', 'Artist', 'Collection', 'Type'], directions: ['asc']},
      columnDefs: [
        {field: 'Play', displayName: 'Play', width: '40px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}"><img src="http://www.icty.org/x/image/Miscellaneous/play_icon30x30.png"></a></div>'},
        {field: 'Song', displayName: 'Song'},
        {field: 'Artist', displayName: 'Artist'},
        {field: 'Collection', displayName: 'Collection'},
        {field: 'AlbumArt', displayName: 'Album Art', width: '60px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><img src="{{row.getProperty(col.field)}}"></div>'},
        {field: 'Type', displayName: 'Type'},
        {field: 'CollectionPrice', displayName: 'Collection Price'},
      ]
  };

  //Our controller is what's going to connect our 'heavy lifting' itunesService with our view (index.html) so our user can see the results they get back from itunes.

 
   


  //Now write a function that will call the method on the itunesService that is responsible for getting the data from iTunes, whenever the user clicks the submit button
  //*remember, that method should be expecting an artist name. The artist name is coming from the input box on index.html, head over there and check if that input box is tied to any specific model we could use.
  //Also note that that method should be retuning a promise, so you could use .then in this function.

    $scope.getSongData = function(){
      itunesService.getData($scope.artist)
        .then(function(data){
        $scope.songData = refineData(data); //rather than calling the function and then returning it, we put it all into one line
        //pushSongData(refinedData);
        //console.log($scope.songData);
        })
    }


  //Check that the above method is working by entering a name into the input field on your web app, and then console.log the result

  //If everything worked you should see a huge array of objects inside your console. That's great! But unfortunately that's not what ng-grid is expecting. What you need to do now
  //is sort the data you got back to be an object in the following format.
    /*
      AlbumArt: "http://a3.mzstatic.com/us/r30/Features4/v4/22/be/30/22be305b-d988-4525-453c-7203af1dc5a3/dj.srlprmuo.100x100-75.jpg"
      Artist: "Nelly"
      Collection: "Nellyville"
      CollectionPrice: 11.99
      Play: "http://a423.phobos.apple.com/us/r1000/013/Music4/v4/4a/ab/7c/4aab7ce2-9a72-aa07-ac6b-2011b86b0042/mzaf_6553745548541009508.plus.aac.p.m4a"
      Type: "song"
  */
  //the iTunes API is going to give you a lot more details than ng-grid wants. Create a new array and then loop through the iTunes data pushing into your new array objects that look like the above data.

    var songData = [];

    var refineData = function(songs){  //songs is the data coming through the parameter where it is called above- just the information for the artist the person searched
      debugger;
      for(var i = 0; i < songs.length; i++) { //we loop through an array of objects
        var song = {  //we create an object that can catch the object parts we are pulling
          Song: songs[i].trackName,
          Artist: songs[i].artistName, //each of these assigns the capitalized key that ng-grid recognizes
          Collection: songs[i].collectionName,// the songs[i] tells us when we are at an object, grab it's property name and assigns it to our new object
          AlbumArt: songs[i].artworkUrl60,//the new object is much smaller with less properties- their new names are the ng-grid names from above
          Type: songs[i].kind,
          CollectionPrice: songs[i].collectionPrice
        };
        songData.push(song);//we push the new song object to the songData array
      }
      console.log(songData);
      return songData; //$scope.songData is going to need the array- we give the array after the loop is done and 
    }                  // this $scope.songData takes it back and is connected to the grid here in the javascript.
    
    //I think we have to use $scope.songData to control that data- unless we use another then statement?


  //Once you have that final data array, you simply need to put it on the scope (or more specifically on the scope as songData). Once you do this ($scope.songData = myFinalArray) then ng-grid will see that and populate the page.

    //Code here
});




