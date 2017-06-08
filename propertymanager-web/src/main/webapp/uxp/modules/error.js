/*****************************************************************************
 *                                                                           *
 *                       Copyright (c) 2012-2013 London Hydro                *
 *                            ALL RIGHTS RESERVED                            *
 *                                                                           *
 *****************************************************************************
 *
 *  File Name:  error.js
 *
 *  Facility:   London Hydro UI Client
 *
 *  Author:     Affinity Systems
 *
 *  Revision History
 *
 *  Date        Author              Description
 *  -------     ------------------  -----------------------------------------
 *  24Jul13     Affinity Systems 	Original version
 */
var error = angular.module('lhError', ['ngRoute','ngResource']);

error.config([ '$httpProvider', function($httpProvider) {
	 $httpProvider.interceptors.push('errorHttpInterceptor');
}
	 ]);


/**
 * Error Factory.
 */
error.factory('ErrorService', function() {
   return {
      errorMessage: null,
      successMessage: null,
      setMessage: function(msg, type) {
    	  if(type == undefined || type == "error")
    		  this.errorMessage = msg;
    	  else
    		  this.successMessage = msg;
      },
      clear: function() {
         this.errorMessage = null;
         this.successMessage = null;
      }
   }; 
});

error.factory('errorHttpInterceptor', function($q, $location, $log, ErrorService, $rootScope, $window) {
	return function(promise) {
		return promise.then(function(response){
			return response;
		}, function(response){
			
			if(response.status === 400) {
        		
            /* The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications. */
			   //ErrorService.setMessage('Error 400 broadcasted by errorHttpInterceptor');
            return $q.reject(response);
            }
        	else if(response.status === 401) {
        		
        		/* The request requires user authentication. The response MUST include a Authorization Bearer header - OAuth 2 throws 401*/
        		//$rootScope.$broadcast('event:loginRequired');
        		//ErrorService.setMessage('401 - Please, check your credentials. User or Password incorrect.');
// TODO Fix constant redirection issue
//        		if(typeof $rootScope.corporateUrl != 'undefined'){
//        			$window.location.href= $rootScope.corporateUrl;
//    			}
        		return $q.reject(response);
            }
        	else if(response.status === 403) {
        		
        		/* The server understood the request, but is refusing to fulfill it. Authorization will be required - API throws 403 */
        	    //ErrorService.setMessage('Error 403 broadcasted by errorHttpInterceptor');
        	    //$rootScope.$broadcast('event:loginRequired');
        		return $q.reject(response);
            }
        	else if(response.status === 404) {
        		
        		/* The server has not found anything matching the Request-URI. */
        		//ErrorService.setMessage('Error 404 broadcasted by errorHttpInterceptor');
        		return $q.reject(response);
            }
        	else if(response.status === 500) {
        		
        		/* The server encountered an unexpected condition which prevented it from fulfilling the request. */
        		return $q.reject(response);
            }
            else {
            	return $q.reject(response);
            }
		});
	};
});