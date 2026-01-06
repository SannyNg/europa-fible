/**
 * Berries Countries Component - Wiederverwendbare Länderübersicht für Beeren
 */

const berriesCountriesData = {
    dach: {
        title: '🏔️ DACH-Region',
        countries: [
            { flag: '🇩🇪', name: 'Deutschland', href: 'deutschland.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇦🇹', name: 'Österreich', href: 'oesterreich.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇨🇭', name: 'Schweiz', href: 'schweiz.html', status: '✅ 10 Beeren', complete: true }
        ]
    },
    west: {
        title: '🌊 Westeuropa',
        countries: [
            { flag: '🇫🇷', name: 'Frankreich', href: 'frankreich.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇳🇱', name: 'Niederlande', href: '', status: '⏳ Geplant', complete: false },
            { flag: '🇧🇪', name: 'Belgien', href: '', status: '⏳ Geplant', complete: false }
        ]
    },
    south: {
        title: '☀️ Südeuropa',
        countries: [
            { flag: '🇮🇹', name: 'Italien', href: 'italien.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇪🇸', name: 'Spanien', href: 'spanien.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇬🇷', name: 'Griechenland', href: 'griechenland.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇵🇹', name: 'Portugal', href: 'portugal.html', status: '✅ 10 Beeren', complete: true }
        ]
    },
    east: {
        title: '🌲 Osteuropa',
        countries: [
            { flag: '🇵🇱', name: 'Polen', href: 'polen.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇺🇦', name: 'Ukraine', href: '', status: '⏳ Geplant', complete: false },
            { flag: '🇨🇿', name: 'Tschechien', href: '', status: '⏳ Geplant', complete: false }
        ]
    },
    north: {
        title: '❄️ Nord- & Westeuropa',
        countries: [
            { flag: '🇸🇪🇳🇴🇫🇮', name: 'Skandinavien', href: 'skandinavien.html', status: '✅ 10 Beeren', complete: true },
            { flag: '🇬🇧', name: 'Großbritannien', href: 'grossbritannien.html', status: '✅ 10 Beeren', complete: true }
        ]
    }
};

function getBerriesStats() {
    let totalBerries = 0;
    let totalCountries = 0;

    Object.values(berriesCountriesData).forEach(region => {
        region.countries.forEach(country => {
            if (country.complete) {
                totalBerries += 10;
                totalCountries++;
            }
        });
    });

    return { totalBerries, totalCountries };
}

function createBerryCountryCard(country, basePath = '') {
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

function createBerryRegionHTML(region, basePath = '') {
    const countryCards = region.countries.map(c => createBerryCountryCard(c, basePath)).join('');

    return `
        <div class="country-region">
            <h3>${region.title}</h3>
            <div class="country-cards">
                ${countryCards}
            </div>
        </div>
    `;
}

function renderBerriesComponent(containerId = 'berries-component', options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const basePath = options.basePath || '';
    const showTitle = options.showTitle !== false;
    const stats = getBerriesStats();

    let html = '';

    if (showTitle) {
        html += `
            <h2 class="section-title">🫐 Essbare Beeren nach Ländern</h2>
            <p class="section-subtitle">${stats.totalBerries} Wildbeeren aus ${stats.totalCountries} europäischen Ländern</p>
        `;
    }

    html += '<div class="countries-grid">';

    Object.values(berriesCountriesData).forEach(region => {
        html += createBerryRegionHTML(region, basePath);
    });

    html += '</div>';

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('berries-component');
    if (container) {
        const basePath = container.dataset.basePath || '';
        const showTitle = container.dataset.showTitle !== 'false';
        renderBerriesComponent('berries-component', { basePath, showTitle });
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderBerriesComponent, berriesCountriesData, getBerriesStats };
}
