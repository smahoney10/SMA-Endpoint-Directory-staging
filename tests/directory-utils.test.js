const assert = require("node:assert/strict");

const {
  buildMailtoUpdateHref,
  filterEndpoints,
  getPrimaryEndpointUrl,
  isAvailableUrl,
  normalizeStatus,
  validateUpdateRequest,
} = require("../assets/directory-utils.js");

assert.equal(normalizeStatus("Not yet started"), "Not Yet Started");
assert.equal(normalizeStatus(" active "), "Active");
assert.equal(normalizeStatus(""), "Unknown");

assert.equal(isAvailableUrl("N/A"), false);
assert.equal(isAvailableUrl("Not Yet Available"), false);
assert.equal(isAvailableUrl("https://example.test/fhir"), true);

assert.equal(
  getPrimaryEndpointUrl({
    productionUrls: ["https://first.test/fhir", "https://second.test/fhir"],
    productionUrl: "https://fallback.test/fhir",
  }),
  "https://first.test/fhir"
);

assert.equal(
  getPrimaryEndpointUrl({
    productionUrls: [],
    productionUrl: "https://fallback.test/fhir",
  }),
  "https://fallback.test/fhir"
);

assert.equal(
  getPrimaryEndpointUrl({
    productionUrls: [],
    productionUrl: "Not Yet Available",
  }),
  ""
);

const rows = [
  {
    state: "Alabama",
    apiType: "Patient Access",
    status: "Active",
    vendor: "Vendor A",
    productionUrl: "https://one.test",
  },
  {
    state: "Alaska",
    apiType: "Prior Authorization",
    status: "Not Yet Started",
    vendor: "",
    productionUrl: "",
  },
];

assert.deepEqual(
  filterEndpoints(rows, { query: "alab", apiType: "All", status: "All" }).map((row) => row.state),
  ["Alabama"]
);

assert.deepEqual(
  filterEndpoints(rows, { query: "", apiType: "Prior Authorization", status: "All" }).map((row) => row.state),
  ["Alaska"]
);

assert.deepEqual(
  filterEndpoints(rows, { query: "", apiType: "All", status: "Active" }).map((row) => row.state),
  ["Alabama"]
);

const invalid = validateUpdateRequest({
  state: "",
  updateType: "",
  submitterEmail: "bad",
  summary: "",
});

assert.equal(invalid.valid, false);
assert.ok(invalid.errors.state);
assert.ok(invalid.errors.updateType);
assert.ok(invalid.errors.submitterEmail);
assert.ok(invalid.errors.summary);

const valid = validateUpdateRequest({
  state: "Alabama",
  updateType: "Patient Access endpoint",
  submitterEmail: "person@example.com",
  summary: "Update the Patient Access endpoint status.",
});

assert.equal(valid.valid, true);
assert.deepEqual(valid.errors, {});

const mailto = buildMailtoUpdateHref({
  state: "Alabama",
  updateType: "Patient Access endpoint",
  submitterEmail: "person@example.com",
  summary: "Update the Patient Access endpoint status.",
});

assert.ok(mailto.startsWith("mailto:SMAendpointDirectory@cms.hhs.gov?"));
assert.ok(mailto.includes("subject=SMA%20Endpoint%20Directory%20update%20request%3A%20Alabama%20-%20Patient%20Access%20endpoint"));
assert.ok(mailto.includes("State%20or%20territory%3A%20Alabama"));
assert.ok(mailto.includes("Submitter%20email%3A%20person%40example.com"));
assert.ok(mailto.includes("Requested%20change%3A%20Update%20the%20Patient%20Access%20endpoint%20status."));

console.log("directory-utils tests passed");
