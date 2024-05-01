import { useRef, useState, Fragment, useReducer, useMemo, useCallback, useEffect } from "react";
import TodoWidget from "./TodoWidget";
import DateDisplay from "./DateDisplay";

import { FaPlus } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { todoListDefault, todoListReducer } from "./TodoData";
import DatePicker from "./DatePicker";

function AddTodoInput({handleTodoList}) {
	const [dateValue,setDateValue] = useState(new Date());
	const [timeValue,setTimeValue] = useState([
		dateValue.getHours(),
		dateValue.getMinutes(),
		dateValue.getSeconds()
	])
	const [titleValue,setTitleValue] = useState('');
	const [expand,setExpand] = useState(false);
	const inputElement = useRef(null);
	const inputValue = useMemo(()=>{
		let newObj = {
			title:titleValue,
			date:dateValue.toLocaleDateString(),
			time:timeValue
		}
		console.log(newObj);
		return newObj
	},[titleValue,dateValue,timeValue])
	//인풋핸들러
	const handleInputValue = {
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
			setTitleValue('');
			setDateValue(new Date());
			setTimeValue(['00','00','00']);
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
	//타임핸들러
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
	return <div className="addTodoList">
		<button className={`expandButton dotbox ${expand?'expanded':''}`} onClick={handleExpand.toggle}>
			<div className="plus">
				<FaPlus/>
			</div>
		</button>
		<div className={`expandContainer dotbox ${expand?'active':''}`}>
			<div className={`inputContainer`}>
				{/* 새로 할 일 입력창 */}
				<input 
					ref={inputElement}
					type='text' 
					name='title' 
					value={titleValue} 
					onChange={handleTitleValue.modify} 
					onKeyDown={enterCallback} 
					placeholder="할 일 입력..."
				/>
				{/* 추가 버튼 */}
				<button onClick={buttonClickCallback}>
					<div className="plus">
						<FaRegPlusSquare className=''/>
					</div>
				</button>
			</div>
		</div>
		<DatePicker name={'date'} value={dateValue} onChange={handleDateValue.modify}/>
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

	const countTodoList = useMemo(()=>{
		return todoList.list.length
	},[todoList.list])

	const handleSelectedTodoList = {

		switch: useCallback((id,flag)=>{
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
		},[selectedTodoList]),

		remove: useCallback((id)=>{
			setSelectedTodoList(
				selectedTodoList.filter((idNum)=>{
					return id!==idNum;
				})
			);
		},[selectedTodoList]),

		clear: useCallback(()=>{
			setSelectedTodoList([]);
		},[])

	}

	const countSelectedTodoList = useMemo(()=>{
		return selectedTodoList.length
	},[selectedTodoList])

	return <div className="todo">
		<DateDisplay/>
		<AddTodoInput handleTodoList={handleTodoList}/>
		<h3>Todo List <button onClick={handleTodoList.truncate}>다지우깅</button></h3>
		{todoList.list.map((todo,index)=>
			<TodoWidget 
				todo={todo} 
				handleTodoList={handleTodoList} 
				handleSelectedTodoList={handleSelectedTodoList} 
				key={todo.id} 
				even={index%2===0}
			/>
		)}
		{selectedTodoList.map((item)=>
			<div key={item}>
				<Fragment>{item}, </Fragment>
			</div>
		)}
		<div>총 게시물 갯수: {countTodoList}</div>
		<div>선택된 게시물 갯수: {countSelectedTodoList}</div>
	</div>
}