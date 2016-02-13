app.factory('TaskFactory', ['$http', function ($http) {
	
	function extract (response) {
		return response.data;
	}

	return {
		getAllTasks: function (userId, inboxId) {
			return $http.get('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.then(extract);
		},
		createTask: function (userId, inboxId) {
			return $http.post('/api/users/' + userId + '/inbox/' + inboxId + '/tasks')
				.then(extract);
		},
		updateTask: function (userId, inboxId, taskId, update) {
			return $http.put('/api/users/' + userId + '/inbox/' + inboxId + '/tasks/' + taskId, update)
				.then(extract);
		}
	}
}]);