var htagbtApp = angular.module('htagbtApp', ['ngRoute']);

htagbtApp
  .config(Route)
  .controller('listePostesController', listePostesController)
  .controller('infosPosteController',  infosPosteController)

function Route($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'recherche.html',
    controller: 'listePostesController',
  })
  .when('/poste/:idsitr', {
    templateUrl: 'poste.html',
    controller: 'infosPosteController'
  });
};

function listePostesController($scope, $http) {
  var listePostes = this;
  listePostes.postes = [];
  listePostes.recherche = "";
  listePostes.loading = true;

  listePostes.ajaxUpdate = function(url) {
    listePostes.loading = true;
    $http.get(url)
        .success(function(data){
          listePostes.loading = false;
          listePostes.postes = data;
        });
  };

  listePostes.search = function(q) {
    listePostes.ajaxUpdate("api/API/postehta.php?chaine="+encodeURIComponent(q));
  };

  listePostes.searchCoords = function (coords) {
    listePostes.ajaxUpdate("api/API/postehta.php?x="+coords[0]+"&y="+coords[1]);
  };

  listePostes.setQuery = function (query) {
    if (query !== '') listePostes.search(query);
    else listePostes.searchCoords(listePostes.coords);
  }

  var watchID = navigator.geolocation.watchPosition(function(position) {
    listePostes.coords = [position.coords.latitude, position.coords.longitude];
    if (listePostes.recherche === "") listePostes.searchCoords(listePostes.coords);
  });
};

function infosPosteController($routeParams, $http) {
  var infosPoste = this;
  infosPoste.idsitr = $routeParams.idsitr;
  infosPoste.infos  = {};
  infosPoste.loading = true;

  function update() {
    $http.get("api/API/infosposte.php?idsitr="+infosPoste.idsitr)
        .success(function(data){
          infosPoste.loading = false;
          infosPoste.infos   = data;
        });
  }

  infosPoste.addComment = function() {
    var url = "api/API/ajout_commentaire.php" +
              "?idsitr=" + infosPoste.idsitr + 
              "&commentaire=" + encodeURIComponent(infosPoste.newComment) + 
              "&type=commentaire";
    $http.get(url).success(function(res){
      update();
    });
    infosPoste.newComment = "";
  }

  update();
}
