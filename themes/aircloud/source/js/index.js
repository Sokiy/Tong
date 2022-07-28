/**
 * Created by Xiaotao.Nie on 09/04/2018.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

// Global functions and listeners
window.onresize = () => {
    // when window resize , we show remove some class that me be added
    // often for debug
    if(window.document.documentElement.clientWidth > 680){
        let aboutContent = document.getElementById('nav-content')
        aboutContent.classList.remove('hide-block')
        aboutContent.classList.remove('show-block');
    }
    // if(window.isPost){
        // reLayout()
    // }

    reHeightToc();
};

// Nav switch function on mobile
/*****************************************************************************/
const navToggle = document.getElementById('site-nav-toggle');
navToggle.addEventListener('click', () => {
    let aboutContent = document.getElementById('nav-content')
    if (!aboutContent.classList.contains('show-block')) {
        aboutContent.classList.add('show-block');
        aboutContent.classList.remove('hide-block')
    } else {
        aboutContent.classList.add('hide-block')
        aboutContent.classList.remove('show-block');
    }
})




function toggleSeachField(){
    if (!searchField.classList.contains('show-flex-fade')) {
        showSearchField()
    } else {
        hideSearchField()
    }
}


// directory function in post pages
/*****************************************************************************/
function getDistanceOfLeft(obj) {
    let left = 0;
    let top = 0;
    while (obj) {
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {
        left:left,
        top:top
    };
}

var toc = document.getElementById('toc')

var tocToTop = getDistanceOfLeft(toc).top;

function reHeightToc(){
    if(toc) { // resize toc height
        toc.style.maxHeight = ( document.documentElement.clientHeight - 10 ) + 'px';
        toc.style.overflowY = 'scroll';
    }
}

reHeightToc();

if(window.isPost){
    var result = []

    var nameSet = new Set();

    if(!toc || !toc.children || !toc.children[0]){
        // do nothing
    }
    else {
        if (toc.children[0].nodeName === "OL") {
            let ol = Array.from(toc.children[0].children)

            function getArrayFromOl(ol) {
                let result = []

                // let escape = function (item) {
                //     return item.replace(/<[^>]+>/g, "").replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\. _]/g, '-')
                // }

                ol.forEach((item) => {
                    if (item.children.length === 1) {
                        // TODO: need change
                        let value = item.children[0].getAttribute('href').replace(/^#/,"")
                        result.push({
                            value: [value],
                            dom: item
                        })
                        nameSet.add(value)
                    }
                    else {
                        let concatArray = getArrayFromOl(Array.from(item.children[1].children))
                        nameSet.add(item.children[0].getAttribute('href').replace(/^#/,""))
                        result.push({
                            value: [item.children[0].getAttribute('href').replace(/^#/,"")].concat(concatArray.reduce((p, n) => {
                                p = p.concat(n.value)
                                return p;
                            }, [])),
                            dom: item
                        })
                        result = result.concat(concatArray)
                    }
                })
                return result
            }

            result = getArrayFromOl(ol)
        }

        var nameArray = Array.from(nameSet)

        function reLayout() {
            let scrollToTop = document.documentElement.scrollTop || window.pageYOffset // Safari is special
            if(tocToTop === 0) {
                // Fix bug that when resize window the toc layout may be wrong
                toc = document.getElementById('toc')
                toc.classList.remove('toc-fixed')
                tocToTop = getDistanceOfLeft(toc).top;
            }
            if (tocToTop <= scrollToTop + 10) {
                if (!toc.classList.contains('toc-fixed'))
                    toc.classList.add('toc-fixed')
            } else {
                if (toc.classList.contains('toc-fixed'))
                    toc.classList.remove('toc-fixed')
            }

            let minTop = 9999;
            let minTopsValue = ""

            for (let item of nameArray) {
                item = decodeURIComponent(item);
                let dom = document.getElementById(item) || document.getElementById(item.replace(/\s/g, ''))
                if (!dom) {
                    console.log('dom is null')
                    continue
                }
                let toTop = getDistanceOfLeft(dom).top - scrollToTop;

                if (Math.abs(toTop) < minTop) {
                    minTop = Math.abs(toTop)
                    minTopsValue = item
                }
                // console.log(minTopsValue, minTop)
            }

            if (minTopsValue) {
                for (let item of result) {
                    if (item.value.indexOf(encodeURIComponent(minTopsValue)) !== -1) {
                        item.dom.classList.add("active")
                    } else {
                        item.dom.classList.remove("active")
                    }
                }
            }
        }

        reLayout()

        window.addEventListener('scroll', function(e) {
            reLayout()
            // let tocDom = document.querySelector('#toc')
            // window.scrollY < 550 ? tocDom.classList.remove('toc-fixed') : tocDom.classList.add('toc-fixed')
        })
    }
}


// donate
/*****************************************************************************/
const donateButton = document.getElementById('donate-button')
const donateImgContainer = document.getElementById('donate-img-container')
const donateImg = document.getElementById('donate-img')

if(donateButton) {
    donateButton.addEventListener('click', () => {
        if (donateImgContainer.classList.contains('hide')) {
            donateImgContainer.classList.remove('hide')
        } else {
            donateImgContainer.classList.add('hide')
        }
    })

    donateImg.src = donateImg.dataset.src
}

