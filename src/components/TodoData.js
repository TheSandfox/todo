const prefix = 'todo_';
const itemPrefix = 'item_';
const keyPrefix = 'key_';

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
	maxId:localStorage.getItem(`${prefix}${keyPrefix}max`)||1
}

// console.log(todoListDefault.list)

const todoListReducer = (state,action)=>{
	switch(action.type){
	case 'add':
		localStorage.setItem(`${prefix}${keyPrefix}max`,parseInt(state.maxId)+1);
		localStorage.setItem(`${prefix}${itemPrefix}${state.maxId}`,JSON.stringify({
			...action.newObj,
			id:state.maxId
		}));
		return {
			...state,
			list:[
				...state.list,
				{
					...action.newObj,
					id:state.maxId
				}
			],
			maxId:parseInt(state.maxId)+1
		}
	case 'remove':
		localStorage.removeItem(`${prefix}${itemPrefix}${action.targetId}`);
		return {
			...state,
			list:[...state.list]
				.filter((item)=>{
					return item.id!==action.targetId
				})
		}
	case 'edit':
		localStorage.setItem(`${prefix}${itemPrefix}${action.targetId}`,JSON.stringify({
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
			maxId:1
		};
	default:
	}
}

export {todoListDefault,todoListReducer}