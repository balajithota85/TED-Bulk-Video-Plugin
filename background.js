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

var tedRegex = /http:\/\/www.ted.com\/.*/;

function checkTEDUrl( id, info, tab ) {
	if ( tab.url.match( tedRegex ) ) {
		chrome.pageAction.show( id );
	}
};

chrome.tabs.onUpdated.addListener(checkTEDUrl);