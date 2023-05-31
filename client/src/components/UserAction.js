/**UserAction Component
 * As an admin when you click delete or promote user this component renders
 */
import { actionDeleteUser, actionPromoteUser, getUsers } from "../service/userService"


export default function UserAction({user, setUsers, toggle, action}) {

    async function deleteUser() {
    
        const data = await actionDeleteUser(user.username)
    
        if(data.message) {
          const users = await getUsers()
          setUsers(users)
          alert(`${user.username} succesfully deleted`)
          toggle(false)
        } else {
          alert(`Failed to delete user: ${user.username}`)
        }
    
      }

      async function promoteUser() {
        const data = await actionPromoteUser(user.username)
        console.log(data)

        if(data.message) {
            const users = await getUsers()
            setUsers(users)
            alert(`${user.username} succesfully promoted`)
            toggle(false)
          } else {
            alert(`Failed to promote user: ${user.username}`)
          }
      }

    return (
        <div className="edit-container">
            <h2 className="edit-title">Change user settings</h2>
            <p>Are you sure you want to <span className="user-action">{action}</span> user <span className="user-action">{user.username}</span>?</p>
            <div>
                <button onClick={action === "delete" ? deleteUser : promoteUser} className="edit-save">Proceed</button>
                <button onClick={() => toggle(false)} className="edit-discard">Cancel</button>
            </div>
        </div>
    )
}