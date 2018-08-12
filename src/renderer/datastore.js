/**
 * Created by Matt-Klaus on 07/08/2018.
 */
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export default {
  boards: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/db/boards.db'),
    timestampData: true
  }),
  users: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/db/users.db'),
    timestampData: true
  }),
  tasks: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/db/events.db'),
    timestampData: true
  })
}
