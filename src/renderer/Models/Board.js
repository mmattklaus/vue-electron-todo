/**
 * Created by Matt-Klaus on 07/08/2018.
 */
import { Model } from 'vue-mc'

class Board extends Model {
  static defaults () {
    return {
      name: '',
      description: '',
      bg: ''
    }
  }
  static mutations () {
    return {}
  }
  static validation () {
    return {
    }
  }
}

export default Board
