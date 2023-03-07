//参考:Javascriptで正規分布の実装まとめ（乱数、累積分布関数など） https://www.marketechlabo.com/normal-distribution-javascript/

function dnorm(x){
	return Math.exp(x * x * -0.5) / Math.sqrt(2*Math.PI);
}

function pnorm(x){
	var p  =  0.2316419;
    var b1 =  0.31938153;
    var b2 = -0.356563782;
    var b3 =  1.781477937;
    var b4 = -1.821255978;
    var b5 =  1.330274429;
    var t = 1 /(1 + p * Math.abs(x));
	var y = 1 - dnorm(x) * (b1*t+b2*(t**2)+b3*(t**3)+b4*(t**4)+b5*(t**5));
	return (x>0)? y : 1-y ;
	
}

function qnorm(x){
	if(x<0 || x>1) return NaN;
	return qnorm_re(x,-8.29371,8.29371);
	
}

function qnorm_re(x,a,b){
	
	if(Math.abs(b-a)<1e-11) return (a+b)/2;
	c=(a+b)/2;
	if(pnorm(c)<x) return qnorm_re(x,c,b);
	else return qnorm_re(x,a,c);
	
}

function toAccum(x,flag){
	if(x>100) x=100;
	if(flag) return 1-x/200.0;
	else return x/200.0;
}

function estimate(str,sigma){
	var a=0.143524356;
	var b=0.562206405;
	return (str-b*sigma)/(1.0+a*sigma);
}

function calculate(str, isUp, percent){
	if(str=="")str=0;
	if(percent=="")percent=0;
	return estimate(str,qnorm(toAccum(percent,isUp)));
}

function calc_sd(str){
	var a=0.143524356;
	var b=0.562206405;
	return a*str+b;
}

function estimate_percent_from_str(x){
	var percent=pnorm((x-weapon_str)/weapon_sd);
	return percent;
}

function estimate_str_from_percent(x){
	return qnorm(x)*weapon_sd+weapon_str;
}