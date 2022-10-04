<template>
  <main>
    <b-field label="Message" required>
      <b-input
        v-model="message"
        maxlength="1000"
        type="textarea"
        required
        placeholder="Please describe what went wrong"
      ></b-input>
    </b-field>

    <b-field label="Do you want to be contacted?">
      <b-switch v-model="contact"></b-switch>
    </b-field>

    <b-field label="Operating System">
      <b-input :value="OS" disabled></b-input>
    </b-field>

    <b-field label="Browser">
      <b-input :value="browser" disabled></b-input>
    </b-field>

    <b-field label="Computer Memory">
      <b-input :value="RAM" disabled></b-input>
    </b-field>

    <b-field label="Device Languages">
      <b-input :value="languages" disabled></b-input>
    </b-field>

    <b-field label="Current URL">
      <b-input :value="URL" disabled></b-input>
    </b-field>

    <b-message type="is-info" has-icon v-if="contextLoaded">
      You may delete the following information if you do not wish to send it in
      the issue report.
    </b-message>

    <b-field label="Blocked Words">
      <b-input v-model="blocked"></b-input>
    </b-field>

    <b-field label="Allowed Words">
      <b-input v-model="allowed"></b-input>
    </b-field>

    <b-field label="Enabled Services">
      <b-input v-model="enabledServices"></b-input>
    </b-field>

    <b-button type="is-primary" expanded @click="sendReport">Send</b-button>
  </main>
</template>

<style>
main {
  max-width: 500px;
  margin: auto;
  padding: 32px;
}
</style>

<script>
export default {
  name: "ReportPage",
  data: () => {
    let data = {};
    try {
      // try load the context data from the URL
      data = JSON.parse(atob(window.location.hash.slice(1)));
    } catch {
      console.error("Failed to load context from URL");
    }
    return {
      contextLoaded: !!Object.keys(data).length,

      URL: data.currentUrl,
      RAM: navigator.deviceMemory + " GB", // useful for debugging slow performance
      OS: navigator.platform, // useful for debugging platform-specific issues
      languages: navigator.languages.join(", "), // useful for debugging language-specific issues
      browser:
        navigator.userAgentData?.brands
          .filter((x) => x.brand !== "Not)A;Brand")
          .map((x) => x.brand + " v" + x.version)
          .join(", ") || navigator.userAgent,

      enabledServices: Object.entries(data)
        .filter(([, value]) => value === true)
        .map(([key]) => key.replace("Toggled", ""))
        .join(", "),

      blocked: (data.blockedWords || ["Not configured"]).join(", "),
      allowed: (data.allowedWords || ["Not configured"]).join(", "),

      contact: false,
      message: "",
    };
  },
  methods: {
    sendReport() {
      const body = [
        this.message,
        "",
        `Reply requested: ${this.contact}`,
        "",
        "Technical Information:",
        ` - RAM: ${this.RAM}`,
        ` - OS: ${this.OS}`,
        ` - Browser: ${this.browser}`,
        ` - Languages: ${this.languages}`,
        ` - Enabled Services: ${this.enabledServices}`,
        ` - Blocked Words: ${this.blocked}`,
        ` - Allowed Words: ${this.allowed}`,
        ` - Current URL: ${this.URL}`,
      ].join("\n");

      const options = new URLSearchParams({
        subject: "Politicry help request",
        body,
      });
      const mailLink = `mailto:support@politicry.com?${options
        .toString()
        .replace(/\+/g, "%20")}`;

      window.open(mailLink);
    },
  },
};
</script>
