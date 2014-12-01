/***************************************************/
/**************** Object Collection ****************/
/***************************************************/
function createObject (title, url){
    var time = getTimestamp();
    var object = {
        title: title,
        url: url,
        memos: [],
        markups: [],
        erasers: [],
        created: time,
        modified: time
    }
    
    return object;
}

function Eraser (selector){
    var time = getTimestamp();
    var eraser = {
        selector: selector,
        created: time
    }
    return eraser;
}
/*
function Markup (type, selection, value){
    var time = getTimestamp();
    var markup = {
        type: type,
        startOffset : selection.baseOffset,
        endOffset : selection.extentOffset,
        tagName : selection.baseNode.parentElement.tagName,
        baseSelector: generateSelector(selection.baseNode.parentElement),
        tagIndex : getTagIndex(selection),
        textIndex : getTextIndex(selection),
        value: value,
        created: time
    }
    return markup;
}*/

function Markup (type, startOffset, endOffset, tagName, tagIndex, textIndex, value){
    var markup = {
        type: type,
        startOffset : startOffset,
        endOffset : endOffset,
        tagName: tagName,
        tagIndex: tagIndex,
        textIndex : textIndex,
        value: value
    }
    return markup;
}

function Memo (){
    var memo = {
        id: undefined, 
        left: undefined,
        top: undefined,
        zIndex: undefined,
        text: undefined
    }
    return memo;
}


function Highlight() {
    var elementBgr = $('<div id="pageeraser_highlight"></div>');
    
    elementBgr.css({
        display: 'block',
        position: 'absolute',
        'z-index': 10000,
        background: 'red',
        opacity: '0.5',
        'pointer-events': 'none'
    });

    return elementBgr;
}

function Overlay() {
    var Overlay = $('<div id="pageeraser_overlay">testing</div>');
    Overlay.css({
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        'z-index': 9000,
        width: '100%',
        height: '200px',
        background: 'black',
        opacity: '0'
    });

    return Overlay;
}

function Palette (){
    return '<div id="palette">'+
        '<ul id="first_line">'+
        '<li><select id="fontBox">'+
        '<option value="none">NONE</option>'+
        '<option value="BatangChe">Batang</option>'+
        '<option value="GungsuhChe" id = "">Gungsuh</option>'+
        '<option value="GulimChe">Gulim</option>'+
        '</select></li>'+
        '<li><a href="#" id="szUp" onClick="return false;">↑</a></li>'+
        '<li><a href="" id="szDown" onClick="return false;">↓</a></li>'+
        '</ul>'+
        '<ul id="second_line">'+
        '<li><a href="" id="bold" onClick="return false;">B</a></li>'+
        '<li><a href="" id="italic" onClick="return false;">I</a></li>'+
        '<li><a href="" id="underline" onClick="return false;">U</a></li>'+
        '<li><a href="" id="highlight" onClick="return false;">H'+
        '<div id="cpDiv"></div></a></li>'+
        '<li><a href="" id="fontColor" >C'+
        '<div id="cpDiv"></div></a></li>'+
        '<li><a href="" id="erase" onClick="return false;">E</a></li>'+
        '</ul></div>';
}

function ColorTable (){
    return '<div id="colorTable">'
        + '<TABLE CELLPADDING=0 CELLSPACING=1><TR>'
        + '<TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FFFF66"><IMG HEIGHT=12 WIDTH=12 style="background-color:#FFFF66"></A></TD>'
        + '<TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FFCC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#FFCC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FF9966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#FF9966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FF6666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#FF6666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FF3366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#FF3366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#FF0066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#FF0066"></A></TD></TR><TR><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CCFF66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CCFF66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CCCC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CCCC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CC9966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CC9966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CC6666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CC6666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CC3366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CC3366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#CC0066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#CC0066"></A></TD></TR><TR><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#99FF66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#99FF66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#99CC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#99CC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#999966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#999966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#996666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#996666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#993366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#993366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#990066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#990066"></A></TD></TR><TR><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#66FF66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#66FF66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#66CC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#66CC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#669966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#669966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#666666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#666666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#663366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#663366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#660066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#660066"></A></TD></TR><TR><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#33FF66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#33FF66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#33CC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#33CC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#339966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#339966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#336666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#336666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#333366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#333366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#330066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#330066"></A></TD></TR><TR><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#00FF66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#00FF66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#00CC66"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#00CC66"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#009966"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#009966"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#006666"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#006666"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#003366"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#003366"></A></TD><TD style="width:12px; height:12px;"><A HREF="#" class="apam_color" value="#000066"><IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#000066"></A></TD></TR></TABLE></div>';
}