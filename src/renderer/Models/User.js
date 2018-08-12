/**
 * Created by Matt-Klaus on 07/08/2018.
 */
// import { Model } from 'vue-mc'
import db from './../datastore'

class User {
  get name () {
    return this._name
  }

  set name (value) {
    this._name = value
  }

  get username () {
    return this._username
  }

  set username (value) {
    this._username = value
  }

  get email () {
    return this._email
  }

  set email (value) {
    this._email = value
  }

  get password () {
    return this._password
  }

  set password (value) {
    this._password = value
  }

  hash = require('password-hash')
  _name = ''
  _username = ''
  _password = ''
  _email = ''
  _id = ''

  constructor ({name, username, email, password, _id}) {
    this._name = name
    this._username = username
    this._email = email
    this._password = password
    this._id = _id
  }

  static options () {
    return {
      identifier: '_id'
    }
  }

  static mutations () {
    return {
      password: (pass) => {
        return this.hash.isHashed(pass) ? pass : this.hash.generate(pass)
      }
    }
  }

  static validation () {
    return {}
  }

  static async all () {
    const user = await this.getUsers()
    return user
  }

  static getUsers () {
    return new Promise((resolve, reject) => {
      db.users.find({}, (err, users) => {
        if (err) reject(err)
        resolve(users)
      })
    })
  }
}

export default User
