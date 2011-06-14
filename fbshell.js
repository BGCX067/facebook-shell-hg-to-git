var access_token="none";
var curContext=null;
var curUser=null;
var appId='120496151366418';
var client_secret=null;
var lastOP=null;
var	curConf=null;


var funDir;
	function processIP(str){
		var reqCmd=new object();
		str.trim();
		for(var i=0;i<str.length;i++){
			var temp="";
			if(str[i]=='\n'){
				return reqCmd;				
			}
			else if(str[i]!='\t' && str[i]!=' '){
					temp+=str[i];
			}else{
				reqCmd.name=temp;
			}
		}
		var args=new object();
		for(var i=0;i<str.length;i++){
			var temp="";
			if(str[i]=='\n'){
				return reqCmd;				
			}
			else if(str[i]!='\t' && str[i]!=' '){
					temp+=str[i];
			}else{
				reqCmd.name=temp;
			}
		}
	}
	
  	function ls(cmd,op){
  		var opStr="<table border=\"0\" style=\"text-align: left\">";
  		var i=0;
	  	for(i=0;i<commands.length;i++){
	  		if(i%5==0){
	  			opStr+="<tr>";
	  		}else if(i%5==4){
		  		opStr+="</tr>";
	  		}

	  		opStr+="<td width=\"50\" style=\"color:black; text-align: left\">"+commands[i].id+"</td>";
	  		
	  	}
	  	if(i%5!=0){
	  		opStr+="</tr>";
	  	}
	  	opStr+="</table>";
	  	op.innerHTML=opStr;
	}
	function retrieveCmd(){
		
	}
  function login(op) {
    FB.login(function(response) {
    if (response.session) {
        if (response.perms) {
        // user is logged in and granted some permissions.
        // perms is a comma separated list of granted permissions
        op.innerHTML="logged in Succesfully";
        } else {
		   		
                op.innerHTML="<span class=\"ERROR\" >logged in Succesfully but not unable to get access</span>";
                
        // user is logged in, but did not grant any permissions
        }
    } else {
        // user is not logged in
        op.innerHTML="<span class=\"ERROR\" >failed to login</span>";;
    } 
});
}
function clear(cmd,op){
	var output=document.getElementById("output");
	output.innerHTML="";
}
function scrollme(){
dh=document.body.scrollHeight
ch=document.body.clientHeight
if(dh>ch){
moveme=dh-ch
window.scrollTo(0,moveme)
}
}
function addObject(obj,opStr){
	opStr="<div class=opDiv>";
	for(var v in obj){
		opStr+="<span class=\"CMDOP_HEAD\">"+v+":	</span><span class=\"CMDOP\">";
		
		if(obj[v] && obj[v].constructor.toString().indexOf('Array') != -1){
			opStr+=display(obj[v])+"</span>";			
		}else if(obj[v] && obj[v].constructor.toString().indexOf('Object') != -1){
			var temp=obj[v];
			var temp2="";
			opStr+=addObject(temp,temp2)+"</span>";	
		}else{
			opStr+=obj[v]+"</span>";	
			
		}
		opStr+="</br>"
	}
	opStr+="</div>"
	return opStr;
}
function display(object){
	var opStr="";
	//opStr+="<br/>"
	
	for(var i=0;i<object.length;i++){
		opStr+=addObject(object[i],opStr);
	}
	return opStr;
}
function api(cmd,op){
	op.innerHTML="";
	var cmdStr="/";
	if(curContext!=null){
		cmdStr+=curContext.id+"/";
	}
	var fields=false;
	if(curContext!=null && curContext.localCmd!=undefined  && curContext.localCmd==true){
		cmdStr+=cmd.name;
	}else if(cmd.name.charAt(0)=='?'){
		fields=true;
		cmdStr+="?fields=";
		var temp=cmd.name.toString().substring(1);
		if(temp.length>0){
			cmdStr+=temp;
			for(var i=0;i<cmd.args.length;i++){
				cmdStr+="&"+cmd.args[i];
			}
		}else{
			if(cmd.args.length>0){
				cmdStr+=cmd.args[0];
				for(var i=1;i<cmd.args.length;i++){
					cmdStr+="&"+cmd.args[i];
				}	
			}else{
				var errOp=document.createElement("div");
				errOp.innerHTML="<span class=\"ERROR\">expecting name of fields</span>";
				op.appendChild(errOp);
				return;
				
			}
		}
		
		
	}else{
		cmdStr+=cmd.name;	
	}
	
	if(access_token!="none"){
		if(fields){
			cmdStr+="&access_token="+access_token;
		}else{
			cmdStr+="?access_token="+access_token;
		}
		
		
	}
	var w8ing=document.createElement("span");
	w8ing.class="CMDOP";
	w8ing.innerHTML="<span class=\"CMDOP\">...</span>";
	
	var cmdStrDiv=document.createElement("div");
	cmdStrDiv.class="opDiv";
  	cmdStrDiv.innerHTML="url: "+cmdStr;
	op.appendChild(cmdStrDiv);
	op.appendChild(w8ing);
	var d = new Date();
	var startTime=d.getTime();		
	FB.api(cmdStr, function(response) {
					d = new Date();
					var endTime=d.getTime();
 					diff=endTime-startTime;
					var FBOP = document.createElement("div");
					FBOP.class="opDiv";
                    if (response !=null && response.error) {
                        FBOP.innerHTML="<span class=\"ERROR\">"+response.error.type+": "+response.error.message+"</span>";
  						lastOP=null;
					}else if(!response){
						FBOP.innerHTML="<span class=\"ERROR\">Object is not accesseble</span>";
						lastOP=null;
                    } else {
						var ob=response;
						lastOP=response;
//						opStr=addObject(ob,opStr);
						var opStr="";						
						FBOP.innerHTML=addObject(ob,opStr);
						
                    }
					op.removeChild(w8ing);
					op.appendChild(FBOP);
					var timeTakenDiv=document.createElement("div");
					timeTakenDiv.class="opDiv";
				  	timeTakenDiv.innerHTML="<span>Time Taken: "+diff+" Milliseconds</span>";
				  	op.appendChild(timeTakenDiv);
          			scrollme();
                  });
				  scrollme();
}
function setUser(user){
	var tempDiv=document.getElementById("userDiv");
	var promptDiv=document.getElementById("prompt");
	if(user!=null){
		curUser=user;
		tempDiv.innerHTML="Welcome "+curUser.name;
	}else{
		curUser=null;
		tempDiv.innerHTML="";
		
	}
	promptDiv.innerHTML=getTerminalText()+"&gt;&nbsp;";
	
	
}
function setContext(response){
	curContext=response;
	promptDiv=document.getElementById("prompt");
	promptDiv.innerHTML=getTerminalText()+"&gt;&nbsp;";
}
function cd(cmd,op){
	op.innerHTML="";
	var errOp=document.createElement("div");
	if(cmd.args.length<1){
		errOp.innerHTML="<span class=\"ERROR\">expecting name of object</span>";
		op.appendChild(errOp);
		return;
	}else if(cmd.args[0]==".."){
		setContext(null);
		return;
	}else if(cmd.args[0]=="search"){
		setContext(fbSearch);
		return;
	}
	var cmdStr="/"+cmd.args[0];
	if(access_token!="none"){
		cmdStr+="?access_token="+access_token;
	}
	var w8ing=document.createElement("span");
	w8ing.class="CMDOP";
	w8ing.innerHTML="<span class=\"CMDOP\">...</span>";
	
	var cmdStrDiv=document.createElement("div");
	cmdStrDiv.class="opDiv";
  	cmdStrDiv.innerHTML="url: "+cmdStr;
	op.appendChild(cmdStrDiv);
	op.appendChild(w8ing);
	var d = new Date();
	var startTime=d.getTime();
//cd	
	FB.api(cmdStr, function(response) {
					d = new Date();
					var endTime=d.getTime();
 					diff=endTime-startTime;
					var FBOP = document.createElement("div");
					FBOP.class="opDiv";
                    if (response !=null && response.error) {
                        FBOP.innerHTML="<span class=\"ERROR\">"+response.error.type+": "+response.error.message+"</span>";
						lastOP=null;
					}else if(!response){
						FBOP.innerHTML="<span class=\"ERROR\">Object is not accesseble</span>";
						lastOP=null;
                    } else {
						lastOP=response;
						//var ob=response;
//						opStr=addObject(ob,opStr);
						//var opStr="";						
						setContext(response);
						//FBOP.innerHTML=addObject(ob,opStr);
						
						
                    }
					op.removeChild(w8ing);
					op.appendChild(FBOP);
					var timeTakenDiv=document.createElement("div");
					timeTakenDiv.class="opDiv";
				  	timeTakenDiv.innerHTML="<span>Time Taken: "+diff+" Milliseconds</span>";
				  	op.appendChild(timeTakenDiv);
          			scrollme();
                  });
				  scrollme();
}
function graphApi(cmd,op){
	op.innerHTML="<span class=\"CMDOP\">...</span>";
	var cmdStr="/"+cmd.name;
	if(access_token!="none"){
		cmdStr+="?access_token="+access_token;
	}
	var d = new Date();
	var startTime=d.getTime();		
	FB.api(cmdStr, function(response) {
					d = new Date();
					var endTime=d.getTime();
 					diff=endTime-startTime;
                    if (!response || response.error) {
                        op.innerHTML="<span class=\"ERROR\">"+response.error.type+": "+response.error.message+"</span>";
                    } else {

						var ob=response;
//						opStr=addObject(ob,opStr);
						var opStr="";
						op.innerHTML=addObject(ob,opStr);
                    }
					var timeTakenDiv=document.createElement("div");
				  	timeTakenDiv.innerHTML="<span>Time Taken: "+diff+" Milliseconds</span>";
				  	op.appendChild(timeTakenDiv);
          			scrollme();
					
                  });
}
function restApi(cmd,op){
op.innerHTML="<span class=\"CMDOP\">...</span>";
//	alert(cmd+"\n"+access_token);
	var d = new Date();
	var startTime=d.getTime();		
	FB.api({
		method: cmd,
		uid: 1130941135,		
		access_token: access_token.toString()

	}, 
	function(response) {
					var endTime=d.getTime();
 					diff=endTime-startTime;

                    if (!response || response.error) {
                        op.innerHTML="<span class=\"ERROR\">"+response.error.type+": "+response.error.message+"</span>";
                    } else {
						var opStr="";
                        for(var v in response){
                        	opStr+="<br/><span class=\"CMDOP\" >"+v+": "+response[v]+"</span>";	
                        }
						op.innerHTML=opStr;
                    }
					var timeTakenDiv=document.createElement("div");
				  	timeTakenDiv.innerHTML="<span>Time Taken: "+diff+"</span>";
				  	op.appendChild(timeTakenDiv);
                    scrollme();
                  });

}
var commands=new Array();
var cmdCount=0;

//commands[cmdCount++]=api;
//commands[cmdCount++]=restApi;
  function execute(cmd,op){
    var found=false;
    var key=13;
	var cmd = makeCmd(cmd,key);
	var tempDiv = document.createElement("div");
	tempDiv.innerHTML=cmd.name+"<br/>";
	for(arg in cmd.args){
		tempDiv.innerHTML+=cmd.args[arg]+"<br/>";	
	}
	tempDiv.innerHTML+=cmd.time+"<br/>";
	tempDiv.innerHTML+="<br/>";
//	op.appendChild(tempDiv);

	  	for(var i=0;i<commands.length;i++){
  			if(cmd.name==commands[i].name){
 				commands[i](cmd,op); 			
 				found=true;
 				break;
  			}
  		}
	if(!found){
	  	if(curContext!=null){
  		  	for(var i=0;i<commands.length;i++){
  				if(curContext.name==commands[i].name){
  					curContext(cmd,op);
					found=true;
 					break;
  				}
  			}
		}
	}
  	if(!found){
  		//op.innerHTML="<span class=\"ERROR\" >"+cmd+": command not found</span>";
  		api(cmd,op);
  		//restApi(cmd,op);
  	}
  	
  }

  function onKeyPressed(ev) {
	   var e = ev || event;
	   if(e.keyCode == 13) {
    	  //Enter was pressed
    	  	return true; //outputents form from being submitted.
   		}else{
	   		return false;
   		}
	}
	function getTerminalText(){
		var terminalText="$";
		if(curUser!=null){
			terminalText+=curUser.id;
		}else{
			terminalText+="guest";
		}
		terminalText+="@fb";
		if(curContext!=null){
			terminalText+="/"+curContext.id;
		}
		return terminalText;
	}
	function process(ev) {
		var ipField=document.getElementById("cmdL");
		var temp1=cmdStack;
		var temp=ev;
		if(onKeyPressed(ev)){
			var output=document.getElementById("output");
			var ip=document.createElement("div");
			
			var cmd=ipField.value.trim();
			ipField.value="";
			var op=document.createElement("div");
			op.color="black";
			
			var ipStr="<br/><span class=\"less\">"+getTerminalText()+"> "+"</span>"+cmd.toString();
			ip.innerHTML=ipStr;
			op.innerHTML="executing...";
			output.appendChild(ip);
			output.appendChild(op);
			execute(cmd,op);
			scrollme();
			//output.innerHTML="OK";
	     	document.getElementById("cmdL").focus();
			}else if(cmdStack.cmds.length>0){
				if(ev.keyCode==40){			
					cmdStack.curCmdIndex++;
					cmdStack.curCmdIndex=(cmdStack.curCmdIndex)%cmdStack.cmds.length;
					ipField.value=cmdStack.cmds[cmdStack.curCmdIndex].text;			
	
				}else if(ev.keyCode==38){
					if(cmdStack.curCmdIndex==0){
						cmdStack.curCmdIndex=cmdStack.cmds.length-1;
					}else{
						cmdStack.curCmdIndex--;
					}
					ipField.value=cmdStack.cmds[cmdStack.curCmdIndex].text;		

				}
			}



	}
	function setAccessToken(temp){
		if((temp=='' || temp==null)){
			temp="none";
			document.getElementById("cmdL").focus();
		}else{
			var cmdStr="/me?access_token="+temp;
				FB.api(cmdStr, function(response) {
					
                    if (response !=null && response.error) {
                        alert("Invalid access token");
					}else if(!response){
						alert("Invalid access token");
                    } else {
						access_token=temp;
						setUser(response);
						var token= document.getElementById("tokenip");
						token.innerHTML="<span>"+access_token+"</span>";		
                    }
					document.getElementById("cmdL").focus();
                  });
		}
		

			
	}
	
	function gettoken(){
			var temp=prompt("Enter Access token:",access_token);//
			setAccessToken(temp);

	}
	function userInfo(){
		
	}
	function loginAsyn(){
		/*$.ajax({ url : "https://www.facebook.com/dialog/oauth?client_id=120496151366418&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=email,read_stream?callback=?",
    type : "GET",
    error : function(req, message) {
        alert(message);
    },
    success : function(data) {
        alert(data);
    },
    dataType: 'JSONP',
    crossDomain : true
    });*/
/*    window.location.replace("https://www.facebook.com/dialog/oauth?client_id=120496151366418&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=email,read_stream");*/

    alert(window.location.href);
	}
	function getMyHost(){
		var java=document.getElementById("java");
//		java.innerHTML="Output:<br/>";
			var url = "abc.js"; // URL of the external script
			// this shows dynamic script insertion
			var script = document.createElement('script');
			script.setAttribute('src', url);
			java.appendChild(script);
	/*	var applete=document.getElementById("gethost");
		for(var ob in applete){
			java.innerHTML+=ob.toString()+":";
			if(java[ob]){
				java.innerHTML+=applete[ob].toString();
			}
			
		}
		*/
	}
function fbSearch(cmd,op){
		if(cmd.text==""){
			var temp=lastOP;
			if(lastOP!=null && lastOP.paging!=null){
				var k=lastOP.paging.next.indexOf('?');
				cmd.name=lastOP.paging.next.substring(k);
				api(cmd,op);
				return;
			}
		}else{
					var i=cmd.args.length;
				cmd.name="?q="+cmd.text;
				cmd.name+="&type="+fbSearch.type;
				cmd.name+="&limit="+fbSearch.limit;
				cmd.name+="&since="+fbSearch.since;
				cmd.name+="&until="+fbSearch.until;
				cmd.name+="&fields="+fbSearch.fields;
				api(cmd,op);
				return;
		}
		op.innerHTML="";

}
fbSearch.localCmd=true;
fbSearch.type="";
fbSearch.limit=25;
fbSearch.since="";
fbSearch.until="";
fbSearch.id="search";
fbSearch.name="search";
fbSearch.fields="";
function set(cmd,op){
	if(cmd.args[0]!=undefined && (cmd.args[0]=="type")){
		var k;
		if(cmd.args[1]=="="){
			k=2;
		}else{
			k=1;
		}
		fbSearch.type=cmd.args[k];
	}else if(cmd.args[0]!=undefined && cmd.args[0]=="fields"){
		var k;
		if(cmd.args[1]=="="){
			k=2;
		}else{
			k=1;
		}
		fbSearch.fields=cmd.args[k];
		var temp =fbSearch;
		var temp1=fbSearch;
	}
	op.innerHTML="";
}

function getSecret(){
	var temp=prompt("Your App ID",client_secret);
	if(!(temp==null || temp.length==0)){
		client_secret=temp;
	}else{
		document.getElementById("cmdL").focus();
		return;
	}
	setSecret(client_secret);
}	
function setSecret(value){
	client_secret=value;
	var cs=document.getElementById("clientsecret");
	cs.innerHTML=client_secret;
	var login=document.getElementById("ll");
	login.href="https://www.facebook.com/dialog/oauth?client_id="+appId+"&client_secret="+client_secret+"&redirect_uri=http://www.facebook.com/connect/login_success.html&response_type=token";
	document.getElementById("cmdL").focus();
}
function setApp(){
	
	var temp=prompt("Your App ID",appId);
	if(!(temp==null || temp.length==0)){
		appId=temp;
	}else{
		document.getElementById("cmdL").focus();
		return;
	}
	
	var	l2=document.getElementById("appIdip");
	l2.innerHTML=appId;
	setAccessToken("none");
	setContext(null);
	setUser(null);
	var login=document.getElementById("ll");
	login.href="https://www.facebook.com/dialog/oauth?client_id="+appId+"&client_secret="+client_secret+"&redirect_uri=http://www.facebook.com/connect/login_success.html&response_type=token";
	FB.init({
    appId  : appId,
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : true  // parse XFBML
  });
  document.getElementById("cmdL").focus();
}
function enterCmd(){
  document.getElementById("cmdL").focus();
}
ls.id="ls";
clear.id="clear";
cd.id="cd";
set.id="set";
commands[cmdCount++]=ls;
//commands[cmdCount++]=login;
commands[cmdCount++]=clear;
commands[cmdCount++]=cd;
commands[cmdCount++]=fbSearch;
commands[cmdCount++]=set;
$(document).ready(function() {
  document.getElementById("cmdL").focus();
  setUser(null);
});


/*
FB.init({
    appId  : appId,
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : true  // parse XFBML
  });
*/  
/*
FB.getLoginStatus(function(response) {
if (response.session) {
    // logged in and connected user, someone you know
    	var facebook=document.getElementById("fb");
    		facebook.innerHTML="<a target=\"_blank\" style=\"color: 3B5998\" href=\"https://www.facebook.com/dialog/oauth?client_id=120496151366418&redirect_uri=http://www.facebook.com/connect/login_success.html\">	logout	</a>";
  } else {
	var facebook=document.getElementById("fb");
		facebook.innerHTML="<a target=\"_blank\" style=\"color: 3B5998\" href=\"https://www.facebook.com/dialog/oauth?client_id=120496151366418&redirect_uri=http://www.facebook.com/connect/login_success.html\">	login	</a>";
    // no user session available, someone you dont know
  }
});
*/



