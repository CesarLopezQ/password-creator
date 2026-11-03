import { useState } from 'react'

import passwordCreator, { type PasswordParams } from './utils/passwordCreator'
import handleCopy from './utils/handleCopy'
import githubLink from './utils/githubLink'

import { Tooltip } from 'react-tooltip'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faCaretLeft,
  faCaretRight,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'

import './App.css'

const defaultPasswordParams = {
  length: 10,
  numbers: true,
  symbols: true,
  upper: true,
  lower: true,
}

const checkboxOptions = ['numbers', 'symbols', 'upper', 'lower']

export default function App() {
  const [passwordParams, setPasswordParams] = useState(defaultPasswordParams)

  const selectedOptions = checkboxOptions.filter(
    (option) => passwordParams[option as keyof PasswordParams],
  ).length
  const handleChange = (key: keyof PasswordParams, value: number | boolean) => {
    if (checkboxOptions.includes(key) && value === false) {
      if (selectedOptions === 1) return
    }

    if (checkboxOptions.includes(key) && value === true) {
      const newLength = Math.max(passwordParams.length, selectedOptions + 1)

      setPasswordParams((prev) => ({
        ...prev,
        [key]: value,
        length: newLength,
      }))

      setLengthInput(String(newLength))
      return
    }

    setPasswordParams((prev) => ({ ...prev, [key]: value }))
  }

  const [lengthInput, setLengthInput] = useState(
    String(defaultPasswordParams.length),
  )
  const handleLengthBlur = () => {
    const value = Number(lengthInput)

    if (lengthInput.trim() === '' || !Number.isInteger(value)) {
      setLengthInput(String(passwordParams.length))
      return
    }

    const validLength = Math.min(100, Math.max(selectedOptions, value))

    setPasswordParams((prev) => ({
      ...prev,
      length: validLength,
    }))

    setLengthInput(String(validLength))
  }

  const [password, setPassword] = useState('')
  const handleClick = () => {
    try {
      const data = passwordCreator(passwordParams)
      setPassword(data)
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message)
      } else {
        window.alert('An unexpected error has occurred.')
      }
    }
  }
  const increaseLength = () => {
    const newLength = Math.min(100, passwordParams.length + 1)

    setPasswordParams((prev) => ({
      ...prev,
      length: newLength,
    }))

    setLengthInput(String(newLength))
  }
  const decreaseLength = () => {
    const newLength = Math.max(selectedOptions, passwordParams.length - 1)
    setPasswordParams((prev) => ({
      ...prev,
      length: newLength,
    }))

    setLengthInput(String(newLength))
  }

  const [isSpinning, setIsSpinning] = useState(false)
  const spinButton = () => {
    setIsSpinning(true)
  }

  const [hidden, setHidden] = useState(true)
  const hiddenPassword = () => {
    return hidden ? '*'.repeat(password.length) : password
  }

  const handleReset = () => {
    setPasswordParams(defaultPasswordParams)
    setLengthInput(String(defaultPasswordParams.length))
    setPassword('')
    spinButton()
    setHidden(true)
  }

  const beforeCopy = 'Copy Password'
  const afterCopy = 'Password Copied!'
  const copyFailed = 'Could not copy password.'
  const [tooltip, setTooltip] = useState(beforeCopy)

  return (
    <div className="container">
      {/*Github Contact*/}
      <FontAwesomeIcon
        icon={faGithub}
        className="github"
        data-tooltip-id="github"
        data-tooltip-content="CesarLopezQ"
        data-tooltip-place="left"
        onClick={githubLink}
      />
      {/*Title*/}
      <h1 className="shadow">Password Generator</h1>
      <h3>Select your options</h3>

      {/*Options*/}
      <div className="optionsMenu shadow">
        {/*Password Length*/}
        <div className="option">
          {/*Reset*/}
          <button
            className="reset"
            data-tooltip-id="reset"
            data-tooltip-content="Reset"
            data-tooltip-place="top"
            onClick={handleReset}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className={isSpinning ? 'spin' : ''}
              onAnimationEnd={() => setIsSpinning(false)}
            />
          </button>
          <label
            data-tooltip-id="length"
            data-tooltip-content={`Min: ${selectedOptions} / Max: 100`}
            data-tooltip-place="top"
          >
            Password Length:
          </label>
          <button className="numArrow" onClick={decreaseLength}>
            <FontAwesomeIcon icon={faCaretLeft} className="icon" />
          </button>
          <input
            type="number"
            name="length"
            min={selectedOptions}
            max={100}
            value={lengthInput}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => setLengthInput(e.target.value)}
            onBlur={handleLengthBlur}
          />{' '}
          <button className="numArrow" onClick={increaseLength}>
            <FontAwesomeIcon icon={faCaretRight} className="icon" />
          </button>
        </div>

        {/*Password Params: numbers*/}
        <div className="option">
          <label>Require numbers:</label>
          <input
            type="checkbox"
            name="numbers"
            checked={passwordParams.numbers}
            onChange={(e) => handleChange('numbers', e.target.checked)}
          />
        </div>

        {/*Password Params: symbols*/}
        <div className="option">
          <label>Require symbols:</label>
          <input
            type="checkbox"
            name="symbols"
            checked={passwordParams.symbols}
            onChange={(e) => handleChange('symbols', e.target.checked)}
          />
        </div>

        {/*Password Params: letters*/}
        <div className="option">
          <label>Require upper case letters:</label>
          <input
            type="checkbox"
            name="upper"
            checked={passwordParams.upper}
            onChange={(e) => handleChange('upper', e.target.checked)}
          />
        </div>
        <div className="option">
          <label>Require lower case letters:</label>
          <input
            type="checkbox"
            name="lower"
            checked={passwordParams.lower}
            onChange={(e) => handleChange('lower', e.target.checked)}
          />
        </div>
        <div className="option">
          <label
            data-tooltip-id="hide"
            data-tooltip-content="Toggle password visibility"
            data-tooltip-place="top"
          >
            Hide password:
          </label>
          <input
            type="checkbox"
            name="hide"
            checked={hidden}
            onChange={(e) =>
              e.target.checked ? setHidden(true) : setHidden(false)
            }
          />
        </div>
      </div>

      {/*Submit*/}
      <button className="shadow" onClick={handleClick}>
        Generate Password
      </button>

      {/*Show Password*/}
      <button
        className={`shadow ${password ? 'nopassword' : 'password'}`}
        data-tooltip-id="password"
        data-tooltip-content={tooltip}
        data-tooltip-place="top"
        onMouseLeave={() =>
          setTimeout(() => {
            setTooltip(beforeCopy)
          }, 500)
        }
        onClick={async () => {
          if (!password) return

          const copied = await handleCopy(password)
          setTooltip(copied ? afterCopy : copyFailed)
        }}
      >
        {password ? hiddenPassword() : '**********'}
      </button>

      <Tooltip id="password" />
      <Tooltip id="length" />
      <Tooltip id="hide" />
      <Tooltip id="reset" />
      <Tooltip id="github" />
    </div>
  )
}
