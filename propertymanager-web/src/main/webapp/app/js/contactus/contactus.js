app.controller('ContactUsController', [ '$rootScope', '$scope', 'toaster', 'ContactUSService', $$ContactUsController ]);
function $$ContactUsController($rootScope, $scope, toaster, ContactUSService) {

	$scope.showFAQ = function() {
		$("#FAQ").show();
		$("#contactUs").hide();
	}
	$scope.back = function() {
		$("#FAQ").hide();
		$("#contactUs").show();
	}

	$scope.maxLength = 500;
	$scope.phone = 5196615503;
	$scope.customerTopic = "General Inquiry";
	$scope.customerMessage = "";
	$scope.selectedId = {
		data : null
	};
	$scope.customerId = "";

	$scope.supportGrpMailId = "dasg@londonhydro.com"

	$scope.sendUserMessage = function() {
		if ($rootScope.workingUser.customerId != null) {
			$scope.customerId = $rootScope.workingUser.customerId;
		} else if ($rootScope.accessibleCustomers.length == 1) {
			$scope.customerId = $rootScope.accessibleCustomers[0].customerId;
		} else if ($rootScope.accessibleCustomers.length > 1) {
			$scope.customerId = $scope.selectedId.data.customerId;
		}

		var requestform = {
			topic : $scope.customerTopic,
			message : $scope.customerMessage,
			supportGrpMailId : $scope.supportGrpMailId
		};
		ContactUSService.sendUserMessage($scope.customerId, requestform).then(function(response) {
			toaster.pop({
				type : 'success',
				title : "Confirmation",
				body : "Message sent Successfuly."
			});
		}, function(httpresponse) {
			console.log('fail', httpresponse);
			toaster.pop({
				type : 'warning',
				title : "Error",
				body : httpresponse.statusText,
				timeout : 300000
			});
		});

	}

	$scope.showHideContinuousServiceAgreement = function(index) {
		// $('[id^="Continuous_Service_Agreement-"]').hide();
		$("#Continuous_Service_Agreement-" + index).toggle();
	}
	$scope.showHideMoveInandMoveOuts = function(index) {
		// $('[id^="Move_In_and_Move_Outs-"]').hide();
		$("#Move_In_and_Move_Outs-" + index).toggle();
	}

	$scope.showHideGeneral = function(index) {
		// $('[id^="General-"]').hide();
		$("#General-" + index).toggle();
	}

	$scope.contactUsTopics = [ {
		value : 'General Inquiry',
		text : 'General Inquiry'
	}, {
		value : 'Move Inquiry',
		text : 'Move Inquiry'
	}, {
		value : 'Service Disconnection',
		text : 'Service Disconnection'
	}, {
		value : 'Continuous Service Agreement',
		text : 'Continuous Service Agreement'
	}, {
		value : 'Property Delegation',
		text : 'Property Delegation'
	} ];

	$scope.faqObjects = {
		"Continuous_Service_Agreement" : [
				{
					"question" : "1. What is the CSA?",
					"answer" : "The Continuous Service Agreement (CSA) is an agreement between a property owner and London Hydro. This agreement says that London Hydro will put the utility services in your name once your tenant moves out and there is a gap before the next tenant. This will ensure that services stay on to avoid property damage, and to avoid cut and reconnect fees."
				},
				{
					"question" : "2. How do I apply or enroll in the CSA?",
					"answer" : "You can enroll in the CSA by selecting Enroll next to your units in the My Properties page of this website. Note that only the owner is able to Enroll."
				}, {
					"question" : "3. How do I remove a property from the CSA?",
					"answer" : "Please contact London Hydro to remove a property from the CSA."
				}

		],
		"Move_In_and_Move_Outs" : [
				{
					"question" : "4. The tenant was supposed to cancel a move out, but I received an email notifying me that the move out is occurring.",
					"answer" : "The email notifying you about the move out may have been sent prior to the move out being cancelled by the tenant. The information on the website will reflect the status of the move out. If it is still showing as a pending move out, then the tenant's request to move out was not cancelled."
				},
				{
					"question" : "5. The tenant was supposed to change the move out date, but I received an email notifying me that the move out is occurring on the wrong date.",
					"answer" : "The email notifying you about the move out may have been sent prior to the move out date being changed. The information on the website will reflect the status of the move out. If it is still showing as the wrong move out date, then the tenant's request to change the move out date has not been received."
				},
				{
					"question" : "6. I have tenants renting a location but the location is not showing as tenant occupied. How can I be sure my tenants contact you to sign up for service?",
					"answer" : "When the tenant signs the lease (before you give the tenant keys), have them complete and sign the application for service. See attached link. Two pieces of ID are required (one with a photo). Once the application has been completed and signed, you can submit it on his/her behalf. See contact information at the bottom of the form. London Hydro needs to receive requests a minimum of 2 business days before the date of the final read. The move in application can also be completed online using MyLondonHydro."
				},
				{
					"question" : "7. Do cancelled move in requests or cancelled move out requests display on the website?",
					"answer" : "No, only pending move ins or pending move outs are presented on the website. If a move in or move out is cancelled, the move in or move out date will no longer display on the website."
				},
				{
					"question" : "8. The tenant is moving out. How do I ensure the services do not remain in his/her name but instead, revert back to the owner so that no disconnection occurs?",
					"answer" : "Send London Hydro notice that you would like to be moved back in because the tenant is moving out. Include the name of the tenant(s), the service address and the final read date. We need to receive requests a minimum of 2 business days before the date of the final read. We will put the services back in your name after the final read date. If anything changes (the tenant decides to stay longer), just let us know and we can restore services in the tenant’s name as long as advance notice is received (2 business days)."
				},
				{
					"question" : "9. I submitted a move in or move out request a while ago for a future dated move but the move is not reflected on the website. Why?",
					"answer" : "We process moves by prioritizing them by date. If the move is sometime in the future, it may still be in our actionable item files. Final reads will be processed (at the latest), 2 business days in advance of the move out date. If the final read is not reflected, 2 business days in advance of the date on the website or you want to confirm that the move request was received, please contact us by email PropertyManagement@londonhydro.com. Move in and move out requests can be processed online using MyLondonHydro."
				},
				{
					"question" : "10. I submitted a signed application but the move in date does not match to the date on the application. Why?",
					"answer" : "We need to receive requests a minimum of 2 business days before the date of the final read. We do not back dates moves if received late."
				},
				{
					"question" : "11. Will a changed move in date be shown on the website?",
					"answer" : "Similar to a cancellation of a move in or move out, only the most up to date move requests will display on the website."
				},
				{
					"question" : "12. A tenant has requested a move out and it is not the end of the lease?",
					"answer" : "The lease is an agreement between the tenant and the owner. Therefore these situations must be resolved between the tenant and the owner."
				},
				{
					"question" : "13. Do I get charged anything extra when I get moved in after my tenant moves out?",
					"answer" : "London Hydro does not charge an account set up fee and does not assess a deposit when the owner gets moved in between tenants. Invoices should be minimal if the location is vacant."
				} ],
		"General" : [
				{
					"question" : "14. How current is the information presented on the website?",
					"answer" : "In most cases, the information is updated on a daily basis."
				},
				{
					"question" : "15. Why don't I receive notice that service is about to be disconnected?",
					"answer" : "Due to privacy laws, we cannot post this information to the landlord/property manager. However once the service is disconnected, you will receive notification."
				},
				{
					"question" : "16. The location is disconnected and the previous tenant has moved out. How do I get it reconnected and put back in my name or a new tenant's name?",
					"answer" : "Fax a note to our London Hydro Collections department 519-661-5060 and include the address or scan a signed letter and email it to Collections1@londonhydro.com), the names of the previous tenant(s) and indicate he/she has vacated and that you want the services restored and put back in your name. If a new tenant is moving in, the note must indicate that the new tenant has no relationship to the old tenant. You must submit a signed application for the new tenant. Note: If the location has been disconnected for more than 6 months, we require ESA inspection before reconnection can occur. ESA phone number is 1-877-372-7233 (1-877-ESA-SAFE)"
				},
				{
					"question" : "17. I have a tenant that is having difficulty paying the utility bill. Is there anything I can suggest?",
					"answer" : "LEAP (Low Income Energy Assistance Program) provides emergency financial relief to cover the cost of utility bill arrears in order to avoid disconnection of service. LEAP applications are completed at satellite sites throughout the City of London and at the Salvation Army Centre of Hope. Applicants may contact the information line 519-661-0343 ext. 300 for eligibility criteria, satellite locations and contact information. Applications are by appointment only. OESP (Ontario Electricity Support Program) provides a monthly credit on income eligible electricity customers bills based on household income and household size.  Customer can apply online at https://ontarioelectricitysupport.ca/ Customers can contact our office for a paper application or can come to our office or the Salvation Army to apply in person.  Customers must have the names, social insurance numbers and dates of birth of all household members."
				},
				{
					"question" : "18. What is London Hydro's contact information?",
					"answer" : "Mailing Address:Customer Service Dept., London Hydro, 111 Horton Street, P.O. Box 2700, London, ON N6A 4H6    Phone Inquiries:519-661-5503 from 8:30 am to 4:00 pm - Monday to Friday   Web Site:http://www.londonhydro.com \nCustomer Service Fax:519-661-5838 \nDrop Box Locations:Visitors' Parking, (off Talbot Street, northeast entrance) and 111 Horton Street entrance"
				} ]
	}
};
