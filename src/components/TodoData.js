const todoListDefault = {
	list:[],
	maxId:1
}

const todoListReducer = (state,action)=>{
	switch(action.type){
	case 'add':
		return {
			...state,
			list:[
				...state.list,
				{
					...action.newObj,
					id:state.maxId
				}
			],
			maxId:state.maxId+1
		}
	case 'remove':
		return {
			...state,
			list:[...state.list]
				.filter((item)=>{
					return item.id!==action.targetId
				})
		}
	case 'edit':
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
	case 'truncate':
		return todoListDefault;
	default:
	}
}

export {todoListDefault,todoListReducer}