/**************************************************/
//                    Color Table                 //
/**************************************************/
var hex = new Array(6)

hex[0] = "FF"
hex[1] = "CC"
hex[2] = "99"
hex[3] = "66"
hex[4] = "33"
hex[5] = "00"

function drawCell(red, green, blue) {
    colorTable = colorTable.concat('<TD style="width:12px; height:12px;">')
    colorTable = colorTable.concat('<A HREF="#" class="apam_color" value="#'+red+green+blue+'">')
    colorTable = colorTable.concat('<IMG BORDER=0 HEIGHT=12 WIDTH=12 style="background-color:#'+red+green+blue+'">')
    colorTable = colorTable.concat('</A>')
    colorTable = colorTable.concat('</TD>')
}

function drawRow(red, blue) {

  colorTable = colorTable.concat('<TR>')
  for (var i = 0; i < 6; ++i) {
    drawCell(red, hex[i], blue)
  }
  colorTable = colorTable.concat('</TR>')
}

function drawTable(blue) {
  colorTable = colorTable.concat('<TABLE CELLPADDING=0 CELLSPACING=1>')
  for (var i = 0; i < 6; ++i) {
    drawRow(hex[i], blue)
  }
  colorTable = colorTable.concat('</TABLE>') 
}

function drawCube() {
  colorTable = colorTable.concat('<div id="colorTable">')
  drawTable(hex[3])
  colorTable = colorTable.concat('</div>')
}
