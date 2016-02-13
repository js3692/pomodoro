app.service('InboxSettings', function ($uibModal) {

	this.open = function (inboxId) {
		return $uibModal.open({
			templateUrl: '/js/inbox/settings.html',
    	size: 'sm',
    	resolve: {
    		userId: function (Session) {
    			return Session.user._id;
    		},
    		inbox: function (Session, InboxFactory) {
    			return InboxFactory.getInbox(Session.user._id, inboxId);
    		}
    	},
			controller: ['$scope', '$uibModalInstance', 'userId', 'inbox', 'InboxFactory', function ($scope, $uibModalInstance, userId, inbox, InboxFactory) {
				$scope.inbox = {
					title: inbox.title
				};
				$scope.loading = false;

				$scope.close = $uibModalInstance.close;

				$scope.update = function (newInbox) {
					$scope.loading = true;
					InboxFactory.updateInbox(userId, inbox._id, newInbox)
						.then(function (updatedInbox) {
							$scope.loading = false;
							$scope.close(updatedInbox.title);
						});
				}
			}]
  	});

	}
});