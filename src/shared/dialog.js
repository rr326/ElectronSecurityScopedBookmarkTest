/**
 * Shared code to ensure that renderer and main processes are using the exact same code.
 */

// Main
//   dialog.showOpenDialog({
//           title: 'MAIN WINDOW',
//           message: "MAIN WINDOW",
//           defaultPath: '/Users/rrosen',
//           buttonLabel: 'MAIN Select Directory',
//           properties: ["openDirectory", "createDirectory"],
//           securityScopedBookmarks: true,
//         }, (filePaths, bookmarks) => {
//           dialog.showMessageBox({
//             type: "info",
//             buttons: ['ok'],
//             title: "Open Dialog Results",
//             message: `\
// ShowOpenDialog Results: \n\
// isMas: ${process.mas}\n\
// filePaths: |${filePaths}|\n\
// bookmarks: |${bookmarks}|\n\
// typeof bookmarks: ${typeof bookmarks} \n\
// isArray: ${bookmarks instanceof Array}\n\
// length: ${bookmarks instanceof Array ? bookmarks.length : 'NA'}\n\
// bookmarks ==== [""]: ${bookmarks === [""]}\
// `
//           })
//         })
//
function resultsText(filePaths, bookmarks, securityScopedBookmarksSetting) {
  return `\
ShowOpenDialog Results: \n\
securityScopedBookmarks setting: ${securityScopedBookmarksSetting} \n\
isMas: ${process.mas}\n\
filePaths: |${filePaths}|\n\
bookmarks: |${bookmarks}|\n\
typeof bookmarks: ${typeof bookmarks} \n\
isArray: ${bookmarks instanceof Array}\n\
length: ${bookmarks instanceof Array ? bookmarks.length : 'NA'}\n\
bookmarks ==== [""]: ${bookmarks === [""]}\
`
}

/**

 * @param  {Function} dialog                    electron.dialog for main, electron.remote.dialog for renderer
 * @param  {string}   name                      Text to display
 * @param  {bool}     securityScopedBookmarks   Passed to dialog.showOpenDialog()
 * @param  {Function} callback                  Optional. Passed: {filePaths, bookmarks, securityScopedBookmarks}
 * @return                                      None
 */
export function showOpenDialog(dialog, name, securityScopedBookmarks, callback) {
  return dialog.showOpenDialog({
    title: name,
    message: `Name: ${name}\noptions.securityScopedBookmarks: ${securityScopedBookmarks}\n$process.mas: |${process.mas}|`,
    defaultPath: '/Users/',
    buttonLabel: 'Select Directory',
    properties: ["openDirectory", "createDirectory"],
    securityScopedBookmarks: securityScopedBookmarks
  }, (filePaths, bookmarks) => {
    dialog.showMessageBox({
      type: "info",
      buttons: ['ok'],
      title: "Open Dialog Results",
      message: resultsText(filePaths, bookmarks, securityScopedBookmarks)

    })

    if (callback) {
      callback({filePaths, bookmarks, securityScopedBookmarks})
    }
  })
}
