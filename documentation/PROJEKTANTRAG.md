# SCENERY – Show Your Best

## Projektbezeichnung
**SCENERY – Show Your Best**

SCENERY ist eine Webplattform für Fotografen und Videografen, auf der Nutzer ihre besten Fotos und Videos präsentieren können.  
Zu jedem Upload werden zusätzlich technische Informationen wie Kamera, Objektiv, Kameraeinstellungen sowie Gedanken zum Bild oder Video angegeben. Dadurch können andere Nutzer nachvollziehen, wie ein Bild oder Video entstanden ist und daraus lernen.

Die Plattform kombiniert eine Galerie für kreative Inhalte mit einer Lernplattform für Fotografie und Videografie.

Ein zusätzlicher Bestandteil der Plattform ist **SCENERY `<CORP/>`**, ein Bereich, in dem Unternehmen kreative Challenges erstellen können. Dabei können Firmen beispielsweise nach bestimmten Fotos, Videos oder Social-Media-Inhalten suchen, die von der Community erstellt werden.

---

# Projektauftraggeber
Frau Professorin **Natascha Rammelmüller**  
Herr Professor **Robert Reder**

---

# Team

**Projektleiter und Entwickler**

- Lukas Benea – Projektleitung, Entwicklung, Datenbankdesign

---

# Projekthintergrund / Motivation

Viele bekannte Plattformen wie Instagram oder Pinterest zeigen Fotos und Videos hauptsächlich als Inspirationsquelle. Allerdings fehlen dort häufig die technischen Informationen darüber, wie diese Inhalte erstellt wurden.

Gerade für Fotografen und Videografen sind jedoch Informationen wie Kamera, Objektiv oder Belichtungseinstellungen sehr wichtig, um von anderen Arbeiten zu lernen.

SCENERY soll deshalb eine Plattform schaffen, auf der Nutzer ihre Arbeiten präsentieren können und gleichzeitig die technischen Einstellungen der Aufnahme sichtbar machen. Dadurch entsteht eine Kombination aus Galerie, Community und Lernplattform.

Zusätzlich bietet die Plattform sogenannte **Challenges**, bei denen Nutzer ihre Inhalte zu bestimmten Themen einreichen und miteinander vergleichen können.

Mit **SCENERY `<CORP/>`** wird dieses Konzept erweitert: Unternehmen können eigene kreative Challenges erstellen und gezielt nach Fotos, Videos oder Social-Media-Content suchen, der von der Community produziert wird.

---

# USP 

SCENERY kombiniert eine Fotogalerie mit einer Lernplattform für Fotografie und Videografie.  
Im Gegensatz zu vielen anderen Plattformen werden zu jedem Bild oder Video auch die technischen Aufnahmeinformationen angezeigt.

Dadurch können Nutzer nicht nur Inhalte betrachten, sondern auch verstehen, wie diese entstanden sind.

Zusätzlich ermöglicht **SCENERY `<CORP/>`** Unternehmen, kreative Challenges zu erstellen und direkt mit der kreativen Community zusammenzuarbeiten.

---

# Projektziele

Ziel des Projekts ist die Entwicklung einer Webplattform, auf der Nutzer kreative Inhalte veröffentlichen, durchsuchen und bewerten können.

Die wichtigsten Funktionen der Plattform sind:

- Registrierung und Login für Benutzer
- Upload von Fotos und Videos
- Anzeige von Kameraeinstellungen und technischen Informationen
- Galerie mit Trending-Inhalten
- Like-System für Beiträge
- Tag-System zur Kategorisierung von Inhalten
- Challenges (Rooms), in denen Nutzer Inhalte zu bestimmten Themen einreichen können
- Unternehmens-Challenges über **SCENERY `<CORP/>`**

---

# UI & UX – Sicht des Users

Die Plattform besitzt eine moderne und minimalistische Benutzeroberfläche mit Fokus auf Bildern und Videos.

Die Startseite zeigt eine Galerie mit Trending-Inhalten und neuen Uploads.  
Alle Inhalte werden in einem dynamischen Grid-Layout dargestellt.

Benutzer können:

- Fotos und Videos durchsuchen
- Inhalte liken
- Inhalte nach Tags filtern
- an Challenges teilnehmen
- eigene Inhalte hochladen

Beim Klick auf ein Bild oder Video öffnet sich eine Detailseite, auf der folgende Informationen sichtbar sind:

- das Bild oder Video
- Beschreibung
- Kameraeinstellungen
- Tags
- Likes

---

# Technologien

## Frontend
- HTML
- CSS3
- JavaScript

## Backend
- PHP

## Datenbank
- MySQL

## Tools
- GitHub (Version Control)
- Figma (UI Design)

---

# Verwendete Libraries

- **GSAP** – Animationen und UI-Effekte  
- **Masonry.js** – dynamisches Grid-Layout für die Galerie  
- **PhotoSwipe** – Fullscreen-Anzeige von Fotos  
- **Dropzone.js** – Drag & Drop Upload für Medien  
- **Plyr** – moderner Video-Player

---

# Feature Liste

## User System
- Benutzerregistrierung
- Login und Logout
- Benutzerprofile

## Upload System
- Upload von Fotos und Videos
- Titel und Beschreibung hinzufügen
- Tags hinzufügen
- Kameraeinstellungen angeben

## Galerie
- Anzeige aller Inhalte in einem Grid-Layout
- Trending Inhalte
- Anzeige neuer Uploads

## Like System
- Nutzer können Inhalte liken
- Beliebte Inhalte werden hervorgehoben

## Tags
- Inhalte können mit Tags kategorisiert werden
- Filterung nach bestimmten Tags

## Challenges (Rooms)
- Erstellung von Challenges
- Nutzer können Inhalte zu Challenges einreichen
- Vergleich verschiedener Beiträge

## SCENERY `<CORP/>`
- Unternehmen können eigene Challenges erstellen
- Firmen können kreative Inhalte von der Community anfordern
- Nutzer können ihre Inhalte für Unternehmens-Challenges einreichen
- Möglichkeit für kreative Kooperation zwischen Community und Unternehmen

---

# Coder Plan – Sicht des Entwicklers

Das Backend der Plattform wird mit **PHP** umgesetzt und kommuniziert mit einer **MySQL-Datenbank**.

Die Datenbank speichert Benutzer, Inhalte, Likes, Tags sowie Challenges.  
Die Inhalte werden in einer Galerie dargestellt, die mit **Masonry.js** dynamisch aufgebaut wird.

Für die Vollbildanzeige von Bildern wird **PhotoSwipe** verwendet.  
Der Upload von Fotos und Videos erfolgt über **Dropzone.js**.  
Videos werden mit dem **Plyr Video Player** abgespielt.

---

# Datenbankkonzept

Die Plattform verwendet eine relationale MySQL-Datenbank mit folgenden Tabellen:

- **users** – Benutzerinformationen  
- **posts** – Fotos und Videos  
- **likes** – Likes auf Beiträge  
- **tags** – Kategorien für Inhalte  
- **post_tags** – Verbindung zwischen Posts und Tags  
- **rooms** – Challenges / Wettbewerbe  
- **room_entries** – Beiträge innerhalb von Challenges  

---

# Zielgruppe

Die Plattform richtet sich an:

- Hobbyfotografen
- Videografen
- Content Creator
- Fotografie-Einsteiger
- kreative Communitys
- Unternehmen, die kreative Inhalte für Marketing oder Social Media suchen

---

# Design Konzept

Das Design der Plattform ist minimalistisch und modern, damit die Inhalte im Mittelpunkt stehen.

Designprinzipien:

- helles Interface
- klares Grid Layout
- Fokus auf Bilder und Videos

Farbschema:

- Hintergrund: `#FAFAFA`  
- Karten: `#FFFFFF`  
- Text: `#1E1E1E`  
- Sekundärer Text: `#6B7280`  
- Akzentfarbe: `#3B82F6`

Schriftarten:

- Logo / Überschriften: **Comfortaa**
- Text: **Nunito**

---

# Endergebnis

Am Ende des Projekts soll eine funktionierende Webplattform entstehen, auf der Nutzer:

- Fotos und Videos hochladen
- Inhalte durchsuchen
- Beiträge liken
- Inhalte nach Tags filtern
- an Challenges teilnehmen

Zusätzlich ermöglicht **SCENERY `<CORP/>`** Unternehmen, kreative Challenges zu erstellen und mit der Community zusammenzuarbeiten.

Die Plattform soll als moderne und übersichtliche Galerie für kreative Inhalte dienen und gleichzeitig eine Möglichkeit bieten, aus den technischen Einstellungen anderer Nutzer zu lernen.