

export default function Books({bookElements}) {

    return (
        <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            <th className="table-header">Order</th>
            <th className="table-header">Action</th>

          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    )
}