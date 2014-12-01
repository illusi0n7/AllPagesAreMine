var captured = null;
var highestZ = 11001;
var highestId = 0;

var memoX = 0;
var memoY = 0;

var memoList = [];

function newNote(pos){
    var note = new Note();
    note.id = ++highestId;
    note.left = memoX + 'px';
    note.top =  memoY + 'px';
    note.zIndex = ++highestZ;
    memoList.push(note)
}

function Note(){
    var self = this;

    var note = document.createElement('div');
    note.className = 'noteAll';
    note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
    note.addEventListener('click', function() { return self.onNoteClick() }, false);
    this.note = note;

    var close = document.createElement('div');
    close.className = 'closebutton';
    close.addEventListener('click', function(event) { return self.close(event) }, false);
    close.setAttribute("id", "closebtn");
    note.appendChild(close);

    var edit = document.createElement('div');
    edit.className = 'edit';
    edit.setAttribute('contenteditable', true);
    edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    note.appendChild(edit);
    this.editField = edit;

    document.body.appendChild(note);
    console.log(self)
    return this;
}

Note.prototype = {
    get id() {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x) {
        this._id = x;
    },

    get text() {
        return this.editField.innerHTML;
    },

    set text(x) {
        this.editField.innerHTML = x;
    },

    get left() {
        return this.note.style.left;
    },

    set left(x) {
        this.note.style.left = x;
    },

    get top() {
        return this.note.style.top;
    },

    set top(x) {
        this.note.style.top = x;
    },

    get zIndex() {
        return this.note.style.zIndex;
    },

    set zIndex(x) {
        this.note.style.zIndex = x;
    },

    close: function(event) {
        this.cancelPendingSave();
        var id = this.id;
        var note = this;        
        var duration = event.shiftKey ? 2 : .25;
        this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
        this.note.offsetTop; // Force style recalc
        this.note.style.webkitTransformOrigin = "0 0";
        this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
        this.note.style.opacity = '0';

        var self = this;
        setTimeout(function(){ document.body.removeChild(self.note) }, duration * 1000);

        for (var i=0; i<memoList.length; i++) {
            if (memoList[i].id == id){ 
                memoList.splice(i, 1);
            }
        };

        saveMemoObject(this);
    },

    saveSoon: function() {
        this.cancelPendingSave();
        var self = this;
        this._saveTimer = setTimeout(function(){ self.save() }, 200);
    },

    cancelPendingSave: function() {
        if (!("_saveTimer" in this))
            return;
        clearTimeout(this._saveTimer);
        delete this._saveTimer;
    },

    save: function() {
        /*this.cancelPendingSave();

        if ("dirty" in this) {
         //   this.timestamp = new Date().getTime();
            delete this.dirty;
        }*/
    },

    onMouseDown: function(e) {
        captured = this;
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler   = function(e) { return self.onMouseMove(e) }
            this.mouseUpHandler     = function(e) { return self.onMouseUp(e) }
        }

        document.addEventListener('mousemove', this.mouseMoveHandler, true);
        document.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onMouseMove: function(e) {
        if (this != captured)
            return true;

        this.left   = e.clientX - this.startX + 'px';
        this.top    = e.clientY - this.startY + 'px';

        return false;
    },

    onMouseUp: function(e) {
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);

        saveMemoObject(this);

        return false;
    },

    onNoteClick: function(e) {
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function() {

        saveMemoObject(this);

        //this.dirty = true;
        //this.saveSoon();
    },
}


function saveMemoObject(note) {
    var memoSetList = [];
    var memoObject = new Object;

    for (var i=0; i<memoList.length; i++) {
        var memoObject = new Object;
        var item = memoList[i];

        memoObject.id       = item.id;
        memoObject.left     = item.left.substr(0, item.left.length-2);
        memoObject.top      = item.top.substr(0, item.top.length-2);
        memoObject.zIndex   = item.zIndex - 12000;
        memoObject.text     = item.text;

        memoSetList.push(memoObject)
    }
    
    var url = document.location.href;
    chrome.storage.sync.get(url, function(pages) {
        var metaData = {};

        if (pages[url] === undefined){
            metaData[url] = {
                title: document.title,
                memos: memoSetList,
                url: url,
                enabled: true,
                created: undefined,
                modified: undefined,
                markups: [],
                erasers: [],
            }
        }
        else {
            var page    = pages[url];
            page.memos  = memoSetList;
            metaData[url] = page;
        }

        chrome.storage.sync.set(metaData);
    });
}

function loadMemos(memoObject) {
    var maxId = -1;
    for (var i=0; i<memoObject.length; i++) {   
        var item = memoObject[i];
        if (item.id > maxId)
            maxId = item.id;
        
        var note    = new Note();
        note.id     = item.id;
        note.left   = item.left +'px';
        note.top    = item.top +'px';
        note.zIndex = item.zIndex + 12000;
        note.text   = item.text;
        
        memoList.push(note);
        highestId   = maxId;
    }
}