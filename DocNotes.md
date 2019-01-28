# Distribution notes

* Good apple docs
	* [Current Docs](https://developer.apple.com/documentation) - Not as detailed or helpful!
	* [Doc Archive](https://developer.apple.com/library/archive/navigation/) - Better, more detailed docs here, but not maintained.
	* [Apple Security Overview](https://developer.apple.com/security/)
	* Technical docs
		* [Security Overview](https://developer.apple.com/library/archive/documentation/Security/Conceptual/Security_Overview/Introduction/Introduction.html#//apple_ref/doc/uid/TP30000976)
		* [Codesigning In Depth](https://developer.apple.com/security/)
		* [Codesignig Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html)
		* [Developer ID & Gatekeeper](https://developer.apple.com/developer-id/) (For outside the MAS. Also, this talks about App notorization.)
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

`codesign` - Key codesignig tool (used by electron-osx-sign)

## [Codesigning](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40005929-CH1-SW1)
Codesigning is quite complex and this is the key doc to read. That said, most of it should be properly taken care of by electron-osx-sign. You can try `codesign --verify --deep --strict --verbose=4 <code-path>` to interrogate the signature and see if it meets the designated requirement. See [Examining a Code Signature](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html#//apple_ref/doc/uid/TP40005929-CH4-SW2)
> After you have produced your final deliverable, but before you ship it, you can use the spctl(8) tool to test your code signatures against various system policies that the user may set.
`spctl --raw --assess --type execute <filename>`  

Really detailed doc: [Codesigning In Dept](https://developer.apple.com/library/archive/technotes/tn2206/_index.html)


## Sandbox
* [Overview](https://developer.apple.com/library/archive/documentation/Security/Conceptual/AppSandboxDesignGuide/AboutAppSandbox/AboutAppSandbox.html#//apple_ref/doc/uid/TP40011183)
* [Entitlements](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/AboutEntitlements.html#//apple_ref/doc/uid/TP40011195)


## Misc Notes
#### [Code Requirements](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/AboutCS/AboutCS.html)
The most important internal requirement is the designated requirement, or DR. This rule tells an evaluating system how to identify a particular piece of code. Any two pieces of code that have (and successfully verify against) the same DR are considered to be the same code. This allows a code signer to publish a new version of an app that is treated as the same app. For example, the DR for Apple Mail might be "was signed by Apple and has the identifier com.apple.Mail". 

## [Gatekeeper](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html#//apple_ref/doc/uid/TP40005929-CH4-SW2)
* Lots of stuff wrt to gatekeeper. See bottom of the page of the link above.
* It looks like a development version should NOT pass gatekeeper!  
> Gatekeeper - Restricts launching of applications from unidentified developers - A configurable trusted anchor check (Developer ID or Mac App Store). [Source - bottom table of this](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/AboutCS/AboutCS.html)
* A good way to test for real if Gatekeeper works is to download the app from a website, which will quarantine it and force GateKeeper to try it. 