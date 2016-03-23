/*
    Author: Abbas Abdulmalik
    Created: March 21, 2016
    Revised: March 22, 2016    
    Title: Resume Project (Abbas Abdulmalik)
    Purpose: An online resume seeking web dev position.
    Notes: The "look" and underlying code should
    showcase my actual and latent talents (warts and all).
    
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
    //var maxFontSize = 18;

    var upperBackground = "linear-gradient(hsla(160, 35%, 100%, 0.8), hsla(160, 35%, 75%, 0.8))"    
    var lowerBackground = "linear-gradient(hsla(160, 35%, 75%, 0.8), hsla(160, 35%, 50%, 0.8))";
    
    flipperBusy = false;


//=========| STATE VARIABLES |==============

    var toggleOn = true;
    var menuShowing = false;
    var supportsLocalStorage = false;
    var totalNumberOfPages = 0;
    var currentPageNumber = 0;
    var currentPage = "";
    var nextPage = ""
    var cache = {};

//=========| THE DRIVER'S SEAT |============

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

        //temporary test:
        //coverPage.innerHTML = newRootEm.toFixed(2) + "px";        
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
    flashMenuIconWhite(0.25);
}

function closeMenu(e){
    e.stopPropagation();   
    menu.style.visibility = "hidden";
    menu.style.opacity = "0";
    exitIcon.style.visibility = "hidden";
    exitIcon.style.opacity = "0";
    if(menuShowing){flashMenuIconWhite(0.25);}    
    //prevent page flip by delaying state flag changes
    setTimeout(function(){
        toggleOn = true;
        menuShowing = false;
    },1);
}

function flashMenuIconWhite(seconds){
    flashObjectColor(menuIcon, "white", seconds);
}

function flashObjectColor(object, color, seconds){
    seconds = seconds || 0.25;
    var oldColor = object.style.color;
    object.style.color = color;
    setTimeout(function(){
        object.style.color = oldColor;
    }, 1000*seconds);
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
function hideFlipper(){
    flipper.style.visibility = "hidden";
    flipper.style.opacity = "0";    
}
function flipFlipperUp(){
    if(flipperBusy)return;
    flipperBusy = true;
    flipper.style.background = lowerBackground;
    
    flipper.style.borderTopLeftRadius = "none";
    flipper.style.borderTopRightRadius = "none";
    flipper.style.borderBottomLeftRadius = "0.5rem";
    flipper.style.borderBottomRightRadius = "0.5rem";
    
    flipper.style.borderTop = "1px solid hsla(160, 40%, 60%,1)"; 
    pushFlipperDown();    
    pushFlipperForward();
    showFlipper();
    flipper.style.transformOrigin = "top";
    flipper.style.transform = "rotateX(180deg)";
    setTimeout(function(){
        flipper.style.background = upperBackground;        
        hideFlipper();
        flipper.style.transform = "rotateX(0deg)";        
        pushFlipperBack();
        pushFlipperDown();        
        flipper.style.borderTop = "none";
        flipper.style.background = lowerBackground;
        flipperBusy = false;    
    },1300)
}

function flipFlipperDown(){
    if(flipperBusy)return;
    flipperBusy = true;
    flipper.style.background = upperBackground;
    
    flipper.style.borderTopLeftRadius = "0.5rem";
    flipper.style.borderTopRightRadius = "0.5rem";
    flipper.style.borderBottomLeftRadius = "none";
    flipper.style.borderBottomRightRadius = "none";
    
    flipper.style.borderBottom = "1px solid hsla(160, 40%, 60%,1)"; 
    pushFlipperUp();    
    pushFlipperForward();
    showFlipper();
    flipper.style.transformOrigin = "bottom";
    flipper.style.transform = "rotateX(-180deg)";
    setTimeout(function(){
        flipper.style.background = lowerBackground;        
        hideFlipper();
        flipper.style.transform = "rotateX(0deg)";        
        pushFlipperBack();
        pushFlipperUp();        
        flipper.style.borderTop = "none";
        flipper.style.background = upperBackground;
        flipperBusy = false;    
    },1300)
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
        m.addEventListener("click", function(e){
           //handle request here
           flashObjectColor(e.target, "white", 0.5);
        }); 
    });
}

};//===| END of Application |===
