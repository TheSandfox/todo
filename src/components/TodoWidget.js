import { useEffect, useState, useRef, useMemo } from "react";
import { timeFormat } from "./TimePicker";

export default function TodoWidget({todo, handleTodoList, even, handleSelectedTodoList}) {
	const editInput = useRef(null);
	// 뉴폼&핸들러
	const [newForm,setNewForm] = useState({
		...todo,
		date:new Date(todo.date)
	})
	const handleNewForm = {
		modify:(e)=>{
			setNewForm({
				...newForm.current,
				[e.target.name]:e.target.value
			})
		},
		reset:()=>{
			setNewForm({...todo});
		}
	}
	// 에딧모드&핸들러
	const [editMode,setEditMode] = useState(false);
	const handleEditMode = {
		enable:()=>{
			setEditMode(true);
			handleNewForm.reset();
		},
		disable:()=>{
			setEditMode(false);
			handleNewForm.reset();
		},
		toggle:()=>{
			handleNewForm.reset();
			setEditMode(!editMode);
		}
	}
	// 데이트밸류
	const dateValue = useMemo(()=>{
		return new Date(todo.date)
	},[todo])
	// 삭제버튼 클릭 시
	const removeRequest = ()=>{
		handleTodoList.remove(todo.id);
	}
	// 수정 컨펌 클릭 시
	const editRequest = ()=>{
		let result = handleTodoList.edit(todo.id,{...newForm});
		if(result){handleEditMode.disable()}
	}
	// 수정 엔터키 콜백
	const editEnterCallback = (e)=>{
		if(e.keyCode!==13) {return;}
		editRequest();
	}
	// 체크박스 클릭 시
	const checkCallback = (e)=>{
		handleSelectedTodoList.switch(todo.id,e.target.checked);
	}
	// 에딧모드 활성화 시 에딧인풋 포커싱
	useEffect(()=>{
		if (editMode) {
			editInput.current.select();
		}
	},[editMode])
	// 리턴 JSX
	return <div
		className={
			`todoWidget fontRadialMo ${todo.checked?'checked':''} ${even?'even':'odd'}`
		}
	>
		{/* 체크박스 */}
		<div className={'checkboxWrapper left'}>
			<input 
				type="checkbox"
				style={{
					width:'16px',
					height:'16px'
				}}
				checked={todo.checked}
				onClick={checkCallback}
				onChange={()=>{}}
			>
			</input>
		</div>
		{/* 할일이름 */}
		<div className={'mid'}>
		{!editMode
			?<><div className="title genericShadow2px">
				{todo.title} 
			</div>
			<div className="dateTime">
				<div className="date genericShadow2px">
					{dateValue.toLocaleDateString()}
				</div>
				<div className="time genericShadow2px">
					{
						todo.time
						?`${timeFormat(todo.time[0])}:${timeFormat(todo.time[1])}`
						:''
					}
				</div>
			</div></>
			:<>
				<input
					ref={editInput}
					type="text"
					name="title"
					style={{flex:'1'}}
					value={newForm['title']}
					onChange={handleNewForm.modify}
					onKeyDown={editEnterCallback}
				/>
				<button onClick={editRequest}>
					컨펌~
				</button>
			</>
		}
		</div>
		{/* 버튼컨테이너 */}
		<div className={'right'}>
			{/* 수정모드체인지 */}
			<button onClick={handleEditMode.toggle}
				className={'dotbox edit'+(editMode?' active':'')}
			>
				{editMode?'취소':'수정'}
			</button>
			{/* 삭제버튼 */}
			<button onClick={removeRequest} 
				className={'dotbox delete'}
			>
				X
			</button>
		</div>
	</div>
}