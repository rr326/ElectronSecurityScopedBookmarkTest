<template>
  <div class="container-fluid">
    <h1>Test of Mac MAS Build Security Scoped Bookmarks</h1>
    <br>

    <div class="card card-body bg-light explanation-block">
      <h3>Overview</h3>
      <p>This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. The only complete documentation is the <a href="https://github.com/electron/electron/pull/11711">Github PR</a>, though there is also some in the <a href="https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback">docs</a>.</p>
    </div>
    <br>
    <h3>Bookmarks</h3>
    <div class="info-table">
      <table class='table table-striped'>
        <tbody>
          <tr>
            <td>securityScopedBookmarksSetting set</td>
            <td>{{securityScopedBookmarksSetting}}</td>
          </tr>          <tr>
            <td>Bookmarks set</td>
            <td>{{bookmarks_set}}</td>
          </tr>
          <tr>
            <td>Bookmarks (between ||)</td>
            <td class="no-overflow">|{{bookmarks}}|</td>
          </tr>
          <tr>
            <td>Bookmarks typeof</td>
            <td>{{typeof bookmarks}}</td>
          </tr>
        </tbody>
      </table>

    </div>
    <br>

    <button type='button' class="btn btn-primary" @click='showOpenDialogTrue'> Select: SSB=true </button>
    <button type='button' class="btn btn-primary" @click='showOpenDialogFalse'> Select: SSB=false </button>

    <button type='button' class="btn btn-secondary" @click='reset'> Reset </button>
    <br>
    <br>
    <div v-if="bookmarks_set">
      <h3>Results</h3>
      <div class="alert alert-success" v-if="isMas && bookmarks_set && validBookmarks">Bookmark properly returned</div>
      <div class="alert alert-warning" v-if="!isMas && bookmarks_set">Not MAS build. Bookmarks not set.</div>
      <div class="alert alert-danger" v-if="isMas && bookmarks_set && !validBookmarks">
        <h4>Invalid bookmarks returned</h4>
        <p><b>Bookmarks: </b> |{{bookmarks}}|</p>
        <p>Explanation:
          <span v-if="this.bookmarks===''">Empty string - Error returned from openDialog</span>
          <span v-if="this.bookmarks!==''"><b>UNEXPECTED</b> Error - non-string. typeof this.bookmarks = {{typeof bookmarks}}</span>
        </p>
        <div v-if="(this.bookmarks instanceof Array) && this.bookmarks.length === 0">MAS build returned empty array. This is strange.</div>
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
    <br>
    <h3>Expectations from <a href="https://github.com/electron/electron/pull/11711">Documentation</a></h3>
    <p>Doc link: https://github.com/electron/electron/pull/11711</p>
    <ul>
      <li>The <code>bookmarks</code> array will be empty if the app is not bundled for <code>mas</code></li>
      <li>If there was an error obtaining the bookmark, an empty string will be returned <code>""</code>
        <ul>
          <li>Errors may be because of signing issues, incorrect entitlements, etc</li>
        </ul>
      </li>
      <li>For <code>showSaveDialog</code> the <code>filename</code> is returned along with a <code>bookmark</code> string</li>
    </ul>
    <h3>Expectations from reading the code</h3>
    <p>Code location (electron source): <code>file_dialog_mac.mm</code> -> <code>OpenDialogCompletion</code> and <code>GetBookMarkDataFromNSURL</code></p>
    <ul>
      <li>Non-MAS build: <code>bookmarks === undefined</code> <span class="badge badge-success">VERIFIED</span></li>
      <li>MAS build</li>
      <ul>
        <li><code>securityScopedBookmarks: false ==> bookmarks === []</code> <span class="badge badge-warning">Sometimes</span></li>
        <li><code>securityScopedBookmarks: true</code>  </li>
        <ul>
          <li>Success: <code>bookmarks === ["SLKDJFLKSDJLSJDLFJSLKJFLS..SJLD"]</code>  <span class="badge badge-warning">Sometimes</span </li>
          <li>Error: <code>bookmarks === ['']</code> <span class="badge badge-secondary">Not Seen</span></li>
        </ul>
      </ul>
    </ul>
  </div>
</template>

<script>
const {
  dialog,
  app
} = require('electron').remote
import {
  showOpenDialog
} from '../shared/dialog.js'

export default {
  name: 'app',
  data() {
    return {
      bookmarks: null,
      bookmarks_set: false,
      bookmarks_extra_param: null,
      securityScopedBookmarksSetting: "NA"
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
      securityScopedBookmarksSetting = "NA"
    },
    setResults(results) {
      this.bookmarks_set = true
      this.bookmarks = results.bookmarks
      this.securityScopedBookmarksSetting = results.securityScopedBookmarks
    },
    showOpenDialogTrue() {
      showOpenDialog(dialog, 'Renderer', true, this.setResults)
    },
    showOpenDialogFalse() {
      showOpenDialog(dialog, 'Renderer', false, this.setResults)
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
