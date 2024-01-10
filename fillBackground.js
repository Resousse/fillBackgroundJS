function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;

            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (minA === undefined || projected < minA) {
                    minA = projected;
                }
                if (maxA === undefined || projected > maxA) {
                    maxA = projected;
                }
            }

            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB === undefined || projected < minB) {
                    minB = projected;
                }
                if (maxB === undefined || projected > maxB) {
                    maxB = projected;
                }
            }

            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};

function isAlreadyThere(coords, x, y, angle, size)
{
    const rad = angle*(Math.PI/180);
    const xb = size * Math.cos(rad) - size * Math.sin(rad) + x;
    const yb = size * Math.sin(rad) + size * Math.cos(rad) + y;
    var xd, yd;

    for (const pos of coords) {
        xd  = size * Math.cos(pos[2] *(Math.PI/180)) - size * Math.sin(pos[2] *(Math.PI/180)) + pos[0];
        yd = size * Math.sin(pos[2] *(Math.PI/180)) + size * Math.cos(pos[2] *(Math.PI/180)) + pos[1];

        if (doPolygonsIntersect([{"x": x, "y" : y}, {"x": xb, "y" : yb}], [{"x": pos[0], "y" : pos[1]}, {"x": xd, "y" : yd}]) )
            return true
      }
    return false;
}

function fillBackground(idCanvas, color, icons ,opacity, size = 100, minMargin = 10, staticOrientation = false){
    if (opacity == undefined)
        opacity = 6
    canvas = document.getElementById(idCanvas);
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    canvas.style.position = "fixed";
    canvas.style.zIndex = "-1";

    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = opacity/100;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, window.screen.width, window.screen.height);
    ctx.globalCompositeOperation = 'destination-over';
    var iconsLst = []
    var avgWidth = 0;
    var avgHeight = 0;
    if (typeof icons === 'string')
    {
        var img = new Image();
        img.src = icons;
        iconsLst.push(img);
        avgWidth = img.width;
        avgWidth = img.height;
    }
    else if (Array.isArray(icons))
    {
        icons.forEach(el => {
            var img = new Image();
            img.src = el;
            
            iconsLst.push(img);
            avgWidth += img.width;
            avgWidth += img.height;
        });
        avgHeight /= iconsLst.length;
        avgWidth /= iconsLst.length;
    }
    else
        console.error("provided icon(s) is/are not valid")
    
    //if (iconsLst.length)
    //    console.log(iconsLst);
    let angle = 0
    const nbRow = Math.floor(window.screen.height / (size + minMargin));
    const nbCol = Math.floor(window.screen.width / (size + minMargin));
    const stepRow = Math.floor(window.screen.height / nbRow);
    const stepCol = Math.floor(window.screen.width / nbCol);
    let x, y;
    let coords = [];

    for (let j = 0; j < nbRow; j++)
    for(let i = 0; i < nbCol; i++ )
    {
        img = iconsLst[Math.floor(Math.random() * iconsLst.length)]
        x = Math.floor(Math.random() * stepCol) + minMargin + stepCol *  i ;
        y = Math.floor(Math.random() * stepRow) + minMargin + stepRow *  j;
        angle = Math.floor(Math.random() * 360);
        if (staticOrientation)
            angle = staticOrientation;
        ctx.save();
        ctx.translate(x, y);

        ctx.rotate(angle*Math.PI/180);
        if (!isAlreadyThere(coords, x, y, angle, size))
        {
            ctx.drawImage(img, 0, 0, size, size * img.height / img.width);
            coords.push([x, y, angle]);
        }
        ctx.restore();

    }
    //console.log(coords);
}