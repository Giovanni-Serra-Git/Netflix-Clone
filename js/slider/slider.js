import { loadMoreSliderItem } from "../app/global.js";

const arrowLeft = document.querySelectorAll("[arrow-left]");
const arrowRight = document.querySelectorAll("[arrow-right]");

function addEventOnArrows(elements) {
    for(const element of elements) {
        element.forEach(arrow => {
            arrow.addEventListener("click", slideShow)
        })
    }
}

function checkArrowParent(element) {
    return element.target.closest("div[parent-slider]").querySelector("[slider-wrapper]").classList[0];
}



addEventOnArrows([arrowLeft, arrowRight]);



class Slider {

    constructor(element) {
        this.element = element;
        this.arrow = this.checkArrow(element);
        this.counter = 1;
        this.itemClassList = this.checkArrowParent(element);
        this.pathUrl = element.target.closest("div[parent-slider]").getAttribute("path");
        this.parent = element.target.closest("div[parent-slider]");
        this.parentClassList = element.target.closest("div[parent-slider]").classList[0];
        this.slider = element.target.closest("div[parent-slider]").querySelector("[slider-wrapper]");
        this.sliderOffsetLeft = this.slider.getBoundingClientRect().left;
        this.sliderCards = Array.from(this.slider.children);
        this.lastCard = this.sliderCards[this.sliderCards.length - 1];
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderTransformValue = window.getComputedStyle(this.slider).getPropertyValue("transform");
        this.sliderGapValue = window.getComputedStyle(this.slider).getPropertyValue("gap").split("").slice(0,-2).join("");
        this.cardsLength = this.slider.children.length;
        this.cardWidth = Number(this.slider.children[0].offsetWidth + Number(this.sliderGapValue));
        this.sliderTransformValue = Math.floor(Number(new WebKitCSSMatrix(this.sliderTransformValue).e));
        this.currentPage = 1;
        this.counterCards = 5;
    }

    checkArrowParent(element) {
        return element.target.closest("div[parent-slider]").querySelector("[slider-wrapper]").classList[0];
    }

    getWidthScreen() {
        return document.body.clientWidth;
    }

    checkArrow(element) {
        return element.target.closest("div").classList.contains("arrow-left") ? "left" : "right";
    }

    slideToRight() {

        if (this.counter == 1) {
            return;
        } else if (this.counter == 2) {
            this.sliderTransformValue = 0;
            this.slider.style.transform = `translateX(${0}px)`;
            this.counter--;
        } else {
            this.sliderTransformValue = Number(this.sliderTransformValue) + Number(this.cardWidth);
            this.slider.style.transform = `translateX(${Number(this.sliderTransformValue)}px)`;
            this.counter--;
        }
    }

    checkVisibilityLastCard() {
        let lastCard = Math.floor(this.lastCard.getBoundingClientRect().left - this.sliderGapValue);
        lastCard = lastCard - this.sliderOffsetLeft;
        console.log(this.cardsLength)
        return this.counterCards == this.cardsLength ? true : false;
    }
}



 class slide extends Slider {


    slideToLeft() {
        this.sliderTransformValue = this.counter * ( - this.cardWidth );
        this.slider.style.transform = `translateX(${this.counter * ( - this.cardWidth ) }px)`;
        this.counter++;
        this.counterCards++;
        console.log(this.counterCards);
        console.log(this.cardsLength)
    }

    slideOnceToLeft() {
        let lastCard = Math.floor(this.lastCard.getBoundingClientRect().left - this.sliderGapValue);
        lastCard = lastCard - this.sliderOffsetLeft;
        console.log(lastCard);
        this.sliderTransformValue = `${Number(-this.cardWidth)}`;
        this.slider.style.transform = `translateX(-${this.cardWidth}px)`;
        this.counter++;
        this.counterCards++;
        console.log(this.counterCards);
    }

    slide() {

        if (this.arrow == "left") {
            if (this.counter == 1) {
                this.slideOnceToLeft();
            } else {
                if (this.checkVisibilityLastCard()) {
                    loadMoreSliderItem(this.pathUrl, this.parent.closest("div"), ++this.currentPage, sliderItems.get(this.parentClassList),this.slider )
                } else {
                    this.slideToLeft();
                    
                }
            }
        }

        if (this.arrow == "right") { this.slideToRight()  }



    }


}

let sliderItems = new Map();
let upcoming;

function slideShow(element) { 

    let itemClassList = element.target.closest("div[parent-slider]").classList[0];
    
    if (sliderItems.get(itemClassList) == undefined) {
        sliderItems.set(itemClassList, new slide(element));
    }

   if (sliderItems.get(itemClassList) != undefined) {
    sliderItems.get(itemClassList).arrow = sliderItems.get(itemClassList).checkArrow(element);
    sliderItems.get(itemClassList).slide(element);
   }
   
}


