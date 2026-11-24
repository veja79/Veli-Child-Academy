# Putting the backend online

The website (Netlify) works without the backend. The backend adds the staff admin portal
(`/admin`): posting news and reading contact-form messages.

You need somewhere that runs a Docker container **and** a MySQL database.
These steps use **Railway**, which does both from your GitHub repo. Check its current pricing first;
expect a small monthly fee.

## 1. Create the project

1. Sign in at railway.com with GitHub.
2. **New Project → Deploy from GitHub repo →** `Veli-Child-Academy`.
3. Open the new service → **Settings → Root Directory** = `backend`. Railway finds `backend/Dockerfile`.
4. In the same project: **+ New → Database → MySQL**.

## 2. Set the variables

On the backend service → **Variables**, add:

| Variable | Value |
| --- | --- |
| `DB_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `JWT_SECRET` | a random string of 32+ characters (a password generator works) |
| `ADMIN_USERNAME` | the staff login name, e.g. `principal` |
| `ADMIN_PASSWORD` | a strong password, 10+ characters |
| `CORS_ORIGINS` | `https://veli-child-academy.netlify.app` (add the .co.za address later, comma-separated) |

Deploy. The first start creates the tables and the admin account.

The login always follows these two variables: change `ADMIN_PASSWORD` and redeploy to reset a forgotten
password. If you delete `ADMIN_PASSWORD`, the account stays with its last password.

## 3. Give it a web address

Backend service → **Settings → Networking → Generate Domain**. You get something like
`veli-api.up.railway.app`. Test it: `https://veli-api.up.railway.app/api/announcements` should show JSON.

## 4. Point the website at it

Netlify → the site → **Site configuration → Environment variables** → add
`VITE_API_BASE` = `https://veli-api.up.railway.app/api`, then **Deploys → Trigger deploy**.

Now `https://veli-child-academy.netlify.app/admin` shows the staff login, news posted there appears on
the website, and contact-form messages land in the admin inbox.

## Notes

- Posters for news posts: pick a website photo in the editor, or paste a link to an image.
- To add another staff account later, ask a developer: there is no sign-up page on purpose.
- Back up the MySQL database from Railway's database **Backups** tab.
