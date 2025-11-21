import type { CaseFilters } from '../cases/types';export interface SavedView{id:string;name:string;filters:Omit<CaseFilters,'page'>;createdAt:string}
const key='sentinel.views';export function loadViews():SavedView[]{try{return JSON.parse(localStorage.getItem(key)??'[]') as SavedView[]}catch{return[]}}export function saveViews(views:SavedView[]){localStorage.setItem(key,JSON.stringify(views))}
