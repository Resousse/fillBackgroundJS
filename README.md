# fillBackgroundJS
Fill background of icons randomly spread and oriented.

# How to
## Include of the library
If you have a local version of the lib `<script type="text/javascript" src="fillBackground.js"></script>`

If you prefer to have a remote version of the lib `To complete`

## Fill of the background
Background can be filled upon body load or any other event, see example below.
A canvas item must be added on the top of the body, it will take all screen, its `id` should be given to the `fillBackground` function.
Note : So far no refresh upon resolution change (or smartphone rotation)

`fillBackground(idCanvas, color, icons , opacity, size = 100, minMargin = 10, staticOrientation = false)`

`idCanvas` is the html `id` associated to the canvas

`color` is the color used to fill the background (can be hex color)

`icons` is either a unique icon or a list of icons (file path should be provided)

`opacity` is the level of opacity of the background (by default 96%), 100% is fully opaque and 0% is fully transparent

`size` is the normalized size of icons (by default 100px) to be displayed

`minMargin` is the minimum space between icons (not so accurate so far)

`staticOrientation` is the angle in degree to render all icons. By default, all icons have random orientation.

### Example

```
<body onload="fillBackground('fillBackground', 'orange', ['img1.png', 'img2.png','img3.png'], 96, 100, 25)">
    <canvas id="fillBackground" >
    </canvas>
    <h1>Test page</h1>

</body>
```

# Demo
![Demo](demo.png)



