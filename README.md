# Impro-JS
A lightweight image processing library in JS

##Objectives:
- Lightweight
- Flexible
- Wide range of effects
- Layering

##Current features:
- Edge detect
- Emboss
- Blur
- Sepia
- Greyscale
- Scaling
- Custom convolution

##How to use
Include the improv.min.js file at the bottom of the body of the page.
```
<script src="path-to/improv.min.js"></script>
```

Create an impro object using the `<canvas>` element and adding `class="impro"` to it. Give specifications using  `data-*` attributes.

Valid `data-*` attributes and values:
- `src` : Specify source of the image (**Image source should be on your own server**)
- `scale` : uniformly scale image along x and y
- `scale-x` : Scale along the width
- `scale-y` : Scale along the height
- `type` : Type of transformation (custom, sepia, grey, blur, emboss, edge)
- `convolution-matrix` : Only for custom, specify the kernel for convolution. 

###Convolution Matrix format

Separate the rows by using a vertical bar (|) and elements by using a comma (,)

####Example

Suppose the kernel is
```
1 2 3
4 5 6
7 8 9
```
The correct format is:
```
1,2,3|4,5,6|7,8,9
```
*Note that the kernel has to be a square matrix*
