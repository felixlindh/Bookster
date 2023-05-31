/**UsersTable Component
 * In this file we recieve all the users as a prop and proceed to render them out on the screen
 */

export default function UsersTable({userElements}) {

    return (
        <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Username</th>
            <th className="table-header">Role</th>
            <th className="table-header">Purchases</th>
            <th className="table-header">Action</th>

          </tr>
        </thead>
        <tbody>{userElements}</tbody>
      </table>
    )
}