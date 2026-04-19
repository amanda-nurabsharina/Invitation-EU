# Wedding Invitation - Client Sites

Frontend untuk undangan pernikahan menggunakan htmx untuk interaksi dinamis.

## Struktur

```
FE User/
├── public/              # Served by backend atau NGINX
│   └── assets/
│       ├── css/
│       ├── js/
│       └── images/
├── templates/           # Go templates, served by Fiber
│   ├── themes/
│   │   ├── elegant/
│   │   ├── rustic/
│   │   ├── modern/
│   │   └── floral/
│   └── components/
│       ├── rsvp-form.html
│       ├── guest-messages.html
│       └── gallery.html
└── README.md
```

## Cara Kerja

1. **Fiber Backend** akan serve HTML templates berdasarkan subdomain
2. Templates menggunakan **htmx** untuk partial updates
3. Setiap tema memiliki file template sendiri
4. Data dari database di-inject ke template

## htmx Attributes yang Digunakan

- `hx-get` - Load fragments (gallery, messages)
- `hx-post` - Submit forms (RSVP, guest book)
- `hx-trigger` - Events (load, click, submit)
- `hx-target` - Where to put response
- `hx-swap` - How to swap content
- `hx-indicator` - Loading indicator

## Contoh Penggunaan htmx

### RSVP Form

```html
<form
  hx-post="/api/rsvp"
  hx-target="#rsvp-result"
  hx-swap="innerHTML"
  hx-indicator="#loading"
>
  <input name="guest_name" required />
  <select name="attendance">
    <option value="hadir">Hadir</option>
    <option value="tidak_hadir">Tidak Hadir</option>
  </select>
  <button type="submit">Kirim</button>
</form>
```

### Lazy Load Gallery

```html
<div hx-get="/api/gallery" hx-trigger="revealed" hx-swap="innerHTML">
  <p>Loading gallery...</p>
</div>
```
