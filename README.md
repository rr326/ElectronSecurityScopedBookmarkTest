# Electron Security Scoped Bookmark Test App

This tests the implementation of security scoped bookmarks. These are necessary for building MAS (Mac App Store) builds. The only complete documentation is the <a href="https://github.com/electron/electron/pull/11711">Github PR</a>, though there is also some in the <a href="https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options-callback">docs</a>.</p>

## Installing
```
mkdir bookmarkTest
cd bookmarkTest
git clone https://github.com/rr326/ElectronSecurityScopedBookmarkTest .
yarn install
```

Now you need:
1. Mac Developer Identity
2. A Develloer Provisioning Profile with Device IDs for your development machine(s)
3. Update `package.json` ==> `macDeveloperIdentityHash` and `provisionprofile`
    * `macDeveloperIdentityHash` - try `security find-identity -p codesigning -v` and look for `Mac Developer: ...`
    * `provisionprofile` - this is a "Mac Provisioning Profile (Development)" exported from your [Developer Account](https://developer.apple.com/account/mac/profile/limited)

You can try [this page](https://github.com/nwjs/nw.js/wiki/Mac-App-Store-%28MAS%29-Submission-Guideline#first-steps) for some help on that.

When you've done that, try: `yarn dist`

Hopefully it will build and sign.

Then try: `open dist/mas/ElectronSecurityScopedBookmarkTestApp.app`


## What *Should* Happen
Source: Reading the code at [atom/browser/ui/file_dialog_mac.mm](https://github.com/electron/electron/blob/c8c1be7ae546da4679a22b6872f023c9786df663/atom/browser/ui/file_dialog_mac.mm). Particularly [OpenDialogComplettion](https://github.com/electron/electron/blob/c8c1be7ae546da4679a22b6872f023c9786df663/atom/browser/ui/file_dialog_mac.mm#L287-L313) and [GetBookMarkDataFromNSURL](https://github.com/electron/electron/blob/c8c1be7ae546da4679a22b6872f023c9786df663/atom/browser/ui/file_dialog_mac.mm#L228-L251)
<ul>
  <li>Non-MAS build: <code>bookmarks === undefined</code></li>
  <li>MAS build</li>
  <ul>
    <li><code>securityScopedBookmarks: false ==> bookmarks === []</code> </li>
    <li><code>securityScopedBookmarks: true</code>  </li>
    <ul>
      <li>Success: <code>bookmarks === ["SLKDJFLKSDJLSJDLFJSLKJFLS..SJLD"]</code> </li>
      <li>Error: <code>bookmarks === ['']</code></li>
    </ul>
  </ul>
</ul>
