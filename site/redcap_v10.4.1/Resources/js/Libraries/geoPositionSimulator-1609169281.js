//
// javascript-mobile-desktop-geolocation
// https://github.com/estebanav/javascript-mobile-desktop-geolocation
//
// Copyright J. Esteban Acosta Villafañe
// Licensed under the MIT licenses.
//
// Based on Stan Wiechers > geo-location-javascript v0.4.8 > http://code.google.com/p/geo-location-javascript/
//
// Revision: $Rev: 01 $:
// Author: $Author: estebanav $:
// Date: $Date: 2012-09-07 23:03:53 -0300 (Fri, 07 Sep 2012) $:


var geoPositionSimulator=function(){
	var pub = {};
	var currentPosition=null;
	/*
	* Example:
	* array = [ { coords: {
	*						latitude: 	30.293095,
	*						longitude: 	-97.5763955
	*						}
	*			}]
	*
	*/
	pub.init = function(array)
	{
		var next=0;
		for (i in array)
		{
				if( i == 0 )
				{
					currentPosition=array[i];
				}
				else
				{
					setTimeout((function(pos) {
					      return function() {
					        currentPosition=pos;
					      }
					    })(array[i]),next);
				}
				next+=array[i].duration;
		}
	}

	pub.getCurrentPosition = function(locationCallback,errorCallback)
	{
		locationCallback(currentPosition);
	}
	return pub;
}();