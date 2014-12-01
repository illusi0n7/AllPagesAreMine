function makeMarkupObjectList(selection, type, value, url){
	console.log(selection)
    var baseNode = selection.baseNode;
    var extentNode = selection.extentNode;
    var baseOffset = selection.baseOffset;
    var extentOffset = selection.extentOffset;
  
    var markups = [];

    if (baseNode !== extentNode){
        if (baseNode.parentElement == extentNode.parentElement){
            var baseNodeIndex = getTextIndex(baseNode);
            var extentNodeIndex = getTextIndex(extentNode);
            
            if (baseNodeIndex > extentNodeIndex){
                var tempNode = baseNode;
                baseNode    = extentNode;
                extentNode  = tempNode;

                var tempOffset = baseOffset;
                baseOffset = extentOffset;
                extentOffset = tempOffset;

                var tempIndex = baseNodeIndex;
                baseNodeIndex = extentNodeIndex;
                extentNodeIndex = tempIndex;
            }

            markups.push(Markup(type,
                0, extentOffset,
                extentNode.parentElement.tagName,
                getTagIndex(extentNode),
                extentNodeIndex, value));

            var siblingsNode = baseNode.parentElement.childNodes;
            for (var i=extentNodeIndex-1; i>baseNodeIndex; i--){
                if (siblingsNode[i].nodeName == '#text')
                    if ($(siblingNodes[i]).is(':empty') == false)
                        markups.push(Markup(type,
                            0, siblingsNode[i].length,
                            extentNode.parentElement.tagName,
                            getTagIndex(extentNode),
                            i, value));
                else
                    markups.push(Markup(type,
                        0, 0,
                        extentNode.parentElement.tagName,
                        getTagIndex(extentNode),
                        i, value));
            }
            
            markups.push(Markup(type,
                baseOffset, baseNode.length,
                baseNode.parentElement.tagName,
                getTagIndex(baseNode),
                baseNodeIndex, value));
        }
        else if (baseNode.parentNode.parentElement == extentNode.parentNode.parentElement){
            var baseNodeIndex = getTextIndex(baseNode.parentElement)
            var extentNodeIndex = getTextIndex(extentNode.parentElement)

            if (baseNodeIndex > extentNodeIndex){
                var tempNode = baseNode;
                baseNode    = extentNode;
                extentNode  = tempNode;

                var tempOffset = baseOffset;
                baseOffset = extentOffset;
                extentOffset = tempOffset;

                var tempIndex = baseNodeIndex;
                baseNodeIndex = extentNodeIndex;
                extentNodeIndex = tempIndex;
            }

            markups.push(Markup(type,
                0, extentOffset,
                extentNode.parentElement.tagName,
                getTagIndex(extentNode),
                getTextIndex(extentNode), value));
            
            var siblingNodes = baseNode.parentElement.parentElement.childNodes;
            for (var i=extentNodeIndex-1; i>baseNodeIndex; i--) {
                if (siblingNodes[i].nodeName == '#text'){
                    if ($(siblingNodes[i]).is(':empty') == false)
                        markups.push(Markup(type,
                            0, siblingNodes[i].length,
                            siblingNodes[i].parentElement.tagName,
                            getTagIndex(siblingNodes[i]),
                            i, value));
                }
                else{
                    markups.push(Markup(type,
                        0, 0,
                        siblingNodes[i].parentElement.tagName,
                        getTagIndex(siblingNodes[i]),
                        i, value));
                }
            }

            markups.push(Markup(type,
                baseOffset, baseNode.length,
                baseNode.parentElement.tagName,
                getTagIndex(baseNode),
                getTextIndex(baseNode), value));
        }
        else {
            var baseAncestors = $(baseNode).parents().andSelf();
            var extentAncestors = $(extentNode).parents().andSelf();

            var index = getLastCommonAncestor(baseAncestors, extentAncestors);
            var siblingNodes;

            var baseNodeIndex = getTextIndex(baseAncestors[index+1]);
            var extentNodeIndex = getTextIndex(extentAncestors[index+1]);

            if (baseNodeIndex > extentNodeIndex){
                var tempNode = baseNode;
                baseNode    = extentNode;
                extentNode  = tempNode;

                var tempOffset = baseOffset;
                baseOffset = extentOffset;
                extentOffset = tempOffset;

                var tempIndex = baseNodeIndex;
                baseNodeIndex = extentNodeIndex;
                extentNodeIndex = tempIndex;

                var tempAncestors = baseAncestors;
                baseAncestors = extentAncestors;
                extentAncestors = tempAncestors;
            }

            markups.push(Markup(type,
                0, extentOffset,
                extentNode.parentElement.tagName,
                getTagIndex(extentNode),
                getTextIndex(extentNode), value));

            var siblingNodes;
            for (var i=extentAncestors.length-1; i>index+1; i--){
                var node = extentAncestors[i];
                siblingNodes = node.parentElement.childNodes;
                var nodeIndex = getTextIndex(node);
                
                for (var j=nodeIndex-1; j>=0; j--){
                    if (siblingNodes[j].nodeName == '#text'){
                        if ($(siblingNodes[j]).is(':empty') == false)
                            markups.push(Markup(type,
                                0, siblingNodes[j].length,
                                siblingNodes[j].parentElement.tagName,
                                getTagIndex(siblingNodes[j]),
                                j, value));
                    }
                    else{
                        markups.push(Markup(type,
                            0, 0,
                            siblingNodes[j].parentElement.tagName,
                            getTagIndex(siblingNodes[j]),
                            j, value));
                    }
                }
            }

            //index+1
            console.log(baseAncestors[index])
            siblingNodes = baseAncestors[index].childNodes;
            for (var i=extentNodeIndex-1; i>baseNodeIndex; i--){
                if (siblingNodes[i].nodeName == '#text'){
                    if ($(siblingNodes[i]).is(':empty') == false)
                        markups.push(Markup(type,
                            0, siblingNodes[i].length,
                            siblingNodes[i].parentElement.tagName,
                            getTagIndex(siblingNodes[i]),
                            i, value));
                }
                else{
                    markups.push(Markup(type,
                        0, 0,
                        siblingNodes[i].parentElement.tagName,
                        getTagIndex(siblingNodes[i]),
                        i, value));
                }
            }

            for (var i=index+2; i<baseAncestors.length; i++){
                var node = baseAncestors[i];
                siblingNodes = node.parentElement.childNodes;
                var nodeIndex = getTextIndex(node);
                
                for (var j=siblingNodes.length-1; j>nodeIndex; j--){
                    if (siblingNodes[j].nodeName == '#text'){
                        if ($(siblingNodes[i]).is(':empty') == false)
                            markups.push(Markup(type,
                                0, siblingNodes[j].length,
                                siblingNodes[j].parentElement.tagName,
                                getTagIndex(siblingNodes[j]),
                                j, value));
                    }
                    else{
                        markups.push(Markup(type,
                            0, 0,
                            siblingNodes[j].parentElement.tagName,
                            getTagIndex(siblingNodes[j]),
                            j, value));
                    }
                }
            }

            markups.push(Markup(type,
                baseOffset, baseNode.length,
                baseNode.parentElement.tagName,
                getTagIndex(baseNode),
                getTextIndex(baseNode), value));
        }
    }
    else {  // baseNode == extentNode
        if (baseOffset > extentOffset){
            var tempOffset = baseOffset;
            baseOffset = extentOffset;
            extentOffset = tempOffset;
        }
        
        markups.push(Markup(type,
            baseOffset, extentOffset,
            baseNode.parentElement.tagName,
            getTagIndex(baseNode),
            getTextIndex(baseNode), value));
    }

    return markups;
}

function loadMarkups(markups){

	for (var i=0; i<markups.length; i++) {
        var range = document.createRange();
        var markup = markups[i];
        
        var elementSet = document.getElementsByTagName(markup.tagName);
        var element = elementSet[markup.tagIndex];

        var node = element.childNodes[markup.textIndex];
        range.setStart(node, markup.startOffset);
        range.setEnd(node, markup.endOffset);
        var span = document.createElement('span');

        if (markup.type == 'color'){
            if (markup.startOffset == 0 && markup.endOffset == 0){
				node.setAttribute('style', 'color:' + markup.value);
			}
			else {
	            span.setAttribute('style', 'color:' + markup.value);
	            range.surroundContents(span);
            }
        }
        else if (markup.type == 'bgColor'){
            if (markup.startOffset == 0 && markup.endOffset == 0){
            	node.setAttribute('style', 'background-color:' + markup.value);	
            }
            else{
	            span.setAttribute('style', 'background-color:' + markup.value);
	            range.surroundContents(span);
	        }
        }
        else if (markup.type == 'size'){
        	if (markup.startOffset == 0 && markup.endOffset == 0){
            	node.style.fontSize = markup.value;
            }
            else {
	            span.style.fontSize = markup.value;
	            range.surroundContents(span);
            }
        }
        else if (markup.type == 'bold'){
            if (markup.startOffset == 0 && markup.endOffset == 0){
                node.style.fontWeight = markup.value;
            }
            else{
                span.style.fontWeight = markup.value;
                range.surroundContents(span);
            }
        }
        else if (markup.type == 'italic'){
        	if (markup.startOffset == 0 && markup.endOffset == 0){
        		node.style.fontStyle = markup.value;
        	}
        	else {
	            span.style.fontStyle = markup.value;
	            range.surroundContents(span);
            }
        }
        else if (markup.type == 'underline'){
        	if (markup.startOffset == 0 && markup.endOffset == 0){
            	node.style.textDecoration = markup.value;
            }
            else{
	            span.style.textDecoration = markup.value;
	            range.surroundContents(span);
            }
        }
        else if (markup.type == 'fontName'){
        	if (markup.startOffset == 0 && markup.endOffset == 0){
        		node.style.fontFamily = markup.value;
        	}
        	else{
	            span.style.fontFamily = markup.value;
	            range.surroundContents(span);
            }
        }
        else if (markup.type == 'erase'){
        	if (markup.startOffset == 0 && markup.endOffset == 0)
        		node.setAttribute('style', 'visibility: hidden');
        	else
	            range.deleteContents();
        }
        
    }
}


function getTagIndex(node){
    var parent = node.parentElement;
    var elementSet = document.getElementsByTagName(parent.tagName);
    var tagIndex = -1;

    for (var i=0; i<elementSet.length; i++) {
        if (elementSet[i] === parent){
            tagIndex = i;
            break;
        }
    }
    
    return tagIndex;
}

function getTextIndex(node){
    var parent = node.parentElement;
    var textIndex = -1;

    for (var i=0; i<parent.childNodes.length; i++) {
        if (node === parent.childNodes[i]){
            textIndex = i;
            break;
        }
    }

    return textIndex;
}


function saveMarkupsInObject(pages, url, markups){
    if (pages[url] === undefined) { // create new
        pages[url] = createObject(document.title, url);
        pages[url].markups = markups;
    } else {    // update existing
        var page = pages[url];
        for (var i=0; i<markups.length; i++)
            page.markups.push(markups[i]);
        
        page.modified = getTimestamp();
        pages[url] = page;
    }

    return pages;
}
