/**************************************************/
/****************** Elemet Delete *****************/
/**************************************************/
var elementBgr = Highlight();
var overlay = Overlay();
var bodyElement = $('body').get(0);

$('body').append(elementBgr);
$('body').append(overlay);
overlay.hide();

function onMouseMove(e) {
    overlay.css('pointer-events', 'none');
    var target = $(document.elementFromPoint(e.clientX, e.clientY));
    overlay.css('pointer-events', 'auto');

    if (target.attr('class') !== 'slug') {
        target = nearestNonInline(target);
        var targetElement = target.get(0);

        if (targetElement !== bodyElement) {
            elementBgr.css({
                top:    target.offset().top,
                left:   target.offset().left,
                width:  target.outerWidth(),
                height: target.outerHeight(),
                'pointer-events': 'none'
            });
            elementBgr.show();
        } else {
          elementBgr.hide();

          e.stopPropagation();
          e.preventDefault();
          return false;
        }
    }
}

function nearestNonInline(element) {
    if (element.css('display') !== 'inline')
        return element;

    var originalElement = element;
    var parent;
    // ignore the body
    while ((parent = element.parent(':not(body)')).length > 0) {
        if (parent.css('display') !== 'inline')
            return parent;
        else
            element = parent;
    }

    return element;
}

function onMouseClick(e) {
    overlay.css('pointer-events', 'none');
    var target = $(document.elementFromPoint(e.clientX, e.clientY));
    overlay.css('pointer-events', 'auto');

    if (target && target.attr('css') !== 'slug') {
        target = nearestNonInline(target);
        var targetElement = target.get(0);
        var targetSelector = generateSelector(target);

        var url = cleanUrl(document.location.href);
        chrome.storage.sync.get(url, function(pages) {
            var eraser = Eraser(targetSelector);
            
            var obj = {};
            if (pages[url] === undefined) { // create new
                obj[url] = createObject(document.title, url);
                obj[url].erasers = [eraser];
            } else {    // update existing
                var page = pages[url];
                if (page.erasers){
                    var erasers = page.erasers;
                    for (var i = erasers.length - 1; i >= 0; i--) {
                        var eras = erasers[i];
                        if (eras.selector.indexOf(eraser.selector) === 0) {
                            erasers.splice(i, 1);
                        }
                    }
                    erasers.push(eraser);
                    page.erasers = erasers;
                    page.modified = getTimestamp();
                }
                else{
                    var erasers = [eraser];
                    page.erasers = erasers;
                }
                obj[url] = page;
            }
            chrome.storage.sync.set(obj);
        });   
        
        removeTarget(target);
        elementBgr.fadeOut(parseInt(/*options.fadeSpeed*/ 300, 10))
    }

    e.stopPropagation();
    e.preventDefault();
    return false;
}

function generateSelector(target) {
    var sel = '';
    target = $(target);
    
    var ancestors = target.parents().andSelf();
    ancestors.each(function(i, ancestorElement) {
        ancestor = $(ancestorElement);
        var subsel = ancestorElement.tagName.toLowerCase();;
        if (subsel !== 'body' && subsel !== 'html'){
            var id = ancestor.attr('id');
            if (id && id.length > 0)
                subsel += '#' + id;
            else {
                var classes = ancestor.attr('class');
                
                if (classes && classes.length > 0)
                    subsel += '.' + classes.replace(/\s+/g, '.');

                var index = ancestor.index(sel + subsel);
                if ($(sel + subsel).siblings(subsel).length > 0)
                    subsel += ':eq(' + index + ')';
            }

            sel += subsel;

            if (i < ancestors.length - 1)
                sel += ' > ';
        }
    });

    return sel;
}

function createSlug(target) {
    var slug = $('<div class="slug"></div>');
    slug.copyCSS(target);
    slug.height(target.height());
    slug.width(target.width());
    slug.css({
        border: 'none',
        background: 'none',
        'pointer-events': 'none'
    });
    return slug;
}

function removeTarget(target) {
    var slug = createSlug(target);
    target.fadeOut(parseInt(300/*seed*/, 10), function() {
        slug.insertAfter(target);
        target.remove();
    });
}

function cleanUrl(url) {
    var tokens = url.split('#');
    return tokens[0];
}

/**************************************************/
/****************** Context Menu ******************/
/**************************************************/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.memo == "out")
            newNote();

        if (request.eraser == "on"){
            $(window).on('resize', onDocumentResize);
            $(document).on('click', onMouseClick);
            overlay.show();
            overlay.on('mousemove', onMouseMove);
            resizeOverlay();
        }

        if (request.eraser == "off"){
            $(window).off('resize', onDocumentResize);
            $(document).off('click', onMouseClick);
            overlay.hide();
            elementBgr.hide();
            overlay.off('mousemove', onMouseMove);
        }
});

function resizeOverlay() {
    overlay.css({
        height: $(window).height()
    });
}

function onDocumentResize(e) {
    resizeOverlay();
}

/***************************************************/
/**************** Add Event Handler ****************/
/***************************************************/

var mode = 'gbr';
$(document).ready(function() {
    initEventHandler();

    $('body').mouseup(function() {
        var selection = document.getSelection();  

        if (selection.type == 'Range')
            showPalette();
        else {
            var pos = abspos(event)
            memoX = pos.x;
            memoY = pos.y;
            closePalette();
        }
    });
  
    $('#palette').mouseup(function() {
        $('#colorTable').hide();
        event.stopPropagation();
    });
    
    $('#fontColor').hover(function(){
            event.stopPropagation();
        }, function(){
            event.stopPropagation();
    });

    var url = cleanUrl(document.location.href);
    chrome.storage.sync.get(url, function(pages) {
        loadObjects(pages, url)
    });
});

function loadObjects(pages, url){
    var page = pages[url];
    
    if (page !== undefined){
        // get Memos
        loadMemos(page.memos);

        // get erasers
        for (var i=0; i<page.erasers.length; i++) {   
            var target = $(page.erasers[i].selector);
            removeTarget(target);
        }

        // get markups
        loadMarkups(page.markups);
    }
}

/***************************************************/
/**************** Init Event Handler ***************/
/***************************************************/

function initEventHandler () {
    var selection = window.getSelection();
    var url = cleanUrl(document.location.href);
    var classType = 'apam-green';

    var palette = Palette();
    var colorTable = ColorTable();
    
    $('body').append(palette);
    $('body').append(colorTable);

    $('.apam_color').each(function(index, item){
        $(this).click(function(){
            highlight($(this).attr('value'));
            return false;
        });
    });

    $('#colorTable').hide();

    $('#colorTable').hover(function(){}, function(){   
        $('#colorTable').hide();
    });
    
    $('#fontColor').hover(function(){
        mode = 'font';
        colorTableLayerPopup(event);
    }, function(){});

    $('#highlight').hover(function(){
        mode = 'bgr';
        colorTableLayerPopup(event);
    }, function(){});

    $('#fontBox').on('change', function (){
        var font = $('#fontBox :selected').val();
        addMarkups(selection, 'fontName', font, url);
        selection.empty();
        closePalette();
    });

    $('#szUp').on('click', function (e){
        addMarkups(selection, 'size', '120%', url);
        selection.empty();
        closePalette();
    });

    $('#szDown').on('click', function (e) {
        addMarkups(selection, 'size', '80%', url);
        selection.empty();
        closePalette();
    });
 
    $('#bold').on('click', function (e) {
        addMarkups(selection, 'bold', 'bold', url);
        selection.empty();
        closePalette();
    });

    $('#italic').on('click', function (e) {
        addMarkups(selection, 'italic', 'italic', url);
        selection.empty();
        closePalette();
    });

    $('#underline').on('click', function (e){
        addMarkups(selection, 'underline', 'underline', url);
        selection.empty();
        closePalette();
    });

    $('#erase').on('click', function (e) {
        addMarkups(selection, 'erase', 'undefined', url);
        selection.empty();
        closePalette(); 
  });
}

function addMarkups(selection, type, value, url){
    if (!selection.isCollapsed){
        var markups = makeMarkupObjectList(selection, type, value, url);

        chrome.storage.sync.get(url, function(pages) {
            var obj = saveMarkupsInObject(pages, url, markups);
            chrome.storage.sync.set(obj);
        });

        loadMarkups(markups);
    }
}

function abspos(e) {
  this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
  this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
  return this;
}

function paletteLayerPopup(e) {
    var ex_obj = document.getElementById('palette');
    if(!e) e = window.Event;
    pos = abspos(e);
    ex_obj.style.left = pos.x + 'px';
    ex_obj.style.top = (pos.y+10) + 'px';
    ex_obj.style.display = ex_obj.style.display=='none'?'none':'block';
}

function colorTableLayerPopup(e) {
    $('#colorTable').show();
    var ex_obj = document.getElementById('colorTable');
    if(!e) e = window.Event;
    pos = abspos(e);
    ex_obj.style.left = pos.x+'px';
    ex_obj.style.top = (pos.y+10)+'px';
    ex_obj.style.display = ex_obj.style.display=='none'?'none':'block';
}

function showPalette() {
    $("#fontBox").prop('selectedIndex', 0);
    $('#palette').show();
    paletteLayerPopup(event);  
}

function closePalette() {
    $('#palette').hide();
    $('#colorTable').hide();
}

function highlight(color) {
    selection = window.getSelection();
    var url = cleanUrl(document.location.href);
    if (mode == 'bgr')
        addMarkups(selection, 'bgColor', color, url);
    else
        addMarkups(selection, 'color', color, url);
    selection.empty();
    closePalette(); 
}

function getTimestamp(){
    var object = new Date();
    var month = object.getMonth()+1;
    if (month < 10)
        month = '0'+month;
    var day = object.getDate();
    if (day < 10)
        day = '0'+day;

    var date = ""+object.getFullYear()+month+day+object.getHours()+object.getMinutes();

    return date;
}

function getLastCommonAncestor (baseAncestors, extentAncestors){
    var index = 0;
    var length = minLength(baseAncestors.length, extentAncestors.length);
    
    for (index=length-1; index>=0; index--){
        if (baseAncestors[index] == extentAncestors[index]){
            break;
        }
    }
    
    return index;
}

function minLength(a, b){
    if (a < b)
        return a;
    else
        return b;
}