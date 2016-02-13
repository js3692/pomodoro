app.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		templateUrl: 'js/dashboard/dashboard.html',
  	data: {
    	authenticate: true
  	},
  	resolve: {
  		user: function (Session) {
  			return Session.user;
  		},
  		inboxes: function (Session) {
  			return Session.user.inbox;
  		},
  		tasks: function (Session, TaskFactory, $q) {
  			var taskPromises = [];
  			Session.user.inbox.forEach(inbox => {
  				taskPromises.push($q.when(TaskFactory.getAllTasks(Session.user._id, inbox._id)));
  			})
  			return $q.all(taskPromises)
  				.then(function (allTasks) {
  					return allTasks.reduce((returnArray, taskArray) => {
  						return returnArray.concat(taskArray);
  					}, [])
  				});
  		}
  	},
		controller: 'DashboardCtrl'
	});
}]);

app.controller('DashboardCtrl', ['$scope', '$q', 'user', 'inboxes', 'tasks', 'InboxFactory', 'TaskFactory', 'InboxSettings', function ($scope, $q, user, inboxes, tasks, InboxFactory, TaskFactory, InboxSettings) {
	$scope.user = user;
	$scope.inboxes = inboxes;
	$scope.tasks = tasks;

	$scope.$watch('inboxes', function (newSet) {
    $scope.inboxes = newSet;
  });

  $scope.$watch('tasks', function (newSet) {
    $scope.tasks = newSet;
  });
	
	$scope.tasksInInbox = function (inboxId) {
		return $scope.tasks.filter(task => { return task.inbox._id === inboxId });
	}

	$scope.editInbox = function (event, inboxId) {
		event.stopPropagation();
		var InboxSettingsModal = InboxSettings.open(inboxId);
		$q.when(InboxSettingsModal.result).then(function (updatedInboxTitle) {
			if(updatedInboxTitle) {
				$scope.inboxes.filter(inbox => {
					if(inbox._id === inboxId) inbox.title = updatedInboxTitle;
				});
			}
		});
	}

	$scope.createInbox = function () {
		InboxFactory.createInbox($scope.user._id)
			.then(function (newInbox) {
				$scope.inboxes.push(newInbox);
			});
	}

	$scope.deleteInbox = function (event, inboxId) {
		event.stopPropagation();
		InboxFactory.deleteInbox($scope.user._id, inboxId)
			.then(function () {
				var idx = _.findIndex($scope.inboxes, { _id: inboxId });
				console.log('hey', idx)
				_.pullAt($scope.inboxes, idx);
			})
	}

	$scope.createTask = function (event, inboxId) {
		event.stopPropagation();
		// $scope.tasks.push({ title: "test" });
		
	}

}]);