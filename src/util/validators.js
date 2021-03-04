'use strict';

const assert = require('assert').strict;
const validator = require('validator');

class Validators {
  /**
   * Checks if the value is a number (can be either a typeof string or number)
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isNumber(value, varName) {
    assert.equal(true, !isNaN(parseInt(value)) && parseInt(value).toString().length == value.toString().length, `${varName} needs to be a number.`);
  }

  /**
   * Checks if the value is a positive integer
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isPositiveInteger(value, varName) {
    Validators.isNumber(value, varName);
    assert(value > 0, `${varName} needs to be a positive integer.`);
  }

  /**
   * Checks if the input is a valid email
   * @param {email} emailInput The input to check
   * @throws {AssertionError} If validation fails.
   */
  static isEmailValid(emailInput) {
    let emailForm = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    assert(emailForm.test(emailInput));
  }

  /**
   * Checks if the value is a string
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isString(value, varName) {
    assert.equal(typeof value, 'string', `${varName} needs to be a string.`);
  }

  /**
   * Checks if the value is a string of non-zero length
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isStringNonZeroLength(value, varName) {
    Validators.isString(value, varName);
    assert(!validator.isEmpty(value), `${varName} needs to have non-zero length.`);
  }

  /**
   * Checks if the value is an alphanumeric string
   * @param {any} value The value to check
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isAlphanumericString(value, varName) {
    Validators.isString(value, varName);
    assert(validator.isAlphanumeric(value), `${varName} needs to only contain letters and numbers.`);
  }

  /**
   * Checks if the value is a number in the specified interval
   * @param {any} value The value to check
   * @param {number} lowerLimit The inclusive lower limit
   * @param {number} upperLimit The inclusive upper limit
   * @param {string} varName The name of the variable that holds the value
   * @throws {AssertionError} If validation fails.
   */
  static isNumberBetween(value, lowerLimit, upperLimit, varName) {
    Validators.isNumber(value, varName);
    assert(value >= lowerLimit && value <= upperLimit, `${varName} needs to be a number between ${lowerLimit} and ${upperLimit}.`);
  }

}

module.exports = Validators;
