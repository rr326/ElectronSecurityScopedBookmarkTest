<template>
  <div class="container-fluid">
    <h1>Test of Mac MAS Build Security Scoped Bookmarks</h1>
    <br>

    <div class="card card-body bg-light explanation-block">
      <h3>Overview</h3>
      <p>This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. The only complete documentation is the <a href="https://github.com/electron/electron/pull/11711">Github PR</a>, though there is also some in the <a href="https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback">docs</a>.</p>
      <h3>Expectations</h3>
      <ul>
        <li>In non-MAS build, Bookmarks == []</li>
        <li>In MAS build:
          <ul>
            <li>No error: Bookmarks == [bookmark] (array of bookmarks)</li>
            <li>Error: Bookmarks == '' (ie: String, not array)</li>
          </ul>
        </li>
      </ul>
      <h3>This DOES work. </h3>
      <p>Tested with Electron 4.0.0-beta.8. It probably works with 3.x.x as well, but I have not tested it.</p>
      <p>If you are having problmems and getting a empty bookmark list with MAS, it means something else is going on.</p>
    </div> <br>
    <h3>Bookmarks</h3>
    <div class="info-table">
      <table class='table table-striped'>
        <tbody>
          <tr>
            <td>Bookmarks set</td>
            <td>{{bookmarks_set}}</td>
          </tr>
          <tr>
            <td>Bookmarks</td>
            <td class="no-overflow">{{bookmarks}}</td>
          </tr>
          <tr>
            <td>Bookmarks typeof</td>
            <td>{{typeof bookmarks}}</td>
          </tr>
        </tbody>
      </table>

    </div>
    <br>

    <button type='button' class="btn btn-primary" @click='showOpenDialog'> Click to select directory </button>
    <button type='button' class="btn btn-secondary" @click='reset'> Reset </button>
    <br>
    <br>
    <div v-if="bookmarks_set">
      <h3>Results</h3>
      <div class="alert alert-success" v-if="isMas && bookmarks_set && validBookmarks">Bookmark properly returned</div>
      <div class="alert alert-warning" v-if="!isMas && bookmarks_set">Not MAS build. Bookmarks not set.</div>
      <div class="alert alert-danger" v-if="isMas && bookmarks_set && !validBookmarks">
        <h4>Invalid bookmarks returned</h4>
        <p><b>Bookmarks: </b> |{{this.bookmarks}}|</p>
        <p>Explanation:
          <span v-if="this.bookmarks==''">Empty string - Error returned from openDialog</span>
          <span v-if="this.bookmarks!=''"><b>UNEXPECTED</b> Error - non-string. typeof this.bookmarks: {{typeof this.bookmarks}}</span>
        </p>
      </div>
    </div>

    <br>
    <div class='info-table'>
      <h3>Environment</h3>
      <table class='table table-striped'>
        <tbody>
          <tr>
            <td>isMas</td>
            <td class="alert" :class="{'alert-success': isMas, 'alert-warning': !isMas}">{{isMas}}</td>
          </tr>
          <tr>
            <td>userDataPath</td>
            <td>{{userDataPath}}</td>
          </tr>
        </tbody>
      </table>
    </div>

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
      bookmarks: null,
      bookmarks_set: false,
      bookmarks_extra_param: null
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      this.bookmarks = ['this', 'is', 'not', 'initialized', {
          data: 'seriously'
        }],
        this.bookmarks_set = false
      this.bookmarks_extra_param = "not set"
    },
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
  },
  computed: {
    isMas() {
      return Boolean(process.mas)
    },
    userDataPath() {
      return app.getPath('userData')
    },
    validBookmarks() {
      return this.bookmarks && this.bookmarks instanceof Array && this.bookmarks.length == 1 && typeof this.bookmarks[0] == "string"
    }
  }
}

</script>

<style lang="scss">
.container-fluid {
  padding: 20px 30px !important;
}

.info-table {
  max-width: 1000px;

  .no-overflow {
    word-break: break-all;
  }
}

.explanation-block {
  font-size: .9em;

  h3 {
    font-size: 1.5em;
  }
}
</style>
