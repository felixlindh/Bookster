import Footer from "./Footer";
import { render, screen } from "@testing-library/react";

test("Check if footer render properly", () => {
  render(<Footer />);
  const footer = screen.getByTestId("footer");
  expect(footer).toBeInTheDocument();
});