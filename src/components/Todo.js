import { useState, Fragment, useReducer, useMemo, useCallback } from "react";
import TodoWidget from "./TodoWidget";
import DateDisplay from "./DateDisplay";
import AddTodoInput from "./AddTodoInput";
import { todoListDefault, todoListReducer } from "./TodoData";
import { Link } from "react-router-dom";

function TodoTitle({children}) {
	return <h1 className="todoTitle fontBitBit">
		{children}
	</h1>
}

export default function Todo({checkOnly}) {
	const [todoList,dispatchTodoList] = useReducer(todoListReducer,todoListDefault);
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
			// console.log(newForm.date);
			dispatchTodoList({
				type:'edit',
				targetId:id,
				newObj:newForm
			});
			return true
		},
		sort:()=>{
			dispatchTodoList({
				type:'sort'
			})
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
		},
		truncateForced:()=>{
			dispatchTodoList({
				type:'truncate'
			});
		}
	}

	const handleSelectedTodoList = {

		switch: useCallback((id,flag)=>{
			dispatchTodoList({
				type:'select',
				targetId:id,
				flag:flag
			})
		},[todoList.selected]),

		remove: useCallback((id)=>{
			dispatchTodoList({
				type:'select',
				targetId:id,
				flag:false
			})
		},[todoList.selected]),

		selectEmpty: useCallback(()=>{
			dispatchTodoList({
				type:'selectEmpty',
			})
		},[]),

		selectAll: useCallback(()=>{
			dispatchTodoList({
				type:'selectAll'
			})
		})

	}

	const countTodoList = useMemo(()=>{
		return todoList.list.length
	},[todoList.list])

	const countSelectedTodoList = useMemo(()=>{
		return todoList.selected.length
	},[todoList.selected])

	//RETURN JSX
	return <div className="todo">
		<TodoTitle>뭐하려고했더라</TodoTitle>
		<Link to={'/'}>전체보기</Link>
		<br/>
		<Link to={'checked'}>체크된애만보기</Link>
		<DateDisplay/>
		<AddTodoInput handleTodoList={handleTodoList}/>
		<h3>
			Todo List 
			<button onClick={handleTodoList.truncate}>다지우기</button>
			<button onClick={handleTodoList.sort}>정렬하기</button>
			<button onClick={handleSelectedTodoList.selectAll}>전체선택</button>
			<button onClick={handleSelectedTodoList.selectEmpty}>전체선택해제</button>
		</h3>
		{/* 게시물들 뿌리기 (리스트가 있을 때에만)*/}
		{countTodoList>0
			?<div className={'dotbox'}>
			{todoList.list.map((todo,index)=>{
				if (!checkOnly||todoList.selected.includes(todo.id)) {
					return <TodoWidget 
					todo={{...todo,checked:todoList.selected.includes(todo.id)}} 
					handleTodoList={handleTodoList} 
					handleSelectedTodoList={handleSelectedTodoList} 
					key={todo.id} 
					even={index%2===0}
					/>
				} else {
					return <Fragment key={todo.id}></Fragment>
				}

			})}
			</div>
			:<></>
		}
		{/* 디버깅용 */}
		{/* 선택된 게시물 */}
		{/* {todoList.selected.map((item)=>{
			return <div key={item}>
				<Fragment>{item}</Fragment>
			</div>
		})} */}
		{/* <div>총 게시물 갯수: {countTodoList}</div>
		<div>선택된 게시물 갯수: {countSelectedTodoList}</div> */}
	</div>
}