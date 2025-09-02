import { useCallback, useEffect, useRef, useState } from 'react';
import type { CaseFilters, CasePatch, CaseRecord } from '../features/cases/types';
import { caseService } from '../services/caseService';
interface State{records:CaseRecord[];allIds:string[];total:number;loading:boolean;refreshing:boolean;error:string|null}
export function useCases(filters:CaseFilters){
 const [state,setState]=useState<State>({records:[],allIds:[],total:0,loading:true,refreshing:false,error:null});
 const owner=useRef(0); const pending=useRef(new Map<string,CasePatch[]>());
 const load=useCallback(async(kind:'list'|'refresh'='list')=>{const token=++owner.current;setState(s=>({...s,loading:kind==='list'&&!s.records.length,refreshing:kind==='refresh',error:null}));try{const result=await caseService.list(filters,kind);if(token!==owner.current)return;setState(s=>({...s,records:result.records.map(record=>applyPending(record,pending.current.get(record.id)??[])),allIds:result.allIds,total:result.total,loading:false,refreshing:false}))}catch(e){if(token===owner.current)setState(s=>({...s,loading:false,refreshing:false,error:e instanceof Error?e.message:'Unable to load cases'}))}},[filters]);
 useEffect(()=>{void load()},[load]);
 const refresh=useCallback(()=>load('refresh'),[load]);
 const optimisticUpdate=useCallback(async(id:string,patch:CasePatch)=>{pending.current.set(id,[...(pending.current.get(id)??[]),patch]);setState(s=>({...s,records:s.records.map(r=>r.id===id?{...r,...patch}:r)}));try{const saved=await caseService.update(id,patch);const queue=pending.current.get(id)??[];queue.shift();if(queue.length)pending.current.set(id,queue);else pending.current.delete(id);setState(s=>({...s,records:s.records.map(r=>r.id===id?applyPending(saved,queue):r)}));return saved}catch(e){const queue=pending.current.get(id)??[];queue.shift();if(queue.length)pending.current.set(id,queue);else pending.current.delete(id);await load('refresh');throw e}},[load]);
 return {...state,refresh,optimisticUpdate};
}
function applyPending(record:CaseRecord,patches:CasePatch[]){return patches.reduce((current,patch)=>({...current,...patch}),record)}
