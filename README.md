# Ashish Kharche: personal site

Plain HTML and CSS, with a few lines of JavaScript for the theme toggle. No build step.

Run locally: `python3 -m http.server 4321` in this folder, then open http://localhost:4321

Deploy (when ready): Cloudflare Pages or Vercel, with no build command and the output directory set to this folder. `_headers` applies on Cloudflare Pages.

Still to do:
- Photo: no portrait found. Replace the "AK" span in the intro with an <img> (see the comment in index.html).
- cv/: copies of the three CVs with the phone number removed. Regenerate them whenever the CVs change.
- If you edit the inline theme script in <head>, update its sha256 hash in `_headers`.
