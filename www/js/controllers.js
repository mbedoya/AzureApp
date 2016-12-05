angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $rootScope) {

    $scope.testRegistration = function (handle) {

      //Se valida si el dispositivo ya se ha registrado en Azure (Servicio de doctus)
      if (!localStorage["argos_registroNotificaciones"]) {

        console.log("about to register");

        var urlServicioRegistro = "https://argosstore-dev.doctus.com.co/Api/NotificationApi/Service/RegisterDevice";
        var applicationID = "415b8b7b-ace4-48db-ac88-e30630a897fd";
        var usuario = "aareiza";

        var objetoEnvio = {
          "ApplicationID": applicationID,
          "Handle": handle,
          "Platform": "Android",
          "Tags": [{ usuario: usuario }],
          "Environment": false
        };

        console.log(objetoEnvio);

        var jqxhr = $.ajax({
          url: urlServicioRegistro,
          data: JSON.stringify(objetoEnvio),
          dataType: "json",
          type: "POST",
          contentType: "application/json"
        })
          .done(function (data) {

            console.log(data);

            if (!data.Data) {
              console.log("No se ha podido registrar el dispositivo");
              if(data.Header && data.Header.Message){
                console.log(data.Header.Message);
              }
            } else {
              console.log("Dispositivo registrado");
              localStorage["argos_registroNotificaciones"] = handle;
            }

          })
          .fail(function () {
            alert("error register");
          })
          ;

      } else {
        console.log("Registro ya realizado");
      }

    }

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };

    $scope.agruparVectorPorColumna = function (vector, columna) {
      vectorRespuesta = [];
      for (i = 0; i < vector.length; i++) {
        //Valores
        var vals = vector[i];

        var encontrado = false;

        if (vectorRespuesta.length > 0) {

          //Buscar en el vector destino si ya hay valores para esa columna
          for (i = 0; i < vectorRespuesta.length; i++) {

            var valsRespuesta = vectorRespuesta[i];
            if (valsRespuesta[columna] == vals[columna]) {
              encontrado = true;
              break;
            }
          }

          if (!encontrado) {
            vectorRespuesta.push(vals);
          }

        } else {
          vectorRespuesta.push(vals);
        }
      }

      return vectorRespuesta;

    }

    $scope.init = function () {

      orderArray = [];
      orderArray.push({ id: 1, val: "-XY", color: "blue" });
      orderArray.push({ id: 2, val: "-YZ", color: "yellow" });
      orderArray.push({ id: 3, val: "-XY", color: "gray" });
      orderArray.push({ id: 4, val: "-MX", color: "yellow" });

      //orderArray = $scope.agruparVectorPorColumna(orderArray, "color");

      // get handle on div
      var container = document.getElementById('container');
      // create table element
      var table = document.createElement('table');
      var tbody = document.createElement('tbody');
      // loop array
      for (i = 0; i < orderArray.length; i++) {
        // get inner array
        var vals = orderArray[i];
        // create tr element
        var row = document.createElement('tr');
        // loop inner array
        for (var b = 0; b < Object.keys(vals).length; b++) {
          // create td element
          var cell = document.createElement('td');
          // set text
          cell.textContent = vals[Object.keys(vals)[b]];
          // append td to tr
          row.appendChild(cell);
        }
        //append tr to tbody
        tbody.appendChild(row);
      }
      // append tbody to table
      table.appendChild(tbody);
      // append table to container
      container.appendChild(table);
    }

    $scope.init();
  });
