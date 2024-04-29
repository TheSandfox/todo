import { useRef, useState, Fragment, useReducer } from "react";
import TodoWidget from "./TodoWidget";
import DateWidget from "./DateWidget";

import { FaPlus } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { todoListDefault, todoListReducer } from "./TodoData";

function AddTodoInput({handleTodoList}) {
	const [expand,setExpand] = useState(false);
	const inputElement = useRef(null);
	const inputValueDefault = {
		title:'',
		// name:''
	}
	const [inputValue,setInputValue] = useState({
		...inputValueDefault
	});

	//인풋핸들러
	const handleInputValue = {
		modify:(e)=>{
			setInputValue({
				...inputValue,
				[e.target.name]:e.target.value
			})
		},
		addRequest:()=>{
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
		},
		clear:()=>{
			setInputValue({
				...inputValueDefault
			})
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
	return <div className="addTodoList">
		<button className={`expandButton dotbox ${expand?'expanded':''}`} onClick={handleExpand.toggle}>
			<div className="plus">
				<FaPlus/>
			</div>
		</button>
		<div className={`expandContainerWrapper dotbox ${expand?'active':''}`}>
		<div className={`expandContainer ${expand?'active':''}`}>
			<div className={`inputContainer`}>
				<input 
					ref={inputElement}
					type='text' 
					name='title' 
					value={inputValue['title']} 
					onChange={handleInputValue.modify} 
					onKeyDown={enterCallback} 
					placeholder="할 일 입력..."
				/>
				<button onClick={buttonClickCallback}>
					<div className="plus">
						<FaRegPlusSquare className=''/>
					</div>
				</button>
			</div>
		</div>
		</div>
	</div>
}

export default function Todo() {
	const [todoList,dispatchTodoList] = useReducer(todoListReducer,todoListDefault);
	const selectedTodoListDefault = [];
	const [selectedTodoList,setSelectedTodoList] = useState([...selectedTodoListDefault]);

	const handleTodoList = {
		add:(newObj)=>{
			dispatchTodoList({
				type:'add',
				newObj:newObj
			});
		},
		remove:(id)=>{
			if(!window.confirm('진짜로?')){
				return;
			}
			dispatchTodoList({
				type:'remove',
				targetId:id
			});
			handleSelectedTodoList.remove(id);
		},
		edit:(id,newForm)=>{
			dispatchTodoList({
				type:'edit',
				targetId:id,
				newObj:newForm
			});
			return true
		},
		truncate:()=>{
			if(todoList.list.length<=0){
				return;
			}
			if(!window.confirm('진짜로?')){
				return;
			}
			dispatchTodoList({
				type:'truncate'
			});
			handleSelectedTodoList.clear();
		},
		truncateForced:()=>{
			dispatchTodoList({
				type:'truncate'
			});
			handleSelectedTodoList.clear();
		}
	}

	const handleSelectedTodoList = {
		switch:(id,flag)=>{
			console.log('얍')
			if(flag){
				console.log('켜짐')
				setSelectedTodoList([
					...selectedTodoList,
					id
				])
			} else {
				console.log('꺼짐')
				setSelectedTodoList(
					selectedTodoList
					.filter((item)=>{
						return item!==id
					})
				);
			}
		},
		remove:(id)=>{
			setSelectedTodoList(
				selectedTodoList.filter((idNum)=>{
					return id!==idNum;
				})
			);
		},
		clear:()=>{
			setSelectedTodoList([]);
		}
	}

	return <div className="todo" style={{
		width:'960px',
		margin:'0 auto'
	}}>
		<DateWidget/>
		<div style={{
			display:'flex',
			gap:'32px',
			alignItems:'center'
		}}>
			<AddTodoInput handleTodoList={handleTodoList}/>
		</div>
		<h3>Todo List <button onClick={handleTodoList.truncate}>다지우깅</button></h3>
		{todoList.list.map((todo,index)=>
			<TodoWidget 
				todo={todo} 
				handleTodoList={handleTodoList} 
				handleSelectedTodoList={handleSelectedTodoList} 
				key={todo.id} 
				color={index%2===0?'#cf0':'#fc0'}
			/>
		)}
		{selectedTodoList.map((item)=>
			<div key={item}>
				<Fragment>{item}, </Fragment>
			</div>
		)}
	</div>
}