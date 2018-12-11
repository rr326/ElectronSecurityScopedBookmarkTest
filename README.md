# Electron Security Scoped Bookmark Test App

I had a TON of trouble getting security scoped bookmarks to work, as per [this pr](https://github.com/electron/electron/pull/11711).
I built this little test app to show how it wasn't working, and lo and behold, it worked! So then I was able to 
track down on my real app where I went wrong.  

So the first thing to do is get this to build and work properly. You'll need a proper app bundle id from apple, signing certificates, a provisioning profile,  etc.
The scope of describing all of that is too much for here. But if you get all of that to work, then you'll see your dist/mas build work.  (A bookmark will be properly returned.) 
Then go back and see what differs in your real repo.  

The thing that killed me:  
* I used a small python helper app to open my many different built applications. eg: `fs opd === open dist_masdev/mas/FileSimple.app`.  It was a great convenience.
* Incredibly, that was my problem. For some reason bookmarks do NOT work in that sitution, but if I open directly from the shell, they work. So maddening. 

Good luck on your debugging!
