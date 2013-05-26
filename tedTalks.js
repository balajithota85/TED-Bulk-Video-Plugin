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

(function(window, undefined){
	var temp = undefined,
		talkLinks = undefined, 
		talks = [],
		downloadLinks = [],
		noOfTalkLinks = 0,
		document = window.document,
		tedMainURL = "http://www.ted.com/",
		tedTalksRegex = /http:\/\/www.ted.com\/talks.*/,
		count = 0,
		htmlStreamsLength = 14;

	function getDownloadLink( talk, i ) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", talk, true);
		xhr.onreadystatechange = function() {
			if ( xhr.readyState == 4 ) {
				var resp = xhr.responseText;
				var start = resp.indexOf('htmlStreams');
	    		if ( start !== -1 ) {
	    			var end = resp.indexOf(']', start);
	    			resp = resp.substring(start + htmlStreamsLength ,end);

	    			var highQualityStart = resp.indexOf('high","file":"'),
	    				standardQualityStart = resp.indexOf( 'standard","file":"' );
	    				
	    			if ( highQualityStart !== -1 ) {
	    				var highQualityEnd = resp.indexOf( '"', highQualityStart + 14 );
			    		downloadLinks[i] = resp.substring( highQualityStart + 14, highQualityEnd ).replace(/\\/g,"");;
			    	} else if ( resp.match(standardQualityRegex) !== null ) {
			    		var standardQualityEnd = resp.indexOf( '"', standardQualityStart + 18 );
			    		downloadLinks[i] = resp.substring( standardQualityStart + 18, standardQualityEnd ).replace(/\\/g,"");;
			    	} else{
			    		/*do nothing*/
			    		/*TODO*/
			    	}	
	    		} else{
	    			downloadLinks[i] = undefined;
	    		}

	    		count = count-1;
		    	if( count === 0) {
		    		chrome.runtime.sendMessage({tedDownloadLinks: downloadLinks});	
		    	}
		  	}
		}
		xhr.send();	
	}
	
	/*need to write logic for various pages*/
	if(document.URL === tedMainURL) {
		talkLinks = document.getElementById('theAppContainer').getElementsByClassName('fractal-link');
	}else if(document.URL.match(tedTalksRegex) !== null && document.URL.match(tedTalksRegex).length === 1){
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
	}else{
		/*do nothing
		In future might get more link regex's*/
	}
		
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
		chrome.runtime.sendMessage({tedTalks: talks});
	}
	
})(window);
