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

const body = utils.$('body')

const articleRoot = [
    {
        foo (el) {
            return el.querySelectorAll('h1').length
        },
        weight: 1000
    },
    {
        foo (el) {
            return Number(el.tagName === 'ARTICLE')
        },
        weight: 100
    },
    {
        foo (el) {
            return el.querySelectorAll('p').length
        },
        weight: 1
    }
]

const justice = () => {
    let children = body.children
    let arrLikeChildren = Array.from(children)
    let childrenWightArr = arrLikeChildren.map(el => {
        let weight = 0
        articleRoot.forEach(val => {
            weight += val.foo(el) * val.weight
        })
        return weight
    })
    let maxWeight = Math.max(...childrenWightArr)
    let maxIndex = childrenWightArr.indexOf(maxWeight)
    arrLikeChildren.forEach((val, index) => {
        if (index !== maxIndex) {
            children[index].style.display = 'none'
        }
    })
}
//just for block useless elements. If you don't want to change the page, just remove object 'articleRoot' and  method 'justice'
justice()

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
        utils.append(body, utils.createElement('div', null, this.html))
    }
    initEvent () {
        chrome.runtime.onMessage.addListener((request, sender) => {
            this.resHandle(request)
        })
        body.addEventListener('dblclick', (e) => {
            let selection = window.getSelection()
            let selectionText = selection.toString().trim()
            let oRange = selection.getRangeAt(0)
            if (!selectionText.length) return
            this.oRect = oRange.getBoundingClientRect()
            chrome.runtime.sendMessage({message: selectionText})
        })
        this.pronEl.addEventListener('click', () => {
            this.audioEl.play()
        })
        this.closeEl.addEventListener('click', () => {
            utils.hide(this.dictEl)
            this.audioEl.pause()
        })
    }
    resHandle (data) {
        this.res = data
        utils.html(this.titleEl, this.res.name)
            .html(this.infoEl, this.res.info)
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