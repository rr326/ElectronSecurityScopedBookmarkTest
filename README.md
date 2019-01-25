# Electron Security Scoped Bookmark Test App

I had a TON of trouble getting security scoped bookmarks to work, as per [this pr](https://github.com/electron/electron/pull/11711).
I built this little test app to show how it wasn't working, and lo and behold, it worked! So then I was able to 
track down on my real app where I went wrong.  

So the first thing to do is get this to build and work properly. You'll need a proper app bundle id from apple, signing certificates, a provisioning profile,  etc.
The scope of describing all of that is too much for here. But if you get all of that to work, then you'll see your dist/mas build work.  (A bookmark will be properly returned.) 
Then go back and see what differs in your real repo.  

Note - you should test your mas-dev build both on your development machine, but also on a separate, clean machine. Ideally a separate physical machine if you have one but a Virtual Machine should be fine. (Though if you get into problems on a VM you start wondering if it is the VM or the app. And I've found getting VMs bot build properly is a huge project in iteself. Nothing is easy!)

Good luck on your debugging!
