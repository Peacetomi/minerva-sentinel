export interface SelectionState{ids:Set<string>}
export type SelectionAction={type:'toggle';id:string}|{type:'addMany';ids:string[]}|{type:'removeMany';ids:string[]}|{type:'reconcile';existingIds:string[]}|{type:'clear'};
export const initialSelection:SelectionState={ids:new Set()};
export function selectionReducer(state:SelectionState,action:SelectionAction):SelectionState{const next=new Set(state.ids);switch(action.type){case'toggle':next.has(action.id)?next.delete(action.id):next.add(action.id);break;case'addMany':action.ids.forEach(id=>next.add(id));break;case'removeMany':action.ids.forEach(id=>next.delete(id));break;case'reconcile':{const existing=new Set(action.existingIds);for(const id of next)if(!existing.has(id))next.delete(id);break}case'clear':next.clear()}return{ids:next}}
