function segmentCrossing(p1, p2, p3, p4) {
    function orientation(a, b, c) {
        var val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (val === 0) return 0;
        return (val > 0) ? 1 : 2;
    }
    function segmentAreCrossing(p1, p2, p3, p4) {
        var o1 = orientation(p1, p2, p3);
        var o2 = orientation(p1, p2, p4);
        var o3 = orientation(p3, p4, p1);
        var o4 = orientation(p3, p4, p2);

        if (o1 !== o2 && o3 !== o4) {
            return true;
        }

        if (o1 === 0 && onSegment(p1, p3, p2)) return true;
        if (o2 === 0 && onSegment(p1, p4, p2)) return true;
        if (o3 === 0 && onSegment(p3, p1, p4)) return true;
        if (o4 === 0 && onSegment(p3, p2, p4)) return true;

        return false;
    }

    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }
    return segmentAreCrossing(p1, p2, p3, p4);
}

function isAlreadyThere(coords, x, y, angle, size) {
    function onSegment(p, q, r) {
        return (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y));
    }
    const rad = angle * (Math.PI / 180);
    const a = { x: x, y: y };
    const b = { x: size * Math.cos(rad) + x, y: size * Math.sin(rad) + y };
    const c = { x: size * Math.cos(rad) - size * Math.sin(rad) + x, y: size * Math.sin(rad) + size * Math.cos(rad) + y };
    const d = { x: - size * Math.sin(rad) + x, y: size * Math.cos(rad) + y };
    var xd, yd;

    for (const pos of coords) {
        const rad2 = pos[2] * (Math.PI / 180);
        const w = { x: pos[0], y: pos[1] };
        const x = { x: size * Math.cos(rad2) + pos[0], y: size * Math.sin(rad2) + pos[1] };
        const y = { x: size * Math.cos(pos[2] * (Math.PI / 180)) - size * Math.sin(pos[2] * (Math.PI / 180)) + pos[0], y: size * Math.sin(pos[2] * (Math.PI / 180)) + size * Math.cos(pos[2] * (Math.PI / 180)) + pos[1] };
        const z = { x: - size * Math.sin(rad2) + pos[0], y: size * Math.cos(rad2) + pos[1] };
        if (segmentCrossing(a, b, w, x) || segmentCrossing(a, b, x, y) || segmentCrossing(a, b, y, z) || segmentCrossing(a, b, z, w) ||
            segmentCrossing(b, c, w, x) || segmentCrossing(b, c, x, y) || segmentCrossing(b, c, y, z) || segmentCrossing(b, c, z, w) ||
            segmentCrossing(c, d, w, x) || segmentCrossing(c, d, x, y) || segmentCrossing(c, d, y, z) || segmentCrossing(c, d, z, w) ||
            segmentCrossing(a, d, w, x) || segmentCrossing(a, d, x, y) || segmentCrossing(a, d, y, z) || segmentCrossing(a, d, z, w)
        )
            return true;
    }
    return false
}

function fillBackground(idCanvas, color, icons, opacity, size = 100, minMargin = 10, staticOrientation = false) {
    toRefresh = true;
    window.onresize = function (event) {
        if (toRefresh && document.body.scrollTop >= 0) {
            fillBackground(idCanvas, color, icons, opacity, size, minMargin, staticOrientation);
        }
    };
    window.addEventListener("touchstart", (event) => {
        toRefresh = false;
    });
    window.addEventListener("touchend", (event) => {
        toRefresh = true;
    });
    window.addEventListener("touchcancel", (event) => {
        toRefresh = true;
    });
    if (typeof iconsLst === "undefined")
        iconsLst = [];
    var counter = 0;
    var lfunc = function () {
        if (--counter === 0 || (typeof backGroundImagesLoadedOnce !== "undefined" && backGroundImagesLoadedOnce)) {
            backGroundImagesLoadedOnce = true;
            fillBackgroundOnceLoaded(idCanvas, color, iconsLst, opacity, size, minMargin, staticOrientation);
        }
    };
    if (typeof backGroundImagesLoadedOnce !== "undefined" && backGroundImagesLoadedOnce) {
        lfunc();
        return;
    }

    if (typeof icons === 'string') {
        counter = 1;
        var img = new Image();
        img.src = icons;
        img.onload = lfunc;
        iconsLst.push(img);
    }
    else if (Array.isArray(icons)) {
        counter = icons.length;
        icons.forEach(el => {
            var img = new Image();
            img.src = el;
            img.onload = lfunc;
            iconsLst.push(img);
        });
    }
    else
        console.error("provided icon(s) is/are not valid");

}

function fillBackgroundOnceLoaded(idCanvas, color, icons, opacity, size = 100, minMargin = 10, staticOrientation = false) {

    var avgWidth = 0;
    var avgHeight = 0;
    if (opacity == undefined)
        opacity = 6

    canvas = document.getElementById(idCanvas);
    var ratio = window.devicePixelRatio || 1;
    if (typeof canvasHeight !== "undefined" && typeof canvasWidth !== "undefined" && canvasWidth == window.innerWidth * ratio && canvasHeight == window.innerHeight * ratio) {
        console.log("nothing to refresh");
        return true;
    }
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.position = "fixed";
    canvas.style.zIndex = "-1";

    canvasHeight = canvas.height;
    canvasWidth = canvas.width;

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-over';

    icons.forEach(img => {
        avgWidth += img.width;
        avgWidth += img.height;
    });

    avgHeight /= icons.length;
    avgWidth /= icons.length;

    //if (icons.length)
    //    console.log(icons);
    let angle = 0
    const nbRow = Math.floor(canvas.height / (size + minMargin));
    const nbCol = Math.floor(canvas.width / (size + minMargin));
    const stepRow = Math.floor(canvas.height / nbRow);
    const stepCol = Math.floor(canvas.width / nbCol);
    let x, y;
    let coords = [];
    let attempt = 0;

    for (let j = 0; j < nbRow; j++)
        for (let i = 0; i < nbCol; i++) {

            img = icons[Math.floor(Math.random() * icons.length)]
            x = Math.floor(Math.random() * stepCol) + minMargin + stepCol * i;
            y = Math.floor(Math.random() * stepRow) + minMargin + stepRow * j;
            angle = Math.floor(Math.random() * 360);
            if (staticOrientation)
                angle = staticOrientation;

            if (!isAlreadyThere(coords, x, y, angle, size)) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle * Math.PI / 180);
                ctx.drawImage(img, 0, 0, size, size * img.height / img.width);
                coords.push([x, y, angle]);
                ctx.restore();
                attemp = 0;
            }
            else if (attempt == 0)
                attempt = 3;
            else
                attempt--;
            if (attempt != 0)
                i--;
        }
}