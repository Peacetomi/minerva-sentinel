import { formatStatus } from '../utils/format';export function StatusPill({value}:{value:string}){return <span className={`pill pill-${value}`}>{formatStatus(value)}</span>}
