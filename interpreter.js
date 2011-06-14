var dict=new Object();
var cmdStack=new Object();
cmdStack.cmds=new Array();
cmdStack.count=0;
cmdStack.max=10;
cmdStack.lastCmd=null;
cmdStack.curCmdIndex=0;



function initDict(){
	dict['ls']=ls;
	commands['clear']=clear;
}

function makeCmd(str,key){	
	str=str.replace(/\s+|\t+/g,' ');
	var	temp=cmdStack;
	if(cmdStack.lastCmd!=null && cmdStack.lastCmd.text==str){
		cmdStack.lastCmd.time=new Date();		
		cmdStack.curCmdIndex=cmdStack.cmds.length;
		return cmdStack.lastCmd;
	}
	var cmd=new Object();
	cmd.text=str;
	var fragments=str.split(' ');
	if(fragments.length<=0){
		return null;
	}
	cmd.name=fragments[0];
	cmd.args=fragments.slice(1);
	cmd.time=new Date();
	cmdStack.cmds[cmdStack.cmds.length]=cmd;
	cmdStack.lastCmd=cmd;
	cmdStack.curCmdIndex=cmdStack.cmds.length;
//	cmd.key=key;
	return cmd;
}


