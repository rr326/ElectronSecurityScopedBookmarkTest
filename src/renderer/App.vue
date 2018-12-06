<template>
  <div class="container-fluid">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <h1>Test of Mac MAS Build Security Scoped Bookmarks</h1>
    <p>This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. The original PR and most of the documentation is <a href="https://github.com/electron/electron/pull/11711">here</a>.</p>
    <h3>Expectations</h3>
    <ul>
      <li>In non-MAS build, Bookmarks == []</li>
      <ul>
        In MAS build:
        <li>No error:  Bookmarks == [bookmark] (array of bookmarks)</li>
        <li>Error: Bookmarks == '' (ie: String, not array)</li>
      </ul>      
    </ul>
    <br>
    <hr>
    <h3>Bookmarks</h3>
    <p>Bookmarks set: {{bookmarks_set}}</p>
    <p>Bookmarks: |{{bookmarks}}|</p>
    <p>Bookmarks typeof: {{typeof bookmarks}}</p>
    <p>Bookmarks len: {{bookmarks ? bookmarks.length : -1}}</p>
    <p>Bookmarks JSON: |{{JSON.stringify(bookmarks)}}|</p>
    <p>Typeof bookmarks: {{bookmarks_type}}</p>
    <button type='button' class="btn btn-primary center-block" @click='showOpenDialog'> Click to select directory </button>
  </div>
</template>

<script>
const {
  dialog,
  app
} = require('electron').remote

export default {
  name: 'app',
  data() {
    return {
      bookmarks: ['this', 'is', 'not', 'initialized', {
        data: 'seriously'
      }],
      bookmarks_set: "not set",
      bookmarks_type: 'not set',
      bookmarks_extra_param: "not set"
    }
  },
  methods: {
    showOpenDialog() {
      let self = this

      dialog.showOpenDialog({
        title: 'Select directory to store your FileSimple data and files',
        defaultPath: app.getPath('home'),
        buttonLabel: 'Select',
        properties: ["openDirectory", "createDirectory"],
        securityScopedBookmarks: true,
      }, (filePaths, bookmarks) => {
        const fp = filePaths,
          bm = bookmarks

        if (filePaths) {
          self.bookmarks_set = true
          self.bookmarks = bookmarks
          self.bookmarks_type = typeof bookmarks
        } else {
          alert('No directory selected. You must select a directory to continue.') // eslint-disable-line no-alert
        }
      })
    }
  }
}

</script>

<style lang="css" scoped>
.container-fluid {
  margin-top: 15px;
}
</style>
