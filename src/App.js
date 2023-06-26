import { useReducer } from 'react'
import './index.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
export const ACTIONS = {
ADD_DIGIT:'add-digit',
CHOSE_OPERATION :'chose-operation',
CLEAR:'clear',
DELETE_DIGIT :'delete-digit',
EVALUATE:'evaluate'
}
const integerFormatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
});

function formatOperand(operand) {
  if (operand === '') return '';
  let [integer, decimal] = operand.split('.');
  if (decimal === undefined) {
    return integerFormatter.format(integer);
  }
  return `${integerFormatter.format(integer)}.${decimal}`
}


function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = `${prev + curr}`;
      break;
    case "-":
      result = `${prev - curr}`;
      break;
    case "*":
      result = `${prev * curr}`;
      break;
    case "÷":
      if (prev === 0) return "";
      else result = `${prev / curr}`;
      break;
    default:
      return "";
  }
  return result.toString();
}

function reducer (state, {type,payload} ){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overWrite === true ){
        return{
          ...state,
          overWrite:false,
          currentOperand:payload.digit,
          previousOperand:'',
          operation:""
        }
      }
      if(state.currentOperand === "0" && payload.digit === "0" ) return state  ;
      if(state.currentOperand.includes('.') && payload.digit === "." ) return state  ;
      return {
        ...state,
        currentOperand:`${state.currentOperand ||""}${payload.digit}`
      }
    case ACTIONS.CHOSE_OPERATION :
      if(state.currentOperand === '' && state.previousOperand === '' ) return state  ;
      if(state.previousOperand ==='' ){
        return{
          ...state,
          operation:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:''
        }
      }
      if(state.currentOperand === '' ){
        return{
          ...state,
          operation:payload.operation
        }
      }
      return{
        ...state,
        previousOperand:evaluate(state) ,
        currentOperand:'',
        operation:payload.operation
      }
    case ACTIONS.EVALUATE:
      if(state.operation === '' || state.currentOperand === '' || state.previousOperand === '' )  return state 
      return{
        ...state,
        overWrite:true,
        currentOperand:evaluate(state),
        operation:'',
        previousOperand:''
      }
    case ACTIONS.CLEAR :
      return{
        ...state,
        currentOperand:'',
        previousOperand:'',
        operation:''
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overWrite || state.currentOperand === '' || state.currentOperand.length === 1 ) return{
        ...state,
        overWrite:false,
        currentOperand:'',
        previousOperand:''
      }
      return{
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)
      }
    default :
      return state
  }
}  
const initialState = {
currentOperand:"",
previousOperand:"",
operation:''
}

export default function App() {

  const [{currentOperand,previousOperand,operation},dispatch] = useReducer(reducer,initialState)

  return (
    <div>
      <div className="rounded-t-xl grid my-10 mx-auto grid-rows-5 grid-cols-4 w-[300px] h-[500px] border-2 border-solid border-[rgba(0,0,0,.75)]" >
        <div className="col-span-4 row-span-1 bg-[rgba(0,0,0,.75)] flex flex-col justify-around items-end break-words">
          <div className="text-[rgba(255,255,255,.75)] text-[17px]">
            {formatOperand(previousOperand)}{operation}
          </div>
          <div className="text-white text-[21px]">
            {formatOperand(currentOperand)}
          </div>
        </div>
        <button className="col-span-2" onClick={()=>{ dispatch({type:ACTIONS.CLEAR}) }}>Ac</button>
        <button onClick={()=>{ dispatch({type:ACTIONS.DELETE_DIGIT}) }} >DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="col-span-2" onClick={()=>{ dispatch({type:ACTIONS.EVALUATE}) }} >=</button>
      </div>
    </div>
  )
}
