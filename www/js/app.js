// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      alert("about to engage");
      if (typeof (Engagement) !== "undefined") {
        Engagement.startActivity("myPage", {});
        alert("engage done");
      } else {
        console.log("engage not available");
      }


      // Register for Push Notifications. Requires that phonegap-plugin-push be installed.
      var pushRegistration = null;
      function registerForPushNotifications() {

        alert("register, before push");

        if (!PushNotification) {
          return;
        }

        alert("about to init push");

        pushRegistration = PushNotification.init({
          android: { senderID: '531375899368' },
          ios: { alert: 'true', badge: 'true', sound: 'true' },
          wns: {}
        });

        alert("push init done");

        // Handle the registration event.
        pushRegistration.on('registration', function (data) {

          alert("registered");

          // Get the native platform of the device.
          var platform = device.platform;
          // Get the handle returned during registration.
          var handle = data.registrationId;

          alert(handle);
          $rootScope.registrationID = handle;

          // Set the device-specific message template.
          if (platform == 'android' || platform == 'Android') {
            // Register for GCM notifications.
            client.push.register('gcm', handle, {
              mytemplate: { body: { data: { message: "{$(messageParam)}" } } }
            });
          } else if (device.platform === 'iOS') {
            // Register for notifications.            
            client.push.register('apns', handle, {
              mytemplate: { body: { aps: { alert: "{$(messageParam)}" } } }
            });
          } else if (device.platform === 'windows') {
            // Register for WNS notifications.
            client.push.register('wns', handle, {
              myTemplate: {
                body: '<toast><visual><binding template="ToastText01"><text id="1">$(messageParam)</text></binding></visual></toast>',
                headers: { 'X-WNS-Type': 'wns/toast' }
              }
            });
          }

          var jqxhr = $.ajax({
            url: "https://argosstore-dev.doctus.com.co/Api/NotificationApi/Service/RegisterDevice",
            data: JSON.stringify(
              {
                "ApplicationID": "AIzaSyAVjwtQazTlXl-KWHgdjcWoWiE55y78OIQ",
                "Handle": handle,
                "Platform": "Android",
                "Tags": [],
                "Environment": false
              }),
            dataType: "json",
            type: "POST",
            contentType: "application/json"
          })
            .done(function (data) {
              alert("done register");
            })
            .fail(function () {
              alert("error register");
            })
            ;
        });

        pushRegistration.subscribe('perceptio-topic', function () {
          alert('success suscription');
        }, function (e) {
          alert('error suscription:');
          //console.log(e);
        });

        pushRegistration.on('notification', function (data, d2) {
          alert('Push Received: ' + data.message);
        });

        pushRegistration.on('error', function () {
          alert("error on notification");
        });
      }

      registerForPushNotifications();

    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  });
