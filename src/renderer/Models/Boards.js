/**
 * Created by Matt-Klaus on 07/08/2018.
 */
import { Collection } from 'vue-mc'
import Board from './Board'

class Boards extends Collection {
  static model () {
    return Board
  }

  static defaults () {
    return {
      orderBy: ''
    }
  }

  static mutations () {
    return {}
  }

  static validation () {
    return {}
  }
}

export default Boards
