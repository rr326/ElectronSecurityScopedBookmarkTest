<template>
  <div class="container-fluid">
    <h1>Test of Mac MAS Build Security Scoped Bookmarks</h1>
    <p>The only complete documentation is the <a href="https://github.com/electron/electron/pull/11711">Github PR</a>, though there is also some in the <a href="https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback">docs</a>.</p>
    <p>This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. </p>
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
    <br>
    <hr>
    <h3>Bookmarks</h3>
    <table class='info-table'>
      <tbody>
        <tr>
          <td>Bookmarks set</td>
          <td>{{bookmarks_set}}</td>
        </tr>
        <tr>
          <td>Bookmarks</td>
          <td>{{bookmarks}}</td>
        </tr>
        <tr>
          <td>Bookmarks typeof</td>
          <td>{{typeof bookmarks}}</td>
        </tr>
        </tbody>
        </table> 
        <br>
        <h3>Environment</h3>
        <table class='info-table'>
      <tbody>
        <tr>
          <td>isMas</td>
          <td>{{isMas}}</td>
        </tr>
        <tr>
          <td>isSandboxed</td>
          <td>{{isSandboxed}}</td>
        </tr>
        <tr>
          <td>userDataPath</td>
          <td>{{userDataPath}}</td>
        </tr>
      </tbody>
    </table>

    <button type='button' class="btn btn-primary center-block" @click='showOpenDialog'> Click to select directory </button>
    <button type='button' class="btn btn-reset center-block" @click='reset'> Reset </button>
    <br>
    <br>
    <hr>


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
      bookmarks_set: null,
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
      this.bookmarks_set = "not set"
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
    isSandboxed() {
      return Boolean(process.sandboxed)
    },
    userDataPath() {
      return app.getPath('userData')
    }
  }
}

</script>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-reset {
  color: #fff;
  background-color: orange;
  border-color: orange;
}

table.info-table {
  padding: 10px 0px;

  td {
    padding: 3px 7px;
  }


  tbody tr:nth-child(odd) {
    background: #eee;
  }
}
</style>
