/**BooksTable Component
 * In this file we recieve all the books as a prop and proceed to render them out on the screen
 */
import { parseJwt } from "../service/jwtService"


export default function BooksTable({bookElements}) {

    const decoded = parseJwt(sessionStorage.getItem("AuthToken"))

    return (
        <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            {(decoded.role === "ADMIN" || decoded.role === "USER") && <th className="table-header">Order</th>}
            {decoded.role === "ADMIN" && <th className="table-header">Action</th>}

          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    )
}