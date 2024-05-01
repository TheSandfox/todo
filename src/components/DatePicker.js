import 'css/datepicker.css'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function DatePicker({name,value,onChange}) {
	const dateController = useRef(null);
	const [dateValue,setDateValue] = useState(value);
	const [editMode,setEditMode] = useState(false);
	const [targetDate,setTargetDate] = useState(new Date(value.getFullYear(),value.getMonth(),value.getDate()));
	const handleEditMode = {
		toggle:useCallback(()=>{
			if(editMode) {
				setTargetDate(new Date(value.getFullYear(),value.getMonth(),value.getDate()))
			}
			setEditMode(!editMode);
		},[editMode])
	}
	//타겟 년,월
	const [targetYear,targetMonth] = useMemo(()=>{
		return [targetDate.getFullYear(),targetDate.getMonth()]
	},[targetDate])
	//요일오프셋
	const weekdayOffset = useMemo(()=>{
		return new Date(targetYear,targetMonth,1).getDay();
	},[targetMonth])
	//day배열(맵으로 뿌릴거)
	const days = useMemo(()=>{
		return new Array(42).fill('').map((temp,index)=>{
			let now = new Date();
			let newDate = new Date(targetYear,targetMonth,(index+1)-weekdayOffset)
			return {
				display:newDate.getDate(),
				dateValue:newDate,
				today:newDate.getFullYear()===now.getFullYear()
					&&newDate.getMonth()===now.getMonth()
					&&newDate.getDate()===now.getDate(),
				inMonth:targetMonth===newDate.getMonth()
			};
		})
	},[weekdayOffset])
	//바깥 클릭해서 닫기 이벤트
	useEffect(()=>{
		const downCallback = (e)=>{
			// 좌클릭 아니면 중단
			if (e.button!==0) {return;}
			// 비가시상태면 중단
			if(!editMode) {
				return;
			}
			// 안쪽을 클릭했으면 중단
			if (e.target===dateController.current) {return;}
			if (dateController.current.contains(e.target)) {return;}
			// 바깥쪽 클릭이므로 비표시
			setEditMode(false);
		}
		window.addEventListener('mousedown',downCallback);
		return ()=>{
			window.removeEventListener('mousedown',downCallback);
		}
	},[editMode])
	//외부 onChange
	useEffect(()=>{
		if(onChange) {
			onChange(dateValue);
		}
	},[dateValue])
	//선택버튼클릭
	const selectButtonCallback = ()=>{
		setDateValue(targetDate);
		setEditMode(false);
	}
	//return JSX
	return <div className="datePicker">
		<input className="datePickerInput" 
			value={dateValue.toLocaleDateString('ko-KR')} 
			readOnly={true}
			name={name}
			onClick={handleEditMode.toggle}
		/>
		<div ref={dateController} className={`datePickerController ${editMode?'active':''}`}>
			{/* 연,월 디스플레이 */}
			<div className='yearAndMonth'>
				{targetDate.getFullYear()}-{targetDate.getMonth()+1}
			</div>
			{/* 날짜 위젯들 */}
			<div className='days'>
				{/* 날짜위젯 뿌리기 */}
				{days.map((day,index)=>{
					return <div key={index} 
						className={`day ${
								String(day.dateValue)===String(targetDate)
								?'active'
								:''
							} ${
								day.today?'today':''
							} ${
								day.inMonth?'inMonth':''
							} ${
								day.dateValue.getDay()===0?'red':''
							} ${
								day.dateValue.getDay()===6?'blue':''
							}`
						} 
						onClick={
							()=>{setTargetDate(day.dateValue);}
						}
					>
						{day.display}
					</div>
				})}
			</div>
			{/* 하단 선택버튼 */}
			<div className='bottom'>
				<button onClick={selectButtonCallback}>선택</button>
			</div>
		</div>
	</div>
}