app.factory('InboxFactory', ['$http', function ($http) {
	
	function extract (response) {
		return response.data;
	}

	return {
		createInbox: function (userId) {
			return $http.post('/api/users/' + userId + '/inbox')
				.then(extract);
		},
		getInbox: function (userId, inboxId) {
			return $http.get('/api/users/' + userId + '/inbox/' + inboxId)
				.then(extract);
		},
		updateInbox: function (userId, inboxId, update) {
			return $http.put('/api/users/' + userId + '/inbox/' + inboxId, update)
				.then(extract);
		},
		deleteInbox: function (userId, inboxId) {
			return $http.put('/api/users/' + userId + '/inbox/' + inboxId, { delete: true })
				.then(extract);
		}
	}
}]);