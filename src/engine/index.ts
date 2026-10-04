export type Lesson = 'append' | 'prepend' | 'insert' | 'delete' | 'find' | 'reverse' | 'twoPointers' | 'window' | 'binary' | 'recursion' | 'fibonacci';
export type Structure = 'array' | 'list';
export type Collection = 'list' | 'stack' | 'queue';
export interface Step { values: number[]; active: number[]; line: number; explanation: string; stack: string[]; result?: number; }
export interface Walkthrough { title: string; code: string[]; steps: Step[]; }
export interface Input { lesson: Lesson; values: number[]; structure: Structure; collection: Collection; value: number; selected: number; doubly: boolean; }
export const LIMIT = 10;

export function buildWalkthrough(input: Input): Walkthrough {
  const { lesson, structure, collection, value, selected, doubly } = input;
  if(input.values.length > LIMIT) throw new Error('Collections support up to 10 values.');
  if(!input.values.every(Number.isFinite) || !Number.isFinite(value)) throw new Error('Values must be finite numbers.');
  let values = [...input.values];
  const steps: Step[] = [];
  const add = (line: number, explanation: string, active: number[] = [], stack: string[] = [], result?: number) => {
    steps.push({ values: [...values], active: [...new Set(active)].filter(index=>index>=0&&index<values.length), line, explanation, stack: [...stack], result });
  };
  const array = structure === 'array';
  let title: string = lesson;
  let code: string[] = [];
  if (lesson === 'recursion') {
    values = [4, 7, 2, 6];
    title = array ? 'sumArray(values, index)' : 'sumFrom(node)';
    code = array ? ['function sumArray(values, index = 0) {', '  if (index === values.length) return 0;', '  const rest = sumArray(values, index + 1);', '  return values[index] + rest;', '}'] : ['function sumFrom(node) {', '  if (!node) return 0;', '  const rest = sumFrom(node.next);', '  return node.value + rest;', '}'];
    const stack: string[] = [];
    add(0, 'Add 4 + 7 + 2 + 6. First follow the calls down, then their answers back up.');
    values.forEach((number, index) => {
      stack.push(array ? `sum(${index})` : `sum(${number})`);
      add(0, `Enter the call for ${array ? `index ${index}` : `node ${number}`}.`, [index], stack);
      add(1, 'There is another value, so this is not the stopping point.', [index], stack);
      add(2, `Keep ${number} waiting while we call the rest.`, [index], stack);
    });
    add(1, array ? 'The index equals the length. Return 0.' : 'Reached null. Return 0.', [], stack);
    let total = 0;
    for (let index = values.length - 1; index >= 0; index--) {
      const rest = total; total += values[index]; stack.pop();
      add(3, `${values[index]} + ${rest} = ${total}. ${index ? 'Return this answer to the waiting call.' : 'All calls finished. The sum is 19.'}`, [index], stack, index === 0 ? total : undefined);
    }
  } else if (lesson === 'fibonacci') {
    values = [0, 1, 1, 2, 3]; title = 'fibonacci(4)';
    code = ['function fibonacci(n) {', '  if (n < 2) return n;', '  const left = fibonacci(n - 1);', '  const right = fibonacci(n - 2);', '  return left + right;', '}'];
    const stack: string[] = [];
    add(0, 'Find Fibonacci(4). Each call waits for the two smaller answers.');
    function visit(n: number): number {
      stack.push(`fib(${n})`); add(0, `Enter Fibonacci(${n}).`, [n], stack);
      if (n < 2) { add(1, `Base case: return ${n}.`, [n], stack); stack.pop(); return n; }
      add(2, `First find Fibonacci(${n - 1}).`, [n], stack);
      const left = visit(n - 1);
      add(3, `The first answer is ${left}. Now find Fibonacci(${n - 2}).`, [n], stack);
      const right = visit(n - 2);
      stack.pop(); add(4, `${left} + ${right} = ${left + right}. Return to the parent.`, [n], stack, n === 4 ? left + right : undefined);
      return left + right;
    }
    visit(4);
  } else if (lesson === 'twoPointers') {
    values.sort((a,b) => a-b); title = 'twoPointers(target)';
    code = array ? ['function twoPointers(values, target) {', '  let left = 0, right = values.length - 1;', '  while (left < right) {', '    const sum = values[left] + values[right];', '    if (sum === target) return [left, right];', '    sum < target ? left++ : right--;','  }','  return null;','}'] : ['function twoPointers(head, tail, target) {','  let left = head, right = tail;','  while (left && right && left !== right && left.prev !== right) {','    const sum = left.value + right.value;','    if (sum === target) return [left, right];','    sum < target ? left = left.next : right = right.prev;','  }','  return null;','}'];
    let left = 0, right = values.length - 1; add(1, 'Sort the values and place a pointer at each end.', [left,right].filter(i=>i>=0));
    let found = false;
    while (left < right) {
      const sum = values[left] + values[right]; add(3, `${values[left]} + ${values[right]} = ${sum}.`, [left,right]);
      if (sum === value) { add(4, `Found a pair adding to ${value}.`, [left,right]); found = true; break; }
      add(5, sum < value ? 'The sum is too small. Move the left pointer forward.' : 'The sum is too large. Move the right pointer backward.', [left,right]);
      if (sum < value) left++; else right--;
    }
    if (!found) add(7, `No pair adds to ${value}.`);
  } else if (lesson === 'binary') {
    values.sort((a,b)=>a-b); title = 'binarySearch(target)';
    code = array ? ['function binarySearch(values, target) {','  let low = 0, high = values.length - 1;','  while (low <= high) {','    const mid = Math.floor((low + high) / 2);','    if (values[mid] === target) return mid;','    values[mid] < target ? low = mid + 1 : high = mid - 1;','  }','  return null;','}'] : ['function binarySearch(head, target) {','  let low = head, high = null;','  while (low !== high) {','    const mid = middleNode(low, high); // walk slow/fast pointers','    if (mid.value === target) return mid;','    mid.value < target ? low = mid.next : high = mid;','  }','  return null;','}'];
    if (!array) code.push('', 'function middleNode(start, end) {', '  let slow = start, fast = start;', '  while (fast.next !== end && fast.next?.next !== end) {', '    slow = slow.next; fast = fast.next.next;', '  }', '  return slow;', '}');
    let low=0, high=values.length-1; let found=false; add(1,'Sort values and start with the complete range.');
    while(low<=high) { const mid=Math.floor((low+high)/2); add(3, array ? `Read index ${mid}: ${values[mid]}.` : `Walk the current range to its middle node: ${values[mid]}.`, [low,mid,high]); if(values[mid]===value) { add(4,`Found ${value}.`,[mid],[],mid); found=true; break; } add(5,values[mid]<value?'Discard the lower half.':'Discard the upper half.',[mid]); if(values[mid]<value) low=mid+1; else high=mid-1; }
    if(!found) add(7,`${value} is not present.`);
  } else if(lesson==='window') {
    title='maxWindowSum(size)'; const size=Math.round(value);
    if(size<1||size>values.length) throw new Error('Choose a window size from 1 to the number of values.');
    code = array ? ['function maxWindowSum(values, size) {','  let sum = 0, best = -Infinity;','  for (let i = 0; i < size; i++) sum += values[i];','  best = sum;','  for (let end = size; end < values.length; end++) {','    const outgoing = values[end - size], incoming = values[end];','    sum = sum - outgoing + incoming;','    best = Math.max(best, sum);','  }','  return best;','}'] : ['function maxWindowSum(head, size) {','  let start = head, end = head, sum = 0;','  for (let i = 0; i < size; i++) { sum += end.value; end = end.next; }','  let best = sum;','  while (end) {','    const outgoing = start.value, incoming = end.value;','    sum = sum - outgoing + incoming;','    best = Math.max(best, sum);','    start = start.next; end = end.next;','  }','  return best;','}'];
    let sum=values.slice(0,size).reduce((a,b)=>a+b,0),best=sum;
    add(3,`First window sums to ${sum}.`,Array.from({length:size},(_,i)=>i));
    for(let start=1;start+size<=values.length;start++) { const outgoing=values[start-1],incoming=values[start+size-1]; sum+=incoming-outgoing; add(6,`Subtract ${outgoing}, add ${incoming}: window sum ${sum}.`,Array.from({length:size},(_,i)=>start+i)); best=Math.max(best,sum); add(7,`Best sum so far: ${best}.`,Array.from({length:size},(_,i)=>start+i)); }
    add(array?9:10,`Maximum window sum is ${best}.`,[],[],best);
  } else {
    const push=collection==='stack'?'push':collection==='queue'?'enqueue':lesson;
    const remove=collection==='stack'?'pop':collection==='queue'?'dequeue':'delete';
    title=lesson==='append'?`${push}(value)`:lesson==='delete'?`${remove}()`:`${lesson}(${['prepend','insert','find'].includes(lesson)?'value':''})`;
    if(['append','prepend','insert'].includes(lesson)&&values.length>=LIMIT) throw new Error('This collection is full (10 nodes). Remove a node first.');
    if(['insert','delete'].includes(lesson)&&!values.length) throw new Error('The collection is empty. Add a value first.');
    const target=collection!=='list'?0:Math.max(0,Math.min(selected,values.length-1));
    if(lesson==='find') {
      code=['function find(head, value) {','  let current = head;','  while (current) {','    if (current.value === value) return current;','    current = current.next;','  }','  return null;','}']; let found=false; for(let i=0;i<values.length;i++) {add(values[i]===value?3:4,values[i]===value?`Found ${value}.`:`Visit ${values[i]}; follow next.`,[i]); if(values[i]===value){found=true;break;} } if(!found)add(6,'Reached null without a match.');
    } else if(lesson==='reverse') {
      code=doubly?['function reverse(head) {','  let current = head;','  while (current) {','    [current.next, current.prev] = [current.prev, current.next];','    current = current.prev;','  }','  [head, tail] = [tail, head];','}']:['function reverse(head) {','  let prev = null, current = head;','  while (current) {','    const next = current.next;','    current.next = prev; prev = current; current = next;','  }','  [head, tail] = [prev, head];','}']; values.forEach((n,i)=>add(doubly?3:4,`Redirect the pointers at node ${n}.`,[i])); values.reverse(); add(6,'Head and tail swap. The list is reversed.');
    } else if(lesson==='delete') {
      code=collection!=='list'?['function remove() {','  if (!this.head) return null;','  const removed = this.head;','  this.head = removed.next;','  if (!this.head) this.tail = null;','  removed.next = null; return removed;','}']:doubly?['function remove(current) {','  if (!current) return null;','  if (current.prev) current.prev.next = current.next;','  else this.head = current.next;','  if (current.next) current.next.prev = current.prev;','  else this.tail = current.prev;','  current.next = current.prev = null; return current;','}']:['function remove(target) {','  let previous = null, current = this.head;','  while (current && current !== target) {','    previous = current; current = current.next;','  }','  if (!current) return null;','  if (previous) previous.next = current.next;','  else this.head = current.next;','  if (current === this.tail) this.tail = previous;','  current.next = null; return current;','}'];
      add(collection!=='list'?2:doubly?2:1,`Find the node to remove: ${values[target]}.`,[target]);
      if(collection==='list'&&!doubly)for(let i=0;i<target;i++)add(3,`Visit ${values[i]} and follow next to reach the selected node.`,[i]);
      add(collection!=='list'?3:doubly?4:6,'Reconnect the remaining nodes without this one.',[target]); values.splice(target,1); add(collection!=='list'?5:doubly?6:9,'Removal complete.');
    } else {
      const index=lesson==='prepend'||(lesson==='append'&&collection==='stack')?0:lesson==='insert'?target+1:values.length;
      code=index===0?['function prepend(value) {','  const node = new Node(value);','  node.next = this.head;',...(doubly?['  if (this.head) this.head.prev = node;']:[]),'  this.head = node;','  if (!this.tail) this.tail = node;','}']:lesson==='insert'?['function insertAfter(current, value) {','  const node = new Node(value);','  node.next = current.next;',...(doubly?['  node.prev = current;','  if (current.next) current.next.prev = node;']:[]),'  current.next = node;','  if (this.tail === current) this.tail = node;','}']:['function append(value) {','  const node = new Node(value);','  if (!this.head) this.head = node;',...(doubly?['  node.prev = this.tail;']:[]),'  if (this.tail) this.tail.next = node;','  this.tail = node;','}'];
      code[0]=code[0].replace(/prepend|append|insertAfter/,lesson==='append'?push:lesson==='insert'?'insertAfter':lesson);
      add(1,`Create a node containing ${value}.`);add(2,`Connect the new node ${index===0?'at the head':index===values.length?'at the tail':'after the selected node'}.`);values.splice(index,0,value);add(code.length-2,'References updated. The new node is in the collection.',[index]);
    }
  }
  if(!steps.length) add(0,'Nothing to process.');
  return {title,code,steps};
}
