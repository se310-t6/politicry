<template>
  <main>
    <h1>Getting started with Politicry</h1>
    <p>
      Politicry is a browser extension that blurs posts which contain certain
      words that you can define.
    </p>

    <img
      src="https://user-images.githubusercontent.com/16009897/194502415-26aa9f63-beae-4ea1-bfc7-097a545177a5.png"
      alt="Screenshot of the Instagram showing a blurred post next to a normal post"
      class="card"
      style="max-height: 300px"
    />
    <p>
      This screenshot shows a blurred post next to a normal post in Instagram.
    </p>

    <template v-if="!hideInstallSection">
      <hr />
      <h1>Installation</h1>
      Politicry has not yet been published. It supports
      <a href="https://google.com/chrome">Google Chrome</a> and
      <a href="https://microsoft.com/edge">Microsoft Edge</a>.
      <img
        src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/HRs9MPufa1J1h5glNhut.png"
        alt="Available in the Chrome Web Store"
        style="height: 100px"
      />
    </template>

    <hr />
    <h1>Enabling the Extension</h1>
    <p>
      Once Installed, Politicry can be launched by clicking the
      <code>
        <img src="favicon.png" alt="Politicry Logo" style="height: 15px" />
      </code>
      icon in the URL bar. <br /><br />

      Under the <code>Enabled Sites</code> header, you can choose which social
      media platforms Politicry should check.
    </p>
    <img
      src="https://user-images.githubusercontent.com/16009897/194503059-f10dc6f1-e3db-4a68-b6dd-a7b13840a5c6.png"
      alt="Screenshot of the Politicry extension"
      class="card"
      style="max-height: 300px"
    />
    <p>
      Enabling the switch next to the 🌐 globe icon will disable Politicry on
      all websites.
    </p>

    <hr />
    <h1>Configuring blocked words</h1>
    <p>
      Click on the tab called <code>Blocked Words</code> to configure which
      words will cause a post to be blurred.
    </p>

    <img
      src="https://user-images.githubusercontent.com/16009897/194503272-a2f57f43-96ac-42a1-aca6-12df2b9275f5.png"
      alt="Screenshot of a list of blocked words"
      class="card"
      style="max-height: 300px"
    />
    <p>
      In this example, there are 4 words configured. To edit them, click the
      <code>Edit Blocked</code> button.
    </p>

    <img
      src="https://user-images.githubusercontent.com/16009897/194503277-8852f6fa-e3c1-4676-bda4-c46f3bf92482.png"
      alt="Screenshot of blocked words being configured"
      class="card"
      style="max-height: 300px"
    />
    <p>
      When editting the list, separate words using a comma (<code>,</code>).
      Spaces are optional.
    </p>

    <hr />
    <h1>Configuring allowed words</h1>
    If a post contained an <em>allowed word</em>, it will be visible to you even
    if it contains some <em>blocked word</em>. For example, If you configure
    <code>Sushi</code> as a banned word and <code>Avocado</code> as an allowed
    word, then you will not see any posts about sushi except for avocado sushi.

    <h1>Using the extension</h1>
    Once you've configured the extension, politicry will blur posts on all
    social media platforms that have been enabled.
    <br /><br />
    For example, configure <code>train</code> and <code>rail</code> as blocked
    words, and then visit some of these pages:

    <ul>
      <li><a href="https://instagr.am/p/CjYuHG-PBsM">An Instagram post</a></li>
      <li>
        <a href="https://instagr.am/metrolosangeles">An Instagram profile</a>
      </li>
      <li>
        <a href="https://twitter.com/ptv_official/status/1578190027091283968"
          >A Twitter post</a
        >
      </li>
      <li><a href="https://twitter.com/ptv_official">A Twitter feed</a></li>
      <li><a href="https://reddit.com/r/trains">A Reddit page</a></li>
    </ul>

    <hr />
    <h1>Troubleshooting</h1>
    If you have any issues, feel free to
    <a href="https://politicry.com/report">report an error</a>.

    <hr />
    <h1>Further documentation</h1>
    If you're a software developer, you might be interested in the
    <a href="https://se310-t6.github.io/politicry">API Documentation</a>.
    Politicry is open source and
    <a href="https://github.com/se310-t6/politicry">available on GitHub</a>.
  </main>
</template>

<style>
h1 {
  margin-top: 32px;
  font-size: x-large;
  font-weight: 800;
}
ul {
  list-style: disc;
  margin-left: 20px;
}
main {
  max-width: 800px;
  margin: auto;
  padding: 0 32px;
}
</style>
<script>
export default {
  data: () => ({
    // We hide the "Installation" section of the help page if the user already has the extension installed.
    // We know if the user arrived at this page from the extension because the URL will end with #/
    hideInstallSection: window.location.hash === "#/",
  }),
};
</script>
