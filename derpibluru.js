// ==UserScript==
// @name         Derpi spoiler blur
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blurs spoilered images, deblurs on hover
// @author       Adrian Kryński
// @source       https://github.com/
// @match        https://derpibooru.org/*
// @grant        none
// ==/UserScript==

const hideTags = true;

(function() {
    'use strict';
    addGlobalStyle(`.blur picture {
                      filter: blur(10px);
                    }
                    .blur:hover picture {
                      filter: none;
                    }`);

    let spoilers = JSON.parse(document.getElementsByClassName('js-datastore')[0].dataset.spoileredTagList);
    blurPics(spoilers);
})();

function enableHides() {
    let hides = document.getElementsByTagName('interaction--downvote');
    for (let i=0; i<hides.lenght; i++) {
        hides[i].classList.remove('disabled');
    }
}

function blurPics(spoilers) {
    let pics = document.getElementsByTagName('picture');
    if (pics.length === 1 && pics[0].childNodes[0].id === "image-display") return;
    for(let i=0; i<pics.length; i++){
        let pic = pics[i];
        let img = pic.childNodes[0];
        let parent = pic.parentElement;
        let tags = JSON.parse(parent.parentElement.dataset.imageTags);
        if (tags.some(t => spoilers.includes(t))) {
            parent.classList.add('blur');
            parent = parent.parentElement;
            let size = parent.dataset.size;
            let link = 'https:' + JSON.parse(parent.dataset.uris)[size];

            if(hideTags) parent.childNodes[0].classList.add('hidden');
            img.src = link;

            parent.onmouseleave = () => {
                if(hideTags) parent.childNodes[0].classList.add('hidden');
                img.src = link;
            };
        }
    }
}


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
