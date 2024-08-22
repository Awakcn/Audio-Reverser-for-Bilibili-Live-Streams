// ==UserScript==
// @name         Audio Reverser for Bilibili Live Streams
// @namespace    https://github.com/Awakcn/Audio-Reverser-for-Bilibili-Live-Streams
// @updateURL    https://github.com/Audio-Reverser-for-Bilibili-Live-Streams/blob/main/AudioReverser.user.js
// @downloadURL  https://github.com/Audio-Reverser-for-Bilibili-Live-Streams/blob/main/AudioReverser.user.js
// @version      1.1
// @description  reverse the left and right audio channels for Bilibili live streams B站直播音频声道反转
// @author       Awakcn
// @match        https://live.bilibili.com/blanc/5609440*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function reverseAudioChannels(videoElement) {
        if (!window.AudioContext) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(videoElement);

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const splitter = audioContext.createChannelSplitter(2);
        const merger = audioContext.createChannelMerger(2);

        splitter.connect(merger, 0, 1); // 左到右
        splitter.connect(merger, 1, 0); // 右到左

        source.connect(splitter);
        merger.connect(audioContext.destination);
    }

    function monitorVideoElement() {
        const videoElement = document.querySelector("#live-player > video");

        if (videoElement) {
            if (!videoElement.hasAttribute('data-audio-processed')) {
                reverseAudioChannels(videoElement);
                videoElement.setAttribute('data-audio-processed', 'true');
            }
        } else {
            setTimeout(monitorVideoElement, 500); // 再次检测
        }
    }

    function addButton() {
        const container = document.querySelector("#head-info-vm > div > div.rows-ctnr.rows-content > div.upper-row > div.left-ctnr.left-header-area");
        if (!container) {
            console.error("Control panel container not found.");
            return;
        }

        const button = document.createElement('button');
        button.textContent = '翻';
        button.style.padding = '2.5px';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'white';
        button.style.border = '1.5px solid white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.fontWeight = 'bold';
        button.style.marginLeft = '10px'
        button.style.marginTop = '0px'


        button.addEventListener('click', () => {
            const videoElement = document.querySelector("#live-player > video");
            if (videoElement) {
                reverseAudioChannels(videoElement);
                alert('Audio channels reversed.');
            } else {
                alert('Video element not found.');
            }
        });

        container.appendChild(button);
    }

    window.addEventListener('load', function() {
        setTimeout(monitorVideoElement, 2000); // 视频延迟检测
        setTimeout(addButton, 3000); // 加按钮
    });

})();

