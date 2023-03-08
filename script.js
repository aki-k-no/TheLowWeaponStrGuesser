var Flag=true;
var isUserData=true;

var weapon_str=0;
var weapon_sd=0;

var now_time=Date.now();
var future_time=Date.now()+500;
var now_str=0;
var now_sd=0;

var str_map={'反転反転聖剣':713.372,'冥剣':649.038,'無反転聖剣':631.858,'アムル':677.364,'RoA':703.078,'ブリテン':663.392,'繊翳':645.612,'ヘブンレイ':563.403,'Satan':524.376,'ポテト':479.378,'リアライザ':722.522,'エタペン':722.108,'グラエン':740.594};

var doer=function init(){
	
    $("#up_down_selec").click(function(){
		var textdata=$(this).html();
		if(textdata=="上振れ"){
			$(this).html("下振れ")
			$(this).css({"color":"#ff0000"})
		}else{
			$(this).html("上振れ")
			$(this).css({"color":"#008a0b"})
		}
	});
	
	$("#from_str").click(function(){
		var percent=estimate_percent_from_str($("#from_str_input").val());
		$("#from_str_output").html((percent>0.5) ? '<span style="color:#008a0b">上振れ</span>'+Math.round((1 - percent)*200*1000000)/1000000+"%" : '<span style="color:#ff0000">下振れ</span>'+Math.round(percent*200*1000000)/1000000+"%")
	});
	
	$("#from_percent").click(function(){
		var up_down=$("#up_down_selec").html();
		var str=0;
		if(up_down=="上振れ")str=estimate_str_from_percent(1-$("#from_percent_input").val()/200.0);
		else str=estimate_str_from_percent($("#from_percent_input").val()/200);
		$("#from_percent_output").html(Math.round(str*10000)/10000);
	});
    
	$(".selector").click(function(){
		if(!Flag) return;
        $('.selected').addClass('selector');
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        $(this).removeClass("selector");
		Flag=false;
		if($(this).html()!="なんでも"){
			
			isUserData=false;
			var temp=weapon_str;
			weapon_str=str_map[$(this).html()];
			weapon_sd=calc_sd(weapon_str);
			weapon_str=Math.round(weapon_str*100)/100;
			weapon_sd=Math.round(weapon_sd*100)/100;
			if(weapon_str!=temp){
				now_str=$("#average_field").html()-0;
				now_sd=$("#sd_field").html()-0;
				now_time=Date.now();
				future_time=now_time+500;
			}
			
			$(".half").animate({"opacity":"0%"},300,"swing",function(){
				$("#data_input").css("display","none");
				$(".half").animate({"width":"0%"},1200,"swing",function(){Flag=true});
			});
			
		}else{
			
			isUserData=true;
	
				
			$(".half").animate({"width":"50%"},1200,"swing",function(){
				$("#data_input").css("display","block");
				$(".half").animate({"opacity":"100%"},300,"swing",function(){Flag=true});
			});
			
		}
    });
	
	
	
	$(".add_data").click(function(){
		$("#almighty").append('<tbody><td><input type="number" class="weapon_str" placeholder="武器の攻撃力(例:231.89)"></td><td><button class="switch up">上振れ</button></td><td><input type="number" class="percent" placeholder="武器の確率(例23.1)"></td></tbody>')
	});
	$('body').on('click', ".remove_data" , function() {
		$("#almighty>tbody").eq(-1).remove();
	});
	
	
	$('body').on('click', ".up" , function() {
        $(this).toggleClass("down");
		if($(this).html()=="上振れ"){
			$(this).html("下振れ");
		}else{
			$(this).html("上振れ");
		}
    });
	
	$('body').on('keypress', ".weapon_str,.percent" , function(x) {
        
    });
	
	
	
	$('body').on('click', ".up" , function(x) {
        var result=arrangeData();
		$("#average_field").html(result);
    });
	
};

$(function(){
    setInterval(function(){
        arrangeData();
		var currentTime=Date.now();
		if(currentTime>future_time){
			$("#average_field").html(weapon_str);
			$("#sd_field").html(weapon_sd);
		}else{
			$("#average_field").html(Math.round(((weapon_str-now_str)*(Math.sin(Math.PI*((currentTime-now_time)/500-0.5))+1)/2+now_str)*100)/100);
			$("#sd_field").html(Math.round(((weapon_sd-now_sd)*(Math.sin(Math.PI*((currentTime-now_time)/500-0.5))+1)/2+now_sd)*100)/100);
		}
    },10);
});


function arrangeData(){
	if(!isUserData) return;
	var weapon_str_field=$(".weapon_str");
	var weapon_up_down=$(".switch");
	var weapon_sd_field=$(".percent");
	var data=[];
	for(var i=0;i<weapon_sd_field.length;i++){
		if(weapon_str_field.eq(i).val()=="" && weapon_sd_field.eq(i).val()==""){
			continue;
		}
		data[i]=0;
	}
	
		for(var i=0;i<weapon_sd_field.length;i++){
			if(weapon_str_field.eq(i).val()=="" && weapon_sd_field.eq(i).val()==""){
				continue;
			}
			
			if(weapon_up_down.eq(i).html()=="上振れ"){
				data[i]=calculate(weapon_str_field.eq(i).val(),true,weapon_sd_field.eq(i).val());
			}else{
				data[i]=calculate(weapon_str_field.eq(i).val(),false,weapon_sd_field.eq(i).val());
			}
		}
	
	var sum=0;
	for(var i=0;i<data.length;i++){
		sum+=data[i];
		
	}
	var temp=weapon_str;
	weapon_str=((data.length==0) ? 0 : (sum/data.length));
	weapon_sd=calc_sd(weapon_str);
	weapon_str=Math.round(weapon_str*100)/100;
	weapon_sd=Math.round(weapon_sd*100)/100;
	if(weapon_str!=temp){
		now_str=$("#average_field").html()-0;
		now_sd=$("#sd_field").html()-0;
		now_time=Date.now();
		future_time=now_time+500;
	}
	
	if(data.length==0) return 0;
	return (sum/data.length);
}

doer();
