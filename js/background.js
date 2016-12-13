"use strict";

const getWordMeaning = (msg) => {
    setTimeout(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let data = {name: msg, info: 'xxx', audio: 'https://iridescent.cn/static/GoT6/Game%20of%20Thrones%20Season%206%20trailer%20music%20(-Wicked%20Game-,%20James%20Vincent%20McMorrow).mp3'}
            chrome.tabs.sendMessage(tabs[0].id, data)
        });
    }, 300)
}

chrome.extension.onMessage.addListener(function(request, sender){
    getWordMeaning(request.message)
});