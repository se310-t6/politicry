import { render, screen } from "@testing-library/vue";
// eslint-disable-next-line import/no-unresolved
import help from "@/pages/help.vue";

describe("/report", () => {
  it("shows the installation section by default", async () => {
    window.__defineGetter__("location", () => ({ hash: "" }));

    render(help);
    expect(screen.queryByText("Installation")).toBeTruthy();
  });

  it("hides the installation section if the page is opened from the extension", async () => {
    window.__defineGetter__("location", () => ({ hash: "#/" }));

    render(help);
    expect(screen.queryByText("Installation")).toBeFalsy();
  });
});
