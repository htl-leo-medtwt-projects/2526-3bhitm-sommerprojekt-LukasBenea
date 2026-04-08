# SCENERY – Cities

## Projektbezeichnung  
**SCENERY – Cities**

SCENERY ist eine Webplattform, auf der Nutzer Städte visuell präsentieren können.  
Zu jeder Stadt werden Bilder sowie grundlegende Informationen wie Land, Beschreibung und besondere Merkmale angezeigt.

Die Plattform kombiniert eine Galerie für visuelle Eindrücke mit einer übersichtlichen Darstellung von Städten und ihren Besonderheiten.

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

Viele Plattformen zeigen Städte hauptsächlich als einfache Bilder oder Reiseinspiration. Oft fehlen jedoch strukturierte Informationen und eine klare Übersicht.

SCENERY soll eine Plattform bieten, auf der Städte visuell dargestellt und gleichzeitig übersichtlich beschrieben werden können. Nutzer sollen schnell einen Eindruck von einer Stadt bekommen und diese mit anderen vergleichen können.

Durch die Kombination aus Galerie und Informationen entsteht eine moderne und leicht verständliche Plattform.

---

# USP  

SCENERY stellt Städte in einem klar strukturierten und visuell ansprechenden Grid dar.

Im Gegensatz zu klassischen Reiseplattformen liegt der Fokus nicht auf langen Texten, sondern auf einer Kombination aus:
- Bildern  
- kurzen Beschreibungen  
- einfacher Navigation  

Dadurch können Nutzer schnell und intuitiv Städte entdecken.

---

# Projektziele  

Ziel des Projekts ist die Entwicklung einer Webplattform, auf der Nutzer Städte durchsuchen und betrachten können.

Die wichtigsten Funktionen der Plattform sind:

- Anzeige von Städten in einer Galerie  
- Detailansicht für jede Stadt  
- Suchfunktion für Städte  
- Filterung nach Tags oder Kategorien  
- modernes Grid-Layout  
- einfache und intuitive Benutzeroberfläche  

---

# UI & UX – Sicht des Users  

Die Plattform besitzt eine moderne und minimalistische Benutzeroberfläche mit Fokus auf Bildern.

Die Hauptseite zeigt eine Galerie mit verschiedenen Städten in einem dynamischen Grid-Layout.

Benutzer können:

- Städte durchsuchen  
- nach Städten suchen  
- nach Tags filtern  
- einzelne Städte im Detail ansehen  

Beim Klick auf eine Stadt öffnet sich eine Detailseite, auf der folgende Informationen sichtbar sind:

- Bild der Stadt  
- Name der Stadt  
- Beschreibung  
- Tags  

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

- **Masonry.js** – dynamisches Grid-Layout für die Galerie  
- **PhotoSwipe** – Fullscreen-Anzeige von Bildern  

---

# Feature Liste  

## Galerie  
- Anzeige aller Städte in einem Grid-Layout  
- Darstellung verschiedener Städte  

## Suche & Filter  
- Suche nach Städtenamen  
- Filterung nach Tags  

## Detailseite  
- Anzeige von Bildern  
- Beschreibung der Stadt  
- Anzeige von Tags  

---

# Coder Plan – Sicht des Entwicklers  

Das Backend der Plattform wird mit **PHP** umgesetzt und kommuniziert mit einer **MySQL-Datenbank**.

Die Datenbank speichert Städte, Bilder und Tags.  
Die Inhalte werden in einer Galerie dargestellt, die mit **Masonry.js** dynamisch aufgebaut wird.

Für die Vollbildanzeige von Bildern wird **PhotoSwipe** verwendet.

---

# Datenbankkonzept  

Die Plattform verwendet eine relationale MySQL-Datenbank mit folgenden Tabellen:

- **cities** – Informationen über Städte  
- **images** – Bilder zu Städten  
- **tags** – Kategorien  
- **city_tags** – Verbindung zwischen Städten und Tags  

---

# Zielgruppe  

Die Plattform richtet sich an:

- Reisende  
- Personen, die neue Städte entdecken möchten  
- Nutzer, die sich für Städte und Orte interessieren  

---

# Design Konzept  

Das Design der Plattform ist minimalistisch und modern, damit die Inhalte im Mittelpunkt stehen.

Designprinzipien:

- helles Interface  
- klares Grid Layout  
- Fokus auf Bilder  

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

- Städte betrachten  
- Städte durchsuchen  
- Inhalte nach Tags filtern  

Die Plattform dient als moderne und übersichtliche Galerie für Städte und ermöglicht eine einfache und visuelle Entdeckung verschiedener Orte.