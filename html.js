// modify start point & end point from Selection anchor node & focus node
// and middle section can modified by accessing range element
/*
//apam-check
function handleReiteration(htmlCode) {
    var origin = htmlCode;
    var regex = /<span class='apam-[a-z]+?'>(.+?)<\/span>/g;

    htmlCode = htmlCode.replace(regex, "$1");
    if (htmlCode != origin) {
    console.log('Changed (nested) : ' + htmlCode);
    }

    origin = htmlCode;
    var regex = /<span class='apam-([a-z]+?)'>(.+)/g;
    htmlCode = htmlCode.replace(regex, '$2<span class="apam-$1">');
    if (htmlCode != origin) {
        console.log("Changed (override) : " + htmlCode);
    }

    origin = htmlCode;
    var regex = /(.*?)<\/span>(.*?)/g;
    htmlCode = htmlCode.replace(regex, '$2<span class="apam-$1">');
    if (htmlCode != origin) {
        console.log('Changed (override) : ' + htmlCode);
    }

    return htmlCode;
}

function injectSpanTag(htmlCode, tagClass) {
  //injection span
  var result;
  var regex = /<\/p>/gi;
  result = htmlCode.replace(regex, '</span></p>');
  return result;
}

function removeBothEnd(htmlCode) {
  var startIndex = 0;
  var endIndex = htmlCode.length;
  
  if(htmlCode[0] == '<')
  {
    for(startIndex; startIndex < htmlCode.length; startIndex++)
    {
      if(htmlCode[startIndex] == '>')
      {
        startIndex++;
        break;
      }
    }
  }

  if(htmlCode[htmlCode.length - 1] == '>')
  {
    for(endIndex; endIndex > startIndex; endIndex--)
    {
      if(htmlCode[endIndex] == '<')
      {
        break;
      }
    }
  }
  return htmlCode.substring(startIndex, endIndex);
}

function getSelectedHtml() {
  var userSelection;
  userSelection = window.getSelection();
  var range = userSelection.getRangeAt(0);
  var clone = range.cloneContents();
  var span = document.createElement('span');
  console.log(clone);
  span.appendChild(clone);

  //range.surroundContents(span);
}

function getSelectedHtml_backup() {
    var userSelection;
    userSelection = window.getSelection ();
    var range = document.createRange ();
    range.setStart (userSelection.anchorNode, userSelection.anchorOffset);
    range.setEnd (userSelection.focusNode, userSelection.focusOffset);
    console.log(range);
    var clonedSelection = range.cloneContents ();
    var div = document.createElement ('div');
    div.appendChild (clonedSelection);
    return div.innerHTML;
}
*/