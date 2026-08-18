export type OperationKind='list'|'search'|'update'|'bulk'|'refresh';
type Deferred={resolve:()=>void;reject:(error:Error)=>void};
export class ScenarioController{
 private delays=new Map<OperationKind,number>(); private failures=new Map<string,string>(); private gates=new Map<string,Deferred[]>();
 setDelay(kind:OperationKind,ms:number){this.delays.set(kind,ms)}
 failNext(key:string,message='Simulated failure'){this.failures.set(key,message)}
 async wait(kind:OperationKind,key:string=kind){const delay=this.delays.get(kind)??0;if(delay) await new Promise(r=>setTimeout(r,delay));const fail=this.failures.get(key);if(fail){this.failures.delete(key);throw new Error(fail)}const queue=this.gates.get(key);if(queue?.length) await new Promise<void>((resolve,reject)=>queue.push({resolve,reject}))}
 hold(key:string){if(!this.gates.has(key)) this.gates.set(key,[]);const list=this.gates.get(key)!;list.push({resolve:()=>{},reject:()=>{}})}
 release(key:string){const queue=this.gates.get(key);if(!queue?.length)return;for(const deferred of queue)deferred.resolve();this.gates.delete(key)}
 reset(){this.delays.clear();this.failures.clear();this.gates.clear()}
}
export const scenarioController=new ScenarioController();
