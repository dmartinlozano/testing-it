'use strict';

/**
 * @ngdoc function
 * @name test4qaApp.directive:testManagementFind
 * @description
 * # testManagementFind
 * Directive of the test4qaApp
 */
angular.module('test4qaApp')
.directive('preconditionsAddEdit', function() {
  return {
    restrict: 'E',
    controller: ['$scope', '$rootScope', 'TestCaseCrudService', function($scope, $rootScope, TestCaseCrudService) {

      $scope.newPrecondition = true;
      $scope.index; //used only in edition mode
      $scope.precondition = "";

      //get testCase to add new precondition
      $rootScope.$on('preconditions.directive.newPrecondition:testCase', function($event, testCase) {
        $scope.newPrecondition = true;
        $scope.testCase = testCase;
        $scope.precondition = "";
      });

      //get testCase to edit a precondition
      $rootScope.$on('preconditions.directive.editPrecondition:testCase', function($event, testCase, index) {
        $scope.newPrecondition = false;
        $scope.testCase = testCase;
        $scope.index = index;
        $scope.precondition = testCase.preconditions[index];
      });

      $scope.addEditPrecondition = function(){
        if ($scope.newPrecondition === true){
          //New precondition
          $scope.testCase.preconditions.push($scope.precondition);
        }else{
          //Edit precondition
          $scope.testCase.preconditions[$scope.index] = $scope.precondition;
        }
        TestCaseCrudService.updateFieldTestCase($scope.testCase._id,'preconditions',$scope.testCase.preconditions).
        then(function(){}).catch(function(res){
          $rootScope.$emit('alert', '[' + res.status + '] ' + res.data.message);
        });
        $('#preconditionsAddEditModal').modal('hide');
      }


    }],
    templateUrl: 'views/modal/preconditions/preconditions-add-edit.html'
  };
});
