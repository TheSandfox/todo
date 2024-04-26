import { useEffect, useState, useRef } from "react";

export default function TodoWidget({todo, handleTodoList, color, handleSelectedTodoList}) {
	const checkInput = useRef(null);
	const editInput = useRef(null);
	// 뉴폼&핸들러
	const [newForm,setNewForm] = useState({...todo})
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
		if (editMode) {editInput.current.select();}
	},[editMode])
	// 리턴 JSX
	return <div
		style={{
			width:'100%',
			height:'48px',
			display:'flex',
			alignItems:'center',
			justifyContent:'space-between',
			backgroundColor:color
		}}
	>
		{/* 체크박스 */}
		<input type="checkbox"
			ref={checkInput}
			style={{
				width:'16px',
				height:'16px'
			}}
			onClick={checkCallback}
		>
		</input>
		{/* id 인디케이터 */}
		<span 
			style={{
				color:'#999',
				width:'48px',
				display:'flex',
				justifyContent:'center'
			}}
		>
			{todo.id}
		</span>
		{/* 할일이름 */}
		{
			// 할일 디스플레이
			!editMode?
			<div style={{flex:'1'}}>
				{todo.title}{/* , {todo.time} */}
			</div>
			:
			// 할일수정
			<>
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
		{/* 수정모드체인지 */}
		<button onClick={handleEditMode.toggle} 
			style={{
				width:'48px',
				height:'100%',
				color:(!editMode?'#0f0':'#330'),
				fontWeight:'bold',
				fontSize:'12px'
			}}
		>
			{!editMode?'바꾸깅':'안바꿀랭'}
		</button>
		{/* 삭제버튼 */}
		<button onClick={removeRequest} 
			style={{
				width:'48px',
				height:'100%',
				color:'#f00',
				fontWeight:'bold'
			}}
		>
			X
		</button>
	</div>
}