import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {buildWalkthrough, type Input} from './index.ts';
const base: Input={lesson:'recursion',values:[15,28,46,63],structure:'list',collection:'list',value:78,selected:0,doubly:false};
test('recursion returns 19 in both representations without changing input',()=>{for(const structure of ['list','array'] as const){const lesson=buildWalkthrough({...base,structure});assert.equal(lesson.steps.at(-1)?.result,19);assert.equal(lesson.steps.at(-1)?.stack.length,0);assert.deepEqual(base.values,[15,28,46,63]);}});
test('Fibonacci includes both branches and returns 3',()=>{const lesson=buildWalkthrough({...base,lesson:'fibonacci'});assert.equal(lesson.steps.at(-1)?.result,3);assert.ok(lesson.steps.some(s=>s.line===3));assert.ok(lesson.steps.some(s=>s.line===1));});
test('search found and missing cases terminate',()=>{assert.equal(buildWalkthrough({...base,lesson:'binary',value:46}).steps.at(-1)?.result,2);assert.match(buildWalkthrough({...base,lesson:'binary',value:999}).steps.at(-1)!.explanation,/not present/);assert.match(buildWalkthrough({...base,lesson:'twoPointers'}).steps.at(-1)!.explanation,/Found/);});
test('window sum and invalid window',()=>{assert.equal(buildWalkthrough({...base,lesson:'window',value:2}).steps.at(-1)?.result,109);assert.throws(()=>buildWalkthrough({...base,lesson:'window',value:0}));});
test('stack is LIFO and queue FIFO',()=>{assert.deepEqual(buildWalkthrough({...base,lesson:'append',collection:'stack',value:9}).steps.at(-1)?.values,[9,15,28,46,63]);assert.deepEqual(buildWalkthrough({...base,lesson:'delete',collection:'queue'}).steps.at(-1)?.values,[28,46,63]);});
test('limits include all insertion methods and snapshots are isolated',()=>{for(const lesson of ['append','prepend','insert'] as const)assert.throws(()=>buildWalkthrough({...base,lesson,values:Array(10).fill(1)}));const run=buildWalkthrough({...base,lesson:'reverse'});assert.deepEqual(run.steps[0].values,[15,28,46,63]);assert.deepEqual(run.steps.at(-1)?.values,[63,46,28,15]);});

test('every lesson highlights a valid code line and isolated snapshot',()=>{
  for(const structure of ['array','list'] as const) for(const lesson of ['append','prepend','insert','delete','find','reverse','twoPointers','window','binary','recursion','fibonacci'] as const) {
    const run=buildWalkthrough({...base,structure,lesson,value:lesson==='window'?2:46});
    for(const step of run.steps){assert.ok(step.line>=0&&step.line<run.code.length);assert.ok(step.active.every(i=>i>=0&&i<step.values.length));}
    if(run.steps.length>1){assert.notEqual(run.steps[0].values,run.steps[1].values);assert.notEqual(run.steps[0].stack,run.steps[1].stack);}
  }
});

test('empty searches and invalid inputs are safe',()=>{
  for(const lesson of ['binary','twoPointers','find'] as const)assert.equal(buildWalkthrough({...base,lesson,values:[]}).steps.at(-1)?.active.length,0);
  assert.throws(()=>buildWalkthrough({...base,values:[NaN]}));
  assert.throws(()=>buildWalkthrough({...base,lesson:'delete',values:[]}));
});

test('displayed binary and window code executes in both representations',()=>{
  const nodes=base.values.map(value=>({value,next:null as unknown}));
  nodes.forEach((node,i)=>node.next=nodes[i+1]??null);
  for(const structure of ['array','list'] as const){
    const binary=buildWalkthrough({...base,lesson:'binary',structure});
    const found=runInNewContext(`${binary.code.join('\n')}\nbinarySearch(data, 46)`,{data:structure==='array'?base.values:nodes[0]});
    assert.equal(structure==='array'?found:found.value,structure==='array'?2:46);
    const window=buildWalkthrough({...base,lesson:'window',value:2,structure});
    assert.equal(runInNewContext(`${window.code.join('\n')}\nmaxWindowSum(data, 2)`,{data:structure==='array'?base.values:nodes[0]}),109);
  }
});
