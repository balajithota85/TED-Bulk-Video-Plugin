/* ==========================================================
 * popup.js v1.0
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

var tedMainURL = "http://www.ted.com";

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		var talks = undefined,
			noOfTalks = 0,
			tedTalksTable = document.getElementById('tedTalks'),
			loadingDiv = document.getElementById('loading');

		if(request !== undefined && request !== null && request.tedDownloadLinks !== undefined && request.tedDownloadLinks !== null){
			talks = request.tedDownloadLinks;
			if(talks.length > 0) {
				noOfTalks = talks.length;
				for(var i=0; i<noOfTalks; i++){
					if(talks[i] !== undefined && talks[i] !== null) {
						var talkRow = document.createElement('tr'),
						talkColumn = document.createElement('td'),
						link = document.createElement('a'),
						talkNameStart = talks[i].lastIndexOf("/"),
						talkNameEnd = talks[i].lastIndexOf("?");

						link.href = talks[i];
						link.innerText = talks[i];

						if ( talkNameStart !== -1 && talkNameEnd !== -1 ) {
							link.download = talks[i].substring( talkNameStart + 1, talkNameEnd ); // Filename	
						}
						
						talkColumn.appendChild(link);
						talkRow.appendChild(talkColumn);
			    		tedTalksTable.appendChild(talkRow);
			    		/*download(link);*/
					}
				}
				loadingDiv.innerText = "Fetching complete.";
			}else{
				loadingDiv.innerText = "No video's.";
			}
		}
	}
);

function download(link) {
	link.click();
}

chrome.windows.getCurrent(
	function (currentWindow) {
		chrome.tabs.query(
			{active: true, windowId: currentWindow.id},
          	function(activeTabs) {
					chrome.tabs.executeScript(
					activeTabs[0].id, {file: 'tedTalks.js', allFrames: true}
				);
			}
		);
	}
);
