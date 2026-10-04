import {Component, useEffect, useMemo, useRef, useState, type ReactNode, type ComponentRef, type RefObject} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {Html, OrbitControls, RoundedBox} from '@react-three/drei';
import {Quaternion, Vector3, type Group, type PerspectiveCamera} from 'three';
import type {SceneProps} from './Scene2D';

function position(index:number,count:number,stack:boolean):[number,number,number]{return stack?[0,((count-1)/2-index)*1.55,0]:[(index-(count-1)/2)*2.7,0,0];}
function Arrow({from,to,color,lane=0}:{from:Vector3;to:Vector3;color:string;lane?:number}){
  const direction=to.clone().sub(from).normalize();
  const gap=Math.abs(direction.y)>.5?.67:1.02;
  const start=from.clone().addScaledVector(direction,gap).add(new Vector3(0,0,lane));
  const end=to.clone().addScaledVector(direction,-gap).add(new Vector3(0,0,lane));
  const length=start.distanceTo(end);
  const quaternion=new Quaternion().setFromUnitVectors(new Vector3(0,1,0),direction);
  return <group><mesh position={start.clone().lerp(end,.5)} quaternion={quaternion}><cylinderGeometry args={[.035,.035,length,10]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.25}/></mesh><mesh position={end} quaternion={quaternion}><coneGeometry args={[.12,.25,12]}/><meshStandardMaterial color={color}/></mesh></group>;
}
function NodeBox({value,index,count,stack,active,selected,onSelect,array,doubly,portal}:{value:number;index:number;count:number;stack:boolean;active:boolean;selected:boolean;onSelect:()=>void;array:boolean;doubly:boolean;portal:RefObject<HTMLDivElement>}){
  const group=useRef<Group>(null);
  const target=useMemo(()=>new Vector3(...position(index,count,stack)),[index,count,stack]);
  const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  useFrame((_,delta)=>{if(group.current){if(reduced)group.current.position.copy(target);else group.current.position.lerp(target,1-Math.exp(-10*delta));}});
  const color=active?'#7160b1':selected?'#168e7d':'#544ca0';
  return <group ref={group} position={position(index,count,stack)}>
    <RoundedBox args={[1.74,1.1,.58]} radius={.14} smoothness={6} onClick={event=>{event.stopPropagation();onSelect();}}><meshStandardMaterial color={color} metalness={.18} roughness={.3} emissive={color} emissiveIntensity={active?.35:.08}/></RoundedBox>
    <Html portal={portal} center distanceFactor={9} zIndexRange={[20,0]} style={{pointerEvents:'none'}}><div className="three-label">
      {index===0&&<span className="three-tag node-heading">{array?'ARRAY':stack?'TOP':'HEAD'}</span>}
      {value}<small>{array?`[${index}]`:doubly?'prev · next':'next'}</small>
      {active&&<span className="three-tag node-current">CURRENT STEP</span>}
    </div></Html>
  </group>;
}
function Camera({count,stack,action}:{count:number;stack:boolean;action:{id:number;kind:'fit'|'in'|'out'}}){
  const controls=useRef<ComponentRef<typeof OrbitControls>>(null);
  const {camera,size,invalidate}=useThree();
  function fit(){const perspective=camera as PerspectiveCamera;const spanX=stack?4:(Math.max(1,count)-1)*2.7+4;const spanY=stack?(Math.max(1,count)-1)*1.55+4:4;const tangent=Math.tan(perspective.fov*Math.PI/360);const distance=Math.max(spanY/(2*tangent),spanX/(2*tangent*Math.max(.1,size.width/size.height)))*1.15;controls.current?.target.set(0,.3,0);perspective.position.set(0,.3+distance*.2,distance);perspective.far=Math.max(100,distance*5);perspective.updateProjectionMatrix();controls.current?.update();invalidate();}
  useEffect(()=>{fit();},[count,stack,size.width,size.height]);
  useEffect(()=>{if(action.kind==='fit')fit();else if(controls.current){const target=controls.current.target;const offset=camera.position.clone().sub(target);const distance=Math.max(3,Math.min(200,offset.length()*(action.kind==='in'?.8:1.25)));camera.position.copy(target).add(offset.normalize().multiplyScalar(distance));controls.current.update();invalidate();}},[action.id]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={3} maxDistance={200} minPolarAngle={Math.PI*.18} maxPolarAngle={Math.PI*.48} zoomSpeed={.7}/>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<div className="scene-loading" role="alert">3D rendering is unavailable. Switch to 2D to continue this lesson.</div>:this.props.children;}
}
export default function Scene3D(props:SceneProps&{light:boolean}){
  const {step,selected,onSelect,stack,array,doubly,light}=props;
  // The portal is mounted before the Canvas scene; Drei's ref type omits null.
  const overlay=useRef<HTMLDivElement>(null!);
  const [action,setAction]=useState<{id:number;kind:'fit'|'in'|'out'}>({id:0,kind:'fit'});
  return <div className="react-three-scene"><div ref={overlay} className="three-overlays"/><SceneBoundary><Canvas camera={{fov:38,position:[0,4.7,12.4]}} dpr={[1,2]} fallback={<div>WebGL unavailable. Use 2D to continue.</div>}>
    <color attach="background" args={[light?'#edf3fc':'#0d1728']}/><hemisphereLight args={['#bad7ff','#0b1627',1.4]}/><directionalLight position={[-4,6,7]} intensity={3.5} color="#91fff0"/><pointLight position={[5,2,4]} intensity={18} color="#8175ff"/>
    {step.values.map((value,index)=><NodeBox key={index} portal={overlay} value={value} index={index} count={step.values.length} stack={stack} array={array} doubly={doubly} selected={selected===index} active={step.active.includes(index)} onSelect={()=>onSelect(index)}/>)}
    {!array&&step.values.slice(0,-1).map((_,index)=>{const from=new Vector3(...position(index,step.values.length,stack));const to=new Vector3(...position(index+1,step.values.length,stack));return <group key={index}><Arrow from={from} to={to} color="#48e3c1"/>{doubly&&<Arrow from={to} to={from} color="#a394ff" lane={.42}/>}</group>;})}
    <Camera count={step.values.length} stack={stack} action={action}/>
  </Canvas></SceneBoundary><div className="camera-tools">{([['in','+'],['out','−'],['fit','Fit all']] as const).map(([kind,label])=><button key={kind} aria-label={kind==='in'?'Zoom in':kind==='out'?'Zoom out':'Fit all nodes'} onClick={()=>setAction(previous=>({id:previous.id+1,kind}))}>{label}</button>)}</div></div>;
}
