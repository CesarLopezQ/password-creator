import { useState } from 'react'

import passwordCreator, { type PasswordParams } from './utils/passwordCreator'
import handleCopy from './utils/handleCopy'
import githubLink from './utils/githubLink'

import { Tooltip } from 'react-tooltip'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretLeft,
  faCaretRight,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import './App.css'

export default function App() {
  {
    /*Password Set*/
  }

  const defaultPasswordParams: PasswordParams = {
    length: 10,
    numbers: true,
    symbols: true,
    upper: true,
    lower: true,
  }
  const [passwordParams, setPasswordParams] = useState<PasswordParams>(
    defaultPasswordParams,
  )
  const [password, setPassword] = useState('')
  const handleChange = (key: keyof PasswordParams, value: number | boolean) => {
    const checkboxOptions = ['numbers', 'symbols', 'upper', 'lower']

    if (checkboxOptions.includes(key) && value === false) {
      const selectedOptions = checkboxOptions.filter(
        (option) => passwordParams[option as keyof PasswordParams],
      )

      if (selectedOptions.length === 1) return
    }

    setPasswordParams((prev) => ({ ...prev, [key]: value }))
  }

  {
    /*Submit Info*/
  }
  const handleClick = () => {
    const data = passwordCreator(passwordParams)
    setPassword(data)
  }

  {
    /*Modify length*/
  }
  const increaseLength = () => {
    setPasswordParams((prev) => ({
      ...prev,
      length: Math.min(100, prev.length + 1),
    }))
  }

  const decreaseLength = () => {
    setPasswordParams((prev) => ({
      ...prev,
      length: Math.max(1, prev.length - 1),
    }))
  }

  {
    /*Spin Reset Button*/
  }
  const [isSpinning, setIsSpinning] = useState(false)
  const spinButton = () => {
    setIsSpinning(true)
  }

  {
    /*Password Visibility*/
  }
  const [hidden, setHidden] = useState(true)
  const hiddenPassword = () => {
    if (hidden) {
      return '**********'
    } else {
      return password
    }
  }

  {
    /*Tooltip*/
  }
  const beforeCopy = 'Copy Password'
  const afterCopy = 'Password Copied!'
  const [tooltip, setTooltip] = useState(false)

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
            onClick={() => {
              spinButton()
              setPassword('')
              setPasswordParams({
                length: 10,
                numbers: true,
                symbols: true,
                upper: true,
                lower: true,
              })
              setHidden(true)
            }}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className={isSpinning ? 'spin' : ''}
              onAnimationEnd={() => setIsSpinning(false)}
            />
          </button>
          <label
            data-tooltip-id="length"
            data-tooltip-content="Min: 1 / Max: 100"
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
            min={1}
            max={100}
            value={passwordParams.length}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => handleChange('length', e.target.valueAsNumber)}
          />{' '}
          <button className="numArrow" onClick={increaseLength}>
            <FontAwesomeIcon icon={faCaretRight} className="icon" />
          </button>
        </div>

        {/*Password Params: numbers*/}
        <div className="option">
          <label
            data-tooltip-id="numbers"
            data-tooltip-content="0-9"
            data-tooltip-place="top"
          >
            Require numbers:
          </label>
          <input
            type="checkbox"
            name="numbers"
            checked={passwordParams.numbers}
            onChange={(e) => handleChange('numbers', e.target.checked)}
          />
        </div>

        {/*Password Params: symbols*/}
        <div className="option">
          <label
            data-tooltip-id="symbols"
            data-tooltip-content="!@#$%^&*()-_=+[]{};:,.<>/?~"
            data-tooltip-place="top"
          >
            Require symbols:
          </label>
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
      <a
        className={`shadow ${password ? 'nopassword' : 'password'}`}
        data-tooltip-id="password"
        data-tooltip-content={tooltip ? afterCopy : beforeCopy}
        data-tooltip-place="top"
        onMouseLeave={() =>
          setTimeout(() => {
            setTooltip(false)
          }, 500)
        }
        onClick={() => {
          void handleCopy(password)
          setTooltip(true)
        }}
      >
        {password ? hiddenPassword() : '**********'}
      </a>

      <Tooltip id="password" />
      <Tooltip id="length" />
      <Tooltip id="numbers" />
      <Tooltip id="symbols" />
      <Tooltip id="hide" />
      <Tooltip id="reset" />
      <Tooltip id="github" />
    </div>
  )
}
