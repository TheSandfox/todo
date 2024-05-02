const prefix = 'todo';
const itemPrefix = 'item';
const keyPrefix = 'key';
const selectedPrefix = 'selected';

//로컬에서 리스트 가져오기
const todoListDefault = {
	list:Object.keys(localStorage)
		.filter((key)=>{return key.includes(itemPrefix)})
		.map((key)=>{
			return JSON.parse(localStorage.getItem(key));
		})
		.sort((next,prev)=>{
			return parseInt(new Date(next.date).getTime()) - parseInt(new Date(prev.date).getTime())
		})
	,
	selected:JSON.parse(localStorage.getItem(`${prefix}_${selectedPrefix}`))||[]
	,
	maxId:localStorage.getItem(`${prefix}_${keyPrefix}max`)||1
}

// console.log(todoListDefault.list)

const todoListReducer = (state,action)=>{
	switch(action.type){
	case 'add':
		localStorage.setItem(`${prefix}_${keyPrefix}max`,parseInt(state.maxId)+1);
		localStorage.setItem(`${prefix}_${itemPrefix}_${state.maxId}`,JSON.stringify({
			...action.newObj,
			id:state.maxId
		}));
		return {
			...state,
			list:[
				...state.list,
				{
					...action.newObj,
					id:parseInt(state.maxId)
				}
			],
			maxId:parseInt(state.maxId)+1
		}
	case 'remove':
		localStorage.removeItem(`${prefix}_${itemPrefix}_${action.targetId}`);
		return {
			...state,
			list:[...state.list]
				.filter((item)=>{
					return item.id!==action.targetId
				})
		}
	case 'edit':
		localStorage.setItem(`${prefix}_${itemPrefix}_${action.targetId}`,JSON.stringify({
			...action.newObj,
			id:action.targetId
		}))
		return {
			...state,
			list:[...state.list]
				.map((item)=>{return(
					item.id!==action.targetId
					?item
					:{...action.newObj,
						id:item.id}
				)})
		}
	case 'sort':
		return  {
			...state,
			list:state.list.sort((next,prev)=>{
				return parseInt(new Date(next.date).getTime()) - parseInt(new Date(prev.date).getTime())
			})
		}
	case 'truncate':
		localStorage.clear();
		return {
			...state,
			list:[],
			selected:[],
			maxId:1
		};
	case 'select':
		let selectArr = (
			action.flag
			//셀렉티드에 추가
			?[...state.selected,parseInt(action.targetId)]
			//셀렉티드에서 삭제
			:[...state.selected].filter((id)=>{return id!==action.targetId})
		)
		localStorage.setItem(`${prefix}_${selectedPrefix}`,JSON.stringify(selectArr));
		return {
			...state,
			selected:selectArr
		}
		break;
	case 'selectEmpty':
		localStorage.removeItem(`${prefix}_${selectedPrefix}`)
		return  {
			...state,
			list:[...state.list],
			selected:[]
		}
	case 'selectAll':
		let selectAllArr = [...state.list].map((item)=>{
			return parseInt(item.id)
		})
		localStorage.setItem(`${prefix}_${selectedPrefix}`,JSON.stringify(selectAllArr));
		return {
			...state,
			list:[...state.list],
			selected:selectAllArr
		}
	default:
	}
}

export {todoListDefault,todoListReducer}