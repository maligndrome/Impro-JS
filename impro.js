	window.onload= function()
	{

	a=document.getElementsByClassName('impro');
	for(b=0;b<a.length;b++)
	{
		populate_canvas(a[b]);
}
}
function populate_canvas(x)
{
	var scalex;
	var scaley=scalex=1;
	if(x.getAttribute('data-scale')!=null&&x.getAttribute('data-scale')!='')
	{
		scaley=scalex=x.getAttribute('data-scale')/1;
	}
	if(x.getAttribute('data-scale-x')!=null&&x.getAttribute('data-scale-x')!='')
	{
		scalex=x.getAttribute('data-scale-x')/1;
	}
	if(x.getAttribute('data-scale-y')!=null&&x.getAttribute('data-scale-y')!='')
	{
		scaley=x.getAttribute('data-scale-y')/1;
	}

	var c= x.getContext('2d');
	var d=new Image();
	d.crossOrigin = "Anonymous";
	d.src=x.getAttribute('data-src');
	var mode=x.getAttribute('data-type');
	d.onload = function(){
	x.width=d.width=d.width*scalex;
	x.height=d.height=d.height*scaley;
	x.height+=5;
	c.drawImage(d,0,0,x.width,x.height-5); 
	var imgd=c.getImageData(0,x.height-10, x.width, x.height-5);
	c.putImageData(imgd,0,x.height-5);
    process(x,mode);
	}
	
}

var sepia=[[0.393,0.769,0.189],[0.349,0.686,0.168],[0.272,0.534,0.131]];
var grey=[[0.333,0.333,0.333],[0.333,0.333,0.333],[0.333,0.333,0.333]];
var blur=[[0.0625,0.125,0.0625],[0.125,0.250,0.125],[0.0625,0.125,0.0625]];
var emboss=[[-0.222,-0.111,0],[0.111,0.222,0.111],[0,0.111,0.222]];
var edge=[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]];
function process(x,mode)
{
	var c= x.getContext('2d');
	var imgd = c.getImageData(0, 0, x.width, x.height);
	var pix = imgd.data;
	if(mode=='sepia')
	{
		pix=pixel_manip(pix,sepia);
		imgd.data.set(pix);
	}
	else if(mode=='grey')
	{
		pix=pixel_manip(pix,grey);
		imgd.data.set(pix);
	}
	else if(mode=='blur')
	{
		imgd.data.set(convolute(pix,blur,x.height,x.width));
	}
	else if(mode=='custom')
	{
		try
		{
			var _conv=x.getAttribute('data-convolution-matrix');
			if(_conv=="") throw "Empty kernel"
			var _kernel=new Array();
			var _t=_conv.split('|');
			if(_t.length>5) throw "The kernel is too large"
			for(var i=0;i<_t.length;i++)
			{
				_kernel[i]=new Array();
				_s=_t[i].split(',');
				if(_s.length!=_t.length) throw "Only square kernels are supported"
				for(var j=0;j<_s.length;j++)
				{
					if(isNaN(_s[j]/1)) throw "Only numbers allowed in kernel"
					_kernel[i].push(_s[j]/1);
				}
			}
			imgd = c.getImageData(0, 0, x.width, x.height);
			pix = imgd.data;
			var pix2=convolute(pix,_kernel,x.height,x.width);//_to_array(apply_kernel(_to_matrix(pix,x.width,x.height),[[0,0,0],[0,1,0],[0,0,0]]));
			imgd.data.set(pix2);
		}
		catch(err)
		{
			console.log("ImproJS error: "+err);
		}
		
	}
	else if(mode=='posterize')
	{
		imgd.data.set(quantize(pix,64));
	}
	else if(mode=='vignette')
	{
		imgd.data.set(vignette(pix,x.height,x.width,0.4)); //development mode
	}
	else if(mode=='emboss')
	{
		pix=convolute(pix,emboss,x.height,x.width);
		imgd.data.set(pix);
	}
	else if(mode=='edge')
	{
		pix=convolute(pix,edge,x.height,x.width);
		imgd.data.set(pix);
	}
	else
	{
		console.log("ImproJS error: Unsupported type")
	}
	x.height=x.height-5;
	c.putImageData(imgd, 0, 0);

}
function vignette(img,h,w,vig_lvl)
{
	var x,y,mD;
	x=w/2;
	y=h/2;
	mD=Math.sqrt(x*x+y*y);
	for (var i = 0, n = img.length; i < n; i += 4) 
	{
		
		var col=Math.floor(i/(4*h));
		var row=i/4-col*h;
		
		var D=Math.pow(Math.sqrt((row-y)*(row-y)+(col-x)*(col-x))/mD,0.5);
	    img[i]=img[i]*(1-vig_lvl*D);
	    img[i+1]=img[i+1]*(1-vig_lvl*D);
	    img[i+2]=img[i+2]*(1-vig_lvl*D); 
	}
	return img;
}
function rgb_to_hsv(img)
{
	var _r,_g,_b,cmax,cmin,del,h,s,v;
	for (var i = 0, n = img.length; i < n; i += 4) 
	{
	    var temp=rgb2hsv(img[i],img[i+1],img[i+2]);
	    img[i]=temp[0];
	    img[i+1]=temp[1];
	    img[i+2]=temp[2];
	 }
	 return img;
}
function hsv_to_rgb(img)
{
	for (var i = 0, n = img.length; i < n; i += 4) 
	{
	   var temp=hsv2rgb(img[i]/360,img[i+1],img[i+2]);
	   img[i]=temp[0];
	   img[i+1]=temp[1];
	   img[i+2]=temp[2];
	}
	return(img);
}
function quantize(img,q_lvl)
{
	//img --> image to be quantized
	//q_lvl --> level of quantization, such as 4, meaning 256 colours converted to 256/4=64 colours
	for (var i = 0, n = img.length; i < n; i += 4) 
	{
	    img[i  ]=Math.floor(img[i  ]/q_lvl)*q_lvl;
	    img[i+1]=Math.floor(img[i+1]/q_lvl)*q_lvl; 
	    img[i+2]=Math.floor(img[i+2]/q_lvl)*q_lvl; 
	 }
	return img;
}
function pixel_manip(img,t_mat)
{
	//no extra memory required here :)
	for (var i = 0, n = img.length; i < n; i += 4) {
	    r=img[i  ];
	    g=img[i+1]; 
	    b=img[i+2]; 
	    img[i]=(r*t_mat[0][0])+(g*t_mat[0][1])+(b*t_mat[0][2]);
	    img[i+1]=(r*t_mat[1][0])+(g*t_mat[1][1])+(b*t_mat[2][2]);
	    img[i+2]=(r*t_mat[2][0])+(g*t_mat[2][1])+(b*t_mat[2][2]);
	}
	return img;
}
function convolute(img,kernel,w,h)
{
	var _img=new Array();
	for(var i=0;i<img.length;i+=4)
	{
		var _r=new Array();
		var _g=new Array();
		var _b=new Array();
		for(var j=0; j<kernel.length;j++)
		{
			_r[j]=new Array();
			_g[j]=new Array();
			_b[j]=new Array();
			for(var k=0; k<kernel.length;k++)
			{
				_r[j].push(img[j*4*h+i+k*4]);
				_g[j].push(img[j*4*h+i+1+k*4]);
				_b[j].push(img[j*4*h+i+2+k*4]);
			}
		}
		var sumr=sumg=sumb=0;
		for(var j=0; j<kernel.length;j++)
		{
			for(var k=0; k<kernel.length;k++)
			{
				sumr+=_r[j][k]*kernel[j][k];
				sumg+=_g[j][k]*kernel[j][k];
				sumb+=_b[j][k]*kernel[j][k];
			}
		}
		_img.push(sumr);
		_img.push(sumg);
		_img.push(sumb);
		_img.push(255);
	}

	
	return _img;
}

function apply_kernel(img,kernel)
{
	var _img=new Array();
	for(var f=0;f<3;f++)
	{
		_img[f]=new Array();
		for(var i=0; i<img[f].length-kernel.length;i++)
		{
			_img[f][i]=new Array();
			for(var j=0; j<img[f][i].length-kernel.length;j++)
			{
				var a=0;
				pixels=new Array();
				//get pixel matrix
				for(var x=0; x<kernel.length;x++)
				{
					pixels[x]=new Array();
					for(var y=0; y<kernel.length; y++)
					{
						pixels[x].push(img[f][i+x][j+y]);
					}
				}
				for(var k=0; k<kernel.length; k++)
				{
					for(var l=0;l<kernel[k].length; l++)
					{
						a+=pixels[k][l]*kernel[k][l];
					}
				}
				_img[f][i].push(a);
			}
		}
	}
	_img[3]=img[3];
return _img;
}

//for individual pixels
function rgb2hsv (r,g,b) {
    var rr, gg, bb,
        r = r / 255,
        g = g / 255,
        b = b / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [h*360,s,v];
}
//for individual pixels
function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255),Math.round(g * 255),Math.round(b * 255)];
}
