import { useEffect, useState } from "react";

const DAYS = ['일','월','화','수','목','금','토']

function secondsFormat(val) {
	while(val<0) {
		val+=60;
	}
	while(val>=60) {
		val-=60;
	}
	if (val<10) {
		return '0'+parseInt(val);
	}
	return val;
}

function getDateString(date) {
	return `
		${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 
		${DAYS[date.getDay()]} ${date.getHours()}:${date.getMinutes()}:${secondsFormat(date.getSeconds())}
	`
}

function useInterval(callback,timeout) {
	useEffect(()=>{
		const timer = setInterval(callback,timeout);
		
		return ()=>{clearInterval(timer);}
	},[callback,timeout])
}

export default function DateWidget(){
	const [now,setNow] = useState(getDateString(new Date()));
	const handleNow = {
		refresh:()=>{
			let date = new Date();
			setNow(getDateString(date))
		}
	}
	useInterval(()=>{
		handleNow.refresh();
	},1000)
	
	return <div
		style={{
			width:'100%',
		}}
	>
		<h2>Today</h2>
		<h1>{String(now)}</h1>
	</div>
}