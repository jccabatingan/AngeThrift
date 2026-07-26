# Ange Thrift Website

Preloved. Curated. Affordable. — a simple, ready-to-host website for Ange Thrift.

## Files
- `index.html` — Home page (hero, live Facebook feed embed, how it works, footer)
- `shop.html` — Shop page (product grid, cart, checkout via Messenger/email)
- `styles.css` — All styling (shared by both pages)
- `script.js` — Cart logic, mobile menu, checkout modal (shared by both pages)

## Put it on GitHub Pages (free hosting)

1. Create a new GitHub repository (e.g. `ange-thrift-website`).
2. Upload all 4 files from this folder to the **root** of that repository (drag-and-drop works, or `git add . && git commit -m "Launch site" && git push`).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`. Save.
5. Wait ~1 minute, then your site will be live at:
   `https://<your-username>.github.io/ange-thrift-website/`

## Updating your shop items

Open `shop.html` in any text editor and find the `PRODUCTS` list near the bottom.
Add a new item like this, then save and re-upload the file to GitHub:

```js
{ id: "p9", name: "Denim Jacket", price: 599, category: "outerwear", tag: "New", image: "https://your-image-url.jpg" },
```

- `category` must be one of: `tops`, `bottoms`, `bags`, `outerwear`
- `image` can be any photo URL — for real inventory, upload your product photos to
  a free image host like **imgur.com** or your GitHub repo itself, then paste the link here.

## Turn on the "Notify Me" email sign-up

The homepage and shop page both have a **"Get new arrivals in your inbox"** box.
Right now it's built but not connected to anywhere — you need one free 2-minute
step so sign-ups actually reach you:

1. Go to [formspree.io](https://formspree.io) and create a free account (no credit card).
2. Create a new form and connect it to `angelynf07@gmail.com`.
3. Formspree will give you a form URL that looks like `https://formspree.io/f/abc1234`.
4. Open `script.js`, find this line near the bottom:
   ```js
   const SUBSCRIBE_FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```
5. Replace `YOUR_FORM_ID` with your actual form ID, save, and re-upload `script.js` to GitHub.

That's it — from then on, every visitor who signs up sends you an email with
their address. **This tells you who's subscribed; it doesn't send updates by
itself.** When you post something new, you'll BCC your list of subscribers
from Gmail (or, once your list grows, move it into a free tool like
[Mailchimp](https://mailchimp.com) or [Brevo](https://brevo.com) so you can send
one-click update emails instead).

## Notes

- The Facebook feed on the homepage is a live embed of `facebook.com/angethriftstore` —
  it updates automatically whenever you post, no extra work needed.
- The shopping bag is saved in each visitor's browser, so it stays filled in as they move
  between the Home and Shop pages.
- Checkout doesn't process payment — it sends the order (via Messenger or email) to you,
  so you can confirm availability, price, and payment method directly with the buyer, the
  same way you do now.
