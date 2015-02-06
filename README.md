# ekzerco
Exercise tracker - no strings attached. It's in fact an IndexedDB experiment more than a real application, but feel free 
to use any part of it or it as a whole.

## Purpose
Primary purpose was to gain experience with IndexedDB as it's the only in-browser database that's endorsed by W3C and 
as such has some future.

Should you want to use just this part of the app, you can just copy idb.js and idbconfig.js. You will need to modify 
idbconfig.js, but only slightly. I use long variable or member names, so configuration shouldn't be a problem, but feel 
free to ask if anything is not clear. You will also need jQuery, as the whole thing is relying heavily on it.
  
Secondary purpose is to actually track the exercises I do. When enough time was spent of finding a suitable free app to 
do exactly that I realized I'd be able to make my own in the same time. Things eventually got complicated severely when 
I decided to use IndexedDB, but at least there are results :)

## Deployment
Just copy the whole folder somewhere that's visible from the internet. I use my own website for that: 
http://www.panco.si/ekzerco.

You will need to change the root folder in menu.js. Since I'm deploying it on my own site, it's /exzerco, but you can 
change it to whatever you wish, just be sure it works :)

### Limitation
Because the app is using IndexedDB, there is no centralised database, so each user sees only what they enter and the 
server sees no data. That certainly doesn't mean data cannot be collected, but that's not the purpose of this app.

Another limitation would also be an outdated browser. But I dare say it could be pretty hard to find one of these 
nowadays.

I haven't seen any need for more specific methods than those that are most commonly used (get all, select entries from 
specific store bound by some simple rules). Should you really need some of those, this might not be the lib for you. 
But in that case, I'd advise against IndexedDB altogether. Some improvements are bound to happen if I need them. And 
since it's open source, feel free to add things.

### Dependencies
jQuery2 - do not thread on the web without this (included though). Would work with jQuery1 too.

### Future
* Offline mode
