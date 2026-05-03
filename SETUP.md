# CS305 Demo Day — Online Feedback Setup

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it: `CS305 Demo Day Feedback`
3. Rename the first tab to `Consent`
   - In cell A1, type: `Timestamp`
4. Create a second tab called `Feedback`
   - In row 1, type these headers:
   - A1: `Timestamp`
   - B1: `Group`
   - C1: `Pre Rating`
   - D1: `Post Rating`
   - E1: `Learning`
   - F1: `Accuracy`
   - G1: `Usability`
   - H1: `Comments`

## Step 2: Deploy the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `apps_script.js` and paste it in
4. Click **Deploy > New deployment**
5. Click the gear icon next to "Select type" and choose **Web app**
6. Set:
   - Description: `CS305 Feedback`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. **Copy the Web app URL** — you'll need this in the next step

## Step 3: Update the Apps Script URL

In **both** `index.html` and `feedback.html`, find this line:

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

Replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied in Step 2.

## Step 4: Test It

1. Visit https://weihaoqu.github.io/cs305-feedback/ — consent page should work
2. Visit https://weihaoqu.github.io/cs305-feedback/feedback.html?group=1 — feedback form for Group 1
3. Submit a test response and check your Google Sheet

## Step 5: Generate the QR Flyer

1. Open `qr_flyer.html` in your browser (just double-click it)
2. Enter your base URL: `https://weihaoqu.github.io/cs305-feedback/feedback.html`
3. Click **Generate QR Codes**
4. Click **Print Flyer** (print to PDF or paper)

## Demo Day Checklist

- [ ] Print the QR flyer (one copy, or project it on screen)
- [ ] Print paper creator reflection forms (one per team)
- [ ] Print paper observation rubrics (one per project)
- [ ] Test the feedback URL on your phone
- [ ] Verify test submissions appear in the Google Sheet
- [ ] Delete test rows before demo day
