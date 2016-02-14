app.service('TaskSettings', function ($uibModal) {

	this.open = function (inboxId, taskId) {
		return $uibModal.open({
			templateUrl: '/js/task/settings.html',
    	size: 'sm',
    	resolve: {
    		userId: function (Session) {
    			return Session.user._id;
    		},
    		task: function (Session, TaskFactory) {
    			return TaskFactory.getTask(Session.user._id, inboxId, taskId);
    		}
    	},
			controller: ['$scope', '$uibModalInstance', 'userId', 'task', 'TaskFactory', function ($scope, $uibModalInstance, userId, task, TaskFactory) {
				$scope.task = {
					title: task.title
				};
				$scope.loading = false;

				$scope.close = $uibModalInstance.close;

				$scope.update = function (newTask) {
					$scope.loading = true;
					TaskFactory.updateTask(userId, inboxId, taskId, newTask)
						.then(function (updatedTask) {
							$scope.loading = false;
							$scope.close(updatedTask.title);
						});
				}
			}]
  	});

	}
});