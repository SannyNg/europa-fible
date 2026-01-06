/**
 * Countries Component - Wiederverwendbare Länderübersicht
 * Kann in jeder Seite eingebunden werden mit: <div id="countries-component"></div>
 */

const countriesData = {
    dach: {
        title: '🏔️ DACH-Region',
        countries: [
            { flag: '🇩🇪', name: 'Deutschland', href: 'deutschland.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇦🇹', name: 'Österreich', href: 'oesterreich.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇨🇭', name: 'Schweiz', href: 'schweiz.html', status: '✅ 10 Kräuter', complete: true }
        ]
    },
    west: {
        title: '🌊 Westeuropa',
        countries: [
            { flag: '🇫🇷', name: 'Frankreich', href: 'frankreich.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇳🇱', name: 'Niederlande', href: '', status: '⏳ Geplant', complete: false },
            { flag: '🇧🇪', name: 'Belgien', href: '', status: '⏳ Geplant', complete: false }
        ]
    },
    south: {
        title: '☀️ Südeuropa',
        countries: [
            { flag: '🇮🇹', name: 'Italien', href: 'italien.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇪🇸', name: 'Spanien', href: 'spanien.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇬🇷', name: 'Griechenland', href: 'griechenland.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇵🇹', name: 'Portugal', href: 'portugal.html', status: '✅ 10 Kräuter', complete: true }
        ]
    },
    east: {
        title: '🌲 Osteuropa',
        countries: [
            { flag: '🇵🇱', name: 'Polen', href: 'polen.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇺🇦', name: 'Ukraine', href: '', status: '⏳ Geplant', complete: false },
            { flag: '🇨🇿', name: 'Tschechien', href: '', status: '⏳ Geplant', complete: false }
        ]
    },
    north: {
        title: '❄️ Nord- & Westeuropa',
        countries: [
            { flag: '🇸🇪🇳🇴🇫🇮', name: 'Skandinavien', href: 'skandinavien.html', status: '✅ 10 Kräuter', complete: true },
            { flag: '🇬🇧', name: 'Großbritannien', href: 'grossbritannien.html', status: '✅ 10 Kräuter', complete: true }
        ]
    }
};

// Statistik berechnen
function getCountriesStats() {
    let totalHerbs = 0;
    let totalCountries = 0;

    Object.values(countriesData).forEach(region => {
        region.countries.forEach(country => {
            if (country.complete) {
                totalHerbs += 10;
                totalCountries++;
            }
        });
    });

    return { totalHerbs, totalCountries };
}

// HTML für eine Länder-Karte generieren
function createCountryCard(country, basePath = '') {
    const href = country.href ? basePath + country.href : '';
    const cssClass = country.complete ? 'country-card country-complete' : 'country-card country-pending';

    if (country.complete && href) {
        return `
            <a href="${href}" class="${cssClass}">
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-status">${country.status}</span>
            </a>
        `;
    } else {
        return `
            <div class="${cssClass}">
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-status">${country.status}</span>
            </div>
        `;
    }
}

// HTML für eine Region generieren
function createRegionHTML(region, basePath = '') {
    const countryCards = region.countries.map(c => createCountryCard(c, basePath)).join('');

    return `
        <div class="country-region">
            <h3>${region.title}</h3>
            <div class="country-cards">
                ${countryCards}
            </div>
        </div>
    `;
}

// Komplette Länderübersicht rendern
function renderCountriesComponent(containerId = 'countries-component', options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const basePath = options.basePath || '';
    const showTitle = options.showTitle !== false;
    const stats = getCountriesStats();

    let html = '';

    if (showTitle) {
        html += `
            <h2 class="section-title">🗺️ Heilkräuter nach Ländern</h2>
            <p class="section-subtitle">${stats.totalHerbs} Heilkräuter aus ${stats.totalCountries} europäischen Ländern - mit botanischen Illustrationen</p>
        `;
    }

    html += '<div class="countries-grid">';

    Object.values(countriesData).forEach(region => {
        html += createRegionHTML(region, basePath);
    });

    html += '</div>';

    container.innerHTML = html;
}

// Auto-initialisieren wenn DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Automatisch rendern, wenn Container existiert
    const container = document.getElementById('countries-component');
    if (container) {
        // basePath aus data-Attribut lesen, falls vorhanden
        const basePath = container.dataset.basePath || '';
        const showTitle = container.dataset.showTitle !== 'false';
        renderCountriesComponent('countries-component', { basePath, showTitle });
    }
});

// Export für externe Nutzung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderCountriesComponent, countriesData, getCountriesStats };
}
