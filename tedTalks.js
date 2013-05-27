/* ==========================================================
 * tedTalks.js v1.0
 * https://github.com/balajithota85/TED-Bulk-Video-Plugin
 * ==========================================================
 * Copyright 2013 balaji thota.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

(function (window, undefined) {
	var temp = undefined,
      	talkLinks = undefined, 
		talks = [],
		downloadLinks = [],
		noOfTalkLinks = 0,
		document = window.document,
		url = document.URL,
		tedMainURL = "http://www.ted.com/",
		tedUserTalksRegex = /http:\/\/www.ted.com\/talks\/.*/,
		tedTalksRegex = /http:\/\/www.ted.com\/talks.*/,
		count = 0,
		fetch = true,
		htmlStreamsLength = 14,
		standardLength = 18,
		highLength = 14;

	function getDownloadLink( talk, i, fetch) {
		var xhr = new XMLHttpRequest();
		xhr.open( "GET", talk, true );
		xhr.onreadystatechange = function() {
			if ( xhr.readyState === 4 ) {
				var resp = xhr.responseText;
				var start = resp.indexOf( 'htmlStreams' );
	    		if ( start !== -1 ) {
	    			var end = resp.indexOf( ']', start );
	    			resp = resp.substring( start + htmlStreamsLength, end );

	    			var highQualityStart = resp.indexOf( 'high","file":"' ),
	    				standardQualityStart = resp.indexOf( 'standard","file":"' );
	    				
	    			if ( highQualityStart !== -1 ) {
	    				var highQualityEnd = resp.indexOf( '"', highQualityStart + highLength );
			    		downloadLinks[i] = resp.substring( highQualityStart + highLength, highQualityEnd ).replace( /\\/g, "" );;
			    	} else if ( resp.match( standardQualityRegex ) !== null ) {
			    		var standardQualityEnd = resp.indexOf( '"', standardQualityStart + standardLength );
			    		downloadLinks[i] = resp.substring( standardQualityStart + standardLength, standardQualityEnd ).replace( /\\/g, "" );;
			    	} else{
			    		/*do nothing*/
			    		/*TODO*/
			    	}	
	    		} else{
	    			downloadLinks[i] = undefined;
	    		}

	    		count = count-1;
		    	if( count === 0) {
		    		chrome.runtime.sendMessage( { tedDownloadLinks: downloadLinks } );	
		    	}
		  	}
		}
		xhr.send();	
	}
	
	/*need to write logic for various pages*/
	if (url === tedMainURL) {
		talkLinks = document.getElementById('theAppContainer').getElementsByClassName('fractal-link');
	} else if ( url.match(tedUserTalksRegex) !== null && url.match(tedUserTalksRegex).length === 1 ) {
		fetch = false;
	} else if (url.match(tedTalksRegex) !== null && url.match(tedTalksRegex).length === 1){
		temp = document.getElementById('content').getElementsByClassName('col');
		if(temp !== undefined && temp !== null && temp.length > 0) {
			var tempLength = temp.length;
			talkLinks = [];
			for(var i=0; i<tempLength; i++){
				var t = temp[i].getElementsByTagName('a');
				if(t !== undefined && t !== null && t.length === 1) {
					talkLinks[i] = temp[i].getElementsByTagName('a')[0];	
				} else {
					talkLinks[i] = undefined;
				}
			}
		}
	} else{
		/*do nothing
		In future might get more link regex's*/
	}
	
	if ( fetch ) {
		if(talkLinks !== undefined && talkLinks !== null && talkLinks.length > 0) {
			noOfTalkLinks = talkLinks.length;
			count = noOfTalkLinks;
			for(var i=0; i<noOfTalkLinks; i++){
				if(talkLinks[i] !== undefined && talkLinks[i] !== null) {
					talks[i] = talkLinks[i].getAttribute("href");
					getDownloadLink(talks[i], i);
				} else {
					talks[i] = undefined;
				}
			}
		}	
	} else {
		chrome.runtime.sendMessage( { tedDownloadLinks: [url] } );
	}
	
	
})(window);