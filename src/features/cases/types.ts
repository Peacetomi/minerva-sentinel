export type CaseStatus = 'new'|'investigating'|'blocked'|'resolved';
export type CasePriority = 'low'|'medium'|'high'|'critical';
export type SortKey = 'updatedAt'|'priority'|'title'|'status';
export interface CaseRecord { id:string; title:string; summary:string; status:CaseStatus; priority:CasePriority; assignee:string; tags:string[]; updatedAt:string; version:number; score:number; }
export interface CaseFilters { query:string; status:CaseStatus|'all'; priority:CasePriority|'all'; sort:SortKey; direction:'asc'|'desc'; page:number; pageSize:number; }
export interface CasePage { records:CaseRecord[]; total:number; allIds:string[]; requestId:number; }
export interface CasePatch { title?:string; summary?:string; status?:CaseStatus; priority?:CasePriority; assignee?:string; tags?:string[]; }
