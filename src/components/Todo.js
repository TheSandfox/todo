import { useRef, useState, Fragment } from "react";
import TodoWidget from "./TodoWidget";
import DateWidget from "./DateWidget";

function AddTodoInput({handleTodoList}) {
	const inputElement = useRef(null);
	const inputValueDefault = {
		title:'',
		// name:''
	}
	const [inputValue,setInputValue] = useState({
		...inputValueDefault
	});

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
	const submit = ()=>{
		handleInputValue.addRequest();
		handleInputValue.clear();
	}
	const buttonClickCallback = ()=>{
		submit();
		inputElement.current.focus();
	}
	const enterCallback = (e)=>{
		if(e.keyCode!==13){return;}
		submit();
	}
	return <div style={{
		display:'flex',
		alignItems:'center',
		gap:'16px'
	}}>
		<input 
			ref={inputElement}
			type='text' 
			name='title' 
			value={inputValue['title']} 
			onChange={handleInputValue.modify} 
			onKeyDown={enterCallback} 
			style={{
				width:'480px',
				height:'32px',
				fontSize:'24px'
			}}
			placeholder="새로운 Todo..."
		/>
		{/* <div>시간:</div>
		<input type='text' name='time' onChange={handleInputValue.modify} onKeyDown={enterCallback}/> */}
		<button onClick={buttonClickCallback} style={{
			height:'100%',
			background:`url(${process.env.PUBLIC_URL+'/img/001.png'})`,
		}}>
			추가하깅
		</button>
		{/* <img src={process.env.PUBLIC_URL+'/img/001.png'}></img> */}
	</div>
}

export default function Todo() {
	const todoIncrement = useRef(0);
	const todoListDefault = [];
	const [todoList,setTodoList] = useState([...todoListDefault]);
	const selectedTodoListDefault = [];
	const [selectedTodoList,setSelectedTodoList] = useState([...selectedTodoListDefault]);
	const [displayAddInput,setDisplayAddInput] = useState(false);

	const handleTodoList = {
		add:(newObj)=>{
			newObj.id =  todoIncrement.current;
			setTodoList([
				...todoList,
				newObj
			]);
			todoIncrement.current += 1;
		},
		remove:(id)=>{
			setTodoList(
				todoList
				.filter((todo)=>{
					return todo.id!==id;
				})
			);
			handleSelectedTodoList.remove(id);
		},
		edit:(id,newForm)=>{
			setTodoList(
				todoList.map((todo)=>{
					if (todo.id===id){
						return {...newForm,id:id};
					}else {
						return todo;
					}
				})
			);
			return true
		},
		truncate:()=>{
			if(todoList.length>0){
				if(window.confirm('진짜로?','dd')){
					setTodoList([]);
					setSelectedTodoList([]);
					todoIncrement.current = 0;
				}
			}
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

	const handleDisplayAddInput = {
		show:()=>{
			setDisplayAddInput(true);
		},
		hide:()=>{
			setDisplayAddInput(false);
		},
		toggle:()=>{
			setDisplayAddInput(()=>{return !displayAddInput});
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
			<button onClick={handleDisplayAddInput.toggle} style={{
				width:'40px',
				height:'40px'
			}}>
				{displayAddInput?'x':'+'}
			</button>
			{displayAddInput?
				<AddTodoInput handleTodoList={handleTodoList} handleDisplayAddInput={handleDisplayAddInput}/>
			:null}
		</div>
		<h3>Todo List <button onClick={handleTodoList.truncate}>다지우깅</button></h3>
		{todoList.map((todo,index)=>
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