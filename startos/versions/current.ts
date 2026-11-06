import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.1.1:0',
  releaseNotes: {
    en_US: `Updated Byparr to 3.1.1. Requires StartOS 0.4.1 or later.

- Downloads the location database before the API becomes ready and caches direct-connection location lookups until restart, reducing repeated requests. Restart Byparr if its public address changes.
- Fixes plain-HTTP pages behind Cloudflare challenges, returns cookies scoped to the requested page, and captures page content after it finishes loading.
- Improves browser error handling and cleanup of orphaned browser processes.

[Full upstream changes](https://github.com/ThePhaseless/Byparr/compare/v3.0.4...v3.1.1)`,
    es_ES: `Byparr actualizado a 3.1.1. Requiere StartOS 0.4.1 o posterior.

- Descarga la base de datos de ubicación antes de que la API esté lista y guarda las consultas de ubicación de conexiones directas hasta el reinicio, reduciendo las solicitudes repetidas. Reinicia Byparr si cambia su dirección pública.
- Corrige las páginas HTTP sin cifrar protegidas por desafíos de Cloudflare, devuelve cookies limitadas a la página solicitada y captura el contenido cuando termina de cargar.
- Mejora el manejo de errores del navegador y la limpieza de procesos de navegador huérfanos.

[Todos los cambios de upstream](https://github.com/ThePhaseless/Byparr/compare/v3.0.4...v3.1.1)`,
    de_DE: `Byparr auf 3.1.1 aktualisiert. Erfordert StartOS 0.4.1 oder neuer.

- Lädt die Standortdatenbank, bevor die API bereit ist, und speichert Standortabfragen direkter Verbindungen bis zum Neustart, um wiederholte Anfragen zu reduzieren. Byparr neu starten, wenn sich seine öffentliche Adresse ändert.
- Behebt Probleme mit unverschlüsselten HTTP-Seiten hinter Cloudflare-Prüfungen, gibt nur zur angeforderten Seite passende Cookies zurück und erfasst den Seiteninhalt nach dem Laden.
- Verbessert die Behandlung von Browserfehlern und das Aufräumen verwaister Browserprozesse.

[Alle Upstream-Änderungen](https://github.com/ThePhaseless/Byparr/compare/v3.0.4...v3.1.1)`,
    pl_PL: `Zaktualizowano Byparr do 3.1.1. Wymaga StartOS 0.4.1 lub nowszego.

- Pobiera bazę lokalizacji przed udostępnieniem API i przechowuje wyniki ustalania lokalizacji połączeń bezpośrednich do ponownego uruchomienia, ograniczając powtarzane żądania. Uruchom Byparr ponownie, jeśli zmieni się jego adres publiczny.
- Naprawia obsługę nieszyfrowanych stron HTTP chronionych wyzwaniami Cloudflare, zwraca ciasteczka ograniczone do żądanej strony i pobiera jej treść po zakończeniu ładowania.
- Poprawia obsługę błędów przeglądarki i usuwanie osieroconych procesów przeglądarki.

[Wszystkie zmiany upstream](https://github.com/ThePhaseless/Byparr/compare/v3.0.4...v3.1.1)`,
    fr_FR: `Byparr mis à jour vers la version 3.1.1. Nécessite StartOS 0.4.1 ou ultérieur.

- Télécharge la base de localisation avant que l'API soit prête et conserve les recherches de localisation des connexions directes jusqu'au redémarrage, réduisant les requêtes répétées. Redémarrez Byparr si son adresse publique change.
- Corrige les pages HTTP non chiffrées protégées par des défis Cloudflare, renvoie uniquement les cookies correspondant à la page demandée et récupère son contenu après le chargement.
- Améliore la gestion des erreurs du navigateur et le nettoyage des processus de navigateur orphelins.

[Tous les changements en amont](https://github.com/ThePhaseless/Byparr/compare/v3.0.4...v3.1.1)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
