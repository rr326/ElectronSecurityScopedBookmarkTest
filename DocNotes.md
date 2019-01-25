# Distribution notes

* Good apple docs
    * [Xcode Code Signing](https://help.apple.com/xcode/mac/current/#/dev3a05256b8)
    * [Cert Types](https://help.apple.com/xcode/mac/current/#/dev80c6204ec)

### Certificates
From [Xcode Help](https://help.apple.com/xcode/mac/current/#/dev80c6204ec)

Cert type | Description
--------- | -----------
Mac Development | Enable certain app services for a macOS app during development and testing.
Mac App Distribution | Sign a macOS app before submitting it to the Mac App Store.
Mac Installer Distribution | Sign and submit a Mac Installer Package, containing your signed app, to the Mac App Store.
Developer ID Application | Sign a macOS app before distributing it outside the Mac App Store.
Developer ID Installer | Sign and distribute a Mac Installer Package, containing your signed app, outside the Mac App Store.

From SPCTL
```
security find-identity -p codesigning -v                                                                                                       [master]  [direnv: python-3.7.0]
  1) 6A26EE0DB4362DA30BE6EF06695E6AF16B101C69 "Developer ID Application: K2 Company LLC (KRUK8XDMA6)"
  2) C706993845BB96DBE90EF9DC927A955FBAF62731 "3rd Party Mac Developer Application: K2 Company LLC (KRUK8XDMA6)"
  3) 82740405A7706688285585DF5928676402E99074 "Mac Developer: Ross Rosen (T3V78M74Z5)"
```

From [electron-osx-sign](https://mintkit.net/electron-userland/electron-osx-sign/guide/)

Cert type | Description
--------- | -----------
Mac Developer \* | Development - MAC or MAS
Developer ID Application \* | Distribution - MAC
3rd Party Mac Developer Application \* | Disribution - MAS


### Mac Development Cert

Apple Developer Website: Type: "Mac Development", name: "Ross Rosen (Ross's iMac Pro)"  
\==  
Keychain
Mac Developer: Ross Rosen (T3V78M74Z5)  
\==  
Xcode  
macOS Development Certificats, "Ross's iMac Pro"  
\==  
Command Line  
82740405A7706688285585DF5928676402E99074 "Mac Developer: Ross Rosen (T3V78M74Z5)"  

### Command line tools
View a certificate exported from Apple Developer webisite:  
(Note - Serial number at the top matches the serial nubmer you see in your keychain view.)
`openssl x509 -inform der -noout -text -in ~/Downloads/mac_development.cer`

View SHA1 of cert - which matches what `security find-identity` says:  
`cat ~/Downloads/mac_development-2.cer| openssl sha1`