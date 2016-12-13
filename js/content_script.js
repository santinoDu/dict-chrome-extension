"use strict"

const html = `<div id="_dict_box">
        <div class="-dict-header clearfix">
            <a href="javascript:;" class="-dict-pron-btn">
                <i class="-dict-icono-volume"></i>
            </a>
            <a href="javascript:;" class="-dict-close">X</a>
        </div>
        <div class="-dict-content">
            <div class="-dict-c-title"></div>
            <div class="-dict-c-info"></div>
            <audio class="-dict-audio"></audio>
        </div>
    </div>`

const calcPos = ({top, right, bottom, left}, el) => {
    let winWidth = window.innerWidth
    let winHeight = window.innerHeight
    let elWidth = el.offsetWidth
    let elHeight = el.offsetHeight
    let isLeftValid = left > elWidth
    let isTopVaild = top > elHeight
    let isRightValid = right + elWidth < winWidth
    let isBottomValid = bottom + elHeight < winHeight
    let x
    let y
    if (isBottomValid) {
        if (isRightValid) {
            x = left
            y = bottom
        } else {
            x = right - elWidth
            y = bottom
        }
    } else {
        if (isRightValid) {
            x = left
            y = top - elHeight
        } else {
            x = right - elWidth
            y = top - elHeight
        }
    }

    return {x, y}
}

class DictExtension {
    constructor (html) {
        this.body = utils.$('body')
        this.html = html
        this.renderInitHtml()
        this.init()
    }
    init () {
        this.dictEl = utils.$('#_dict_box')
        this.pronEl = this.dictEl.querySelector('.-dict-pron-btn')
        this.closeEl = this.dictEl.querySelector('.-dict-close')
        this.titleEl = this.dictEl.querySelector('.-dict-c-title')
        this.infoEl = this.dictEl.querySelector('.-dict-c-info')
        this.audioEl = this.dictEl.querySelector('.-dict-audio')
        this.initEvent()
    }
    renderInitHtml () {
        utils.append(this.body, utils.createElement('div', null, this.html))
    }
    initEvent () {
        this.body.addEventListener('dblclick', (e) => {
            let selection = window.getSelection()
            let selectionText = selection.toString().trim()
            let oRange = selection.getRangeAt(0)
            this.oRect = oRange.getBoundingClientRect()
            setTimeout(this.resHandle.bind(this), 200)
        })
        this.pronEl.addEventListener('click', () => {
            console.log('what')
            this.audioEl.play()
        })
        this.closeEl.addEventListener('click', () => {
            utils.hide(this.dictEl)
            this.audioEl.pause()
        })
    }
    resHandle () {
        this.res = {
            audio: 'https://iridescent.cn/static/GoT6/Game%20of%20Thrones%20Season%206%20trailer%20music%20(-Wicked%20Game-,%20James%20Vincent%20McMorrow).mp3',
            name: '光环',
            info: 'halo'
        }
        utils.html(this.titleEl, this.res.name)
            .html(this.infoEl, this.res.info)
            .show(this.dictEl)
            .setAttrs(this.audioEl, {src: this.res.audio})
        this.setPos()
    }
    setPos () {
        let pos = calcPos(this.oRect, this.dictEl)
        let style = `left: ${pos.x}px; top: ${pos.y}px;`
        utils.setAttrs(this.dictEl, {style}).show(this.dictEl)
    }
}

new DictExtension(html)