import type {Step} from '../engine';
export interface SceneProps { step: Step; selected: number; onSelect: (index:number)=>void; stack:boolean; array:boolean; doubly:boolean; }
export function Scene2D({step,selected,onSelect,stack,array,doubly}:SceneProps){
  return <div className="react-flat-scene"><div className={`node-sequence ${stack?'vertical':''}`}>
    {step.values.length===0&&<p>Empty collection · head → null</p>}
    {step.values.map((value,index)=><div className="node-slot" key={`${index}-${value}`}><button aria-label={`Value ${value}, index ${index}`} className={`react-node ${selected===index?'selected':''} ${step.active.includes(index)?'active-step':''}`} onClick={()=>onSelect(index)}><strong>{value}</strong><small>{array?`[${index}]`:index===0?stack?'TOP':'HEAD':index===step.values.length-1?'TAIL':'NODE'}</small></button>{!array&&index<step.values.length-1&&<span className="react-arrow" aria-label={doubly?'next and prev pointers':'next pointer'}>{stack?doubly?'⇅':'↓':doubly?'⇄':'→'}</span>}</div>)}
  </div><p className="scene-instruction">{step.explanation}</p></div>;
}
