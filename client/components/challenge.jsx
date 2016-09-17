import React, { Component } from 'react';
import TestResult from './testResult';
import { regexValidator, regexParser } from '../regexValidators';
import { dispatch } from 'redux';
import { connect } from 'react-redux';

class Challenge extends Component {
  constructor(props) {
    super(props);
    // const challengeInfo = [
    //   { id: 1, case: 'abcd', result: null, task: 'Match', expectation: true },
    //   { id: 2, case: 'acd', result: null, task: 'Skip', expectation: false },
    //   { id: 3, case: 'abcde', result: null, task: 'Match', expectation: true },
    // ];
    this.state = {
      input: '',
    };
    this.checkRegex = this.checkRegex.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.setAllFlags = this.setAllFlags.bind(this);
    this.changeInputState = this.changeInputState.bind(this);
    this.regexParser = this.regexParser.bind(this);
    this.snagRegexFlags = this.snagRegexFlags.bind(this);
    this.regexValidator = this.regexValidator.bind(this);
    this.flagActionCreator = this.flagActionCreator.bind(this);
  }
  
  render() {
    const table = this.props.challengeInfo.map(item => (
      <tr>
        <td>{item.task}</td>
        <td key={item.id}>{item.case}</td>
        <td><TestResult flag={item.result} /></td>
      </tr>
    ));
    return (
      <div>
        <h3>Challenge</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Text</th>
            </tr>
          </thead>

          <tbody>
            {table}
          </tbody>
        </table>

        <form className="input-group">
          <input
            className="form-control"
            placeholder="enter your pattern here..."
            value={this.state.input}
            onChange={this.changeInputState}
          />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-secondary">
            submit
            </button>
          </span>
        </form>
      </div>
    );
  }
  // REGEX RELATED FUNCTIONS
  // regexparser is called here; regexvalidator
  // Validates whether the input was a properly formed regex.
  regexValidator(input) {
    return /^\/.+\/[gimuy]{0,5}$/.test(input);
  }
  // To grab the flags at the end of a regex pattern (i.e. after the second forward slash)
  snagRegexFlags(input) {
    const flags = input.match(/\/([gimuy]{1,5})$/);
    return flags ? flags[1] : null;
  }
  // Strips input pattern of both forward slashes, and separates flags if any.
  regexParser(input) {
    const inputArr = input.split('');
    // To take off first forward slash.
    inputArr.shift();
    // To take off second forward slash plus any flags that may exist.
    const pattern = inputArr.join('').replace(/\/.*$/, '');
    const flags = this.snagRegexFlags(input);
    return {
      pattern,
      flags,
    };
  }
  checkRegex(parsedInput, testCases = this.props.challengeInfo) {
    // To check to see if there are flags in the pattern,
    // as the RegExp instantiator doesn't allow a null/false value for flags.
    const regex = parsedInput.flags ? new RegExp(parsedInput.pattern, parsedInput.flags) : new RegExp(parsedInput.pattern);
    let passed = true;
    testCases.forEach((test) => {
        if (regex.test(test.case) !== test.expectation) {
          passed = false;
          this.setFlag(test, false);
        } else {
          this.setFlag(test, true);
        }
    });
    console.log('***passed***', passed);
    return passed;
  }
  flagActionCreator(challenge, flagValue) {
    return {
      type: 'UPDATE-RESULT',
      testResult: flagValue,
      challengeId: challenge.id,
    }
  }
  // END OF REGEX RELATED FUNCTIONS
  // To set individual flags to null, true or false.
  setFlag(itemToChange, flagValue) {
    this.props.dispatch(this.flagActionCreator(itemToChange, flagValue));
    // this.setState({
    //     challengeInfo: this.props.challengeInfo.map((test) => {
    //         if (itemToChange.id === test.id) {
    //             itemToChange.result = flagValue;
    //         }
    //         return test;
    //     }),
    // });
  }
  // To set all flags to null, true, or false based on current situation.
  setAllFlags(testCases, flagValue) {
    testCases.forEach(test => this.setFlag(test, flagValue));
  }

  changeInputState(event) {
    event.preventDefault();
    const input = event.target.value;
    this.setState({ input }, () => {
      if (this.regexValidator(input)) {
        this.checkRegex(this.regexParser(input));
      } else if (!this.props.input) {
        // For reseting flags to null when there's no input.
        this.setAllFlags(this.props.challengeInfo, null);
      } else {
        this.setAllFlags(this.props.challengeInfo, false);
      }
    });
  }
}

const mapStateToProps = state => {
  return { challengeInfo: state };
};

export default connect(mapStateToProps)(Challenge);