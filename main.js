/*
    Author: Abbas Abdulmalik
    Created: March 21, 2016
    Revised: March 23, 2016
    Title: Resume Project (Abbas Abdulmalik)
    Purpose: An online resume seeking web dev position.
			 The "look" and underlying code should
			 showcase my actual and latent talents
			 (warts and all).
	Notes:

//=========| Map of index.html's elements |========

<div id="mobileHolder" class="fullScreen">
    <div id="mainPanel" class="fullScreen">
        <div id="coverPage" class="page">cover page</div>
        <div id="upperPage" class="page">upper page</div>
        <div id="lowerPage" class="page">lower page</div>
    </div>
    <div id="menu">
        <div id="menuIcon" >&Congruent;</div>
        <div id="menuChoices">menu choices</div>
    </div>
    <div id="splashPanel" class="fullScreen">splash panel</div>
</div>
*/
//===| START of Application |===

window.onload = function(){

//=========| CONSTANTS, &tc. |=========

	var lorem = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.<br/>" +
	"Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero," +
	"sit amet commodo magna eros quis urna.<br/>" +
	"Nunc viverra imperdiet enim.<br/>Lorem ipsum dolor sit amet, consectetuer adipiscing elit."

    var id = function id(ID){return document.getElementById(ID);}
    var mainPanel = id("mainPanel");
    var splashPanel = id("splashPanel");
    var coverPage = id("coverPage");
    var flipper = coverPage; //an alias: item has dual use;
    var lowerPage = id("lowerPage");
    var upperPage = id("upperPage");
    var menu = id("menu");
    var menuIcon = id("menuIcon");
    var exitIcon = id("exitIcon");
    var choices = id("menuChoices");

    var minFontSize = 10;

    var upperBackground = "linear-gradient(hsla(160, 35%, 100%, 1), hsla(160, 35%, 75%, 1)"
    var lowerBackground = "linear-gradient(hsla(160, 35%, 75%, 1), hsla(160, 35%, 50%, 1))";



//=========| GLOBAL STATE VARIABLES |==============

    var toggleOn = true;
    var menuShowing = false;
    var supportsLocalStorage = false;
    var totalNumberOfPages = 0;
    var currentPageNumber = 0;
    var currentPage = "";
    var nextPage = "";
    var flags = {
		flipperBusy: false,
		flashingBusy: false
	};
    var cache = {};

//=========| THE DRIVER'S SEAT |============
	splashPanel.onclick = function(){splashPanel.style.opacity = "0";}
    initialize();
    coverPage.onclick = flipUp;
    lowerPage.onclick = flipUp;
    upperPage.onclick = flipDown;
    menuIcon.onclick = function(e){toggle(openMenu, closeMenu, e)};
    exitIcon.onclick = closeMenu;
    choices.onClick = loadChoice;

//=========| UNDER THE HOOD |===============

function initialize(){
    dissolveSplashPanel(); //might place this further down to hide some delays
    adjustRootEm();
    window.onresize = adjustRootEm;
    supportsLocalStorage = !!(typeof Storage && window.localStorage);
    closeMenuOnPageClick();
    handleMenuSelection();
    mainPanel.onclick = closeMenu;


    //---| Helper functions |---
    function dissolveSplashPanel(){
        splashPanel.style.opacity = "0";
        splashPanel.style.visibility = "hidden";

    };
    function adjustRootEm(){
        var newRootEm = (minFontSize + window.innerWidth/100);
        document.documentElement.style.fontSize = newRootEm + "px";
    }
    //---| END of Helper functions |---

}//===| END of initialize function |=====

function toggle(onHandler, offHandler, e){
    //global toggleOn variable starts true;
    if(toggleOn){
        onHandler(e);
        toggleOn = false;
    }
    else{
        offHandler(e);
        toggleOn = true;
    }
    e.stopPropagation();
};

function openMenu(e){
    e.stopPropagation();
    menuShowing = true;
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
    exitIcon.style.visibility = "visible";
    exitIcon.style.opacity = "1";
    //flashMenuIconWhite(0.25);
    flashObjectColor(menuIcon, "red", 0.25);
}

function closeMenu(e){
    e.stopPropagation();
    menu.style.visibility = "hidden";
    menu.style.opacity = "0";
    exitIcon.style.visibility = "hidden";
    exitIcon.style.opacity = "0";
    if(menuShowing){ flashObjectColor(menuIcon, "red", 0.25);}
    //prevent page flip by delaying state flag changes
    setTimeout(function(){
        toggleOn = true;
        menuShowing = false;
    },10);
}

function flashMenuIconWhite(seconds){
    flashObjectColor(menuIcon, "white", seconds);
}

function flashObjectColor(object, color, seconds){
	if(flags.flashingBusy)return;
	flags.flashingBusy = true;
    seconds = seconds || 0.25;
    var oldColor = object.style.color;
    object.style.color = color;
    setTimeout(function(){
        object.style.color = oldColor;
    }, 1000*seconds);
	setTimeout(function(){
		flags.flashingBusy = false;
	}, 1100);
}

function flipUp(){
    if(!menuShowing){flipFlipperUp()};

}

function flipDown(){
    if(!menuShowing){flipFlipperDown()};
}

function pushFlipperDown(){
    flipper.style.bottom = "0";
    flipper.style.top = "50%";

}
function pushFlipperUp(){
    flipper.style.top = "0";
    flipper.style.bottom = "50%";

}
function pushFlipperForward(){
    flipper.style.zIndex = "4";

}
function pushFlipperBack(){
    flipper.style.zIndex = "-1";
}

function showFlipper(){
	flipper.style.visibility = "visible";
    flipper.style.opacity = "1";
}

function hideFlipper(delay){
	setTimeout(function(){
		flipper.style.visibility = "hidden";
	}, delay * 1000);
    //flipper.style.opacity = "0";
}

function flipFlipperUp(){
    if(flags.flipperBusy)return;
    flags.flipperBusy = true;
    flipper.style.background = lowerBackground;

    //make only lower corners round
	flipper.style.borderTopLeftRadius = "0";
    flipper.style.borderTopRightRadius = "0";
    flipper.style.borderBottomLeftRadius = "1rem";
    flipper.style.borderBottomRightRadius = "1rem";
	flipper.style.border = "1px solid lightgray";
	flipper.style.borderTop = "none";

	//put flipper into position before showing the flip
	pushFlipperDown();
    flipper.style.transformOrigin = "top";
    pushFlipperForward();

    //handle content
    handleContent(lowerPage);

    //Here's the up flip!
	showFlipper();
    flipper.style.transform = "rotateX(180deg)";

    //Let the flipped page show for a bit before hiding
	setTimeout(function(){
        hideFlipper(0.5);
        pushFlipperBack();
        pushFlipperDown();
        flipper.style.background = lowerBackground;
    },500);
	//Let prior preperation happen before next flip allowed
	setTimeout(function(){
        flipper.style.transform = "rotateX(0deg)";
        flags.flipperBusy = false;
	},2200);
}

function flipFlipperDown(){
    if(flags.flipperBusy)return;
    flags.flipperBusy = true;
    flipper.style.background = upperBackground;

	//make only upper corners round
    flipper.style.borderTopLeftRadius = "1rem";
    flipper.style.borderTopRightRadius = "1rem";
    flipper.style.borderBottomLeftRadius = "0";
    flipper.style.borderBottomRightRadius = "0";
	flipper.style.border = "1px solid gray;"
	flipper.style.borderBottom = "none";

	//put flipper into position before showing the flip
    pushFlipperUp();
    flipper.style.transformOrigin = "bottom";
    pushFlipperForward();

    //handle content
    handleContent(upperPage);

    //Here's the down flip!
	showFlipper();
    flipper.style.transform = "rotateX(-180deg)";

    //Let the flipped page show for a bit before hiding
    setTimeout(function(){
        hideFlipper(0.5);
        //flipper.style.transform = "rotateX(0deg)";
        pushFlipperBack();
        pushFlipperUp();
        flipper.style.background = upperBackground;
    },500);
	//Let prior preperation happen before next flip allowed
	setTimeout(function(){
        flipper.style.transform = "rotateX(0deg)";
        flags.flipperBusy = false;
	},2200);
}

function handleContent(page){
	flipper.innerHTML = page.innerHTML;
	setTimeout(function(){
		page.innerHTML = lorem;
	},200);
}

function loadChoice(){}

function closeMenuOnPageClick(){
    var pages = getClassArray("page");
    pages.forEach(function(m){
        m.addEventListener("click",function(e){
            closeMenu(e);
        });
    });
}

function getClassArray(className){
    var all = document.getElementsByTagName("*");
    var classArray = [];
    for(var i = 0; i < all.length; i++){
        if(all[i].getAttribute("class") === className){
            classArray.push(all[i]);
        }
    }
    return classArray;
}

function handleMenuSelection(){
    var menuChoices = getClassArray("li");
    menuChoices.forEach(function(m){
        m.addEventListener("click", function(e,m){
           //handle request here
           flashObjectColor(e.target, "red", 0.5);
           setTimeout(function(){
				closeMenu(e);
				var fixedText = e.target.innerHTML.split(" ").join("").toLowerCase();
				upperPage.innerHTML += fixedText +"<br/>";
				lowerPage.innerHTML += fixedText +"<br/>";
           }, 500);
        });
    });
}

};//===| END of Application |===
