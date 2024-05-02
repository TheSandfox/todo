import { useEffect, useMemo, useRef, useState } from "react";

import 'css/timepicker.css'

function timeFormat(str) {
	if (isNaN(parseInt(str))) {return '00'}
	if (String(str).length<2) {return '0'+str;}
	// if (parseInt(str)<10) {return '0'+str;}
	return String(str);
}

function TimePicker({value,onChange,visibleFlag,className}){
	const [hoursInput,setHoursInput] = useState(value[0]);
	const [minutesInput,setMinutesInput] = useState(value[1]);
	const [secondsInput,setSecondsInput] = useState(value[2]);
	const hoursInputElement = useRef(null);
	const minutesInputElement = useRef(null);
	const secondsInputElement = useRef(null);
	const [visible,setVisible] = useState(visibleFlag||[
		...visibleFlag
	])
	const handleHoursInput = {
		modify:(e)=>{
			if(e.target.value.length>2) {return;}
			if(parseInt(e.target.value)>23) {
				setHoursInput(23);
			} else if (parseInt(e.target.value)<0) {
				setHoursInput(timeFormat(0));
			} else {
				setHoursInput(timeFormat(e.target.value));
			}
		},
		validate:(e)=>{
			let val = parseInt(e.target.value);
			console.log(val);
			if (isNaN(val)||val<0){setHoursInput('00');return;}
			setHoursInput(timeFormat(val));
		}
	}
	const handleMinutesInput = {
		modify:(e)=>{
			if(e.target.value.length>2) {return;}
			if(parseInt(e.target.value)>59) {
				setMinutesInput(59)
			} else if (parseInt(e.target.value)<0) {
				setMinutesInput(timeFormat(0));
			} else {
				setMinutesInput(timeFormat(e.target.value))
			}
		},
		validate:(e)=>{
			let val = parseInt(e.target.value);
			if (isNaN(val)||val<0){setMinutesInput('00');return;}
			setMinutesInput(timeFormat(val));
		}
	}
	const handleSecondsInput = {
		modify:(e)=>{
			if(e.target.value.length>2) {return;}
			if(parseInt(e.target.value)>59) {
				setSecondsInput(59)
			} else if (parseInt(e.target.value)<0) {
				setSecondsInput(timeFormat(0));
			} else {
				setSecondsInput(timeFormat(e.target.value))
			}
		},
		validate:(e)=>{
			let val = parseInt(e.target.value);
			if (isNaN(val)||val<0){setSecondsInput('00');return;}
			setSecondsInput(timeFormat(val));
		}
	}
	const timeValue = useMemo(()=>{
		return [
			timeFormat(hoursInput),
			timeFormat(minutesInput),
			timeFormat(secondsInput)
		]
	},[hoursInput,minutesInput,secondsInput])
	useEffect(()=>{
		if(onChange) {
			onChange(timeValue);
		}
	},[timeValue])
	return <div className={"timePicker"+(className?(' '+className):'')}>
		{visible[0]
			?<><input 
				type="number" 
				className="hoursInput fontBitBit" 
				ref={hoursInputElement} 
				name="hours" 
				value={hoursInput} 
				onChange={handleHoursInput.modify}
				onBlur={handleHoursInput.validate}
			/></>
			:<></>
		}
		{visible[1]
			?<><div className="timeColone">:</div>
			<input 
				type="number" 
				className="minutesInput fontBitBit" 
				ref={minutesInputElement} 
				name="minutes" 
				value={minutesInput} 
				onChange={handleMinutesInput.modify}
				onBlur={handleMinutesInput.validate}
			/></>
			:<></>
		}
		{visible[2]
			?<><div className="timeColone">:</div>
			<input 
				type="number" 
				className="secondsInput fontBitBit" 
				ref={secondsInputElement} 
				name="seconds" 
				value={secondsInput} 
				onChange={handleSecondsInput.modify}
				onBlur={handleSecondsInput.validate}
			/></>
			:<></>
		}
	</div>
}

export {timeFormat, TimePicker};