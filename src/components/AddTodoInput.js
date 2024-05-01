import { FaPlus } from "react-icons/fa";
import DatePicker from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { useCallback, useMemo, useRef, useState } from "react";

import 'css/addtodo.css'

export default function AddTodoInput({handleTodoList}) {
	//제목인풋, 날짜인풋, 시간인풋
	const [titleValue,setTitleValue] = useState('');
	const [dateValue,setDateValue] = useState(new Date());
	const [timeValue,setTimeValue] = useState([
		dateValue.getHours(),
		dateValue.getMinutes(),
		dateValue.getSeconds()
	])
	//확장여부
	const [expand,setExpand] = useState(false);
	//제목인풋 엘리먼트
	const inputElement = useRef(null);
	//인풋뭉탱이
	const inputValue = useMemo(()=>{
		let newObj = {
			title:titleValue,
			date:dateValue,
			time:timeValue
		}
		console.log(newObj);
		return newObj
	},[titleValue,dateValue,timeValue])
	//인풋핸들러
	const handleInputValue = {
		addRequest:useCallback(()=>{
			let wantBreak = false;
			let newObj = {
				...inputValue
			}
			let values = Object.values(newObj);
			values.every((value)=>{
				if(value===''){wantBreak=true;return false;}
				return true;
			})
			if (wantBreak){return;}
			handleTodoList.add(newObj);
		},[inputValue]),
		clear:()=>{
			setTitleValue('');
			// setDateValue(new Date());
			// setTimeValue(['00','00','00']);
		}
	}
	//타이틀 핸들러
	const handleTitleValue = {
		modify:(e)=>{
			setTitleValue(e.target.value);
		}
	}
	//데이트 핸들러
	const handleDateValue = {
		modify:(val)=>{
			setDateValue(val);
		}
	}
	//타임 핸들러
	const handleTimeValue = {
		modify:(arr)=>{
			setTimeValue([...arr]);
		}
	}
	//익스팬드 핸들러
	const handleExpand = {
		toggle:()=>{
			setExpand(!expand);
		}
	}
	//리스트 추가 요청
	const submit = ()=>{
		handleInputValue.addRequest();
		handleInputValue.clear();
	}
	//버튼클릭콜백
	const buttonClickCallback = ()=>{
		submit();
		inputElement.current.focus();
	}
	//엔터콜백
	const enterCallback = (e)=>{
		if(e.keyCode!==13){return;}
		submit();
	}
	//리턴 JSX
	return <div className="addTodoList dotbox">
		<div className="top">			
			{/* 타이틀 입력 */}
			<div className="dotbox titleInputWrapper">
				<input 
					className="titleInput"
					ref={inputElement}
					type='text' 
					name='title' 
					value={titleValue} 
					onChange={handleTitleValue.modify} 
					onKeyDown={enterCallback} 
					placeholder="할 일 입력..."
				/>
			</div>
		</div>
		<div className="bottom">
			{/* 날짜입력 */}
			<DatePicker className={'dotbox'} name={'date'} value={dateValue} onChange={handleDateValue.modify}/>
			{/* 시간입력 */}
			<TimePicker className={'dotbox'} name={'time'} value={timeValue} onChange={handleTimeValue.modify} visibleFlag={[true,true,false]}/>
			{/* 추가버튼 */}
			<button className={`addButton dotbox ${expand?'expanded':''}`} onClick={buttonClickCallback}>
				<FaPlus className="plus"></FaPlus>
			</button>
		</div>
	</div>
}
