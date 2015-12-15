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
	c.drawImage(d,0,0,x.width,x.height); 

pix=process(x,mode);

	}
}
function process(x,mode)
{
	var c= x.getContext('2d');
	var imgd = c.getImageData(0, 0, x.width, x.height);
	var pix = imgd.data;
	if(mode=='sepia')
	for (var i = 0, n = pix.length; i < n; i += 4) {
	    r=pix[i  ];
	    g=pix[i+1]; 
	    b=pix[i+2]; 
	    pix[i]=(r*0.393)+(g*0.769)+(b*0.189);
	    pix[i+1]=(r*0.349)+(g*0.686)+(b*0.168);
	    pix[i+2]=(r*0.272)+(g*0.534)+(b*0.131);
	}
	else if(mode=='grey')
	for (var i = 0, n = pix.length; i < n; i += 4) {
	    r=pix[i  ];
	    g=pix[i+1]; 
	    b=pix[i+2]; 
	    pix[i]=(r+g+b)/3;
	    pix[i+1]=(r+g+b)/3;
	    pix[i+2]=(r+g+b)/3;
	}
	else if(mode=='blur')
	{
		var pix2=convolute(pix,[[0.0625,0.125,0.0625],[0.125,0.250,0.125],[0.0625,0.125,0.0625]],x.height,x.width);//_to_array(apply_kernel(_to_matrix(pix,x.width,x.height),[[0,0,0],[0,1,0],[0,0,0]]));
		imgd.data.set(pix2);
	}
	if(mode=='custom')
	{
		var _conv=x.getAttribute('data-convolution-matrix');
		var _kernel=new Array();
		var _t=_conv.split('|');
		for(var i=0;i<_t.length;i++)
		{
			_kernel[i]=new Array();
			_s=_t[i].split(',');
			for(var j=0;j<_s.length;j++)
				_kernel[i].push(_s[j]/1);
		}
		var pix2=convolute(pix,_kernel,x.height,x.width);//_to_array(apply_kernel(_to_matrix(pix,x.width,x.height),[[0,0,0],[0,1,0],[0,0,0]]));
		imgd.data.set(pix2);
	}
	c.putImageData(imgd, 0, 0);
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
	console.log(img.length, _img.length)
	
	return _img;
}