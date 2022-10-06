import Vue from "vue";
import { render, screen } from "@testing-library/vue";
// eslint-disable-next-line import/no-unresolved
import report from "@/pages/report.vue";

// mock the `window.navigator` object since it is undefined in the test environment
window.__defineGetter__("navigator", function () {
  return {
    languages: ["fr-CH", "en-AU", "mi-NZ"],
    userAgentData: {
      brands: [
        { brand: "Chromium", version: 100 },
        { brand: "Not)A;Brand", version: -1 },
        { brand: "Edge", version: 99 },
      ],
    },
    deviceMemory: 4,
    platform: "win32",
  };
});

describe("/report", () => {
  it("renders input fields with data populated", async () => {
    render(report, {
      stubs: {
        "b-switch": true,
        "b-button": true,
        "b-input": "<input />",
        // mock the <b-field> component so that it is queryable in the test framework
        "b-field": Vue.component("b-field", {
          props: ["label"],
          template: "<label role='label'>{{label}}<slot /></label>",
        }),
      },
    });

    // RAM
    expect(screen.getByDisplayValue("4 GB")).toBeTruthy();

    // languages
    expect(screen.getByDisplayValue("fr-CH, en-AU, mi-NZ")).toBeTruthy();

    // browser
    expect(screen.getByDisplayValue("Chromium v100, Edge v99")).toBeTruthy();

    // platform
    expect(screen.getByDisplayValue("win32")).toBeTruthy();

    // blocked words & allowed words
    expect(screen.getAllByDisplayValue("Not configured")).toHaveLength(2);
  });
});
