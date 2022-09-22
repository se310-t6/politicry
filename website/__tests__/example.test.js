import { render, screen } from "@testing-library/vue";
import ProfileCard from "@/components/ProfileCard.vue";

describe("ProfileCard", () => {
  it("renders the supplied props", async () => {
    render(ProfileCard, {
      props: {
        name: "Example",
        image: "profiles/lang.jpg",
        github: "https://example.org",
        linkedin: "https://example.com",
        blurb: "blah blah blah",
      },
      stubs: ["b-icon"],
    });
    expect(screen.queryByText("blah blah blah")).toBeTruthy();
  });
});
