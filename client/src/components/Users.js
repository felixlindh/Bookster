

export default function Users({userElements}) {

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