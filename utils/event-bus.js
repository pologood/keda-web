import Auth from 'utils/auth';
import Util from 'utils/util';
import Constants from 'utils/constants';
import Global from 'utils/global';
const CHANNEL_CODE = Global.getAppName();
let listeners = {};
let buffer = {};
let isLoopStarted = false;
let chromeVersion = 0;
export function postMessage (eventCode, message) {
	console.log(`postMessage${eventCode}`);
	if(getChromeVersion() <= 60){
		if(!message){
			message = {status: '0'};
		}
		message.timestamp = new Date().getTime();
		localStorage.setItem(CHANNEL_CODE + '_' + eventCode, JSON.stringify(message));
	}else{
		let channel = new window.BroadcastChannel(CHANNEL_CODE);
		let data = {
			timestamp: new Date().getTime(),
			eventCode: eventCode,
			message: message
		};
		if (!Util.isEmpty(Auth.getJwtToken())) {
			channel.postMessage(data);
		}
	}
};

export function onMessage (eventCode, callback) {
	if(getChromeVersion() <= 60){
		if(!listeners[CHANNEL_CODE + '_' + eventCode]) {
			listeners[CHANNEL_CODE + '_' + eventCode] = [];
			buffer[CHANNEL_CODE + '_' + eventCode] = false;
		}
		listeners[CHANNEL_CODE + '_' + eventCode].push(callback);
		if(!isLoopStarted) {
			isLoopStarted = loop();
		}
	}else{
		let channel = new window.BroadcastChannel(CHANNEL_CODE);
		channel.onmessage = function (ev) {
			console.log(`onMessage>>>${eventCode},${ev.data.eventCode}`);
			if (eventCode === ev.data.eventCode && ev.data.eventCode === Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN) {
				Util.isWindowClosed(function (result) {
					if (result) {
						window.opener = this;
						window.close();
						Auth.clearStorage();
					}
				});
			}
			if (ev.data.eventCode === eventCode) {
				if (ev.data.eventCode === eventCode && callback) {
					callback(ev.data.message);
				}
			}
		};
	}
};

var loop = function() {
	for(let namespace in listeners) {
		let data = localStorage.getItem(namespace);
		console.log('namespace[' + namespace + ']>>>', data);
		if(data && !buffer[namespace]) {
			let timestamp = data.timestamp;
			let now = new Date().getTime();
			if(now - timestamp >= 1900){
				// localStorage.removeItem(namespace);
			}else{
				buffer[namespace] = true;
				try {
					var parsed = JSON.parse(data);
					if(parsed) data = parsed;
					for(let i = 0; i < listeners[namespace].length; i++) {
						// console.log('listeners[' + namespace + '][' + i + ']>>>', listeners[namespace][i]);
						if(namespace === CHANNEL_CODE + '_' + Constants.EVENT_BUS_CODE_CLOSE_ALL_WIN) {
							Util.isWindowClosed(function (result) {
								if (result) {
									window.opener = this;
									window.close();
									Auth.clearStorage();
								}
							});
						}else if(typeof listeners[namespace][i] === 'function'){
							listeners[namespace][i](data);
						}else {
							// console.log('typeof listeners[namespace][i]>>>', typeof listeners[namespace][i]);
						}
					}
				} catch(e) {}
			}
		} else if(!data) {
			buffer[namespace] = false;
		}
	}
	setTimeout(loop, 1000);
	return true;
};

export function getChromeVersion() {
	if(chromeVersion <= 0){
		let arr = navigator.userAgent.split(' ');
		var result = '';
		for(let i = 0; i < arr.length; i++){
			if(/chrome/i.test(arr[i])){
				result = arr[i];
			}
		}
		if(result){
			chromeVersion = Number(result.split('/')[1].split('.')[0]);
		}
	}
	return chromeVersion;
}
