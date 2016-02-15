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

app.controller('DashboardCtrl', [
		'$scope',
		'$q',
		'$timeout',
		'$state',
		'$compile',
		'user',
		'inboxes',
		'tasks',
		'InboxFactory',
		'TaskFactory',
		'InboxSettings',
		'TaskSettings',
		'AuthService',
	function ($scope, $q, $timeout, $state, $compile, user, inboxes, tasks, InboxFactory, TaskFactory, InboxSettings, TaskSettings, AuthService) {
  $scope.logout = function (event) {
  	event.stopPropagation();
    AuthService.logout().then(function () {
      $state.go('home');
    });
  };
	$scope.user = user;
	$scope.inboxes = inboxes;
	$scope.tasks = tasks;
	$scope.timerQueue = [];
	$scope.timerRunning = false;

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
				_.pullAt($scope.inboxes, idx);
			})
	}

	var dummyTask = {
		empty: true,
		inbox: {
			title: "Select a task"
		}
	}

	var convertDateForTask = function (task) {
		task.due = new Date(Date.parse(task.due))
		return task;
	}

	var arrangePomodoros = function (numberOfPomodoros) {
		$scope.timerQueue = [];
		while (numberOfPomodoros > 0) {
			// var five = $compile("<timer interval=\"1000\" countdown=\"5\" finish-callback=\"finished(false)\">{{ mminutes }}:{{ sseconds }}</timer>")
			// var three = $compile("<timer interval=\"1000\" countdown=\"3\" finish-callback=\"finished(true)\">{{ mminutes }}:{{ sseconds }}</timer>")
			// $scope.timerQueue.push(five, three)
			var fiveMinuteTimer = $compile("<timer interval=\"1000\" countdown=\"300\" finish-callback=\"finished()\">{{ mminutes }}:{{ sseconds }}</timer>");
			var twentyFiveMinuteTimer = $compile("<timer interval=\"1000\" countdown=\"1500\" finish-callback=\"finished()\">{{ mminutes }}:{{ sseconds }}</timer>")
			$scope.timerQueue.push(twentyFiveMinuteTimer, fiveMinuteTimer)
			numberOfPomodoros--;
		}
		$scope.timerQueue.pop();
	}

	$scope.currentTask = dummyTask;



	$scope.select = function (event, task) {
    angular.element("#dashboard .inbox-tasks .task span").removeClass('active');
		angular.element(event.target).addClass('active');
		$scope.currentTask = convertDateForTask(task);
		arrangePomodoros($scope.currentTask.pomodoros);
	}

	$scope.createTask = function (event, inboxId) {
		event.stopPropagation();
		TaskFactory.createTask($scope.user._id, inboxId)
			.then(function (newTask) {
				$scope.tasks.push(newTask);
				$timeout(function () {
					var spanId = "span#" + inboxId + "-" + ($scope.tasksInInbox(inboxId).length - 1)
					angular.element("#dashboard .inbox-tasks .task span").removeClass('active');
					angular.element(spanId).addClass('active');
					$scope.currentTask = convertDateForTask(newTask);
				}, 100)
			});
	}

	$scope.deleteTask = function (inboxId, taskId) {
		TaskFactory.deleteTask($scope.user._id, inboxId, taskId)
			.then(function () {
				var idx = _.findIndex($scope.tasks, { _id: taskId });
				_.pullAt($scope.tasks, idx);
		  	angular.element("#dashboard .inbox-tasks .task span").removeClass('active');
				$scope.currentTask = dummyTask;
			})
	}

	$scope.editTaskTitle = function (inboxId, taskId) {
		var TaskSettingsModal = TaskSettings.open(inboxId, taskId);
		$q.when(TaskSettingsModal.result).then(function (updatedTaskTitle) {
			if(updatedTaskTitle) {
				$scope.tasks.filter(task => {
					if(task._id === taskId) task.title = updatedTaskTitle;
				});
			}
		});
	}

	$scope.changePomodoro = function (number) {
		$scope.currentTask.pomodoros += number;
		$scope.updateTask($scope.currentTask);
		arrangePomodoros($scope.currentTask.pomodoros);
	}

	$scope.changePriority = function (higher) {
		var newPriority;
		if ($scope.currentTask.priority === 'low') newPriority = higher ? 'normal' : '';
		else if ($scope.currentTask.priority === 'normal') newPriority = higher ? 'high' : 'low';
		else if ($scope.currentTask.priority === 'high') newPriority = higher ? '' : 'normal';

		if(newPriority) $scope.currentTask.priority = newPriority;

		$scope.updateTask($scope.currentTask);
	}

	$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	$scope.days = function (currentDate) {
		if(currentDate) {
			var days = [];
			var dummyDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
			var end = dummyDate.getDate();
			for (var i = 1; i <= end; i++) { days.push(i); };
			return days;
		} else return;
	}

	$scope.years = function () {
		var now = new Date();
		var year = now.getFullYear();
		return [year, year + 1, year + 2];
	}

	$scope.selectDate = function (month, day, year) {
		if(month) $scope.currentTask.due.setMonth($scope.months.indexOf(month));
		else if(day) $scope.currentTask.due.setDate(day);
		else if (year) $scope.currentTask.due.setFullYear(year);

		$scope.updateTask($scope.currentTask);
	}

	$scope.updateTask = function (task) {
		delete task.__v;
		delete task.lastModified;
		var inboxId = task.inbox._id;
		var taskId = task._id;
		TaskFactory.updateTask($scope.user._id, inboxId, taskId, task)
			.then(function (updatedTask) {
				var idx = _.findIndex($scope.tasks, { _id: taskId });
				_.pullAt($scope.tasks, idx);

				$scope.tasks.splice(idx, 0, updatedTask);

				$scope.currentTask = convertDateForTask(updatedTask);
			})
	}

	$scope.startTimer = function () {
		$scope.timerRunning = true;
		var nextTimer = $scope.timerQueue.shift();
		angular.element("div.time").append(nextTimer($scope))
	}

	$scope.cancelTimer = function () {
		$scope.timerRunning = false;
		angular.element("timer")[0].clear();
		angular.element("timer").remove();
		$scope.currentTask.pomodoros--;
		$scope.updateTask($scope.currentTask);
		$scope.timerQueue.shift();
	}

	$scope.finished = function (isBreak) {
		angular.element("timer").remove();

		if (!isBreak) {
			$scope.currentTask.pomodoros--;
			$scope.updateTask($scope.currentTask);
		}

		if($scope.timerQueue.length > 0) {
			var nextTimer = $scope.timerQueue.shift();
			$timeout(function () {
				angular.element("div.time").append(nextTimer($scope));
			}, 1000)
		} else {
			$scope.timerRunning = false;
			alert("Task Completed!")
		}
	}
}]);