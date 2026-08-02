HOW TO ADD YOUR OWN CONTENT
============================

1) PHOTOS (Our Memories section + About section)
   - Put image files in the /images folder
   - In index.html, find each: <div class="img-placeholder" data-label="...">
   - Replace the placeholder div's content with: <img src="images/your-photo.jpg" alt="...">
   - Tip: keep the surrounding <div class="img-placeholder">...</div> wrapper so the
     rounded corners, hover zoom, and captions still work.

2) VIDEOS (Special Moments section)
   - Put video files in the /videos folder
   - Find: <div class="video-placeholder" data-label="Add a video">
   - Replace with a <video> tag, e.g.:
     <video src="videos/your-clip.mp4" controls poster="images/thumb.jpg"></video>

3) MUSIC (optional background song)
   - Put an mp3 file in /music named "theme.mp3" (or update the <source> tag in index.html)
   - The floating music button (bottom right) will play/pause it

4) TEXT
   - All copy lives directly in index.html — search for the section you want
     (About, Reasons, Timeline, Quotes, Letter) and edit the text freely.

Just open index.html in any browser — no build step required.
