import { User } from 'src/contracts'
import { AppVisibility } from 'quasar'

export function showNotification(
  title: string, 
  user: User,
  userState: string, 
  notifPref: boolean, 
  content = ''
) {
    if (Notification.permission === 'granted') {

      // IF USER IS ONLINE+
      // IF APP IS NOT VISIBLE+
      // IF ALL NOTIFS ARE ON+
      // ONLY MENTIONS ARE ON AND MENTIONED IN CONTENT

      if (userState === 'ONLINE' && !AppVisibility.appVisible && (!notifPref || content.includes('@' + user.nickname))){
        const notification = new Notification(title,
          {
            body: content,
            icon: user.icon
          }
        )
        notification.onclick = (event) => {
        event.preventDefault() 
      }
      }
      
    }
  }