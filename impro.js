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
c.putImageData(imgd, 0, 0);
}
