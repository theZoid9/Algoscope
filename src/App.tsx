import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {buildWalkthrough, LIMIT, type Collection, type Lesson, type Step, type Structure, type Walkthrough} from './engine';
import {Scene2D} from './components/Scene2D';
const Scene3D = lazy(()=>import('./components/Scene3D'));
const initial = [15,28,46,63];
const algorithms: [Lesson,string][]=[['twoPointers','Two pointers'],['window','Window'],['binary','Binary search'],['recursion','Recursion'],['fibonacci','Fibonacci']];
const methods: [Lesson,string][]=[['append','Append'],['prepend','Prepend'],['insert','Insert after'],['delete','Delete'],['find','Find'],['reverse','Reverse']];
export default function App() {
  const [values,setValues]=useState(initial);
  const [collection,setCollection]=useState<Collection>('list');
  const [structure,setStructure]=useState<Structure>('list');
  const [doubly,setDoubly]=useState(false);
  const [lesson,setLesson]=useState<Lesson>('append');
  const [parameter,setParameter]=useState(72);
  const [selected,setSelected]=useState(0);
  const [view,setView]=useState<'2d'|'3d'>('2d');
  const [guided,setGuided]=useState(true);
  const [run,setRun]=useState<Walkthrough|null>(null);
  const [cursor,setCursor]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState('');
  const [light,setLight]=useState(()=>{try{return localStorage.getItem('linklab-theme')==='light';}catch{return false;}});
  const codeRef=useRef<HTMLDivElement>(null);
  const algorithm=algorithms.some(([id])=>id===lesson);
  const recursive=lesson==='recursion'||lesson==='fibonacci';
  const forcedDoubly=lesson==='twoPointers'&&structure==='list';
  const effectiveDoubly=collection==='list'&&(doubly||forcedDoubly);
  const input={lesson,values,structure,collection,value:parameter,selected,doubly:effectiveDoubly};
  let preview:Walkthrough|null=null;
  try{preview=buildWalkthrough(input);}catch{}
  const frame:Step=run?.steps[cursor]??{values:lesson==='recursion'?[4,7,2,6]:lesson==='fibonacci'?[0,1,1,2,3]:values,active:[],line:-1,explanation:'Choose an operation, then start the walkthrough.',stack:[]};
  const display=run??preview;
  const complete=Boolean(run&&cursor===run.steps.length-1);
  useEffect(()=>{
    document.body.classList.toggle('light-theme',light);
    document.body.classList.add('compact');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f3f6fb':'#09111f');
    try{localStorage.setItem('linklab-theme',light?'light':'dark');}catch{}
  },[light]);
  useEffect(()=>{
    if(!playing||!run)return;
    if(cursor>=run.steps.length-1){setPlaying(false);return;}
    const timer=setTimeout(()=>setCursor(n=>n+1),1000);
    return ()=>clearTimeout(timer);
  },[playing,cursor,run]);
  useEffect(()=>{
    const row=codeRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const box=codeRef.current;
    if(row&&box){const offset=row.offsetTop-box.offsetTop;if(offset<box.scrollTop||offset+row.offsetHeight>box.scrollTop+box.clientHeight)box.scrollTop=Math.max(0,offset-box.clientHeight/2);}
  },[cursor,run]);
  function clearRun(){setRun(null);setCursor(0);setPlaying(false);setError('');}
  function choose(next:Lesson){clearRun();setLesson(next);if(algorithms.some(([id])=>id===next))setCollection('list');setParameter(next==='window'?2:next==='twoPointers'?78:next==='binary'?46:72);}
  function chooseCollection(next:Collection){clearRun();setCollection(next);if(next!=='list'){setDoubly(false);setLesson('append');}setStructure('list');}
  function start(){
    try{
      if(!Number.isInteger(parameter)||parameter<0||parameter>999)throw new Error('Enter a whole number from 0 to 999.');
      const next=buildWalkthrough(input);setRun(next);setCursor(guided||recursive?0:next.steps.length-1);setPlaying(false);setError('');
    }catch(reason){setError(reason instanceof Error?reason.message:'Unable to start this lesson.');}
  }
  function finish(){if(!run)return;if(!algorithm){setValues([...run.steps.at(-1)!.values]);setSelected(Math.min(selected,Math.max(0,run.steps.at(-1)!.values.length-1)));}clearRun();}
  return <div className="app-shell">
    <header className="topbar"><a href="#top" className="brand"><span className="brand-orbit"><i/><b/></span><span>algo<span>scope</span></span></a>
      <div className="view-switch" aria-label="Node appearance">{(['2d','3d'] as const).map(mode=><button key={mode} className={view===mode?'active':''} aria-pressed={view===mode} onClick={()=>setView(mode)}>{mode.toUpperCase()} boxes</button>)}</div>
      <button id="themeToggle" aria-label={`Switch to ${light?'dark':'light'} theme`} aria-pressed={light} onClick={()=>setLight(!light)}><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.7-1.5 1.5-1.5 2.5h-4c0-1-.6-1.8-1.5-2.5Z"/></svg></button>
    </header>
    <main id="top"><section className="intro"><div><p className="eyebrow">Learn by following each step</p><h1>See algorithms <em>unfold.</em></h1><p className="intro-copy">Explore data structures in 2D and 3D. Follow each operation, code line, and recursive call.</p></div><div className="complexity-chip"><span>Collection capacity</span><strong>{frame.values.length}/{LIMIT}</strong><small>values</small></div></section>
      <section className="lab-grid"><aside className="control-panel" aria-label="Lesson controls"><div className="panel-heading"><p className="eyebrow">Your experiment</p><h2>Build &amp; explore</h2></div>
        <div className="preset-picker"><span>Collection preset</span><div>{(['list','stack','queue'] as const).map(mode=><button key={mode} className={collection===mode?'active':''} aria-pressed={collection===mode} onClick={()=>chooseCollection(mode)}>{mode==='list'?'Linked list':mode==='stack'?'Stack':'Queue'}</button>)}</div><p>{collection==='stack'?'LIFO: last in, first out.':collection==='queue'?'FIFO: first in, first out.':'Follow next pointers or add prev for backward traversal.'} Up to 10 values.</p></div>
        <div className="algorithm-picker"><span>Algorithm lessons</span><div><button className={!algorithm?'active':''} onClick={()=>choose('append')}>Operations</button>{algorithms.map(([id,label])=><button key={id} className={lesson===id?'active':''} aria-pressed={lesson===id} onClick={()=>choose(id)}>{label}</button>)}</div></div>
        {algorithm&&lesson!=='fibonacci'&&<div className="data-structure-picker"><div className="data-structure-head"><span>Walk through on</span></div><div>{(['array','list'] as const).map(mode=><button key={mode} aria-pressed={structure===mode} className={structure===mode?'active':''} onClick={()=>{clearRun();setStructure(mode);}}><b>{mode==='array'?'▦ Array':'⇄ Linked list'}</b><small>{mode==='array'?'indexed access':'follow pointers'}</small></button>)}</div></div>}
        {!recursive&&<label className="value-field"><span>{lesson==='window'?'Window size':lesson==='twoPointers'?'Target sum':lesson==='binary'||lesson==='find'?'Target value':'Value'}</span><input type="number" min="0" max="999" value={parameter} onChange={e=>{clearRun();setParameter(Number(e.target.value));}} onKeyDown={e=>{if(e.key==='Enter')start();}}/></label>}
        {!algorithm&&<div className="method-grid">{methods.map(([id,label])=>{const allowed=collection==='list'||id==='append'||id==='delete';const name=id==='append'&&collection!=='list'?collection==='stack'?'Push':'Enqueue':id==='delete'&&collection!=='list'?collection==='stack'?'Pop':'Dequeue':label;return <button key={id} className={`method-button ${lesson===id?'active':''}`} disabled={!allowed} onClick={()=>choose(id)}><span className="method-icon">{id==='delete'?'−':id==='find'?'⌕':id==='reverse'?'⇄':'+'}</span><span><b>{name}</b><small>{id==='insert'?'after selected':id==='delete'?'remove selected':'node operation'}</small></span></button>;})}</div>}
        <button className={`step-toggle ${guided?'is-on':''}`} aria-pressed={guided} onClick={()=>setGuided(!guided)} disabled={recursive||Boolean(run)}><span className="step-toggle-icon">≡</span><span><b>Step-by-step mode</b><small>{recursive?'Full guided lesson':'Pause on each instruction'}</small></span><i/></button>
        <button className="run-button" disabled={Boolean(run)} onClick={start}><span>▶</span><span>{recursive?'Start full walkthrough':'Run operation'}</span></button>
        <button className="reset-button" onClick={()=>{clearRun();setValues(initial);setSelected(0);}}>Reset example</button>
        {error&&<p className="validation-message" role="alert">{error}</p>}
      </aside><section className="scene-panel" aria-label={`${view.toUpperCase()} data structure`}><div className="scene-topline"><div><span className="scene-kicker">{algorithm&&structure==='array'&&lesson!=='fibonacci'?'Array':collection==='list'?'Linked list':collection}</span><strong>{frame.values.length} values · {frame.result!==undefined?`result ${frame.result}`:'select a box to inspect'}</strong></div><div className="structure-mode">{(['singly','doubly'] as const).map(mode=><button key={mode} aria-pressed={effectiveDoubly===(mode==='doubly')} className={effectiveDoubly===(mode==='doubly')?'active':''} disabled={collection!=='list'||(algorithm&&structure==='array')||(forcedDoubly&&mode==='singly')} onClick={()=>{clearRun();setDoubly(mode==='doubly');}}>{mode==='singly'?'Singly':'Doubly'}</button>)}</div></div>
        {view==='2d'?<Scene2D step={frame} selected={selected} onSelect={setSelected} stack={collection==='stack'} array={algorithm&&structure==='array'&&lesson!=='fibonacci'} doubly={effectiveDoubly}/>:<Suspense fallback={<div className="scene-loading" role="status">Loading 3D boxes…</div>}><Scene3D step={frame} selected={selected} onSelect={setSelected} stack={collection==='stack'} array={algorithm&&structure==='array'&&lesson!=='fibonacci'} doubly={effectiveDoubly} light={light}/></Suspense>}
        <div className="scene-bottomline"><span>{view==='3d'?'Drag to orbit · scroll to zoom':'Click a box to select'}</span><span>{frame.stack.length?`Call stack: ${frame.stack.join(' → ')}`:'Call stack: empty'}</span></div>
      </section></section>
      <section className="methods-grid"><article className="code-panel"><div className="code-head"><div className="function-heading"><p className="eyebrow">How it works</p><h2>{display?.title??lesson}</h2></div><div className="function-meta"><span className="language-pill">TypeScript / JS</span><span className="current-code-line" role="status">{run?`▶ Line ${frame.line+1}`:'Ready'}</span></div></div>
        <div className="code-window" ref={codeRef}><div className="code-lines">{(display?.code??[]).map((line,index)=><div key={index} className={`code-line ${run&&frame.line===index?'active':''}`} aria-current={run&&frame.line===index?'step':undefined}><span className="code-number">{run&&frame.line===index?'▶ ':''}{index+1}</span><code>{line}</code></div>)}</div></div>
        {run&&<div className="stepper" aria-live="polite"><div className="stepper-top"><span>Step {cursor+1} of {run.steps.length}{complete?' · Complete':''}</span><button aria-label="Close walkthrough" onClick={clearRun}>×</button></div><p>{frame.explanation}</p><div className="stepper-actions"><button className="stepper-back" disabled={cursor===0} onClick={()=>{setPlaying(false);setCursor(n=>n-1);}}>← Back</button><button className="stepper-back" disabled={complete} onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Play'}</button><button className="stepper-next" onClick={()=>{setPlaying(false);if(complete)finish();else setCursor(n=>n+1);}}>{complete?algorithm?'Finish ✓':'Apply change ✓':'Next →'}</button></div></div>}
        <p className="method-explanation">{lesson==='binary'&&structure==='list'?'Linked lists find the middle by walking pointers. Arrays access the midpoint directly.':forcedDoubly?'Two pointers uses a doubly linked list so the right pointer can move backward.':recursive?'Follow every call and return. Back restores the exact earlier snapshot.':'Code, boxes, and trace follow the same step. Apply a structural change when the walkthrough finishes.'}</p>
      </article><article className="activity-panel"><div className="activity-head"><div><p className="eyebrow">Execution trace</p><h2>Follow the progress</h2></div><span className="trace-live">● Live</span></div><ol className="trace-list" aria-live="polite">{run?run.steps.slice(Math.max(0,cursor-3),cursor+1).reverse().map((step,index)=><li key={`${cursor}-${index}`}><b>Line {step.line+1}</b> — {step.explanation}</li>):<li>Start a lesson to see what happens at each step.</li>}</ol></article></section>
    </main><footer><span>AlgoScope</span><p>Data structures and algorithms, one clear step at a time.</p></footer>
  </div>;
}
