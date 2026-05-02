import React, { useState } from 'react'

const buttons = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

export default function App() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function handleDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  function handleDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  function handleOperator(nextOp) {
    const current = parseFloat(display)
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, current, op)
      setDisplay(String(result))
      setPrev(result)
    } else {
      setPrev(current)
    }
    setOp(nextOp)
    setWaitingForOperand(true)
  }

  function calculate(a, b, operator) {
    switch (operator) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  function handleEquals() {
    if (op === null || waitingForOperand) return
    const current = parseFloat(display)
    const result = calculate(prev, current, op)
    setDisplay(String(result))
    setPrev(null)
    setOp(null)
    setWaitingForOperand(true)
  }

  function handleClear() {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setWaitingForOperand(false)
  }

  function handleToggleSign() {
    setDisplay(String(parseFloat(display) * -1))
  }

  function handlePercent() {
    setDisplay(String(parseFloat(display) / 100))
  }

  function handleButton(btn) {
    if (btn === 'C') return handleClear()
    if (btn === '±') return handleToggleSign()
    if (btn === '%') return handlePercent()
    if (btn === '=') return handleEquals()
    if (btn === '.') return handleDecimal()
    if (['+', '−', '×', '÷'].includes(btn)) return handleOperator(btn)
    handleDigit(btn)
  }

  const isOp = (btn) => ['+', '−', '×', '÷'].includes(btn)
  const isTop = (btn) => ['C', '±', '%'].includes(btn)

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-black rounded-3xl overflow-hidden w-72 shadow-2xl">
        {/* Display */}
        <div className="px-6 py-8 text-right">
          <div className="text-white font-light overflow-hidden" style={{
            fontSize: display.length > 9 ? '1.8rem' : display.length > 6 ? '2.5rem' : '3.5rem',
            lineHeight: 1
          }}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-px bg-gray-700">
          {buttons.map((row, ri) =>
            row.map((btn, ci) => {
              const isZero = btn === '0'
              const isEquals = btn === '='
              const isOperator = isOp(btn)
              const isTopRow = isTop(btn)

              let bg = 'bg-gray-500 hover:bg-gray-400'
              let text = 'text-white'
              if (isTopRow) { bg = 'bg-gray-400 hover:bg-gray-300'; text = 'text-black' }
              if (isOperator || isEquals) { bg = 'bg-orange-500 hover:bg-orange-400'; text = 'text-white' }

              return (
                <button
                  key={`${ri}-${ci}`}
                  onClick={() => handleButton(btn)}
                  className={`
                    ${bg} ${text}
                    ${isZero ? 'col-span-2' : ''}
                    h-16 text-2xl font-light
                    active:opacity-70 transition-opacity
                    flex items-center
                    ${isZero ? 'justify-start px-6' : 'justify-center'}
                  `}
                >
                  {btn}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
