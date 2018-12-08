<template>
  <div class="container-fluid">
    <h1>Test of Mac MAS Build Security Scoped Bookmarks</h1>
    <p>This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. The original PR and most of the documentation is at: https://github.com/electron/electron/pull/11711.</p>
    <h3>Expectations</h3>
    <ul>
      <li>In non-MAS build, Bookmarks == []</li>
      <li>In MAS build:
        <ul>          
          <li>No error:  Bookmarks == [bookmark] (array of bookmarks)</li>
          <li>Error: Bookmarks == '' (ie: String, not array)</li>
        </ul>   
      </li>
    </ul>
    <h3>This DOES work. </h3>
    <p>Tested with Electron 4.0.0-beta.8. It probably works with 3.x.x as well, but I have not tested it.</p>
    <p>If you are having problmems and getting a empty bookmark list with MAS, it means something else is going on.</p>
    <br>
    <hr>
    <h3>Bookmarks</h3>
    <p>Bookmarks set: {{bookmarks_set}}</p>
    <p>Bookmarks: |{{bookmarks}}|</p>
    <p>Bookmarks typeof: {{typeof bookmarks}}</p>
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
        } else {
          alert('No directory selected. You must select a directory to continue.') // eslint-disable-line no-alert
        }
      })
    }
  }
}

</script>

<style lang="css">
body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: left;
    background-color: #fff;
}


.container-fluid {
  margin: 20px;
      width: 100%;
    padding-right: 15px;
    padding-left: 15px;
}

.btn {
  display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}

</style>
