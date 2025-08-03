export const formatStatus=(value:string)=>value.replace(/(^|_)(\w)/g,(_,s,c)=>`${s?' ':''}${c.toUpperCase()}`);
export const formatRelative=(iso:string)=>new Intl.DateTimeFormat('en',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(iso));
