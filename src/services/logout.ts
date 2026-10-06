import router from '../router/index'
import { clearSession } from './session'

/** Ends the session and returns to the sign-in page */
const logOut = async () => {
  clearSession()
  router.push({ name: 'Home' })
}

export default logOut
