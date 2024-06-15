import axios from 'axios'
import { useAuthStore } from '../stores/auth';
import router from '../router/index'
// import { useSnackbar } from 'vue3-snackbar';

const authStore = useAuthStore()
// const snackbar = useSnackbar()
// const router = useRouter()

const logOut = async () => {
   
    try {
        // const res = await axios.post(`authenticate/Logout`);
       // console.log(res)
        authStore.token = null
        authStore.user = {}
        router.push({ name: 'Home' })
        // snackbar.add({
        //   type: 'success',
        //   text: 'Successfully logged out'
        // })
      } catch (err: any) {
        // snackbar.add({
        //   type: 'error',
        //   text: `Please contact support ${err.message}`
        // })
      }

}

export default logOut


  

